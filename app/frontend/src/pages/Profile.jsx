import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { SkeuoCard, SkeuoButton, SkeuoInput, SkeuoTextarea, SkeuoBadge } from "@/components/Skeuo";
import { Edit2, Save, X, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
    const { user, refresh } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(user || {});
    const [trips, setTrips] = useState([]);

    useEffect(() => { setForm(user || {}); }, [user]);
    useEffect(() => {
        api.get("/trips").then((r) => setTrips(r.data)); }, []);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });
        const save = async () => {
            try {
                await api.patch("/auth/me", form);
      await refresh();
                toast.success("Profile updated");
      setEditing(false);
            } catch {
                toast.error("Update failed"); }
  };

            const preplanned = trips.filter((t) => t.status !== "completed").slice(0, 6);
  const previous = trips.filter((t) => t.status === "completed").slice(0, 6);

  if (!user) return null;

            return (
                <div className="space-y-8" data-testid="profile-page">
                    <SkeuoCard className="flex flex-col md:flex-row gap-8 items-start">
                        <img src={
                            user.photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"} alt="me" className="w-40 h-40 rounded-2xl object-cover shadow-skeuo-raised" />
                                <div className="flex-1 w-full">
          {!editing?(
            <>
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                <h1 className="text-4xl font-bold text-sandy-900">{user.first_name} {user.last_name}</h1>
                                    <p className="text-sandy-700 mt-1">{user.additional_info || "—"}</p>
                </div>
            <SkeuoButton variant="secondary" onClick={() => setEditing(true)} data-testid="edit-profile"><Edit2 className="w-4 h-4 inline mr-2" />Edit profile</SkeuoButton>
              </div>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-sandy-800">
                <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-ocean-600" />{user.email}</span>
                    <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-ocean-600" />{user.phone || "—"}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-ocean-600" />{user.city}{user.country ? `, ${user.country}` : ""}</span>
        {
            user.role === "admin" && <SkeuoBadge tone="ocean">Admin</SkeuoBadge>}
              </div>
            </>
          ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SkeuoInput placeholder="First Name" value={form.first_name || ""} onChange={onChange("first_name")} />
                <SkeuoInput placeholder="Last Name" value={form.last_name || ""} onChange={onChange("last_name")} />
                    <SkeuoInput placeholder="Phone" value={form.phone || ""} onChange={onChange("phone")} />
                        <SkeuoInput placeholder="City" value={form.city || ""} onChange={onChange("city")} />
                            <SkeuoInput placeholder="Country" value={form.country || ""} onChange={onChange("country")} />
                                <SkeuoInput placeholder="Photo URL" value={form.photo || ""} onChange={onChange("photo")} />
                                    <SkeuoTextarea className="sm:col-span-2" rows={3} placeholder="Additional Info" value={form.additional_info || ""} onChange={onChange("additional_info")} />
                                        <div className="sm:col-span-2 flex gap-2 justify-end">
                                            <SkeuoButton variant="ghost" onClick={() => { setEditing(false); setForm(user); }}><X className="w-4 h-4 inline mr-2" />Cancel</SkeuoButton>
                                                <SkeuoButton onClick={ save } data-testid="profile-save"><Save className="w-4 h-4 inline mr-2" />Save</SkeuoButton>
              </div>
            </div>
          )
}
        </div>
      </SkeuoCard>

{
    [
    {
        label: "Preplanned Trips", list: preplanned },
        {
                label: "Previous Trips", list: previous },
      ].map((sec) => (
                    <section key={sec.label}>
                        <h2 className="text-2xl font-bold text-sandy-900 mb-4">{sec.label}</h2>
          {
                        sec.list.length === 0 ? (
                            <SkeuoCard inset className="text-center text-sandy-700 py-6 text-sm">No {sec.label.toLowerCase()}.</SkeuoCard>
          ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {
                                    sec.list.map((t) => (
                                        <SkeuoCard key={t.id} className="!p-0 overflow-hidden">
                                    <img src={ t.cover_image } alt={ t.title } className="w-full h-32 object-cover" />
                                    <div className="p-4">
                                    <div className="font-bold text-sandy-900 text-sm">{t.title}</div>
                                    <div className="text-xs text-sandy-700 mt-1">{t.destination}</div>
                                    <Link to={`/trips/${t.id}`} className="block mt-3"><SkeuoButton variant="secondary" className="!py-2 !px-3 text-xs w-full">View</SkeuoButton></Link>
                  </div>
                </SkeuoCard>
              ))
    }
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
