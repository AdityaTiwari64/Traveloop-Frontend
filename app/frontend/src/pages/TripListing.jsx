import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { SkeuoCard, SkeuoInput, SkeuoPill, SkeuoBadge } from "@/components/Skeuo";
import { Search, Filter, Layers, ArrowDownAZ, MapPin, Calendar, DollarSign } from "lucide-react";

const STATUSES = [
    {
        key: "ongoing", label: "Ongoing", tone: "ocean" },
  {
            key: "upcoming", label: "Up-coming", tone: "sandy" },
  { key: "completed", label: "Completed", tone: "warn" },
];

export default function TripListing() {
    const [trips, setTrips] = useState([]);
    const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
        api.get("/trips").then((r) => setTrips(r.data)); }, []);

  const grouped = useMemo(() => {
            let arr = trips.filter((t) => !q || t.title.toLowerCase().includes(q.toLowerCase()) || t.destination.toLowerCase().includes(q.toLowerCase()));
            if (sortBy === "budget") arr = [...arr].sort((a, b) => b.total_budget - a.total_budget);
            if (sortBy === "date") arr = [...arr].sort((a, b) => (a.start_date || "").localeCompare(b.start_date || ""));
            const g={ ongoing: [], upcoming: [], completed: [] };
            arr.forEach((t) => g[t.status]?.push(t));
            return g;
        }, [trips, q, sortBy]);

        return (
            <div className="space-y-8" data-testid="trip-listing-page">
                <div>
                <h1 className="text-4xl font-bold text-sandy-900">My Trips</h1>
                    <p className="text-sandy-700 mt-1">Every adventure has its season — here are yours.</p>
      </div>

        <SkeuoCard className="!p-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1 relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-sandy-700" />
                    <SkeuoInput value={ q } onChange={(e) => setQ(e.target.value)
} placeholder="Search trips..." className="!pl-12" data-testid="trip-search" />
        </div>
    <div className="flex gap-2">
        <SkeuoPill> <Layers className="w-4 h-4 inline mr-1" />Group by</SkeuoPill>
            <SkeuoPill> <Filter className="w-4 h-4 inline mr-1" />Filter</SkeuoPill>
                <SkeuoPill onClick={() => setSortBy(sortBy === "date" ? "budget" : "date")} active={true}><ArrowDownAZ className="w-4 h-4 inline mr-1" />Sort: {sortBy}</SkeuoPill>
        </div>
      </SkeuoCard>

                    {
                        STATUSES.map((s) => (
        <section key={s.key} data-testid={`group-${s.key}`}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-sandy-900">{s.label}</h2>
            <SkeuoBadge tone={s.tone}>{grouped[s.key].length}</SkeuoBadge>
          </div>
                            <div className="space-y-3">
            {
                                grouped[s.key].length === 0 ? (
                                    <SkeuoCard inset className="text-center text-sandy-700 py-6 text-sm">No {s.label.toLowerCase()} trips.</SkeuoCard>
            ) : grouped[s.key].map((t) => (
              <Link key={t.id} to={`/trips/${t.id}`}>
                <SkeuoCard className="!p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:translate-y-[1px] transition-all">
                  <img src={t.cover_image} alt={t.title} className="w-full sm:w-44 h-32 rounded-xl object-cover shadow-[inset_2px_2px_4px_rgba(176,152,122,0.4)]" />
                  <div className="flex-1">
                    <div className="font-bold text-xl text-sandy-900">{t.title}</div>
                    <p className="text-sm text-sandy-700 mt-1">{t.description}</p>
                                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-sandy-700">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{t.destination}</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t.start_date} → {t.end_date}</span>
                                    <span className="flex items-center gap-1 text-ocean-700 font-semibold"><DollarSign className="w-3 h-3" />{t.total_budget}</span>
                    </div>
                  </div>
                </SkeuoCard>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
