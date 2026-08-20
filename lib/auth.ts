import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
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
          // Ganti URL API sesuai backend GO / Express kamu
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            },
          );

          const data = await res.json();

          if (!res.ok || !data.user) {
            return null;
          }

          // Return user object sesuai schema DB
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            image: data.user.avatar_url,
            activeRole: data.user.active_role,
            subscriptionPlan: data.user.subscription_plan,
            accessToken: data.token,
          };
        } catch (error) {
          console.error("Auth Login Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Saat login pertama kali
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.activeRole = user.activeRole;
        token.subscriptionPlan = user.subscriptionPlan;
        token.accessToken = user.accessToken;
      }

      // Dukungan untuk update role/profile secara dinamis dari client via update()
      if (trigger === "update" && session) {
        if (session.activeRole) token.activeRole = session.activeRole;
        if (session.name) token.name = session.name;
        if (session.user?.image) token.picture = session.user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.phone = token.phone;
        session.user.activeRole = token.activeRole;
        session.user.subscriptionPlan = token.subscriptionPlan;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
