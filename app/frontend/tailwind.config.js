/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}",
        "./app/**/*.{js,jsx}",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px"
            },
        },
        extend: {
            fontFamily: {
                outfit: ["Outfit", "sans-serif"],
                karla: ["Karla", "sans-serif"],
                display: ["Outfit", "sans-serif"],
            },
            colors: {
                surface: {
                    main: "#F1F5F9",
                    card: "#FFFFFF",
                },
                sandy: {
                    50: "#F8FAFC",
                    100: "#F1F5F9",
                    200: "#E2E8F0",
                    300: "#CBD5E1",
                    400: "#94A3B8",
                    500: "#64748B",
                    600: "#475569",
                    700: "#334155",
                    800: "#1E293B",
                    900: "#0F172A",
                },
                ocean: {
                    50: "#EEF2FF",
                    100: "#E0E7FF",
                    200: "#C7D2FE",
                    300: "#A5B4FC",
                    400: "#818CF8",
                    500: "#6366F1",
                    600: "#4F46E5",
                    700: "#4338CA",
                    800: "#3730A3",
                    900: "#312E81",
                },
                accent: {
                    50: "#FFF1F2",
                    100: "#FFE4E6",
                    500: "#F43F5E",
                    600: "#E11D48",
                    700: "#BE123C",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                "skeuo-raised": "8px 8px 16px rgba(15, 23, 42, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)",
                "skeuo-raised-sm": "4px 4px 8px rgba(15, 23, 42, 0.08), -4px -4px 8px rgba(255, 255, 255, 0.85)",
                "skeuo-inset": "inset 4px 4px 8px rgba(15, 23, 42, 0.12), inset -4px -4px 8px rgba(255, 255, 255, 0.7)",
                "skeuo-inset-sm": "inset 2px 2px 4px rgba(15, 23, 42, 0.12), inset -2px -2px 4px rgba(255, 255, 255, 0.7)",
                "skeuo-ocean": "6px 6px 12px rgba(79, 70, 229, 0.3), -6px -6px 12px rgba(165, 180, 252, 0.2)",
                "skeuo-ocean-pressed": "inset 4px 4px 8px rgba(79, 70, 229, 0.4), inset -4px -4px 8px rgba(165, 180, 252, 0.2)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};