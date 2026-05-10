# Traveloop Backend API

Production-ready REST API for Traveloop — a personalized multi-city travel planning app.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: `pg` (node-postgres)
- **Auth**: JWT (access + refresh tokens)
- **Validation**: Zod
- **File Uploads**: Multer

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env` file based on `.env.example` and fill in your database credentials and JWT secrets.
4. **Database Setup**:
   Ensure your PostgreSQL server is running and the schema (including views) is created as per the project requirements.
5. **Run the server**:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## API Endpoints

### Auth (`/api/auth`)
- `POST /register` — Create user
- `POST /login` — Return JWT
- `POST /logout` — Logout (client-side token removal)
- `POST /forgot-password` — Password reset link

### Users (`/api/users`)
- `GET /me` — Get own profile
- `PUT /me` — Update name, photo, language
- `DELETE /me` — Delete account
- `GET /me/saved-destinations` — List saved destinations
- `POST /me/saved-destinations` — Save a city
- `DELETE /me/saved-destinations/:id` — Remove saved destination

### Cities (`/api/cities`)
- `GET /` — List all cities (filters: `region`, `country`, `sort`)
- `GET /search?q=` — Search cities by name/country
- `GET /:id` — City detail

### Activities (`/api/activities`)
- `GET /` — List activities (filters: `city_id`, `category`, `max_cost`)
- `GET /:id` — Activity detail

### Trips (`/api/trips`)
- `GET /` — List user's trips
- `POST /` — Create a new trip
- `GET /:id` — Trip details (includes itinerary)
- `PUT /:id` — Update trip info
- `DELETE /:id` — Delete trip
- `POST /:id/share` — Share trip (returns share token)
- `GET /public/:share_token` — View public trip (no auth)

### Trip Stops (`/api/trips/:tripId/stops`)
- `GET /` — List all stops for a trip
- `POST /` — Add a stop (city + dates)
- `PUT /:stopId` — Update stop dates/order
- `DELETE /:stopId` — Remove stop
- `POST /:stopId/activities` — Add activity to stop
- `DELETE /:stopId/activities/:activityId` — Remove activity from stop

### Trip Details (Budget, Packing, Notes)
- `GET /api/trips/:tripId/budget` — Budget breakdown
- `PUT /api/trips/:tripId/budget` — Update budget fields
- `GET /api/trips/:tripId/budget/alerts` — Over-budget alerts
- `GET /api/trips/:tripId/packing` — Packing checklist
- `POST /api/trips/:tripId/packing` — Add item
- `PUT /api/trips/:tripId/packing/:itemId` — Toggle packed / update
- `DELETE /api/trips/:tripId/packing/:itemId` — Delete item
- `GET /api/trips/:tripId/notes` — Trip notes
- `POST /api/trips/:tripId/notes` — Add note
- `PUT /api/trips/:tripId/notes/:noteId` — Update note
- `DELETE /api/trips/:tripId/notes/:noteId` — Delete note

### Admin (`/api/admin`)
- `GET /stats` — Platform analytics
- `GET /users` — List all users
- `GET /trips` — List all trips with filters

## Response Format
All responses follow this consistent JSON structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "error": { ... }
}
```
