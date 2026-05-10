/* Skeuomorphic primitives for Traveloop */
import { cn } from "@/lib/utils";

export function SkeuoCard({ className, children, inset = false, ...props }) {
    return (
        <div
            className={cn(
                "rounded-2xl bg-surface-card p-6 transition-all",
                inset ? "shadow-skeuo-inset" : "shadow-skeuo-raised border border-white/40",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function SkeuoButton({ className, variant = "primary", children, ...props }) {
    const base = "rounded-xl px-6 py-3 font-semibold transition-all duration-150 active:translate-y-[2px] hover:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary:
            "bg-ocean-600 text-white shadow-skeuo-ocean hover:shadow-skeuo-ocean active:shadow-skeuo-ocean-pressed",
        secondary:
            "bg-sandy-200 text-sandy-900 shadow-skeuo-raised-sm hover:shadow-skeuo-raised active:shadow-skeuo-inset-sm",
        ghost:
            "bg-transparent text-sandy-900 hover:bg-sandy-100",
        danger:
            "bg-accent-600 text-white shadow-[6px_6px_12px_rgba(225,29,72,0.3),-6px_-6px_12px_rgba(255,228,230,0.2)] active:shadow-[inset_4px_4px_8px_rgba(225,29,72,0.4)]",
    };
    return (
        <button className={cn(base, variants[variant], className)} {...props}>
            {children}
        </button>
    );
}

export function SkeuoInput({ className, ...props }) {
    return (
        <input
            className={cn(
                "w-full rounded-xl bg-surface-main text-sandy-900 placeholder:text-sandy-500 px-4 py-3 border-none outline-none",
                "shadow-skeuo-inset-sm focus:shadow-skeuo-inset",
                "focus:ring-2 focus:ring-ocean-500/20 transition-all",
                className
            )}
            {...props}
        />
    );
}

export function SkeuoTextarea({ className, ...props }) {
    return (
        <textarea
            className={cn(
                "w-full rounded-xl bg-surface-main text-sandy-900 placeholder:text-sandy-500 px-4 py-3 border-none outline-none",
                "shadow-skeuo-inset-sm focus:shadow-skeuo-inset",
                "focus:ring-2 focus:ring-ocean-500/20 transition-all resize-none",
                className
            )}
            {...props}
        />
    );
}

export function SkeuoSelect({ className, children, ...props }) {
    return (
        <select
            className={cn(
                "w-full rounded-xl bg-surface-main text-sandy-900 px-4 py-3 border-none outline-none cursor-pointer",
                "shadow-skeuo-inset-sm",
                "focus:ring-2 focus:ring-ocean-500/20",
                className
            )}
            {...props}
        >
            {children}
        </select>
    );
}

export function SkeuoBadge({ className, children, tone = "ocean" }) {
    const tones = {
        ocean: "bg-ocean-100 text-ocean-700 shadow-skeuo-inset-sm",
        sandy: "bg-sandy-100 text-sandy-700 shadow-skeuo-inset-sm",
        success: "bg-emerald-100 text-emerald-700",
        warn: "bg-amber-100 text-amber-700",
    };
    return (
        <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold", tones[tone], className)}>
            {children}
        </span>
    );
}

            export function SkeuoPill({ active, children, onClick, className, ...props }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all",
        active
                    ?"bg-ocean-500 text-white shadow-[inset_3px_3px_6px_rgba(44,108,176,0.6)]"
          : "bg-sandy-200 text-sandy-800 shadow-[3px_3px_6px_rgba(176,152,122,0.35),-3px_-3px_6px_rgba(255,255,255,0.8)] hover:translate-y-[1px]",
        className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
