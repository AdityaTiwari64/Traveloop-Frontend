import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { SkeuoCard, SkeuoButton, SkeuoInput, SkeuoSelect } from "@/components/Skeuo";
import { ArrowLeft, Plus, Trash2, Download, FileText, Receipt } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const PIE_COLORS = ["#4A90E2", "#7EB6FF", "#D4BFA6", "#B0987A", "#2C6CB0", "#22568D"];
const CATS = ["Hotel", "Travel", "Food", "Activity", "Misc"];

export default function Invoice() {
    const { id } = useParams();
    const { user } = useAuth();
    const [trip, setTrip] = useState(null);
    const [exp, setExp] = useState([]);
    const [form, setForm] = useState({
        category: "Hotel", description: "", quantity: 1, unit_cost: 0 });

  const load = async () => {
            const [t, e] = await Promise.all([api.get(`/trips/${id}`), api.get(`/trips/${id}/expenses`)]);
            setTrip(t.data); setExp(e.data);
        };
        useEffect(() => { load(); }, [id]);

    const total = exp.reduce((s, x) => s + x.amount, 0);
    const tax = +(total * 0.05).toFixed(2);
    const discount = 50;
    const grand = +(total + tax - discount).toFixed(2);
    const remaining = (trip?.total_budget || 0) - total;

    const byCat = CATS.map((c) => ({ name: c, value: exp.filter((e) => e.category === c).reduce((s, x) => s + x.amount, 0) })).filter((d) => d.value> 0);

    const add = async () => {
        if (!form.description || !form.unit_cost) return;
        await api.post(`/trips/${id}/expenses`, { ...form, quantity: Number(form.quantity), unit_cost: Number(form.unit_cost) });
        setForm({
            category: "Hotel", description: "", quantity: 1, unit_cost: 0 });
    load();
        };
        const remove = async (eid) => { await api.delete(`/trips/${id}/expenses/${eid}`); load(); };
        const download = () => {
            const text = `Traveloop Invoice
Trip: ${trip.title}
Traveler: ${user?.first_name} ${user?.last_name}

${exp.map(e => `${e.category} - ${e.description} - ${e.quantity} x $${e.unit_cost} = $${e.amount}`).join("\n")}

    Subtotal: $${ total }
    Tax: $${ tax }
    Discount: -$${ discount }
Grand Total: $${ grand } `;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `traveloop - ${ trip.id }.txt`; a.click();
  };

  if (!trip) return <div className="text-center text-sandy-700 py-20">Loading...</div>;

  return (
    <div className="space-y-6" data-testid="invoice-page">
      <Link to={`/ trips / ${ id } `} className="text-ocean-700 font-semibold flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to my trip</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeuoCard className="lg:col-span-2 !p-8 skeuo-paper relative">
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-ocean-600 grid place-items-center shadow-skeuo-ocean">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-sandy-700 font-bold">Trip in {trip.destination.split(",")[0]} Adventure</div>
                <h1 className="text-2xl font-bold text-sandy-900">{trip.title}</h1>
                <div className="text-xs text-sandy-700 mt-1">Booked by {user?.first_name} {user?.last_name}</div>
              </div>
            </div>
            <div className="text-right text-xs text-sandy-700 space-y-0.5">
              <div><span className="font-bold">Invoice #:</span> INV{trip.id.slice(0, 8).toUpperCase()}</div>
              <div><span className="font-bold">Generated:</span> {new Date().toISOString().slice(0, 10)}</div>
              <div><span className="font-bold">Status:</span> <span className="text-ocean-700 font-bold">Pending</span></div>
              <div className="mt-2"><span className="font-bold">Traveler:</span> {user?.first_name} {user?.last_name}</div>
              <div>{user?.email}</div>
              <div>{user?.city}{user?.country && `, ${ user.country } `}</div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl shadow-skeuo-inset-sm bg-surface-main">
            <table className="w-full text-sm">
              <thead className="text-left text-sandy-700 uppercase text-xs bg-sandy-200/50">
                <tr><th className="px-4 py-3">#</th><th>Category</th><th>Description</th><th>Qty</th><th>Unit Cost</th><th className="text-right pr-4">Amount</th><th></th></tr>
              </thead>
              <tbody>
                {exp.map((e, i) => (
                  <tr key={e.id} className="border-t border-sandy-200/60 hover:bg-surface-card/40">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="font-semibold text-sandy-900">{e.category}</td>
                    <td className="text-sandy-700">{e.description}</td>
                    <td>{e.quantity}</td>
                    <td>${e.unit_cost}</td>
                    <td className="text-right pr-4 font-bold text-ocean-700">${e.amount}</td>
                    <td><button onClick={() => remove(e.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
                {exp.length === 0 && <tr><td colSpan="7" className="text-center text-sandy-700 py-6">No expenses yet.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-5">
            <div className="w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-bold">${total.toFixed(2)}</span></div>
              <div className="flex justify-between text-sandy-700"><span>Tax (5%)</span><span>+${tax}</span></div>
              <div className="flex justify-between text-sandy-700"><span>Discount</span><span>-${discount}</span></div>
              <div className="flex justify-between text-lg font-bold text-ocean-700 pt-2 border-t border-sandy-300/60"><span>Grand Total</span><span>${grand}</span></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <SkeuoButton variant="secondary" onClick={download}><Download className="w-4 h-4 inline mr-2" />Download Invoice</SkeuoButton>
            <SkeuoButton variant="secondary"><FileText className="w-4 h-4 inline mr-2" />Export as PDF</SkeuoButton>
            <SkeuoButton>Mark as paid</SkeuoButton>
          </div>
        </SkeuoCard>

        <div className="space-y-5">
          <SkeuoCard>
            <h3 className="font-bold text-sandy-900 mb-4">Budget Overview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Total Budget</span><span className="font-bold">${trip.total_budget}</span></div>
              <div className="flex justify-between"><span>Total Spent</span><span className="font-bold text-ocean-700">${total.toFixed(2)}</span></div>
              <div className="flex justify-between text-sandy-700"><span>Remaining</span><span className={`font - bold ${
        remaining < 0 ?"text-red-600" : ""}`}>${remaining.toFixed(2)}</span></div>
            </div>
            <div className="h-44 mt-4">
        {
            byCat.length === 0 ? <div className="text-center text-xs text-sandy-700 pt-8">Add expenses to see breakdown</div> : (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={byCat} dataKey="value" cx="50%" cy="50%" outerRadius={60} label={(d) => d.name}>
                      {byCat.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )
        }
            </div>
            <SkeuoButton variant="secondary" className="w-full">View Full Budget</SkeuoButton>
          </SkeuoCard>

          <SkeuoCard>
            <h3 className="font-bold text-sandy-900 mb-3">Add Expense</h3>
            <div className="space-y-3">
            <SkeuoSelect value={ form.category } onChange={(e) => setForm({ ...form, category: e.target.value })
    }>
        { CATS.map((c) => <option key={c}>{c}</option>) }
              </SkeuoSelect>
        <SkeuoInput placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
                <SkeuoInput type="number" placeholder="Qty" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                    <SkeuoInput type="number" placeholder="Unit Cost" value={form.unit_cost} onChange={(e) => setForm({ ...form, unit_cost: e.target.value })} />
              </div>
        <SkeuoButton onClick={add} className="w-full" data-testid="add-expense"><Plus className="w-4 h-4 inline mr-2" />Add</SkeuoButton>
            </div>
          </SkeuoCard>
        </div>
      </div>
    </div>
  );
}
