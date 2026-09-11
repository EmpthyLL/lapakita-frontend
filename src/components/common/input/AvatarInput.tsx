/* eslint-disable @next/next/no-img-element */
"use client";

import DialogWrapper from "@/components/common/DialogWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Camera, Trash2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface AvatarInputProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
  disabled?: boolean;
  mode?: "edit" | "display";
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "size-12",
  md: "size-16",
  lg: "size-24",
};

const FALLBACK_TEXT_CLASSES = {
  sm: "text-base font-bold",
  md: "text-xl font-bold",
  lg: "text-3xl font-extrabold",
};

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export function AvatarInput({
  value,
  onChange,
  name = "User",
  className,
  disabled = false,
  mode = "edit",
  size = "lg",
}: AvatarInputProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const [imgSrc, setImgSrc] = React.useState<string>("");
  const [crop, setCrop] = React.useState<Crop>();
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();
  const [isOpenCropModal, setIsOpenCropModal] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImgSrc(reader.result);
          setIsOpenCropModal(true);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const handleConfirmCrop = async () => {
    if (!completedCrop || !imgRef.current || !onChange) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const base64Image = canvas.toDataURL("image/jpeg", 0.9);
    onChange(base64Image);
    setIsOpenCropModal(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) onChange("");
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

  if (mode === "display") {
    return (
      <Avatar
        className={cn(
          SIZE_CLASSES[size],
          "border border-border bg-muted shadow-xs",
          className,
        )}
      >
        {value ? (
          <AvatarImage asChild src={value} alt={name}>
            <Image
              src={value}
              alt={name}
              width={96}
              height={96}
              className="size-full object-cover"
            />
          </AvatarImage>
        ) : null}
        <AvatarFallback
          className={cn(
            "bg-primary/10 text-primary size-full flex items-center justify-center",
            FALLBACK_TEXT_CLASSES[size],
          )}
        >
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <>
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2",
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

        <div className="relative">
          <div
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={cn(
              "group relative overflow-hidden rounded-full border-2 border-border bg-muted shadow-sm cursor-pointer transition-all",
              SIZE_CLASSES[size],
              !disabled && "hover:border-primary/50",
            )}
          >
            <Avatar className="size-full">
              {value ? (
                <AvatarImage asChild src={value} alt={name}>
                  <Image
                    src={value}
                    alt={name}
                    width={96}
                    height={96}
                    className="size-full object-cover"
                  />
                </AvatarImage>
              ) : null}
              <AvatarFallback
                className={cn(
                  "bg-primary/10 text-primary size-full flex items-center justify-center",
                  FALLBACK_TEXT_CLASSES[size],
                )}
              >
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>

            {!disabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-6" />
              </div>
            )}
          </div>

          {value && !disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-3 -right-3 flex size-7 items-center justify-center rounded-full bg-destructive/15 text-destructive border border-destructive/30 shadow-md transition-transform hover:scale-110 active:scale-95 outline-none z-30"
              title="Remove Avatar"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <DialogWrapper
        open={isOpenCropModal}
        onOpenChange={setIsOpenCropModal}
        title="Crop Profile Picture"
        size="md"
      >
        <div className="flex max-h-[70vh] w-full items-center justify-center overflow-hidden py-2">
          {imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop
              className="max-h-[60vh] flex items-center justify-center"
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Crop Preview"
                onLoad={handleImageLoad}
                className="max-h-[60vh] w-auto object-contain block"
              />
            </ReactCrop>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpenCropModal(false)}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleConfirmCrop}
            className="rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            Apply & Save
          </Button>
        </DialogFooter>
      </DialogWrapper>
    </>
  );
}
