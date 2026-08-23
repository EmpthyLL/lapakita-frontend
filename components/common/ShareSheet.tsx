"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Check, Copy, Link2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LineIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
} from "../icon/SocialIcon";

interface ShareSheetProps {
  title: string;
  text?: string;
  url?: string;
  trigger: ReactNode;
}

interface ShareChannel {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  brandColor: string;
  href?: string;
  onClick?: () => void;
}

export function ShareSheet({ title, text, url, trigger }: ShareSheetProps) {
  const t = useTranslations("common.share_sheet");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const shareText = text || t("default_text");
  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareText}\n${shareUrl}`);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast.success(t("toast.success"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast.error(t("toast.error"));
    }
  }

  const secondaryChannels: ShareChannel[] = [
    {
      name: "Facebook",
      icon: FacebookIcon,
      brandColor: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "X",
      icon: XIcon,
      brandColor: "#0F1419",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: TelegramIcon,
      brandColor: "#24A1DE",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "LINE",
      icon: LineIcon,
      brandColor: "#06C755",
      href: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: LinkedinIcon,
      brandColor: "#0A66C2",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Email",
      icon: Mail,
      brandColor: "#EA580C",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}`,
    },
    {
      name: "Instagram",
      icon: InstagramIcon,
      brandColor: "#E1306C",
      onClick: handleCopy,
    },
  ];

  const body = (
    <div className="flex flex-col gap-3.5">
      <a
        href={`https://wa.me/?text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-2xl bg-[#25D366] p-3 text-white shadow-sm transition-transform active:scale-[0.98] hover:bg-[#22bf5b]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
          <WhatsAppIcon className="h-5 w-5" />
        </span>
        <span className="flex-1 text-left min-w-0">
          <span className="block text-xs font-semibold leading-tight">
            {t("whatsapp_banner.title")}
          </span>
          <span className="block text-[11px] text-white/80 leading-tight mt-0.5 truncate">
            {t("whatsapp_banner.subtitle")}
          </span>
        </span>
      </a>

      <div className="grid grid-cols-4 gap-2">
        {secondaryChannels.map((c) => {
          const Icon = c.icon;
          const commonClass =
            "flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card p-2.5 text-[10px] font-medium text-foreground transition-all active:scale-95 hover:border-primary/30 hover:bg-secondary/50";

          const iconWrap = (
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: `${c.brandColor}1A`,
                color: c.brandColor,
              }}
            >
              <Icon className="h-4 w-4" />
            </span>
          );

          if (c.onClick) {
            return (
              <button
                key={c.name}
                type="button"
                onClick={c.onClick}
                className={commonClass}
              >
                {iconWrap}
                <span className="truncate w-full text-center">{c.name}</span>
              </button>
            );
          }

          return (
            <a
              key={c.name}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className={commonClass}
            >
              {iconWrap}
              <span className="truncate w-full text-center">{c.name}</span>
            </a>
          );
        })}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-1 pl-3">
        <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          value={shareUrl}
          readOnly
          className="h-7 border-none bg-transparent px-0 font-mono text-xs text-muted-foreground shadow-none focus-visible:ring-0"
        />
        <Button
          type="button"
          size="sm"
          onClick={handleCopy}
          className={cn(
            "h-7 shrink-0 gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
            copied && "bg-emerald-600 hover:bg-emerald-600 text-white",
          )}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? t("copied") : t("copy_link")}
        </Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent className="w-full max-w-100 p-5 rounded-2xl gap-4 overflow-hidden">
          <DialogHeader className="p-0 space-y-1">
            <DialogTitle className="text-base font-semibold">
              {t("title")}
            </DialogTitle>
            <DialogDescription className="truncate text-xs">
              {title}
            </DialogDescription>
          </DialogHeader>

          {body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md p-4 pt-0">
          <DrawerHeader className="px-0 pt-2 pb-4 space-y-1">
            <DrawerTitle className="text-base font-semibold">
              {t("title")}
            </DrawerTitle>
            <DrawerDescription className="truncate text-xs">
              {title}
            </DrawerDescription>
          </DrawerHeader>

          {body}

          <DrawerFooter className="px-0 pt-3 pb-1">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full rounded-xl h-9 text-xs"
              >
                {t("cancel")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
