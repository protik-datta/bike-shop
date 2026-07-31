import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn(
    "VITE_API_URL is not set — requests will fail. Check your .env file.",
  );
}

export const api = axios.create({
  baseURL,
});

// Normalizes backend error shape ({ success:false, message }) into a plain
// Error so components/hooks can just read err.message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  },
);

export default api;
