import { Role } from "@/types";
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
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        userData: { label: "User Data Payload", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.accessToken || !credentials?.userData) {
          throw new CustomAuthError("Invalid credentials payload");
        }

        try {
          const userPayload = JSON.parse(credentials.userData as string);
          const accessToken = credentials.accessToken as string;
          const refreshToken = (credentials.refreshToken as string) || "";

          const activeRole: Role =
            (userPayload.active_role as Role) || "tenant";

          return {
            id: userPayload.id,
            defaultName: userPayload.default_name,
            defaultAvatarUrl: userPayload.default_avatar_url,
            defaultPhone: userPayload.default_phone,
            email: userPayload.email,
            isPasswordSet: userPayload.is_password_set ?? false,
            activeRole,
            subscriptionPlan: userPayload.subscription_plan || "free",
            subscriptionExpiresAt: userPayload.subscription_expires_at,
            phoneNumbers: userPayload.phone_numbers || [],
            personas: userPayload.personas || {},
            token: accessToken,
            refreshToken,
            tokenExpiresAt: Date.now() + 15 * 60 * 1000,
          };
        } catch {
          throw new CustomAuthError("Failed to parse user session payload");
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
        token.isPasswordSet = user.isPasswordSet;
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

      // Handle update dari client side
      if (trigger === "update" && session) {
        const updateData = session.user || session;

        if (updateData.defaultName !== undefined)
          token.defaultName = updateData.defaultName;
        if (updateData.defaultPhone !== undefined)
          token.defaultPhone = updateData.defaultPhone;
        if (updateData.defaultAvatarUrl !== undefined)
          token.defaultAvatarUrl = updateData.defaultAvatarUrl;
        if (updateData.phoneNumbers !== undefined)
          token.phoneNumbers = updateData.phoneNumbers;
        if (updateData.personas !== undefined)
          token.personas = updateData.personas;
        if (updateData.activeRole !== undefined)
          token.activeRole = updateData.activeRole;
        if (updateData.subscriptionPlan !== undefined)
          token.subscriptionPlan = updateData.subscriptionPlan;

        return token;
      }

      if (Date.now() < token.tokenExpiresAt) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.defaultName = token.defaultName;
        session.user.defaultAvatarUrl = token.defaultAvatarUrl;
        session.user.defaultPhone = token.defaultPhone;
        session.user.email = token.email ?? "";
        session.user.isPasswordSet = token.isPasswordSet;
        session.user.activeRole = token.activeRole;
        session.user.subscriptionPlan = token.subscriptionPlan;
        session.user.subscriptionExpiresAt = token.subscriptionExpiresAt;
        session.user.phoneNumbers = token.phoneNumbers;
        session.user.personas = token.personas;
        session.user.token = token.token;
        session.user.refreshToken = token.refreshToken;
        session.error = token.error;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
});
