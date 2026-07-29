import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ── Request interceptor ──────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach auth token when implemented
    // const token = authStore.getState().token;
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "An unexpected error occurred.";

    const status = error.response?.status;

    // Surface structured error objects for consumers
    return Promise.reject({ message, status, raw: error });
  }
);

export default axiosInstance;
