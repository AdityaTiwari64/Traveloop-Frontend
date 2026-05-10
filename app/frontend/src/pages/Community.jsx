import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { SkeuoCard, SkeuoButton, SkeuoInput, SkeuoTextarea, SkeuoPill, SkeuoBadge } from "@/components/Skeuo";
import { Search, Filter, Layers, ArrowDownAZ, MapPin, Heart, Send } from "lucide-react";
import { toast } from "sonner";

export default function Community() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [q, setQ] = useState("");
  const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        trip_title: "", content: "", location: "", image: "" });

  const load = () => api.get("/community", { params: q ? { q } : {} }).then((r) => setPosts(r.data));
  useEffect(() => { load(); }, [q]);

        const submit = async () => {
            if (!form.trip_title || !form.content) return toast.error("Title and content required");
    try {
                await api.post("/community", form);
      setForm({
                    trip_title: "", content: "", location: "", image: "" });
      setShow(false);
                    load();
      toast.success("Posted to community");
    } catch {
                    toast.error("Post failed"); }
  };

                const like = async (id) => { await api.post(`/community/${id}/like`); load(); };

                return (
                    <div className="space-y-6" data-testid="community-page">
                        <div className="flex items-end justify-between">
                            <div>
                            <h1 className="text-4xl font-bold text-sandy-900">Community</h1>
                                <p className="text-sandy-700 mt-1">Where travelers share stories worth following.</p>
        </div>
        <SkeuoButton onClick={() => setShow(!show)} data-testid="new-post-toggle">{show ? "Cancel" : "Share a story"}</SkeuoButton>
      </div>

        <SkeuoCard className="!p-3 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-sandy-700" />
                    <SkeuoInput value={ q } onChange={(e) => setQ(e.target.value)
} placeholder="Search community..." className="!pl-12" data-testid="community-search" />
        </div>
    <div className="flex gap-2">
        <SkeuoPill> <Layers className="w-4 h-4 inline mr-1" />Group</SkeuoPill>
            <SkeuoPill> <Filter className="w-4 h-4 inline mr-1" />Filter</SkeuoPill>
                <SkeuoPill> <ArrowDownAZ className="w-4 h-4 inline mr-1" />Sort</SkeuoPill>
        </div>
      </SkeuoCard>

    { show && (
        <SkeuoCard className="space-y-3" data-testid="new-post-form">
            <SkeuoInput placeholder="Trip title (e.g. Greek Island Hop)" value={form.trip_title} onChange={(e) => setForm({ ...form, trip_title: e.target.value })} />
                <SkeuoInput placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    <SkeuoInput placeholder="Image URL (optional)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                        <SkeuoTextarea rows={ 4} placeholder="Share a moment, a tip, a misadventure..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                            <div className="flex justify-end"><SkeuoButton onClick={submit} data-testid="post-submit"><Send className="w-4 h-4 inline mr-2" />Publish</SkeuoButton></div>
        </SkeuoCard>
      )}

<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
{
    posts.map((p) => (
        <SkeuoCard key={p.id} className="!p-5 flex gap-4">
    <img src={
        p.user_avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"} alt="" className="w-14 h-14 rounded-full object-cover shadow-[inset_2px_2px_4px_rgba(176,152,122,0.4)] flex-shrink-0" />
            <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
                  <div className="font-bold text-sandy-900">{p.user_name}</div>
    <div className="text-xs text-sandy-700 flex items-center gap-2">
    <SkeuoBadge tone="ocean">{p.trip_title}</SkeuoBadge>
                    {
            p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>}
                  </div>
                </div>
              </div>
        {
            p.image && <img src={p.image} alt="" className="w-full h-48 rounded-xl object-cover mt-3 shadow-[inset_2px_2px_4px_rgba(176,152,122,0.4)]" />}
                <p className="text-sm text-sandy-800 mt-3 leading-relaxed">{p.content}</p>
                <div className="flex items-center justify-between mt-3">
                <button onClick={ () => like(p.id)
} data-testid={ `like-${p.id}` } className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sandy-100 text-sandy-800 shadow-[3px_3px_6px_rgba(176,152,122,0.35),-3px_-3px_6px_rgba(255,255,255,0.8)] hover:translate-y-[1px] text-sm">
    <Heart className="w-4 h-4 text-ocean-700" />{p.likes}
                </button>
              </div>
            </div>
          </SkeuoCard>
        ))}
{
    posts.length === 0 && <div className="md:col-span-2 text-center py-10 text-sandy-700">No posts yet — be the first to share.</div>}
      </div>
    </div>
  );
}
