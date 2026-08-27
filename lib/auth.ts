import { Role } from "@/types";
import { PersonaMap } from "@/types/next-auth";
import axios from "axios";
import NextAuth, { CredentialsSignin } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

class CustomAuthError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.code = message;
  }
}

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const COOKIE_PREFIX = "lapakita";
const useSecureCookies = (process.env.AUTH_URL ?? "").startsWith("https://");

function getActivePersona(
  personas: PersonaMap | undefined,
  activeRole: Role,
  defaults: {
    name?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
  },
) {
  const activePersona = personas?.[activeRole as keyof PersonaMap];
  return {
    name: activePersona?.display_name || defaults.name || "User",
    avatarUrl: activePersona?.avatar_url || defaults.avatarUrl || null,
    phone: activePersona?.phone || defaults.phone || null,
  };
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await authApi.post("auth/refresh", {
      refresh_token: token.refreshToken,
    });

    const refreshedTokens = response.data?.data;

    if (!response.data || !refreshedTokens) {
      throw new Error("Failed to refresh token");
    }

    return {
      ...token,
      token: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      tokenExpiresAt: Date.now() + 15 * 60 * 1000,
    };
  } catch {
    return {
      ...token,
      error: "RefreshTokenError",
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 18000,
    updateAge: 0,
  },
  cookies: {
    sessionToken: {
      name: `${COOKIE_PREFIX}-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${COOKIE_PREFIX}-next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${COOKIE_PREFIX}-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        userData: { label: "User Data Payload", type: "text" },
      },
      async authorize(credentials) {
        // Flow 1: Direct Token Ingestion (OTP Verification / Google Complete Profile)
        if (credentials?.accessToken && credentials?.userData) {
          try {
            const userPayload = JSON.parse(credentials.userData as string);
            const accessToken = credentials.accessToken as string;
            const refreshToken = (credentials.refreshToken as string) || "";

            const activeRole: Role =
              (userPayload.active_role as Role) || "tenant";
            const persona = getActivePersona(userPayload.personas, activeRole, {
              name: userPayload.default_name,
              avatarUrl: userPayload.default_avatar_url,
              phone: userPayload.default_phone,
            });

            return {
              id: userPayload.id,
              defaultName: userPayload.default_name,
              defaultAvatarUrl: userPayload.default_avatar_url,
              defaultPhone: userPayload.default_phone,
              email: userPayload.email,
              activeRole,
              subscriptionPlan: userPayload.subscription_plan || "free",
              subscriptionExpiresAt: userPayload.subscription_expires_at,
              phoneNumbers: userPayload.phone_numbers || [],
              personas: userPayload.personas || {},
              token: accessToken,
              refreshToken,
              tokenExpiresAt: Date.now() + 15 * 60 * 1000,
              name: persona.name,
              avatarUrl: persona.avatarUrl,
              phone: persona.phone,
            };
          } catch {
            throw new CustomAuthError("Failed to parse user session payload");
          }
        }

        // Flow 2: Email & Password Login
        if (!credentials?.email || !credentials?.password) {
          throw new CustomAuthError("Email and password are required");
        }

        try {
          const res = await authApi.post("auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const authData = res.data?.data;
          const userPayload = authData?.user;
          const accessToken = authData?.access_token || userPayload?.token;
          const refreshToken = authData?.refresh_token;

          if (userPayload && accessToken) {
            const activeRole: Role =
              (userPayload.active_role as Role) || "tenant";
            const persona = getActivePersona(userPayload.personas, activeRole, {
              name: userPayload.default_name,
              avatarUrl: userPayload.default_avatar_url,
              phone: userPayload.default_phone,
            });

            return {
              id: userPayload.id,
              defaultName: userPayload.default_name,
              defaultAvatarUrl: userPayload.default_avatar_url,
              defaultPhone: userPayload.default_phone,
              email: userPayload.email,
              activeRole,
              subscriptionPlan: userPayload.subscription_plan || "free",
              subscriptionExpiresAt: userPayload.subscription_expires_at,
              phoneNumbers: userPayload.phone_numbers || [],
              personas: userPayload.personas || {},
              token: accessToken,
              refreshToken: refreshToken || "",
              tokenExpiresAt: Date.now() + 15 * 60 * 1000,
              name: persona.name,
              avatarUrl: persona.avatarUrl,
              phone: persona.phone,
            };
          }
          throw new CustomAuthError("Invalid credentials");
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const msg =
              error.response?.data?.message ||
              error.response?.data?.error ||
              "Invalid email or password";
            throw new CustomAuthError(msg);
          }
          if (error instanceof CustomAuthError) {
            throw error;
          }
          throw new CustomAuthError("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.defaultName = user.defaultName;
        token.defaultAvatarUrl = user.defaultAvatarUrl;
        token.defaultPhone = user.defaultPhone;
        token.email = user.email;
        token.activeRole = user.activeRole;
        token.subscriptionPlan = user.subscriptionPlan;
        token.subscriptionExpiresAt = user.subscriptionExpiresAt;
        token.phoneNumbers = user.phoneNumbers;
        token.personas = user.personas;
        token.token = user.token;
        token.refreshToken = user.refreshToken;
        token.tokenExpiresAt = user.tokenExpiresAt;
        return token;
      }

      if (trigger === "update" && session) {
        if (session.activeRole) token.activeRole = session.activeRole;
        if (session.subscriptionPlan)
          token.subscriptionPlan = session.subscriptionPlan;
        if (session.personas) token.personas = session.personas;
      }

      if (Date.now() < token.tokenExpiresAt) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token && session.user) {
        const activeRole: Role = token.activeRole || "tenant";
        const persona = getActivePersona(token.personas, activeRole, {
          name: token.defaultName,
          avatarUrl: token.defaultAvatarUrl,
          phone: token.defaultPhone,
        });

        session.user.id = token.id;
        session.user.defaultName = token.defaultName;
        session.user.defaultAvatarUrl = token.defaultAvatarUrl;
        session.user.defaultPhone = token.defaultPhone;
        session.user.email = token.email ?? "";
        session.user.activeRole = activeRole;
        session.user.subscriptionPlan = token.subscriptionPlan;
        session.user.subscriptionExpiresAt = token.subscriptionExpiresAt;
        session.user.phoneNumbers = token.phoneNumbers;
        session.user.personas = token.personas;
        session.user.token = token.token;
        session.user.refreshToken = token.refreshToken;
        session.error = token.error;

        session.user.name = persona.name;
        session.user.avatarUrl = persona.avatarUrl;
        session.user.phone = persona.phone;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
