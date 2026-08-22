import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const COOKIE_PREFIX = "lapakita";
const useSecureCookies = (process.env.AUTH_URL ?? "").startsWith("https://");

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
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await authApi.post("auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const user = res.data?.data;

          if (user && user.token) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              avatarUrl: user.avatar_url,
              activeRole: user.active_role ?? "tenant",
              subscriptionPlan: user.subscription_plan ?? "free",
              subscriptionExpiresAt: user.subscription_expires_at,
              token: user.token,
            };
          }
          return null;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
              return null;
            }
            throw new Error(
              error.response?.data?.error || "Gagal menghubungi server",
            );
          }
          throw error;
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
      }

      if (trigger === "update" && session) {
        if (session.activeRole) token.activeRole = session.activeRole;
        if (session.subscriptionPlan)
          token.subscriptionPlan = session.subscriptionPlan;
      }

      return token;
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
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
