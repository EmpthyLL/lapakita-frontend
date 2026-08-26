"use client";

import api from "@/lib/api";
import { handleError } from "@/lib/error";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { GoogleIcon } from "../icon/SocialIcon";
import { Button } from "../ui/button";

interface GoogleButtonProps {
  label?: string;
  className?: string;
}

export function GoogleButton({
  label = "Continue with Google",
  className,
}: GoogleButtonProps) {
  const googleAuthMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/google");
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      handleError(error);
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={() => googleAuthMutation.mutate()}
      isLoading={googleAuthMutation.isPending}
      className={cn("w-full font-semibold gap-2.5", className)}
    >
      {!googleAuthMutation.isPending && (
        <GoogleIcon className="size-4 shrink-0" />
      )}
      <span>{label}</span>
    </Button>
  );
}
