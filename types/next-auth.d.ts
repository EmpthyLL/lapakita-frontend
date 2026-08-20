import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";
import { Role } from ".";

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
    } & DefaultSession["user"];
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
  }
}
