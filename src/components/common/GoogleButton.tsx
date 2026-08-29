"use client";

import { Button } from "@/components/ui/button";
import { googleAuth } from "@/lib/data/api/auth";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoogleIcon } from "../icon/SocialIcon";

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
  const [isGsiReady, setIsGsiReady] = useState(false);

  const googleAuthMutation = useMutation({
    mutationFn: (idToken: string) => googleAuth({ id_token: idToken }),
    onSuccess: async (res) => {
      const authData = res.data;

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
    },
    onError: (error) => {
      handleError(error);
    },
  });

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    let isMounted = true;

    const initGoogle = () => {
      if (window.google?.accounts?.id && isMounted) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) => {
            if (response.credential) {
              googleAuthMutation.mutate(response.credential);
            }
          },
        });
        setIsGsiReady(true);
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };
  const isLoading = !isGsiReady || googleAuthMutation.isPending;
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      disabled={isLoading}
      isLoading={googleAuthMutation.isPending}
      onClick={handleGoogleClick}
      className={cn("w-full", className)}
    >
      {!googleAuthMutation.isPending && <GoogleIcon />}
      <span>Continue with Google</span>
    </Button>
  );
}
