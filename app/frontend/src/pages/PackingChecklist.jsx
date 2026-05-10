import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { SkeuoCard, SkeuoButton, SkeuoInput, SkeuoSelect, SkeuoBadge } from "@/components/Skeuo";
import { ArrowLeft, Plus, Trash2, Check, RefreshCcw, Share2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Documents", "Clothing", "Electronics", "Toiletries", "Misc"];

export default function PackingChecklist() {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");
  const [cat, setCat] = useState("Documents");

  const load = async () => {
        const [t, i] = await Promise.all([api.get(`/trips/${id}`), api.get(`/trips/${id}/packing`)]);
        setTrip(t.data); setItems(i.data);
    };
    useEffect(() => { load(); }, [id]);

    const grouped = useMemo(() => {
        const g={};
        items.forEach((it) => { (g[it.category] = g[it.category] || []).push(it); });
        return g;
    }, [items]);

    const total = items.length;
    const done = items.filter((i) => i.checked).length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    const addItem = async () => {
        if (!name.trim()) return;
        await api.post(`/trips/${id}/packing`, { category: cat, name: name.trim(), checked: false });
        setName(""); load();
  };
    const toggle = async (it) => { await api.patch(`/trips/${id}/packing/${it.id}`, { checked: !it.checked }); load(); };
    const remove = async (it) => { await api.delete(`/trips/${id}/packing/${it.id}`); load(); };
    const reset = async () => {
        await Promise.all(items.map((i) => api.patch(`/trips/${id}/packing/${i.id}`, { checked: false })));
        load(); toast.success("Reset all");
  };
    const share = () => { navigator.clipboard?.writeText(items.map(i => `[${i.checked ?"x":" "}] ${i.name}`).join("\n")); toast.success("List copied to clipboard"); };

    if (!trip) return <div className="text-center text-sandy-700 py-20">Loading...</div>;

    return (
        <div className="space-y-6" data-testid="packing-page">
            <Link to={`/trips/${id}`} className="text-ocean-700 font-semibold flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to trip</Link>
    <SkeuoCard>
    <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
        <h1 className="text-3xl font-bold text-sandy-900">Packing Checklist</h1>
            <p className="text-sandy-700">{trip.title}</p>
          </div>
    <div className="flex gap-2">
        <SkeuoButton variant="secondary" onClick={reset} data-testid="packing-reset"><RefreshCcw className="w-4 h-4 inline mr-2" />Reset all</SkeuoButton>
            <SkeuoButton variant="secondary" onClick={share}><Share2 className="w-4 h-4 inline mr-2" />Share Checklist</SkeuoButton>
          </div>
        </div>
    <div className="mt-5">
        <div className="flex justify-between text-sm text-sandy-800 mb-2"><span>Progress</span><span>{done}/{total} · {pct}%</span></div>
            <div className="h-4 rounded-full shadow-skeuo-inset bg-surface-main overflow-hidden">
                <div className="h-full bg-ocean-600 shadow-skeuo-ocean-pressed transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </SkeuoCard>

    <SkeuoCard className="flex flex-col sm:flex-row gap-3" data-testid="add-packing-item">
        <SkeuoInput value={ name } onChange={(e) => setName(e.target.value)} placeholder="Add new item..." className="flex-1" onKeyDown={(e) => e.key === "Enter" && addItem()} />
            <SkeuoSelect value={ cat } onChange={(e) => setCat(e.target.value)} className="sm:w-44">
{ CATEGORIES.map((c) => <option key={c}>{c}</option>) }
        </SkeuoSelect>
    <SkeuoButton onClick={addItem}><Plus className="w-4 h-4 inline mr-2" />Add</SkeuoButton>
      </SkeuoCard>

    <div className="space-y-5">
{
    CATEGORIES.map((c) => {
        const list = grouped[c] || [];
        if (list.length === 0) return null;
        const dn = list.filter(x => x.checked).length;
        return (
            <SkeuoCard key={c}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-sandy-900">{c}</h2>
                <SkeuoBadge tone="sandy">{dn}/{list.length}</SkeuoBadge>
              </div>
            <div className="space-y-2">
        {
            list.map((it) => (
                <div key={it.id} data-testid={`item-${it.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-surface-main shadow-skeuo-inset-sm">
            <button onClick={() => toggle(it)} className={`w-7 h-7 rounded-lg grid place-items-center transition-all ${it.checked ?"bg-ocean-600 shadow-skeuo-ocean-pressed" : "bg-surface-card shadow-skeuo-raised-sm"}`}>
        {
            it.checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                    </button>
                <span className={`flex-1 text-sandy-900 ${it.checked ?"line-through opacity-60" : ""}`}>{it.name}</span>
                    <button onClick={() => remove(it)
        } className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))
}
              </div>
            </SkeuoCard>
          );
        })}
{
    items.length === 0 && <SkeuoCard inset className="text-center text-sandy-700 py-10">Empty checklist — add your first item above.</SkeuoCard>}
      </div>
    </div>
  );
}
