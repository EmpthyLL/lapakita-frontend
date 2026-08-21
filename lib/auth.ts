import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "./api";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const user = res.data?.data; // Sesuaikan dengan payload API backend-mu

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
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Login Awal
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.avatarUrl = user.avatarUrl;
        token.activeRole = user.activeRole;
        token.subscriptionPlan = user.subscriptionPlan;
        token.subscriptionExpiresAt = user.subscriptionExpiresAt;
        token.token = user.token;
      }

      // Update Session manual via `update({ activeRole: "owner" })` dari client
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
  session: { strategy: "jwt" },
});
