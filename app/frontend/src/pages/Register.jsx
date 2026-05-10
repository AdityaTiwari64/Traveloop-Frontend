import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SkeuoCard, SkeuoButton, SkeuoInput, SkeuoTextarea } from "@/components/Skeuo";
import { Camera } from "lucide-react";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";

const AVATAR_OPTIONS = [
"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200",
];

export default function Register() {
    const { register } = useAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({
        first_name: "", last_name: "", email: "", password: "",
    phone: "", city: "", country: "", additional_info: "",
    photo: AVATAR_OPTIONS[0],
    });
    const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
    const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true); setErr("");
    try {
            await register(form);
            toast.success("Account created. Bon voyage!");
      nav("/");
    } catch (e) {
            setErr(formatApiError(e.response?.data?.detail) || e.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen skeuo-surface px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <SkeuoCard className="p-8 sm:p-10" data-testid="register-card">
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                            <img src={form.photo} alt="avatar" className="w-24 h-24 rounded-full object-cover shadow-skeuo-raised" />
                                <div className="absolute -bottom-1 -right-1 bg-ocean-600 rounded-full p-2 shadow-skeuo-ocean">
                                    <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
        <h1 className="text-3xl font-bold text-sandy-900 mt-4">Create your traveler profile</h1>
            <p className="text-sandy-700 text-sm">Tell us a bit about yourself — we'll personalize your itineraries.</p>
                <div className="flex gap-3 mt-4">
    {
        AVATAR_OPTIONS.map((url) => (
            <button key={url} type="button" onClick={() => setForm({ ...form, photo: url })}
                  className={`w-12 h-12 rounded-full overflow-hidden transition-all ${form.photo === url ?"ring-4 ring-ocean-400" : "opacity-70 hover:opacity-100"}`}>
        <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))
    }
            </div>
          </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div> <label className="text-sm font-semibold text-sandy-800">First Name</label><SkeuoInput data-testid="reg-first-name" value={form.first_name} onChange={onChange("first_name")} required /></div>
                <div> <label className="text-sm font-semibold text-sandy-800">Last Name</label><SkeuoInput data-testid="reg-last-name" value={form.last_name} onChange={onChange("last_name")} required /></div>
                    <div> <label className="text-sm font-semibold text-sandy-800">Email</label><SkeuoInput data-testid="reg-email" type="email" value={form.email} onChange={onChange("email")} required /></div>
                        <div> <label className="text-sm font-semibold text-sandy-800">Phone</label><SkeuoInput data-testid="reg-phone" value={form.phone} onChange={onChange("phone")} /></div>
                            <div> <label className="text-sm font-semibold text-sandy-800">City</label><SkeuoInput data-testid="reg-city" value={form.city} onChange={onChange("city")} /></div>
                                <div> <label className="text-sm font-semibold text-sandy-800">Country</label><SkeuoInput data-testid="reg-country" value={form.country} onChange={onChange("country")} /></div>
                                    <div className="sm:col-span-2"><label className="text-sm font-semibold text-sandy-800">Password</label><SkeuoInput data-testid="reg-password" type="password" value={form.password} onChange={onChange("password")} required /></div>
                                        <div className="sm:col-span-2"><label className="text-sm font-semibold text-sandy-800">Additional Information</label><SkeuoTextarea data-testid="reg-additional" rows={3} value={form.additional_info} onChange={onChange("additional_info")} placeholder="Travel style, dietary needs, dream destinations..." /></div>
    {
        err && <div className="sm:col-span-2 text-sm text-red-700 bg-red-50/60 rounded-lg px-3 py-2 shadow-skeuo-inset-sm">{err}</div>}
            <div className="sm:col-span-2 flex justify-between items-center pt-2">
                <Link to="/login" className="text-ocean-700 font-semibold text-sm">Have an account? Sign in</Link>
                    <SkeuoButton type="submit" data-testid="reg-submit" disabled={submitting}>{submitting ? "Creating..." : "Register User"}</SkeuoButton>
            </div>
          </form>
        </SkeuoCard>
      </div>
    </div>
  );
    }
    