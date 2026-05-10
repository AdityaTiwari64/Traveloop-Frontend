import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { SkeuoCard, SkeuoButton, SkeuoInput, SkeuoTextarea, SkeuoBadge } from "@/components/Skeuo";
import { Calendar, MapPin, Sparkles, Plus, Check } from "lucide-react";
import { toast } from "sonner";

export default function CreateTrip() {
    const nav = useNavigate();
    const [form, setForm] = useState({
        title: "", destination: "", start_date: "", end_date: "",
    description: "", cover_image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
  });
    const [destinations, setDestinations] = useState([]);
    const [picked, setPicked] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get("/destinations").then((r) => setDestinations(r.data)); }, []);
  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });
        const togglePick = (d) => setPicked((p) => p.find((x) => x.id === d.id) ? p.filter((x) => x.id !== d.id) : [...p, d]);

        const onSubmit = async (e) => {
            e.preventDefault();
            setSubmitting(true);
            try {
                const sections = picked.map((d) => ({
                    id: crypto.randomUUID(),
                    title: d.name,
                    description: d.description,
                    date_from: form.start_date,
                    date_to: form.end_date,
                    budget: d.avg_cost,
                    activities: d.activities || [],
                }));
                const cover = picked[0]?.image || form.cover_image;
                const { data } = await api.post("/trips", { ...form, sections, cover_image: cover });
      toast.success("Trip created. Now build your itinerary.");
      nav(`/trips/${data.id}/itinerary/edit`);
            } catch (e) {
                toast.error(e.response?.data?.detail || "Could not create trip");
    } finally { setSubmitting(false); }
        };

        return (
            <div className="space-y-8" data-testid="create-trip-page">
                <div>
                <h1 className="text-4xl font-bold text-sandy-900">Plan a New Trip</h1>
                    <p className="text-sandy-700 mt-1">Lay the bones — we'll help fill in the magic.</p>
      </div>

            <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SkeuoCard className="lg:col-span-1 space-y-5">
                    <h2 className="text-xl font-bold text-sandy-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-ocean-600" /> Plan a new trip</h2>
                        <div className="space-y-3">
                            <div>
                            <label className="text-sm font-semibold text-sandy-800">Trip Title</label>
                                <SkeuoInput data-testid="trip-title" value={form.title} onChange={onChange("title")} placeholder="Greek Island Hop" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-sandy-800 flex items-center gap-2"><MapPin className="w-4 h-4" />Select a Place</label>
              <SkeuoInput data-testid="trip-destination" value={form.destination} onChange={onChange("destination")} placeholder="Santorini, Greece" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-sandy-800 flex items-center gap-2"><Calendar className="w-4 h-4" />Start Date</label>
              <SkeuoInput data-testid="trip-start-date" type="date" value={form.start_date} onChange={onChange("start_date")} required />
            </div>
            <div>
              <label className="text-sm font-semibold text-sandy-800 flex items-center gap-2"><Calendar className="w-4 h-4" />End Date</label>
              <SkeuoInput data-testid="trip-end-date" type="date" value={form.end_date} onChange={onChange("end_date")} required />
            </div>
            <div>
              <label className="text-sm font-semibold text-sandy-800">Description</label>
              <SkeuoTextarea rows={3} value={form.description} onChange={onChange("description")} placeholder="Two weeks chasing sunsets..." />
            </div>
            <SkeuoButton type="submit" className="w-full" data-testid="trip-create-submit" disabled={submitting}>{submitting ? "Creating..." : "Create Trip & Build Itinerary"}</SkeuoButton>
          </div>
        </SkeuoCard>

        <SkeuoCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-sandy-900">Suggestions for Places to Visit / Activities</h2>
            <SkeuoBadge tone="ocean">{picked.length} selected</SkeuoBadge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="suggestion-grid">
            {destinations.map((d) => {
              const isPicked = picked.find((x) => x.id === d.id);
              return (
                <button type="button" key={d.id} onClick={() => togglePick(d)} data-testid={`suggest-${d.name}`}
                  className={`text-left rounded-2xl overflow-hidden transition-all ${isPicked ? "shadow-skeuo-ocean-pressed bg-ocean-100" : "bg-surface-card shadow-skeuo-raised hover:translate-y-[1px]"}`}>
                  <div className="relative h-32 overflow-hidden">
                    <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                    {isPicked && <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-ocean-600 grid place-items-center shadow-md"><Check className="w-5 h-5 text-white" /></div>}
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sandy-900 text-sm">{d.name}</div>
                    <div className="text-xs text-sandy-700">{d.country}</div>
                    <div className="text-xs mt-1 text-ocean-700 font-semibold">${d.avg_cost}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </SkeuoCard>
      </form>
    </div>
  );
}
