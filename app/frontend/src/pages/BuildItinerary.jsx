import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { SkeuoCard, SkeuoButton, SkeuoInput, SkeuoTextarea } from "@/components/Skeuo";
import { Plus, Trash2, Calendar, DollarSign, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export default function BuildItinerary() {
    const { id } = useParams();
    const nav = useNavigate();
    const [trip, setTrip] = useState(null);
    const [sections, setSections] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get(`/trips/${id}`).then((r) => { setTrip(r.data); setSections(r.data.sections || []); });
    }, [id]);

    const addSection = () => setSections([...sections, {
        id: crypto.randomUUID(), title: "", description: "", date_from: "", date_to: "", budget: 0, activities: [] }]);
  const updateSection = (idx, key, val) => {
            const arr = [...sections]; arr[idx] = { ...arr[idx], [key]: val }; setSections(arr);
        };
        const removeSection = (idx) => setSections(sections.filter((_, i) => i !== idx));

        const save = async () => {
            setSaving(true);
            try {
                await api.patch(`/trips/${id}`, { sections });
                toast.success("Itinerary saved");
      nav(`/trips/${id}`);
            } catch {
                toast.error("Save failed"); } finally { setSaving(false); }
  };

            if (!trip) return <div className="text-center text-sandy-700 py-20">Loading...</div>;

            return (
                <div className="space-y-6" data-testid="build-itinerary-page">
                    <div className="flex items-center justify-between">
                        <Link to={`/trips/${id}`} className="text-ocean-700 font-semibold flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to trip</Link>
            <SkeuoButton onClick={ save } disabled={ saving } data- testid="save-itinerary"><Save className="w-4 h-4 inline mr-2" />{saving ? "Saving..." : "Save Itinerary"}</SkeuoButton>
      </div>

      <SkeuoCard>
        <h1 className="text-3xl font-bold text-sandy-900">{trip.title}</h1>
        <p className="text-sandy-700 mt-1">{trip.destination} · {trip.start_date} → {trip.end_date}</p>
      </SkeuoCard>

        <div className="space-y-5">
    {
        sections.map((s, idx) => (
            <SkeuoCard key={s.id} className="space-y-4" data-testid={`section-${idx}`}>
        <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-sandy-900">Section {idx + 1}</div>
        <button onClick={() => removeSection(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
            </div>
        <SkeuoInput placeholder="Section title (e.g. Athens Layover)" value={s.title} onChange={(e) => updateSection(idx, "title", e.target.value)} />
            <SkeuoTextarea rows={ 2} placeholder="All the necessary information about this section. This can be anything like travel section, hotel or any other activity." value={s.description} onChange={(e) => updateSection(idx, "description", e.target.value)} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                    <label className="text-xs font-semibold text-sandy-800 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date Range From</label>
                        <SkeuoInput type="date" value={s.date_from} onChange={(e) => updateSection(idx, "date_from", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-sandy-800 flex items-center gap-1"><Calendar className="w-3 h-3" /> To</label>
                <SkeuoInput type="date" value={s.date_to} onChange={(e) => updateSection(idx, "date_to", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-sandy-800 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Budget of this section</label>
                <SkeuoInput type="number" value={s.budget} onChange={(e) => updateSection(idx, "budget", parseFloat(e.target.value) || 0)} />
              </div>
            </div>
          </SkeuoCard>
        ))
}
      </div>

    <button onClick={addSection} data-testid="add-section" className="w-full py-6 rounded-2xl border-2 border-dashed border-sandy-400 text-sandy-800 font-semibold hover:bg-sandy-100/50 transition-all flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" /> Add another Section
      </button>
    </div>
  );
}
