import axios from "axios";
import NextAuth, { CredentialsSignin } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// Class Custom Error untuk Auth.js v5
class CustomAuthError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.code = message; // Auth.js v5 menyimpan pesan error di properti 'code'
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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new CustomAuthError("Email and password are required");
        }

        try {
          const res = await authApi.post("auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const data = res.data?.data;
          const user = data?.user;
          const accessToken = data?.access_token || user?.token;
          const refreshToken = data?.refresh_token;

          if (user && accessToken) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              avatarUrl: user.avatarUrl ?? user.avatar_url,
              activeRole: user.activeRole ?? user.active_role ?? "tenant",
              subscriptionPlan:
                user.subscriptionPlan ?? user.subscription_plan ?? "free",
              subscriptionExpiresAt:
                user.subscriptionExpiresAt ?? user.subscription_expires_at,
              token: accessToken,
              refreshToken: refreshToken || "",
              tokenExpiresAt: Date.now() + 15 * 60 * 1000,
            };
          }
          throw new CustomAuthError("Invalid credentials");
        } catch (error) {
          if (axios.isAxiosError(error)) {
            // Tangkap pesan error dari response backend Golang
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
        token.phone = user.phone;
        token.avatarUrl = user.avatarUrl;
        token.activeRole = user.activeRole;
        token.subscriptionPlan = user.subscriptionPlan;
        token.subscriptionExpiresAt = user.subscriptionExpiresAt;
        token.token = user.token;
        token.refreshToken = user.refreshToken;
        token.tokenExpiresAt = user.tokenExpiresAt;
        return token;
      }

      if (trigger === "update" && session) {
        if (session.activeRole) token.activeRole = session.activeRole;
        if (session.subscriptionPlan)
          token.subscriptionPlan = session.subscriptionPlan;
      }

      if (Date.now() < token.tokenExpiresAt) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.phone = token.phone;
        session.user.avatarUrl = token.avatarUrl;
        session.user.activeRole = token.activeRole;
        session.user.subscriptionPlan = token.subscriptionPlan;
        session.user.subscriptionExpiresAt = token.subscriptionExpiresAt;
        session.user.token = token.token;
        session.user.refreshToken = token.refreshToken;
        session.error = token.error;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
