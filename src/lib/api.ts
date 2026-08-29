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
      let session = await getSession();

      // Retry 1x jika session belum siap (race condition setelah login)
      if (!session?.user?.token) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        session = await getSession();
      }

      // Force signout jika refresh token di NextAuth gagal
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

      config.headers["Accept-Language"] = locale;
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

    const invalidTokenMessages = [
      "Expired token",
      "Token not found",
      "Invalid token",
      "Unauthorized",
    ];

    const isUnauthorized =
      status === 401 ||
      (errorMessage && invalidTokenMessages.includes(errorMessage));

    if (isUnauthorized && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const isPublicAuthPage =
        currentPath.includes("/login") ||
        currentPath.includes("/register") ||
        currentPath.includes("/verify-otp") ||
        currentPath.includes("/forgot-password") ||
        currentPath.includes("/reset-password");

      if (!isPublicAuthPage) {
        await signOut({ redirect: true, callbackUrl: "/login" });
      }
    }

    return Promise.reject(error);
  },
);

export default api;
