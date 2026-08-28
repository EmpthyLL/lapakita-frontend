"use client";

import { googleAuth } from "@/lib/data/api/auth";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface GoogleButtonProps {
  className?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
  }
}

export function GoogleButton({ className }: GoogleButtonProps) {
  const router = useRouter();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const googleAuthMutation = useMutation({
    mutationFn: (idToken: string) => googleAuth({ id_token: idToken }),
    onSuccess: async (res) => {
      const responseData = res.data;

      // SKENARIO A: Profil Belum Lengkap
      if (responseData?.setup_preset) {
        const { setup_token, name, email, avatar_url } =
          responseData.setup_preset;

        // 1. Jika backend mengembalikan auth_data di setup_preset, daftarkan session dulu
        if (responseData.auth_data) {
          const authData = responseData.auth_data;
          await signIn("credentials", {
            accessToken: authData.access_token,
            refreshToken: authData.refresh_token,
            userData: JSON.stringify(authData.user),
            redirect: false,
          });
        }

        if (res.message) showToast.success(res.message);

        // 2. Redirect ke complete-profile (Middleware akan mengunci user di sini karena phone/name belum lengkap)
        const params = new URLSearchParams({
          setup_token,
          name: name || "",
          email: email || "",
          avatar_url: avatar_url || "",
        });

        router.push(`/complete-profile?${params.toString()}`);
        router.refresh();
        return;
      }

      // SKENARIO B: Profil Sudah Lengkap -> Direct Dashboard
      if (responseData?.auth_data) {
        const authData = responseData.auth_data;
        const signInRes = await signIn("credentials", {
          accessToken: authData.access_token,
          refreshToken: authData.refresh_token,
          userData: JSON.stringify(authData.user),
          redirect: false,
        });

        if (signInRes?.error) {
          handleError(signInRes.error);
          return;
        }

        if (res.message) showToast.success(res.message);
        router.push("/dashboard");
        router.refresh();
      }
    },
    onError: (error) => {
      handleError(error);
    },
  });

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    let isMounted = true;

    const initializeGoogle = () => {
      if (window.google?.accounts?.id && googleBtnRef.current && isMounted) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) => {
            if (response.credential) {
              googleAuthMutation.mutate(response.credential);
            }
          },
        });

        googleBtnRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: googleBtnRef.current.offsetWidth || 380,
          text: "continue_with",
          shape: "rectangular",
        });
      }
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("w-full flex justify-center", className)}>
      <div ref={googleBtnRef} className="w-full min-h-10" />
    </div>
  );
}
