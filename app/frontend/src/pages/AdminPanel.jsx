import { useEffect, useState } from "react";
import api from "@/lib/api";
import { SkeuoCard, SkeuoPill, SkeuoBadge, SkeuoButton, SkeuoInput } from "@/components/Skeuo";
import { Users as UsersIcon, MapPin, Activity, BarChart3, TrendingUp, Trash2, Search } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { toast } from "sonner";

const COLORS = ["#4A90E2", "#7EB6FF", "#2C6CB0", "#D4BFA6", "#B0987A"];

export default function AdminPanel() {
    const [tab, setTab] = useState("users");
  const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [trips, setTrips] = useState([]);
    const [activities, setActivities] = useState([]);
    const [q, setQ] = useState("");

  const reload = () => {
        api.get("/admin/stats").then((r) => setStats(r.data));
    api.get("/admin/users").then((r) => setUsers(r.data));
    api.get("/admin/trips").then((r) => setTrips(r.data));
    api.get("/admin/activities").then((r) => setActivities(r.data));
  };
    useEffect(() => { reload(); }, []);

    const deleteUser = async (id) => {
        if (!confirm("Delete user?")) return;
    try {
                await api.delete(`/admin/users/${id}`); toast.success("User deleted"); reload(); }
    catch (e) {
                    toast.error(e.response?.data?.detail || "Failed"); }
  };

                const filterFn = (item) => {
                    if (!q) return true;
                    return JSON.stringify(item).toLowerCase().includes(q.toLowerCase());
                };

                return (
                    <div className="space-y-6" data-testid="admin-panel">
                        <div>
                        <h1 className="text-4xl font-bold text-sandy-900">Admin Panel</h1>
                            <p className="text-sandy-700 mt-1">Mission control for Traveloop.</p>
      </div>

        { stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
    {
        [
            {
                label: "Users", value: stats.total_users, icon: UsersIcon },
            {
                    label: "Trips", value: stats.total_trips, icon: MapPin },
            {
                        label: "Ongoing", value: stats.ongoing, icon: Activity },
            {
                            label: "Upcoming", value: stats.upcoming, icon: TrendingUp },
            { label: "Posts", value: stats.total_posts, icon: BarChart3 },
          ].map((s) => (
                                <SkeuoCard key={s.label} className="!p-5">
                            <div className="flex items-center justify-between">
                            <div>
                            <div className="text-sandy-700 text-xs uppercase tracking-wide font-bold">{s.label}</div>
                            <div className="text-3xl font-bold text-sandy-900 mt-1">{s.value}</div>
                </div>
                                <div className="w-12 h-12 rounded-xl bg-ocean-100 grid place-items-center shadow-[inset_2px_2px_4px_rgba(44,108,176,0.18)]">
                            <s.icon className="w-6 h-6 text-ocean-700" />
                </div>
              </div>
            </SkeuoCard>
          ))
    }
        </div>
      )
}

{
    stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SkeuoCard>
            <h3 className="font-bold text-sandy-900 mb-3">Trip status distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer>
                <PieChart>
                  <Pie data={[{ name: "Ongoing", value: stats.ongoing }, { name: "Upcoming", value: stats.upcoming }, { name: "Completed", value: stats.completed }]} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                    {COLORS.slice(0, 3).map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </SkeuoCard>
          <SkeuoCard>
            <h3 className="font-bold text-sandy-900 mb-3">Top destinations</h3>
            <div className="h-64">
        <ResponsiveContainer>
        <BarChart data={stats.top_destinations}>
            <XAxis dataKey="destination" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4A90E2" radius={[8, 8, 0, 0]} />
        </BarChart>
              </ResponsiveContainer>
            </div>
          </SkeuoCard>
        <SkeuoCard className="lg:col-span-2">
            <h3 className="font-bold text-sandy-900 mb-3">Trips created over time</h3>
                <div className="h-56">
                    <ResponsiveContainer>
                    <LineChart data={stats.monthly}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#2C6CB0" strokeWidth={3} dot={{ r: 5, fill: "#4A90E2" }} />
                    </LineChart>
              </ResponsiveContainer>
            </div>
          </SkeuoCard>
        </div>
      )
}

      <SkeuoCard>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <SkeuoPill active={tab === "users"} onClick={() => setTab("users")}>Manage Users</SkeuoPill>
          <SkeuoPill active={tab === "trips"} onClick={() => setTab("trips")}>Manage Trips</SkeuoPill>
    <SkeuoPill active={ tab === "activities"} onClick={() => setTab("activities")}>Manage Activity</SkeuoPill>
        <div className="flex-1" />
            <div className="relative flex items-center w-full sm:w-72">
                <Search className="absolute left-3 w-4 h-4 text-sandy-700" />
                    <SkeuoInput value={ q } onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="!pl-10 !py-2" />
          </div>
        </div>

    { tab === "users" && (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-left text-sandy-700 uppercase text-xs">
                    <tr> <th className="py-2">User</th><th>Email</th><th>Role</th><th>Created</th><th></th></tr>
              </thead>
    <tbody>
        {users.filter(filterFn).map((u) => (
            <tr key={u.id} className="border-t border-sandy-200/60">
        <td className="py-3"><div className="flex items-center gap-2"><img src={u.photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80"} alt="" className="w-8 h-8 rounded-full object-cover" />{u.first_name} {u.last_name}</div></td>
                    <td>{u.email}</td>
                    <td><SkeuoBadge tone={u.role === "admin" ? "ocean" : "sandy"}>{u.role}</SkeuoBadge></td>
    <td className="text-xs">{u.created_at?.slice(0, 10)}</td>
        <td> <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

{
    tab === "trips" && (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-left text-sandy-700 uppercase text-xs"><tr><th className="py-2">Title</th><th>Destination</th><th>Status</th><th>Dates</th><th>Budget</th></tr></thead>
                    <tbody>
                {
                    trips.filter(filterFn).map((t) => (
                        <tr key={t.id} className="border-t border-sandy-200/60">
                    <td className="py-3 font-semibold">{t.title}</td><td>{t.destination}</td>
                    <td> <SkeuoBadge tone="ocean">{t.status}</SkeuoBadge></td>
                    <td className="text-xs">{t.start_date} → {t.end_date}</td>
                    <td className="font-bold text-ocean-700">${t.total_budget}</td>
                  </tr>
                ))
                }
              </tbody>
            </table>
          </div>
        )
}

{
    tab === "activities" && (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-left text-sandy-700 uppercase text-xs"><tr><th className="py-2">Activity</th><th>City</th><th>Category</th><th>Cost</th><th>Duration</th></tr></thead>
                    <tbody>
                {
                    activities.filter(filterFn).map((a) => (
                        <tr key={a.id} className="border-t border-sandy-200/60">
                    <td className="py-3 font-semibold">{a.name}</td><td>{a.city}</td>
                    <td> <SkeuoBadge tone="sandy">{a.category}</SkeuoBadge></td>
                    <td className="font-bold text-ocean-700">${a.cost}</td><td className="text-xs">{a.duration}</td>
                  </tr>
                ))
                }
              </tbody>
            </table>
          </div>
        )
}
      </SkeuoCard>
    </div>
  );
}
