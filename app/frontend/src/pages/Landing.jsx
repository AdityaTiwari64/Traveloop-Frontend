import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { SkeuoCard, SkeuoButton, SkeuoInput, SkeuoBadge, SkeuoPill } from "@/components/Skeuo";
import { Search, Filter, Layers, ArrowDownAZ, MapPin, Plus, Sparkles, Star } from "lucide-react";

const HERO="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600";

export default function Landing() {
    const [destinations, setDestinations] = useState([]);
    const [trips, setTrips] = useState([]);
    const [q, setQ] = useState("");

  useEffect(() => {
        api.get("/destinations").then((r) => setDestinations(r.data));
    api.get("/trips").then((r) => setTrips(r.data));
  }, []);

    const filtered = destinations.filter(
        (d) => !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.country.toLowerCase().includes(q.toLowerCase())
    );
    const previousTrips = trips.filter((t) => t.status === "completed").slice(0, 3);

  return (
        <div className="space-y-12" data-testid="landing-page">
    {/* HERO BANNER */ }
    <SkeuoCard className="!p-0 overflow-hidden">
        <div className="relative h-[420px]">
            <img src={ HERO } alt="banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/85 via-ocean-700/40 to-transparent" />
                    <div className="absolute inset-0 p-10 sm:p-16 flex flex-col justify-end">
                        <SkeuoBadge tone="ocean" className="self-start mb-4 !bg-white/20 !text-white !shadow-none backdrop-blur"><Sparkles className="w-3 h-3" /> Welcome back, wanderer</SkeuoBadge>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white max-w-3xl leading-tight">
              The world is wide. <br /> Your next chapter awaits.
            </h1>
        <p className="text-ocean-100 mt-4 max-w-xl text-lg">Plan tactile, beautiful itineraries — section by section, day by day, memory by memory.</p>
            <div className="mt-6 flex gap-3">
                <Link to="/trips/new"><SkeuoButton data-testid="hero-plan-trip" className="!bg-white !text-indigo-600 shadow-skeuo-raised"><Plus className="w-4 h-4 inline mr-2" />Plan a trip</SkeuoButton></Link>
                    <Link to="/community"><SkeuoButton variant="ghost" data-testid="hero-community" className="!text-white !bg-white/10 backdrop-blur">Browse community</SkeuoButton></Link>
            </div>
          </div>
        </div>
      </SkeuoCard>

        {/* SEARCH BAR */ }
        <SkeuoCard className="!p-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1 relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-sandy-600" />
                    <SkeuoInput data-testid="landing-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Bali, Kyoto, Santorini..." className="!pl-12 !shadow-skeuo-inset" />
        </div>
        <div className="flex gap-2">
            <SkeuoPill> <Layers className="w-4 h-4 inline mr-1" />Group by</SkeuoPill>
                <SkeuoPill> <Filter className="w-4 h-4 inline mr-1" />Filter</SkeuoPill>
                    <SkeuoPill> <ArrowDownAZ className="w-4 h-4 inline mr-1" />Sort by</SkeuoPill>
        </div>
      </SkeuoCard>

        {/* TOP REGIONAL SELECTIONS */ }
        <section>
        <div className="flex items-end justify-between mb-6">
            <div>
            <h2 className="text-3xl font-bold text-sandy-900">Top Regional Selections</h2>
                <p className="text-sandy-600 text-sm mt-1">Curated escapes, hand-picked for your next adventure.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5" data-testid="top-regional-grid">
    {
        filtered.slice(0, 10).map((d) => (
            <Link key={d.id} to={`/search?city=${encodeURIComponent(d.name)}`} className="group">
        <SkeuoCard className="!p-0 overflow-hidden hover:translate-y-[2px] active:shadow-skeuo-inset-sm transition-all">
        <div className="relative h-44 overflow-hidden">
        <img src={ d.image } alt={ d.name } className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-1 text-xs font-bold flex items-center gap-1 text-sandy-900">
        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />{d.rating}
                  </div>
                </div>
            <div className="p-4">
        <div className="font-bold text-sandy-900">{d.name}</div>
        <div className="text-xs text-sandy-600 flex items-center gap-1"><MapPin className="w-3 h-3" />{d.country}</div>
        <div className="text-xs mt-2 text-ocean-600 font-semibold">${d.avg_cost} avg</div>
                </div>
              </SkeuoCard>
            </Link>
          ))
    }
        </div>
      </section>

        {/* PREVIOUS TRIPS */ }
        <section>
        <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl font-bold text-sandy-900">Previous Trips</h2>
                <Link to="/trips" className="text-ocean-700 font-semibold text-sm">View all</Link>
        </div>
        {
            previousTrips.length === 0 ? (
                <SkeuoCard className="text-center text-sandy-700 py-10">No completed trips yet — your first adventure begins now.</SkeuoCard>
        ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {
                        previousTrips.map((t) => (
              <Link key={t.id} to={`/trips/${t.id}`}>
                <SkeuoCard className="!p-0 overflow-hidden">
                  <img src={t.cover_image} alt={t.title} className="w-full h-44 object-cover" />
                  <div className="p-5">
                    <SkeuoBadge tone="sandy">Completed</SkeuoBadge>
                    <h3 className="font-bold text-lg text-sandy-900 mt-2">{t.title}</h3>
                        <div className="text-xs text-sandy-700 mt-1">{t.destination}</div>
                  </div>
                </SkeuoCard>
              </Link>
            ))
}
          </div>
        )}
      </section>

    <div className="flex justify-end">
        <Link to="/trips/new"><SkeuoButton data-testid="bottom-plan-trip"><Plus className="w-4 h-4 inline mr-2" />Plan a trip</SkeuoButton></Link>
      </div>
    </div>
  );
}
