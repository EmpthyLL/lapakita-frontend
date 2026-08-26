import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";
import { Role } from ".";

export type SubscriptionPlan = "free" | Role | "all_access";

export interface PersonaDetail {
  display_name: string;
  avatar_url: string;
  phone: string;
}

export interface PhonePayload {
  number: string;
  is_primary: boolean;
  roles: Role[];
}

export type PersonaMap = Partial<Record<Role, PersonaDetail>>;

declare module "next-auth" {
  interface User {
    id: string;
    defaultName?: string | null;
    defaultAvatarUrl?: string | null;
    defaultPhone?: string | null;
    email: string;
    activeRole: Role;
    subscriptionPlan: SubscriptionPlan;
    subscriptionExpiresAt?: string | null;
    phoneNumbers?: PhonePayload[];
    personas?: PersonaMap;
    token: string;
    refreshToken: string;
    tokenExpiresAt: number;
    // Computed convenient props for active role persona
    name?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
  }

  interface Session {
    user: {
      id: string;
      defaultName?: string | null;
      defaultAvatarUrl?: string | null;
      defaultPhone?: string | null;
      email: string;
      activeRole: Role;
      subscriptionPlan: SubscriptionPlan;
      subscriptionExpiresAt?: string | null;
      phoneNumbers?: PhonePayload[];
      personas?: PersonaMap;
      token: string;
      refreshToken: string;
      name?: string | null;
      avatarUrl?: string | null;
      phone?: string | null;
    } & DefaultSession["user"];
    error?: "RefreshTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    defaultName?: string | null;
    defaultAvatarUrl?: string | null;
    defaultPhone?: string | null;
    activeRole: Role;
    subscriptionPlan: SubscriptionPlan;
    subscriptionExpiresAt?: string | null;
    phoneNumbers?: PhonePayload[];
    personas?: PersonaMap;
    token: string;
    refreshToken: string;
    tokenExpiresAt: number;
    error?: "RefreshTokenError";
  }
}
