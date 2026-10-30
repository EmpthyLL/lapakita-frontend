import axios, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";

// Helper membuat/mengambil Device ID yang persisten di localStorage
function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "";

  let deviceId = localStorage.getItem("lapakita_device_id");
  if (!deviceId) {
    try {
      // Coba gunakan bawaan browser jika lingkungan aman (HTTPS / localhost)
      if (typeof window.crypto?.randomUUID === "function") {
        deviceId = window.crypto.randomUUID();
      } else {
        // Fallback ke library uuid jika crypto tidak tersedia (misal di http:// IP lokal)
        deviceId = uuidv4();
      }
    } catch {
      // Fallback darurat terakhir jika semuanya gagal
      deviceId = uuidv4();
    }

    localStorage.setItem("lapakita_device_id", deviceId);
  }
  return deviceId;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

function isProtectedAppPath(pathname: string) {
  const path = pathname.replace(/^\/(en|id)(?=\/|$)/, "") || "/";
  return (
    path === "/dashboard" ||
    path.startsWith("/dashboard/") ||
    path === "/complete-profile" ||
    path.startsWith("/complete-profile/")
  );
}

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      // 1. Set Device ID Header secara otomatis di setiap request
      const deviceId = getOrCreateDeviceId();
      if (deviceId) {
        config.headers["X-Device-ID"] = deviceId; // atau "Device-ID" sesuai preferensi BE
      }

      let session = await getSession();

      // Retry 1x jika session belum siap (race condition setelah login)
      if (!session?.user?.token) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        session = await getSession();
      }

      const isProtectedPage = isProtectedAppPath(window.location.pathname);

      if (session?.error === "RefreshTokenError") {
        if (isProtectedPage) {
          await signOut({ redirect: true, callbackUrl: "/login" });
          return Promise.reject(new Error("Session expired"));
        }
      } else if (session?.user?.token) {
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
      const authorization =
        error.config?.headers?.Authorization ??
        error.config?.headers?.get?.("Authorization");
      if (authorization && isProtectedAppPath(currentPath)) {
        await signOut({ redirect: true, callbackUrl: "/login" });
      }
    }

    return Promise.reject(error);
  },
);

export default api;
