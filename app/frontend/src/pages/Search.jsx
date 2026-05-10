import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import { SkeuoCard, SkeuoInput, SkeuoPill, SkeuoBadge } from "@/components/Skeuo";
import { Search as SearchIcon, Filter, Layers, ArrowDownAZ, MapPin, Clock, DollarSign } from "lucide-react";

export default function Search() {
    const [params] = useSearchParams();
    const initialCity = params.get("city") || "";
  const [city, setCity] = useState(initialCity);
    const [q, setQ] = useState("");
  const [activities, setActivities] = useState([]);
    const [category, setCategory] = useState("all");

  useEffect(() => {
        const p={};
        if (city) p.city = city;
        if (q) p.q = q;
        api.get("/activities", { params: p }).then((r) => setActivities(r.data));
  }, [city, q]);

    const categories = Array.from(new Set(activities.map((a) => a.category)));
    const filtered = category === "all" ? activities : activities.filter((a) => a.category === category);

    return (
        <div className="space-y-6" data-testid="search-page">
            <div>
            <h1 className="text-4xl font-bold text-sandy-900">Activity & City Search</h1>
                <p className="text-sandy-700 mt-1">Find experiences worth remembering.</p>
      </div>

        <SkeuoCard className="!p-3 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative flex items-center">
                <MapPin className="absolute left-4 w-5 h-5 text-sandy-700" />
                    <SkeuoInput value={ city } onChange={(e) => setCity(e.target.value)
} placeholder="City (e.g. Paris, Bali)" className="!pl-12" data-testid="search-city" />
        </div>
    <div className="flex-1 relative flex items-center">
        <SearchIcon className="absolute left-4 w-5 h-5 text-sandy-700" />
            <SkeuoInput value={ q } onChange={(e) => setQ(e.target.value)} placeholder="Search activities..." className="!pl-12" data-testid="search-query" />
        </div>
    <div className="flex gap-2">
        <SkeuoPill> <Layers className="w-4 h-4 inline mr-1" />Group</SkeuoPill>
            <SkeuoPill> <Filter className="w-4 h-4 inline mr-1" />Filter</SkeuoPill>
                <SkeuoPill> <ArrowDownAZ className="w-4 h-4 inline mr-1" />Sort</SkeuoPill>
        </div>
      </SkeuoCard>

    <div className="flex flex-wrap gap-2">
        <SkeuoPill active={ category === "all"} onClick={() => setCategory("all")}>All</SkeuoPill>
{
    categories.map((c) => (
        <SkeuoPill key={c} active={category === c} onClick={() => setCategory(c)}>{c}</SkeuoPill>
    ))
}
      </div>

    <div className="space-y-3" data-testid="search-results">
        <h2 className="text-xl font-bold text-sandy-900">Results <span className="text-sandy-700 text-sm font-normal">({filtered.length})</span></h2>
{
    filtered.length === 0 ? (
        <SkeuoCard inset className="text-center text-sandy-700 py-10">No results. Try a different city or term.</SkeuoCard>
        ) : filtered.map((a) => (
            <SkeuoCard key={a.id} className="!p-4 flex gap-4 items-center hover:translate-y-[1px] active:shadow-skeuo-inset-sm transition-all">
            {
                a.image && <img src={a.image} alt={a.name} className="w-28 h-20 rounded-xl object-cover shadow-skeuo-inset-sm hidden sm:block" />}
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                    <div className="font-bold text-sandy-900 truncate">{a.name}</div>
                    <SkeuoBadge tone="ocean">{a.category}</SkeuoBadge>
              </div>
            <p className="text-sm text-sandy-700 mt-1 line-clamp-1">{a.description}</p>
        <div className="flex gap-4 text-xs text-sandy-700 mt-2">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.city}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.duration}</span>
        <span className="flex items-center gap-1 text-ocean-700 font-bold"><DollarSign className="w-3 h-3" />{a.cost}</span>
              </div>
            </div>
          </SkeuoCard>
        ))
}
      </div>
    </div>
  );
}
