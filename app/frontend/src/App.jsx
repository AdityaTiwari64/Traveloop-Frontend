import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Toaster } from "sonner";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Landing from "@/pages/Landing";
import CreateTrip from "@/pages/CreateTrip";
import BuildItinerary from "@/pages/BuildItinerary";
import TripListing from "@/pages/TripListing";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";
import ItineraryView from "@/pages/ItineraryView";
import Community from "@/pages/Community";
import PackingChecklist from "@/pages/PackingChecklist";
import AdminPanel from "@/pages/AdminPanel";
import TripNotes from "@/pages/TripNotes";
import Invoice from "@/pages/Invoice";

function Protected({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center skeuo-surface">
                <div className="w-12 h-12 rounded-full border-4 border-ocean-200 border-t-ocean-500 animate-spin" />
      </div>
    );
    }
    if (!user) return <Navigate to="/login" replace />;
    return <Layout>{children}</Layout>;
}

function AdminOnly({ children }) {
    const { user } = useAuth();
    if (user && user.role !== "admin") return <Navigate to="/" replace />;
    return children;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster position="top-right" richColors />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Protected><Landing /></Protected>} />
                    <Route path="/trips" element={<Protected><TripListing /></Protected>} />
                    <Route path="/trips/new" element={<Protected><CreateTrip /></Protected>} />
                    <Route path="/trips/:id/itinerary/edit" element={<Protected><BuildItinerary /></Protected>} />
                    <Route path="/trips/:id" element={<Protected><ItineraryView /></Protected>} />
                    <Route path="/trips/:id/packing" element={<Protected><PackingChecklist /></Protected>} />
                    <Route path="/trips/:id/notes" element={<Protected><TripNotes /></Protected>} />
                    <Route path="/trips/:id/invoice" element={<Protected><Invoice /></Protected>} />
                    <Route path="/profile" element={<Protected><Profile /></Protected>} />
                    <Route path="/search" element={<Protected><Search /></Protected>} />
                    <Route path="/community" element={<Protected><Community /></Protected>} />
                    <Route path="/admin" element={<Protected><AdminOnly><AdminPanel /></AdminOnly></Protected>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
