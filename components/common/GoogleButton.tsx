import { cn } from "@/lib/utils";
import { GoogleIcon } from "../icon/SocialIcon";
import { Button } from "../ui/button";

interface GoogleButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function GoogleButton({
  href = "/api/auth/google",
  label = "Continue with Google",
  className,
}: GoogleButtonProps) {
  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className={cn("w-full font-semibold", className)}
    >
      <a href={href}>
        <GoogleIcon />
        <span>{label}</span>
      </a>
    </Button>
  );
}
