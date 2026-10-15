"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "@/lib/utils";

type DrawerContextProps = {
  hasSnapPoints: boolean;
  modal: boolean;
  showSwipeHandle: boolean;
  swipeDirection: "up" | "down" | "left" | "right";
};

const DrawerContext = React.createContext<DrawerContextProps | null>(null);

function useDrawer() {
  const context = React.useContext(DrawerContext);

  if (!context) {
    throw new Error("useDrawer must be used within a Drawer.");
  }

  return context;
}

interface DrawerProps extends DialogPrimitive.DialogProps {
  showSwipeHandle?: boolean;
  snapPoints?: (string | number)[];
  swipeDirection?: "up" | "down" | "left" | "right";
}

function Drawer({
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = "down",
  children,
  ...props
}: DrawerProps) {
  const hasSnapPoints = snapPoints != null && snapPoints.length > 0;
  const contextValue = React.useMemo(
    () => ({ hasSnapPoints, modal, showSwipeHandle, swipeDirection }),
    [hasSnapPoints, modal, showSwipeHandle, swipeDirection],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      <DialogPrimitive.Root modal={modal} {...props}>
        {children}
      </DialogPrimitive.Root>
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({ ...props }: DialogPrimitive.DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: DialogPrimitive.DialogPortalProps) {
  return <DialogPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: DialogPrimitive.DialogCloseProps) {
  return <DialogPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: DialogPrimitive.DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 min-h-dvh bg-black/10 opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] select-none data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0 data-[state=closed]:duration-[calc(var(--drawer-swipe-strength,1)*400ms)] data-[state=open]:opacity-100 data-snap-points:[--drawer-overlay-min-opacity:0.5] data-starting-style:opacity-0 data-swiping:duration-0 supports-backdrop-filter:backdrop-blur-xs supports-[-webkit-touch-callout:none]:absolute",
        className,
      )}
      {...props}
    />
  );
}

function DrawerSwipeHandle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-swipe-handle"
      aria-hidden="true"
      className={cn(
        "relative z-10 flex shrink-0 cursor-grab transition-opacity duration-200 group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-[swipe-axis=x]/drawer-popup:h-full group-data-[swipe-axis=x]/drawer-popup:w-3 group-data-[swipe-axis=x]/drawer-popup:items-center group-data-[swipe-axis=y]/drawer-popup:h-3 group-data-[swipe-axis=y]/drawer-popup:w-full group-data-[swipe-axis=y]/drawer-popup:justify-center group-data-[swipe-direction=down]/drawer-popup:items-end group-data-[swipe-direction=left]/drawer-popup:order-last group-data-[swipe-direction=left]/drawer-popup:justify-start group-data-[swipe-direction=right]/drawer-popup:justify-end group-data-[swipe-direction=up]/drawer-popup:order-last group-data-[swipe-direction=up]/drawer-popup:items-start after:block after:shrink-0 after:rounded-md after:bg-muted group-data-[swipe-axis=x]/drawer-popup:after:h-12 group-data-[swipe-axis=x]/drawer-popup:after:w-1 group-data-[swipe-axis=y]/drawer-popup:after:h-1 group-data-[swipe-axis=y]/drawer-popup:after:w-12 active:cursor-grabbing",
        className,
      )}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: DialogPrimitive.DialogContentProps) {
  const { modal, showSwipeHandle, swipeDirection } = useDrawer();

  // Konfigurasi animasi slide masuk & keluar yang selaras dengan durasi eksplisit
  const slideAnimationClasses = {
    down: "inset-x-0 bottom-0 rounded-t-2xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
    up: "inset-x-0 top-0 rounded-b-2xl data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
    left: "inset-y-0 left-0 rounded-r-2xl data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
    right:
      "inset-y-0 right-0 rounded-l-2xl data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
  };

  return (
    <DrawerPortal data-slot="drawer-portal">
      {modal && (
        <DrawerOverlay
          className={cn(
            "fixed inset-0 z-50 bg-black/40 backdrop-blur-xs",
            "transition-opacity duration-300 ease-out",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          )}
        />
      )}
      <div
        data-slot="drawer-viewport"
        className="pointer-events-none fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden"
      >
        <DialogPrimitive.Content
          data-slot="drawer-popup"
          className={cn(
            // Base style: Pastikan ada transition transform & durasi 300ms untuk open/closed
            "pointer-events-auto fixed z-50 flex flex-col bg-popover text-xs/relaxed text-popover-foreground shadow-xl outline-none",
            "transition-transform duration-300 ease-in-out", // <-- INI KUNCINYA AGAR BERGESER SAAT DITUTUP
            "data-[state=open]:animate-in data-[state=open]:duration-300",
            "data-[state=closed]:animate-out data-[state=closed]:duration-300",
            slideAnimationClasses[swipeDirection] || slideAnimationClasses.down,
            className,
          )}
          {...props}
        >
          {showSwipeHandle && <DrawerSwipeHandle />}
          <div
            data-slot="drawer-content"
            className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-4"
          >
            {children}
          </div>
        </DialogPrimitive.Content>
      </div>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex shrink-0 flex-col gap-0.5 p-4 pb-0 group-data-[swipe-axis=y]/drawer-popup:text-center md:gap-0.5 md:text-left",
        className,
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex shrink-0 flex-col gap-2 p-4 pt-0", className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: DialogPrimitive.DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: DialogPrimitive.DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="drawer-description"
      className={cn(
        "text-xs/relaxed text-balance text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerSwipeHandle,
  DrawerTitle,
  DrawerTrigger,
};
