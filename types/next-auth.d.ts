import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";
import { Role } from ".";

export type SubscriptionPlan = "free" | Role | "all_access";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string | null;
    activeRole: Role;
    subscriptionPlan: SubscriptionPlan;
    subscriptionExpiresAt?: string | null;
    token: string;
    refreshToken: string;
    tokenExpiresAt: number; // In milliseconds/seconds timestamp
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      avatarUrl?: string | null;
      activeRole: Role;
      subscriptionPlan: SubscriptionPlan;
      subscriptionExpiresAt?: string | null;
      token: string;
      refreshToken: string;
    } & DefaultSession["user"];
    error?: "RefreshTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    phone?: string;
    avatarUrl?: string | null;
    activeRole: Role;
    subscriptionPlan: SubscriptionPlan;
    subscriptionExpiresAt?: string | null;
    token: string;
    refreshToken: string;
    tokenExpiresAt: number;
    error?: "RefreshTokenError";
  }
}
