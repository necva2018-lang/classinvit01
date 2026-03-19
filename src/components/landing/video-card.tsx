"use client";

import * as React from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import type { MediaItem } from "@/types";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const TYPE_LABEL: Record<MediaItem["type"], string> = {
  hero: "Hero",
  course: "課程",
  case: "案例",
  promo: "宣傳",
};

export function VideoCard({
  item,
  onPlay,
  categoryLabel,
  className,
}: {
  item: MediaItem;
  onPlay: () => void;
  /** 分類 Tab 時顯示 */
  categoryLabel?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "group w-full max-w-full text-left",
        "rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      onClick={onPlay}
    >
      <Card className="h-full overflow-hidden border border-border/80 bg-card shadow-sm transition-all duration-200 hover:border-primary/25 hover:shadow-md dark:hover:border-primary/30">
        <div className="relative aspect-video w-full bg-muted">
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 360px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent dark:from-black/70" />
          <div className="absolute inset-0 flex items-center justify-center opacity-90 transition-opacity group-hover:opacity-100">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg ring-2 ring-background/50 dark:bg-background/90">
              <Play className="h-6 w-6 translate-x-0.5" />
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="line-clamp-2 text-sm font-semibold text-white drop-shadow-sm">
              {item.title}
            </p>
          </div>
        </div>
        <CardContent className="space-y-2 p-4">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs font-normal">
              {TYPE_LABEL[item.type]}
            </Badge>
            {item.relatedCourseId ? (
              <Badge variant="outline" className="text-xs font-normal">
                關聯課程
              </Badge>
            ) : null}
            {item.relatedCaseId ? (
              <Badge variant="outline" className="text-xs font-normal">
                關聯案例
              </Badge>
            ) : null}
            {categoryLabel ? (
              <Badge variant="outline" className="text-xs font-normal">
                {categoryLabel}
              </Badge>
            ) : null}
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}
