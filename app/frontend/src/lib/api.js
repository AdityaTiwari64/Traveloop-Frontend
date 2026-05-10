import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
export const API = `${BACKEND_URL}/api`;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("traveloop_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-unwrap backend data property if it exists
api.interceptors.response.use((response) => {
    if (response.data && response.data.success && response.data.data !== undefined) {
        return { ...response, data: response.data.data };
    }
    return response;
});

export default api;

export function formatApiError(detail) {
    if (detail == null) return "Something went wrong. Please try again.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail))
        return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
    return String(detail);
}
