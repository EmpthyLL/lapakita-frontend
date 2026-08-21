"use client";

import { Role } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VectorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const role = (session.user.activeRole as Role) ?? "tenant";
    router.replace(`/dashboard/${role}`);
  }, [session, status, router]);

  return null;
}
