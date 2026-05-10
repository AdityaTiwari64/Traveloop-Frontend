import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // null=loading, false=anon, obj=auth
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/auth/me")
                .then((res) => setUser(res.data))
                .catch(() => setUser(false))
                .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        if (data.data?.accessToken) {
            localStorage.setItem("traveloop_token", data.data.accessToken);
        }
        setUser(data.user);
        return data.user;
    };

    const register = async (payload) => {
        const { data } = await api.post("/auth/register", payload);
        if (data.data?.accessToken) {
            localStorage.setItem("traveloop_token", data.data.accessToken);
        }
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            localStorage.removeItem("traveloop_token");
            setUser(false);
        }
    };

    const refresh = async () => {
        const { data } = await api.get("/auth/me");
    setUser(data);
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
