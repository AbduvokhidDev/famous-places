import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 15000,
});
client.interceptors.request.use(async (config) => {
  if (window.Clerk?.session) {
    const token = await window.Clerk.session.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || "Serverda xatolik";
    const customError = new Error(
      typeof message === "string" ? message : JSON.stringify(message),
    );
    customError.details = error.response?.data?.details || [];
    customError.status = error.response?.status;
    return Promise.reject(customError);
  },
);

export default client;
