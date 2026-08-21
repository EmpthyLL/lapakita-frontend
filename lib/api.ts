import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import { getLocale } from "next-intl/server";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    metadata?: { start: number; side: "server" | "browser" };
  }
}

const baseURL =
  typeof window === "undefined"
    ? (process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL)
    : process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let cachedBrowserToken: string | null = null;
let browserTokenFetchedAt = 0;
let browserSessionPromise: Promise<string | null> | null = null;
const BROWSER_TOKEN_TTL_MS = 15 * 1000;

const getBrowserToken = async (): Promise<string | null> => {
  const now = Date.now();

  if (
    cachedBrowserToken &&
    now - browserTokenFetchedAt < BROWSER_TOKEN_TTL_MS
  ) {
    return cachedBrowserToken;
  }

  if (!browserSessionPromise) {
    browserSessionPromise = getSession()
      .then((session) => {
        const token = session?.user?.token ?? null;
        cachedBrowserToken = token;
        browserTokenFetchedAt = Date.now();
        return token;
      })
      .finally(() => {
        browserSessionPromise = null;
      });
  }

  return browserSessionPromise;
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const isServer = typeof window === "undefined";
    const side = isServer ? "server" : "browser";
    config.metadata = { start: Date.now(), side };

    if (!isServer) {
      // 1. Client-Side: Ambil Locale dari Cookie 'NEXT_LOCALE'
      const locale =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("NEXT_LOCALE="))
          ?.split("=")[1] || "en";
      config.headers["lang"] = locale;

      // 2. Client-Side Auth Token
      const token = await getBrowserToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // 1. Server-Side: Ambil Locale dari next-intl/server
      try {
        const locale = await getLocale();
        config.headers["lang"] = locale || "en";
      } catch {
        config.headers["lang"] = "en";
      }

      // 2. Server-Side Auth Token
      const { auth } = await import("./auth");
      const session = await auth();
      if (session?.user?.token) {
        config.headers.Authorization = `Bearer ${session.user.token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    const meta = response.config.metadata;
    if (meta && process.env.NODE_ENV === "development") {
      const ms = Date.now() - meta.start;
      console.log(
        `[API ${meta.side.toUpperCase()}] ${response.config.url} -> ${response.status} (${ms}ms)`,
      );
    }
    return response;
  },
  async (error: AxiosError<{ message?: string; error?: string }>) => {
    const meta = error.config?.metadata;
    if (meta && process.env.NODE_ENV === "development") {
      const ms = Date.now() - meta.start;
      const tag =
        error.code === "ECONNABORTED"
          ? "TIMEOUT"
          : (error.response?.status ?? "ERR");
      console.error(
        `[API ${meta.side.toUpperCase()}] ${error.config?.url} -> ${tag} (${ms}ms)`,
      );
    }

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
        cachedBrowserToken = null;
        browserTokenFetchedAt = 0;
        await signOut({ redirect: true, callbackUrl: "/login" });
      }
    }

    return Promise.reject(error);
  },
);

export default api;
