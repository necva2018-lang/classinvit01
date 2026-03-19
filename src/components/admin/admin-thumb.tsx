"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type AdminThumbProps = {
  src: string;
  alt: string;
  className?: string;
};

/** 後台列表縮圖：任意網址皆可，不依賴 next/image 網域設定 */
export function AdminThumb({ src, alt, className }: AdminThumbProps) {
  const [broken, setBroken] = React.useState(false);

  if (!src || broken) {
    return (
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted text-[10px] text-muted-foreground",
          className
        )}
        aria-hidden
      >
        —
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "h-12 w-12 shrink-0 rounded-lg border object-cover",
        className
      )}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}
