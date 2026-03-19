"use client";

import * as React from "react";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Play,
  Quote,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import type { CaseItem } from "@/types";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function CaseCard({
  item,
  onConsultCta,
  onRouteCta,
  onWatchStory,
  className,
}: {
  item: CaseItem;
  onConsultCta: () => void;
  onRouteCta: () => void;
  onWatchStory?: () => void;
  className?: string;
}) {
  const hasVideo = Boolean(item.videoUrl?.trim());

  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden border-border/80 bg-gradient-to-b from-card via-card to-muted/20 shadow-md transition-shadow hover:shadow-lg dark:to-muted/10",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 bg-muted">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 92vw, 480px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {item.isFeatured ? (
            <Badge className="gap-1 shadow-sm">
              <Sparkles className="h-3 w-3" />
              精選見證
            </Badge>
          ) : (
            <Badge variant="secondary">學員故事</Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs font-medium text-primary">學員 {item.name}</p>
          <p className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-foreground">
            {item.title}
          </p>
        </div>
      </div>

      <CardHeader className="space-y-2 pb-2 pt-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.summary}
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pb-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3 dark:bg-muted/15">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              轉變前
            </div>
            <p className="text-sm font-medium leading-snug">{item.beforeStatus}</p>
          </div>
          <div className="hidden items-center justify-center sm:flex">
            <ArrowRight className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 dark:bg-primary/10">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
              <BadgeCheck className="h-3.5 w-3.5" />
              轉變後
            </div>
            <p className="text-sm font-medium leading-snug">{item.afterStatus}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/80 p-4 dark:bg-background/40">
          <div className="flex gap-2">
            <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <blockquote className="text-sm leading-relaxed text-foreground/95">
              「{item.quote}」
            </blockquote>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <Badge key={t} variant="outline" className="font-normal">
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex flex-col gap-2 border-t border-border/60 bg-muted/20 pt-4 dark:bg-muted/10 sm:flex-row sm:flex-wrap">
        {hasVideo && onWatchStory ? (
          <Button
            type="button"
            variant="secondary"
            className="h-11 w-full rounded-xl sm:flex-1"
            onClick={onWatchStory}
          >
            <Play className="h-4 w-4" />
            觀看故事影片
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-11 w-full rounded-xl",
            hasVideo ? "sm:flex-1" : "sm:flex-1"
          )}
          onClick={onRouteCta}
        >
          了解可行路線
        </Button>
        <Button
          type="button"
          className="h-11 w-full rounded-xl font-semibold sm:flex-1"
          onClick={onConsultCta}
        >
          免費預約諮詢
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
