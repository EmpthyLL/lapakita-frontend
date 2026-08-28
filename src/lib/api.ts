import axios, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const session = await getSession();

      // Jika refresh token gagal di NextAuth, langsung force signout
      if (session?.error === "RefreshTokenError") {
        await signOut({ redirect: true, callbackUrl: "/login" });
        return Promise.reject(new Error("Session expired"));
      }

      if (session?.user?.token) {
        config.headers.Authorization = `Bearer ${session.user.token}`;
      }
    }

    if (typeof document !== "undefined") {
      const locale =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("NEXT_LOCALE="))
          ?.split("=")[1] || "en";

      config.headers.lang = locale;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; error?: string }>) => {
    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.error || error.response?.data?.message;

    if (
      status === 401 ||
      errorMessage === "Expired token" ||
      errorMessage === "Token not found" ||
      errorMessage === "Invalid token" ||
      errorMessage === "Unauthorized"
    ) {
      if (typeof window !== "undefined") {
        await signOut({ redirect: true, callbackUrl: "/login" });
      }
    }

    return Promise.reject(error);
  },
);

export default api;
