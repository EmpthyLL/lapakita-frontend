"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Camera, Trash2 } from "lucide-react";
import * as React from "react";

interface AvatarInputProps {
  value?: string;
  onChange: (value: string) => void;
  name?: string;
  className?: string;
  disabled?: boolean;
}

export function AvatarInput({
  value,
  onChange,
  name = "User",
  className,
  disabled = false,
}: AvatarInputProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Pembacaan file ke format Data URL (Base64) untuk pratinjau/pengiriman
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = (str: string) => {
    if (!str) return "U";
    return str
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="relative group">
        <Avatar className="size-20 border-2 border-border bg-muted shadow-xs transition-transform group-hover:scale-102">
          <AvatarImage src={value} alt={name} className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        {/* Tombol Kamera di Atas Avatar */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:opacity-50 outline-none"
          title="Change Avatar"
        >
          <Camera className="size-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="text-xs h-7 px-2.5"
        >
          Upload Photo
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleRemove}
            disabled={disabled}
            className="text-xs h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5 mr-1" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
