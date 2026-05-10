import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Compass, MapPin, Plus, User, Users, ShieldCheck, BookOpen, LogOut, Backpack, Search } from "lucide-react";

const navItems = [
    {
        to: "/", label: "Discover", icon: Compass },
  {
            to: "/trips", label: "My Trips", icon: MapPin },
  {
                to: "/search", label: "Search", icon: Search },
  { to: "/community", label: "Community", icon: Users },
];

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const nav = useNavigate();

    const handleLogout = async () => {
        await logout();
        nav("/login");
  };

    return (
        <div className="min-h-screen skeuo-surface">
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-surface-main/85 border-b border-sandy-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
                    <Link to="/" data-testid="brand-logo" className="flex items-center gap-1 group">
            <div>
              <div className="font-outfit font-bold text-2xl text-sandy-900 leading-none">Traveloop</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-accent-600 font-bold">Plan · Wander · Remember</div>
            </div>
          </Link>

        <nav className="hidden md:flex items-center gap-2">
    {
        navItems.map((it) => (
            <NavLink
                key={it.to}
                to={it.to}
                end
                data-testid={`nav-${it.label.toLowerCase().replace(" ", "-")}`}
                className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive
                        ?"bg-ocean-600 text-white shadow-skeuo-ocean-pressed"
                      : "text-sandy-800 hover:bg-sandy-100"
                  }`
                }
            >
                <it.icon className="w-4 h-4" />
                {it.label}
            </NavLink>
        ))
    }
    {
        user && user.role === "admin" && (
            <NavLink
        to="/admin"
        data-testid="nav-admin"
                className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive ? "bg-sandy-700 text-white shadow-skeuo-inset-sm" : "text-sandy-800 hover:bg-sandy-100"
                    }`
                }
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/trips/new"
              data-testid="nav-new-trip"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ocean-600 text-white font-semibold text-sm shadow-skeuo-ocean hover:translate-y-[1px] active:translate-y-[2px] transition-all"
            >
              <Plus className="w-4 h-4" /> New Trip
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" data-testid="nav-profile" className="w-11 h-11 rounded-full overflow-hidden bg-sandy-100 shadow-skeuo-inset-sm grid place-items-center border border-white/40">
                  {user.photo ? (
                    <img src={user.photo} alt="me" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-sandy-700" />
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  data-testid="nav-logout"
                  className="hidden sm:inline-grid place-items-center w-11 h-11 rounded-full bg-sandy-100 text-sandy-800 shadow-skeuo-raised-sm hover:translate-y-[1px]"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" data-testid="nav-login" className="text-sandy-900 font-semibold text-sm px-4">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      <footer className="mt-20 py-10 text-center text-sandy-700 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          Crafted with intention. Traveloop {new Date().getFullYear()} — your tactile companion for the road less algorithmic.
        </div>
      </footer>
    </div>
  );
}
