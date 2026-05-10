from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, status
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

# ---------- Setup ----------
mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
db_name = os.environ.get("DB_NAME", "traveloop_db")

try:
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=2000)
    db = client[db_name]
    # Test connection
    import asyncio
    # We'll check connection on startup instead of here to avoid blocking
except Exception:
    from mongomock_motor import AsyncMongoMockClient
    client = AsyncMongoMockClient()
    db = client[db_name]
    logger.warning("Using AsyncMongoMockClient fallback")

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ["JWT_SECRET"]
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@traveloop.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

app = FastAPI(title="Traveloop API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("traveloop")


# ---------- Helpers ----------
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------- Models ----------
class RegisterIn(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = ""
    city: Optional[str] = ""
    country: Optional[str] = ""
    additional_info: Optional[str] = ""
    photo: Optional[str] = ""


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: str = ""
    city: str = ""
    country: str = ""
    additional_info: str = ""
    photo: str = ""
    role: str = "user"
    created_at: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    additional_info: Optional[str] = None
    photo: Optional[str] = None


class ItinerarySection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str = ""
    date_from: str = ""
    date_to: str = ""
    budget: float = 0
    activities: List[str] = []


class TripIn(BaseModel):
    title: str
    destination: str
    cover_image: Optional[str] = ""
    start_date: str
    end_date: str
    description: Optional[str] = ""
    status: Literal["upcoming", "ongoing", "completed"] = "upcoming"
    sections: List[ItinerarySection] = []


class Trip(TripIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    created_at: str = Field(default_factory=now_iso)
    total_budget: float = 0


class TripUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    cover_image: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal["upcoming", "ongoing", "completed"]] = None
    sections: Optional[List[ItinerarySection]] = None


class Destination(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    region: str
    country: str
    image: str
    description: str
    activities: List[str] = []
    avg_cost: float = 0
    rating: float = 4.5


class Activity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    city: str
    category: str
    description: str
    cost: float = 0
    duration: str = ""
    image: str = ""


class CommunityPostIn(BaseModel):
    trip_title: str
    content: str
    image: Optional[str] = ""
    location: Optional[str] = ""


class CommunityPost(CommunityPostIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    user_avatar: str = ""
    created_at: str = Field(default_factory=now_iso)
    likes: int = 0


class PackingItemIn(BaseModel):
    category: str
    name: str
    checked: bool = False


class PackingItem(PackingItemIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trip_id: str
    user_id: str


class PackingItemUpdate(BaseModel):
    name: Optional[str] = None
    checked: Optional[bool] = None
    category: Optional[str] = None


class TripNoteIn(BaseModel):
    title: str
    content: str
    note_type: Literal["trip", "day", "stop"] = "trip"
    day_index: Optional[int] = None


class TripNote(TripNoteIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trip_id: str
    user_id: str
    created_at: str = Field(default_factory=now_iso)


class ExpenseIn(BaseModel):
    category: str
    description: str
    quantity: float = 1
    unit_cost: float
    

class Expense(ExpenseIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trip_id: str
    user_id: str
    amount: float = 0
    created_at: str = Field(default_factory=now_iso)


# ---------- Auth Endpoints ----------
def _user_public(u: dict) -> dict:
    u.pop("password_hash", None)
    u.pop("_id", None)
    return u


@api.post("/auth/register")
async def register(payload: RegisterIn, response: Response):
    email = payload.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "first_name": payload.first_name,
        "last_name": payload.last_name,
        "email": email,
        "phone": payload.phone or "",
        "city": payload.city or "",
        "country": payload.country or "",
        "additional_info": payload.additional_info or "",
        "photo": payload.photo or "",
        "role": "user",
        "password_hash": hash_password(payload.password),
        "created_at": now_iso(),
    }
    await db.users.insert_one(user_doc)
    token = create_access_token(user_id, email)
    response.set_cookie("access_token", token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return {"user": _user_public(dict(user_doc)), "access_token": token}


@api.post("/auth/login")
async def login(payload: LoginIn, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], email)
    response.set_cookie("access_token", token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return {"user": _user_public(dict(user)), "access_token": token}


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@api.patch("/auth/me")
async def update_me(payload: UserUpdate, user: dict = Depends(get_current_user)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if updates:
        await db.users.update_one({"id": user["id"]}, {"$set": updates})
    updated = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return updated


# ---------- Destination & Activity ----------
@api.get("/destinations", response_model=List[Destination])
async def list_destinations():
    docs = await db.destinations.find({}, {"_id": 0}).to_list(100)
    return docs


@api.get("/activities", response_model=List[Activity])
async def list_activities(city: Optional[str] = None, q: Optional[str] = None):
    query = {}
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
        ]
    docs = await db.activities.find(query, {"_id": 0}).to_list(200)
    return docs


# ---------- Trips ----------
def _calc_total_budget(sections: List[ItinerarySection]) -> float:
    return float(sum(s.budget for s in sections))


@api.post("/trips", response_model=Trip)
async def create_trip(payload: TripIn, user: dict = Depends(get_current_user)):
    sections = payload.sections or []
    trip = Trip(
        **payload.model_dump(),
        user_id=user["id"],
        total_budget=_calc_total_budget(sections),
    )
    await db.trips.insert_one(trip.model_dump())
    return trip


@api.get("/trips", response_model=List[Trip])
async def list_trips(status_filter: Optional[str] = None, user: dict = Depends(get_current_user)):
    query: dict = {"user_id": user["id"]}
    if status_filter:
        query["status"] = status_filter
    docs = await db.trips.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api.get("/trips/{trip_id}", response_model=Trip)
async def get_trip(trip_id: str, user: dict = Depends(get_current_user)):
    trip = await db.trips.find_one({"id": trip_id, "user_id": user["id"]}, {"_id": 0})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@api.patch("/trips/{trip_id}", response_model=Trip)
async def update_trip(trip_id: str, payload: TripUpdate, user: dict = Depends(get_current_user)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "sections" in updates:
        updates["total_budget"] = float(sum(s.get("budget", 0) for s in updates["sections"]))
    if updates:
        result = await db.trips.update_one({"id": trip_id, "user_id": user["id"]}, {"$set": updates})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Trip not found")
    trip = await db.trips.find_one({"id": trip_id, "user_id": user["id"]}, {"_id": 0})
    return trip


@api.delete("/trips/{trip_id}")
async def delete_trip(trip_id: str, user: dict = Depends(get_current_user)):
    res = await db.trips.delete_one({"id": trip_id, "user_id": user["id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Trip not found")
    await db.packing_items.delete_many({"trip_id": trip_id})
    await db.trip_notes.delete_many({"trip_id": trip_id})
    await db.expenses.delete_many({"trip_id": trip_id})
    return {"ok": True}


# ---------- Packing Checklist ----------
@api.get("/trips/{trip_id}/packing", response_model=List[PackingItem])
async def list_packing(trip_id: str, user: dict = Depends(get_current_user)):
    docs = await db.packing_items.find({"trip_id": trip_id, "user_id": user["id"]}, {"_id": 0}).to_list(500)
    return docs


@api.post("/trips/{trip_id}/packing", response_model=PackingItem)
async def add_packing(trip_id: str, payload: PackingItemIn, user: dict = Depends(get_current_user)):
    item = PackingItem(**payload.model_dump(), trip_id=trip_id, user_id=user["id"])
    await db.packing_items.insert_one(item.model_dump())
    return item


@api.patch("/trips/{trip_id}/packing/{item_id}", response_model=PackingItem)
async def update_packing(trip_id: str, item_id: str, payload: PackingItemUpdate, user: dict = Depends(get_current_user)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if updates:
        await db.packing_items.update_one({"id": item_id, "trip_id": trip_id, "user_id": user["id"]}, {"$set": updates})
    item = await db.packing_items.find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(404)
    return item


@api.delete("/trips/{trip_id}/packing/{item_id}")
async def delete_packing(trip_id: str, item_id: str, user: dict = Depends(get_current_user)):
    await db.packing_items.delete_one({"id": item_id, "trip_id": trip_id, "user_id": user["id"]})
    return {"ok": True}


# ---------- Trip Notes / Journal ----------
@api.get("/trips/{trip_id}/notes", response_model=List[TripNote])
async def list_notes(trip_id: str, user: dict = Depends(get_current_user)):
    docs = await db.trip_notes.find({"trip_id": trip_id, "user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api.post("/trips/{trip_id}/notes", response_model=TripNote)
async def add_note(trip_id: str, payload: TripNoteIn, user: dict = Depends(get_current_user)):
    note = TripNote(**payload.model_dump(), trip_id=trip_id, user_id=user["id"])
    await db.trip_notes.insert_one(note.model_dump())
    return note


@api.delete("/trips/{trip_id}/notes/{note_id}")
async def delete_note(trip_id: str, note_id: str, user: dict = Depends(get_current_user)):
    await db.trip_notes.delete_one({"id": note_id, "trip_id": trip_id, "user_id": user["id"]})
    return {"ok": True}


# ---------- Expenses / Invoice ----------
@api.get("/trips/{trip_id}/expenses", response_model=List[Expense])
async def list_expenses(trip_id: str, user: dict = Depends(get_current_user)):
    docs = await db.expenses.find({"trip_id": trip_id, "user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api.post("/trips/{trip_id}/expenses", response_model=Expense)
async def add_expense(trip_id: str, payload: ExpenseIn, user: dict = Depends(get_current_user)):
    amount = payload.quantity * payload.unit_cost
    exp = Expense(**payload.model_dump(), trip_id=trip_id, user_id=user["id"], amount=amount)
    await db.expenses.insert_one(exp.model_dump())
    return exp


@api.delete("/trips/{trip_id}/expenses/{exp_id}")
async def delete_expense(trip_id: str, exp_id: str, user: dict = Depends(get_current_user)):
    await db.expenses.delete_one({"id": exp_id, "trip_id": trip_id, "user_id": user["id"]})
    return {"ok": True}


# ---------- Community ----------
@api.get("/community", response_model=List[CommunityPost])
async def list_community(q: Optional[str] = None):
    query = {}
    if q:
        query["$or"] = [
            {"trip_title": {"$regex": q, "$options": "i"}},
            {"content": {"$regex": q, "$options": "i"}},
            {"location": {"$regex": q, "$options": "i"}},
        ]
    docs = await db.community.find(query, {"_id": 0}).sort("created_at", -1).to_list(200)
    return docs


@api.post("/community", response_model=CommunityPost)
async def add_community(payload: CommunityPostIn, user: dict = Depends(get_current_user)):
    post = CommunityPost(
        **payload.model_dump(),
        user_id=user["id"],
        user_name=f"{user.get('first_name','')} {user.get('last_name','')}".strip() or user.get("email", "User"),
        user_avatar=user.get("photo", ""),
    )
    await db.community.insert_one(post.model_dump())
    return post


@api.post("/community/{post_id}/like")
async def like_post(post_id: str, user: dict = Depends(get_current_user)):
    await db.community.update_one({"id": post_id}, {"$inc": {"likes": 1}})
    return {"ok": True}


# ---------- Admin ----------
@api.get("/admin/users")
async def admin_users(user: dict = Depends(require_admin)):
    docs = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(500)
    return docs


@api.delete("/admin/users/{user_id}")
async def admin_delete_user(user_id: str, user: dict = Depends(require_admin)):
    if user_id == user["id"]:
        raise HTTPException(400, "Cannot delete self")
    await db.users.delete_one({"id": user_id})
    return {"ok": True}


@api.get("/admin/trips")
async def admin_trips(user: dict = Depends(require_admin)):
    docs = await db.trips.find({}, {"_id": 0}).to_list(1000)
    return docs


@api.get("/admin/activities")
async def admin_activities(user: dict = Depends(require_admin)):
    docs = await db.activities.find({}, {"_id": 0}).to_list(500)
    return docs


@api.get("/admin/stats")
async def admin_stats(user: dict = Depends(require_admin)):
    total_users = await db.users.count_documents({})
    total_trips = await db.trips.count_documents({})
    ongoing = await db.trips.count_documents({"status": "ongoing"})
    upcoming = await db.trips.count_documents({"status": "upcoming"})
    completed = await db.trips.count_documents({"status": "completed"})
    total_posts = await db.community.count_documents({})
    # Trips per month (last 6) - approximation using created_at
    pipeline = [
        {"$group": {"_id": {"$substr": ["$created_at", 0, 7]}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
        {"$limit": 12},
    ]
    monthly = []
    async for d in db.trips.aggregate(pipeline):
        monthly.append({"month": d["_id"], "count": d["count"]})
    # Top destinations
    pipe2 = [
        {"$group": {"_id": "$destination", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5},
    ]
    top_dest = []
    async for d in db.trips.aggregate(pipe2):
        top_dest.append({"destination": d["_id"], "count": d["count"]})
    return {
        "total_users": total_users,
        "total_trips": total_trips,
        "ongoing": ongoing,
        "upcoming": upcoming,
        "completed": completed,
        "total_posts": total_posts,
        "monthly": monthly,
        "top_destinations": top_dest,
    }


# ---------- Health ----------
@api.get("/")
async def root():
    return {"app": "Traveloop", "status": "ok"}


# ---------- Seed ----------
SEED_DESTINATIONS = [
    {"name": "Santorini", "region": "Cyclades", "country": "Greece", "image": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800", "description": "Whitewashed cliffside village with iconic blue domes overlooking the Aegean.", "activities": ["Sunset cruise", "Wine tasting", "Beach day"], "avg_cost": 1850, "rating": 4.9},
    {"name": "Kyoto", "region": "Kansai", "country": "Japan", "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", "description": "Ancient temples, bamboo forests, and timeless tea houses in a serene cultural capital.", "activities": ["Temple visits", "Tea ceremony", "Geisha district walk"], "avg_cost": 2200, "rating": 4.8},
    {"name": "Bali", "region": "Lesser Sunda", "country": "Indonesia", "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", "description": "Rice terraces, surf beaches, and spiritual retreats wrapped in tropical lush.", "activities": ["Surfing", "Yoga retreat", "Rice terrace trek"], "avg_cost": 1200, "rating": 4.7},
    {"name": "Reykjavik", "region": "Capital Region", "country": "Iceland", "image": "https://images.unsplash.com/photo-1490093158370-1d4cdc1ccc16?w=800", "description": "Geysers, glaciers, and the otherworldly aurora borealis.", "activities": ["Northern lights", "Blue lagoon", "Glacier hike"], "avg_cost": 2800, "rating": 4.8},
    {"name": "Marrakech", "region": "Marrakech-Safi", "country": "Morocco", "image": "https://images.unsplash.com/photo-1597212720291-5c4f5100f0c5?w=800", "description": "Color-soaked souks, mosaic palaces, and mint tea under the Atlas Mountains.", "activities": ["Souk shopping", "Desert tour", "Hammam"], "avg_cost": 1100, "rating": 4.6},
    {"name": "Banff", "region": "Alberta", "country": "Canada", "image": "https://images.unsplash.com/photo-1609825488888-3a766db05542?w=800", "description": "Turquoise lakes nestled between snow-capped Rockies.", "activities": ["Lake Louise hike", "Skiing", "Hot springs"], "avg_cost": 2400, "rating": 4.9},
    {"name": "Lisbon", "region": "Lisbon", "country": "Portugal", "image": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800", "description": "Pastel hills, vintage trams, and Atlantic-side fado nights.", "activities": ["Tram 28 ride", "Pastel de nata tasting", "Sintra day trip"], "avg_cost": 1500, "rating": 4.7},
    {"name": "Cape Town", "region": "Western Cape", "country": "South Africa", "image": "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800", "description": "Where Table Mountain meets two oceans and wine country.", "activities": ["Table Mountain", "Cape Point", "Winelands tour"], "avg_cost": 1700, "rating": 4.7},
]

SEED_ACTIVITIES = [
    {"name": "Eiffel Tower Summit", "city": "Paris", "category": "Sightseeing", "description": "Skip-the-line elevator to the top of Paris's iconic landmark.", "cost": 28, "duration": "2h", "image": "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600"},
    {"name": "Seine River Dinner Cruise", "city": "Paris", "category": "Dining", "description": "3-course French dinner along illuminated Seine landmarks.", "cost": 95, "duration": "2.5h", "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600"},
    {"name": "Colosseum Underground Tour", "city": "Rome", "category": "Tour", "description": "Access restricted gladiator passages with a historian guide.", "cost": 65, "duration": "3h", "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600"},
    {"name": "Vatican Early Access", "city": "Rome", "category": "Tour", "description": "Beat the crowds with sunrise entry to the Sistine Chapel.", "cost": 89, "duration": "3.5h", "image": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600"},
    {"name": "Bali Surf Lesson", "city": "Bali", "category": "Adventure", "description": "Beginner-friendly waves at Kuta Beach with board included.", "cost": 35, "duration": "2h", "image": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600"},
    {"name": "Ubud Rice Terrace Trek", "city": "Bali", "category": "Nature", "description": "Half-day guided walk through emerald-green Tegallalang.", "cost": 45, "duration": "4h", "image": "https://images.unsplash.com/photo-1604665088730-3325be3e3768?w=600"},
    {"name": "Kyoto Tea Ceremony", "city": "Kyoto", "category": "Culture", "description": "Traditional matcha ritual in a kimono with a tea master.", "cost": 55, "duration": "1.5h", "image": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600"},
    {"name": "Arashiyama Bamboo Walk", "city": "Kyoto", "category": "Nature", "description": "Self-guided morning stroll through Kyoto's iconic bamboo grove.", "cost": 0, "duration": "2h", "image": "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600"},
    {"name": "Northern Lights Hunt", "city": "Reykjavik", "category": "Adventure", "description": "Guided 4x4 hunt for the aurora with hot cocoa breaks.", "cost": 120, "duration": "5h", "image": "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600"},
    {"name": "Blue Lagoon Spa", "city": "Reykjavik", "category": "Wellness", "description": "Geothermal soak with silica mud mask in a lava field.", "cost": 89, "duration": "3h", "image": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600"},
    {"name": "Sahara Desert Tour", "city": "Marrakech", "category": "Adventure", "description": "3-day camel trek through Erg Chebbi dunes with Berber camp.", "cost": 220, "duration": "3 days", "image": "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=600"},
    {"name": "Souk Walking Tour", "city": "Marrakech", "category": "Culture", "description": "Guided exploration of medina markets with mint tea stop.", "cost": 30, "duration": "3h", "image": "https://images.unsplash.com/photo-1597212720158-15f9f10ed7e5?w=600"},
]


async def seed():
    # indexes
    await db.users.create_index("email", unique=True)
    await db.trips.create_index("user_id")
    await db.packing_items.create_index([("trip_id", 1), ("user_id", 1)])
    await db.trip_notes.create_index([("trip_id", 1), ("user_id", 1)])
    await db.expenses.create_index([("trip_id", 1), ("user_id", 1)])

    # admin
    if not await db.users.find_one({"email": ADMIN_EMAIL}):
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "first_name": "Admin", "last_name": "Traveloop",
            "email": ADMIN_EMAIL, "phone": "", "city": "HQ", "country": "Internet",
            "additional_info": "Master admin", "photo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
            "role": "admin", "password_hash": hash_password(ADMIN_PASSWORD), "created_at": now_iso(),
        })
        logger.info("Seeded admin user")

    # demo user
    demo_email = "demo@traveloop.com"
    demo = await db.users.find_one({"email": demo_email})
    if not demo:
        demo_id = str(uuid.uuid4())
        demo_doc = {
            "id": demo_id, "first_name": "Maya", "last_name": "Wanderer",
            "email": demo_email, "phone": "+1 555-0144", "city": "Brooklyn", "country": "USA",
            "additional_info": "Slow-travel enthusiast. 32 countries and counting.",
            "photo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
            "role": "user", "password_hash": hash_password("demo123"), "created_at": now_iso(),
        }
        await db.users.insert_one(demo_doc)
        # Seed trips for demo user
        trips = [
            {
                "id": str(uuid.uuid4()), "user_id": demo_id,
                "title": "Greek Island Hop", "destination": "Santorini, Greece",
                "cover_image": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
                "start_date": "2026-04-12", "end_date": "2026-04-22",
                "description": "Two weeks chasing sunsets across the Cyclades.",
                "status": "upcoming", "total_budget": 3200, "created_at": now_iso(),
                "sections": [
                    {"id": str(uuid.uuid4()), "title": "Athens Layover", "description": "Acropolis & Plaka district", "date_from": "2026-04-12", "date_to": "2026-04-13", "budget": 350, "activities": ["Acropolis tour", "Greek dinner"]},
                    {"id": str(uuid.uuid4()), "title": "Santorini", "description": "Cliffside villages of Oia & Fira", "date_from": "2026-04-13", "date_to": "2026-04-18", "budget": 1900, "activities": ["Sunset cruise", "Wine tasting", "Red beach"]},
                    {"id": str(uuid.uuid4()), "title": "Mykonos", "description": "Beaches & windmills", "date_from": "2026-04-18", "date_to": "2026-04-22", "budget": 950, "activities": ["Paradise beach", "Little Venice"]},
                ],
            },
            {
                "id": str(uuid.uuid4()), "user_id": demo_id,
                "title": "Cherry Blossom Run", "destination": "Kyoto, Japan",
                "cover_image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
                "start_date": "2026-02-20", "end_date": "2026-03-02",
                "description": "Temples, ramen and pink petals.",
                "status": "ongoing", "total_budget": 2800, "created_at": now_iso(),
                "sections": [
                    {"id": str(uuid.uuid4()), "title": "Kyoto Temples", "description": "Fushimi Inari, Kinkaku-ji", "date_from": "2026-02-20", "date_to": "2026-02-25", "budget": 1400, "activities": ["Tea ceremony", "Bamboo grove"]},
                    {"id": str(uuid.uuid4()), "title": "Osaka Food Crawl", "description": "Dotonbori street food", "date_from": "2026-02-25", "date_to": "2026-03-02", "budget": 1400, "activities": ["Ramen tour", "Osaka Castle"]},
                ],
            },
            {
                "id": str(uuid.uuid4()), "user_id": demo_id,
                "title": "Iceland Ring Road", "destination": "Reykjavik, Iceland",
                "cover_image": "https://images.unsplash.com/photo-1490093158370-1d4cdc1ccc16?w=800",
                "start_date": "2025-09-15", "end_date": "2025-09-25",
                "description": "Glacier walks and aurora chasing.",
                "status": "completed", "total_budget": 4200, "created_at": now_iso(),
                "sections": [
                    {"id": str(uuid.uuid4()), "title": "Reykjavik", "description": "City & Blue Lagoon", "date_from": "2025-09-15", "date_to": "2025-09-17", "budget": 800, "activities": ["Blue lagoon", "Hallgrimskirkja"]},
                    {"id": str(uuid.uuid4()), "title": "South Coast", "description": "Vik, Skogafoss, Jokulsarlon", "date_from": "2025-09-17", "date_to": "2025-09-22", "budget": 2100, "activities": ["Glacier hike", "Black sand beach"]},
                    {"id": str(uuid.uuid4()), "title": "Snaefellsnes", "description": "Peninsula loop", "date_from": "2025-09-22", "date_to": "2025-09-25", "budget": 1300, "activities": ["Kirkjufell", "Lava fields"]},
                ],
            },
        ]
        await db.trips.insert_many(trips)
        # demo packing
        for trip in trips[:2]:
            items = [
                {"id": str(uuid.uuid4()), "trip_id": trip["id"], "user_id": demo_id, "category": "Documents", "name": "Passport", "checked": True},
                {"id": str(uuid.uuid4()), "trip_id": trip["id"], "user_id": demo_id, "category": "Documents", "name": "Travel insurance", "checked": True},
                {"id": str(uuid.uuid4()), "trip_id": trip["id"], "user_id": demo_id, "category": "Documents", "name": "Hotel bookings", "checked": False},
                {"id": str(uuid.uuid4()), "trip_id": trip["id"], "user_id": demo_id, "category": "Clothing", "name": "Cotton shirts", "checked": True},
                {"id": str(uuid.uuid4()), "trip_id": trip["id"], "user_id": demo_id, "category": "Clothing", "name": "Light jacket", "checked": False},
                {"id": str(uuid.uuid4()), "trip_id": trip["id"], "user_id": demo_id, "category": "Electronics", "name": "Camera", "checked": True},
                {"id": str(uuid.uuid4()), "trip_id": trip["id"], "user_id": demo_id, "category": "Electronics", "name": "Universal adapter", "checked": False},
                {"id": str(uuid.uuid4()), "trip_id": trip["id"], "user_id": demo_id, "category": "Electronics", "name": "Earphones", "checked": True},
            ]
            await db.packing_items.insert_many(items)
        # demo notes
        notes = [
            {"id": str(uuid.uuid4()), "trip_id": trips[0]["id"], "user_id": demo_id, "title": "Hotel check-in - Oia stay", "content": "Check-in after 3pm, room 502. Breakfast included 7-10am. Day 2, June 14 2026.", "note_type": "trip", "day_index": 2, "created_at": now_iso()},
            {"id": str(uuid.uuid4()), "trip_id": trips[0]["id"], "user_id": demo_id, "title": "Hotel check-in - Mykonos stop", "content": "Check-in after 4pm, room 802. Breakfast included 7-10am. Day 5, June 17 2026.", "note_type": "stop", "day_index": 5, "created_at": now_iso()},
            {"id": str(uuid.uuid4()), "trip_id": trips[0]["id"], "user_id": demo_id, "title": "Hotel check-in - Athens stop", "content": "Check-in after 2pm, room 102. Breakfast included 7-10am. Day 8, June 20 2026.", "note_type": "stop", "day_index": 8, "created_at": now_iso()},
        ]
        await db.trip_notes.insert_many(notes)
        # demo expenses
        exps = [
            {"id": str(uuid.uuid4()), "trip_id": trips[0]["id"], "user_id": demo_id, "category": "Hotel", "description": "Hotel booking partial", "quantity": 4, "unit_cost": 3000, "amount": 12000, "created_at": now_iso()},
            {"id": str(uuid.uuid4()), "trip_id": trips[0]["id"], "user_id": demo_id, "category": "Travel", "description": "Flight bookings (BLR -> FOR)", "quantity": 1, "unit_cost": 12000, "amount": 12000, "created_at": now_iso()},
        ]
        await db.expenses.insert_many(exps)
        logger.info("Seeded demo user with trips")

        # community posts
        posts = [
            {"id": str(uuid.uuid4()), "user_id": demo_id, "user_name": "Maya Wanderer", "user_avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", "trip_title": "Greek Island Hop", "content": "Watching the sun melt into the Aegean from Oia is genuinely life-changing. Bring layers — the wind kicks up at dusk!", "image": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800", "location": "Santorini, Greece", "likes": 47, "created_at": now_iso()},
            {"id": str(uuid.uuid4()), "user_id": demo_id, "user_name": "Maya Wanderer", "user_avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", "trip_title": "Cherry Blossom Run", "content": "Skip the bamboo forest at noon. Be there at 6am — you'll have it all to yourself, the light is golden, and the silence is unreal.", "image": "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800", "location": "Kyoto, Japan", "likes": 32, "created_at": now_iso()},
            {"id": str(uuid.uuid4()), "user_id": demo_id, "user_name": "Maya Wanderer", "user_avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", "trip_title": "Iceland Ring Road", "content": "Pro tip: don't book a Northern Lights tour. Just rent a 4x4, drive 30 min outside Reykjavik on a clear night, and look up.", "image": "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800", "location": "Reykjavik, Iceland", "likes": 89, "created_at": now_iso()},
            {"id": str(uuid.uuid4()), "user_id": demo_id, "user_name": "Maya Wanderer", "user_avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", "trip_title": "Marrakech Magic", "content": "The souks are wild, beautiful chaos. Get lost on purpose — that's where the best mint tea hides.", "image": "https://images.unsplash.com/photo-1597212720158-15f9f10ed7e5?w=800", "location": "Marrakech, Morocco", "likes": 21, "created_at": now_iso()},
        ]
        await db.community.insert_many(posts)

    # destinations
    if await db.destinations.count_documents({}) == 0:
        for d in SEED_DESTINATIONS:
            await db.destinations.insert_one({"id": str(uuid.uuid4()), **d})
    if await db.activities.count_documents({}) == 0:
        for a in SEED_ACTIVITIES:
            await db.activities.insert_one({"id": str(uuid.uuid4()), **a})


@app.on_event("startup")
async def on_startup():
    global db, client
    try:
        # Try a simple command to see if DB is alive
        await client.admin.command('ping')
        logger.info("Connected to MongoDB")
    except Exception as e:
        logger.warning(f"Could not connect to real MongoDB: {e}. Falling back to AsyncMongoMockClient.")
        from mongomock_motor import AsyncMongoMockClient as MockClient
        client = MockClient()
        db = client[db_name]
        
    await seed()
    logger.info("Traveloop API ready")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
