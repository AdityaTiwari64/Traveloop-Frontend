import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SkeuoCard, SkeuoButton, SkeuoInput } from "@/components/Skeuo";
import { Compass, Lock, Mail } from "lucide-react";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState("demo@traveloop.com");
  const [password, setPassword] = useState("demo123");
  const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState("");

  const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErr("");
    try {
            await login(email, password);
            toast.success("Welcome back, traveler.");
      nav("/");
    } catch (e) {
            setErr(formatApiError(e.response?.data?.detail) || e.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen skeuo-surface grid place-items-center px-4 py-10 relative overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[440px] h-[440px] rounded-full bg-ocean-200/40 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full bg-sandy-300/50 blur-3xl" />

                    <SkeuoCard className="relative w-full max-w-md p-10" data-testid="login-card">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 rounded-full bg-surface-card grid place-items-center shadow-[inset_4px_4px_8px_rgba(176,152,122,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.7)] mb-4">
                                <Compass className="w-10 h-10 text-ocean-700" strokeWidth={2} />
          </div>
        <h1 className="text-3xl font-bold text-sandy-900">Welcome to Traveloop</h1>
            <p className="text-sandy-700 text-sm mt-1">Sign in to plan your next escape.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-sandy-800 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</label>
                    <SkeuoInput type="email" data-testid="login-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@traveloop.com" required />
          </div>
        <div className="space-y-2">
            <label className="text-sm font-semibold text-sandy-800 flex items-center gap-2"><Lock className="w-4 h-4" /> Password</label>
                <SkeuoInput type="password" data-testid="login-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
        { err && <div data-testid="login-error" className="text-sm text-red-700 bg-red-50/60 rounded-lg px-3 py-2 shadow-[inset_2px_2px_4px_rgba(150,60,50,0.2)]">{err}</div>}
            <SkeuoButton type="submit" data-testid="login-submit" className="w-full" disabled={submitting}>
    {
        submitting ?"Signing in..." : "Sign in"}
          </SkeuoButton>
        </form>

            <div className="mt-6 text-center text-sm text-sandy-700">
          New here ? {
        " "}
            <Link to="/register" data-testid="link-register" className="text-ocean-700 font-semibold hover:underline">Create an account</Link>
        </div>
            <div className="mt-4 text-xs text-sandy-700/80 text-center bg-sandy-100 rounded-lg px-3 py-2 shadow-[inset_2px_2px_4px_rgba(176,152,122,0.25)]">
        Demo: demo @traveloop.com / demo123 · Admin: admin@traveloop.com / admin123
        </div>
      </SkeuoCard>
    </div>
  );
    }
    