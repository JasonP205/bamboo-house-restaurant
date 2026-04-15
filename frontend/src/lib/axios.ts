import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5002/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  const deviceId = useAuthStore.getState().deviceId;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (deviceId) {
    config.headers["X-Device-ID"] = deviceId;
  }

  return config;
});


api.interceptors.response.use((req) => req,async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/auth/refresh") || 
        originalRequest.url.includes("/auth/signin") ||
        originalRequest.url.includes("/auth/signup"))
    {
        return Promise.reject(error);
    }
    originalRequest._retryCount = originalRequest._retryCount || 0;
    if (error.response?.status === 401 && originalRequest._retryCount < 4 ) {
        originalRequest._retryCount += 1;
        console.log('Refreshing token and retrying request, attempt:', originalRequest._retryCount);
        try {
            const res = await api.post("/auth/refresh", { withCredentials: true });
            const newAccessToken = res.data.accessToken;
            useAuthStore.getState().setAccessToken(newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            useAuthStore.getState().clearSession();
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default api;