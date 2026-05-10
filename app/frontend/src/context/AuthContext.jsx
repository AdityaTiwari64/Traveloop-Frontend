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
    setUser(data.user);
        return data.user;
    };

    const register = async (payload) => {
        const { data } = await api.post("/auth/register", payload);
    setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        await api.post("/auth/logout");
    setUser(false);
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
