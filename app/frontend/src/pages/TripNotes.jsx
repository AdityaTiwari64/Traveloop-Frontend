import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { SkeuoCard, SkeuoButton, SkeuoInput, SkeuoTextarea, SkeuoPill, SkeuoBadge } from "@/components/Skeuo";
import { ArrowLeft, Plus, Trash2, BookOpen, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function TripNotes() {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [notes, setNotes] = useState([]);
    const [filter, setFilter] = useState("all");
  const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        title: "", content: "", note_type: "trip", day_index: null });

  const load = async () => {
            const [t, n] = await Promise.all([api.get(`/trips/${id}`), api.get(`/trips/${id}/notes`)]);
            setTrip(t.data); setNotes(n.data);
        };
        useEffect(() => { load(); }, [id]);

    const filtered = filter === "all" ? notes : notes.filter((n) => n.note_type === filter);

    const submit = async () => {
        if (!form.title || !form.content) return toast.error("Title and content required");
    try {
            await api.post(`/trips/${id}/notes`, { ...form, day_index: form.day_index ? Number(form.day_index) : null });
            setForm({
                title: "", content: "", note_type: "trip", day_index: null });
      setShow(false);
                load();
      toast.success("Note added");
    } catch {
                toast.error("Failed"); }
  };

            const remove = async (noteId) => { await api.delete(`/trips/${id}/notes/${noteId}`); load(); };

            if (!trip) return <div className="text-center text-sandy-700 py-20">Loading...</div>;

            return (
                <div className="space-y-6" data-testid="trip-notes-page">
                    <Link to={`/trips/${id}`} className="text-ocean-700 font-semibold flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to trip</Link>

            <SkeuoCard>
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                <h1 className="text-3xl font-bold text-sandy-900 flex items-center gap-2"><BookOpen className="w-7 h-7 text-ocean-700" />Trip notes</h1>
                    <p className="text-sandy-700">{trip.title}</p>
          </div>
        <SkeuoButton onClick={() => setShow(!show)} data-testid="add-note-toggle"><Plus className="w-4 h-4 inline mr-2" />Add note</SkeuoButton>
        </div>
        <div className="flex gap-2 mt-5">
            <SkeuoPill active={ filter === "all"} onClick={() => setFilter("all")}>All</SkeuoPill>
                <SkeuoPill active={ filter === "trip"} onClick={() => setFilter("trip")}>Trip Notes & Stops directory</SkeuoPill>
                    <SkeuoPill active={ filter === "day"} onClick={() => setFilter("day")}>by Day</SkeuoPill>
                        <SkeuoPill active={ filter === "stop"} onClick={() => setFilter("stop")}>by Stop</SkeuoPill>
        </div>
      </SkeuoCard>

        { show && (
            <SkeuoCard className="space-y-3" data-testid="add-note-form">
                <SkeuoInput placeholder="Note title (e.g. Hotel check-in details)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    <SkeuoTextarea rows={ 4} placeholder="Check-in after 3pm, room 502..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                        <div className="flex gap-3 flex-wrap">
    {
        ["trip", "day", "stop"].map((t) => (
            <SkeuoPill key={ t } active={ form.note_type === t } onClick={() => setForm({ ...form, note_type: t })}> { t }</SkeuoPill>
            ))
}
<SkeuoInput type="number" placeholder="Day #" value={form.day_index || ""} onChange={(e) => setForm({ ...form, day_index: e.target.value })} className="w-32" />
          </div>
    <div className="flex justify-end"><SkeuoButton onClick={submit} data-testid="note-submit">Save</SkeuoButton></div>
        </SkeuoCard>
      )}

{/* Journal-style cards */ }
<div className="space-y-4">
{
    filtered.length === 0 ? (
        <SkeuoCard inset className="text-center text-sandy-700 py-10">No notes yet — start capturing your memories.</SkeuoCard>
        ) : filtered.map((n) => (
            <div key={n.id} data-testid={`note-${n.id}`} className="rounded-2xl skeuo-paper shadow-skeuo-raised p-6 relative">
        <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
        <SkeuoBadge tone="ocean" className="capitalize">{n.note_type}</SkeuoBadge>
                  {
                n.day_index && <SkeuoBadge tone="sandy">Day {n.day_index}</SkeuoBadge>}
                    <span className="text-xs text-sandy-700 flex items-center gap-1"><Calendar className="w-3 h-3" />{n.created_at?.slice(0, 10)}</span>
                </div>
            <h3 className="text-xl font-bold text-sandy-900">{n.title}</h3>
        <p className="text-sandy-800 mt-2 leading-relaxed whitespace-pre-line">{n.content}</p>
              </div>
            <button onClick={() => remove(n.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))
}
      </div>
    </div>
  );
}
