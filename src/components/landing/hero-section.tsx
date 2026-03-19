"use client";

import * as React from "react";
import Image from "next/image";
import {
  Bot,
  Cpu,
  Gift,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import type { HeroContent, MediaItem } from "@/types";
import { cn } from "@/lib/utils";
import { getYoutubeEmbedUrl } from "@/lib/video-embed";
import { runHeroCta } from "@/lib/hero-cta";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BADGE_ICON_HINTS: { match: RegExp; icon: React.ReactNode }[] = [
  { match: /補助|政府/, icon: <Gift className="h-3 w-3" /> },
  { match: /設備|教室/, icon: <Cpu className="h-3 w-3" /> },
  { match: /AI|工具/, icon: <Bot className="h-3 w-3" /> },
];

function badgeIconFor(label: string) {
  for (const { match, icon } of BADGE_ICON_HINTS) {
    if (match.test(label)) return icon;
  }
  return null;
}

function HeroVideoBlock({
  title,
  description,
  videoUrl,
  thumbnailUrl,
}: {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div id="hero-video" className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground sm:text-sm">
          影音預覽 · 約 3 分鐘了解課程與就業路線
        </p>
        <button
          type="button"
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl border bg-gradient-to-br from-muted/60 to-background shadow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          onClick={() => {
            console.log("[track] video_preview_open", {
              source: "hero_cms",
              title,
            });
            setOpen(true);
          }}
          aria-label={`播放影片：${title}`}
        >
          <div className="relative aspect-video w-full">
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              priority
              loading="eager"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 520px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
              <div className="space-y-1 text-left">
                <p className="text-sm font-medium text-white/90 line-clamp-1">
                  {title}
                </p>
                <p className="text-xs text-white/70 line-clamp-2">
                  {description}
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-black shadow-md transition group-hover:bg-white">
                <Play className="h-5 w-5 translate-x-[1px]" />
              </div>
            </div>
          </div>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black">
              <iframe
                key={open ? videoUrl : "closed"}
                className="absolute inset-0 h-full w-full"
                src={open ? getYoutubeEmbedUrl(videoUrl) : undefined}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function mediaToVideoProps(media: MediaItem) {
  return {
    title: media.title,
    description: media.description,
    videoUrl: media.videoUrl,
    thumbnailUrl: media.thumbnailUrl,
  };
}

type HeroSectionProps = {
  content: HeroContent;
  /** CMS 未設定影片時，沿用已上架 type=hero 的影音 */
  heroMediaFallback?: MediaItem | null;
  /** 後台預覽：縮小字級、包在邊框內 */
  embedded?: boolean;
  className?: string;
};

export function HeroSection({
  content,
  heroMediaFallback = null,
  embedded = false,
  className,
}: HeroSectionProps) {
  const useCmsVideo =
    content.showVideoPreview &&
    Boolean(content.heroVideoUrl?.trim()) &&
    Boolean(content.heroVideoThumbnail?.trim());

  const videoProps = useCmsVideo
    ? {
        title: content.title.slice(0, 80) || "介紹影片",
        description: content.subtitle || content.description.slice(0, 120),
        videoUrl: content.heroVideoUrl.trim(),
        thumbnailUrl: content.heroVideoThumbnail.trim(),
      }
    : heroMediaFallback
      ? mediaToVideoProps(heroMediaFallback)
      : null;

  const inner = (
    <div
      className={cn(
        "mx-auto max-w-6xl px-4 py-8 sm:py-14 lg:py-16",
        embedded && "py-6 sm:py-8",
        className
      )}
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-12">
        <div className="space-y-5 sm:space-y-6">
          {content.showBadges && content.badges.length > 0 ? (
            <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
              {content.badges.map((label, bi) => {
                const icon = badgeIconFor(label);
                return (
                  <Badge
                    key={`${bi}-${label}`}
                    variant="secondary"
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1 text-xs font-normal sm:text-[13px]",
                      embedded && "text-[11px]"
                    )}
                  >
                    {icon ? (
                      <span className="mr-1 inline-flex opacity-80">{icon}</span>
                    ) : null}
                    {label}
                  </Badge>
                );
              })}
            </div>
          ) : null}

          <div className="space-y-3 sm:space-y-4">
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm",
                embedded && "text-[10px] sm:text-xs"
              )}
            >
              {content.subtitle}
            </p>
            <h1
              className={cn(
                "text-pretty text-[1.65rem] font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]",
                embedded && "text-xl sm:text-2xl lg:text-3xl"
              )}
            >
              {content.title}
            </h1>
            <p
              className={cn(
                "max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed",
                embedded && "text-xs sm:text-sm"
              )}
            >
              {content.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              size="lg"
              className={cn(
                "h-12 min-h-[48px] w-full rounded-xl text-base font-semibold shadow-md sm:w-auto sm:min-w-[240px]",
                embedded && "h-10 min-h-0 text-sm sm:min-w-[180px]"
              )}
              onClick={() =>
                runHeroCta(content.primaryCtaTarget, {
                  label: content.primaryCtaLabel,
                  placement: "hero_primary",
                })
              }
            >
              {content.primaryCtaLabel}
            </Button>
            {content.showSecondaryCta ? (
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "h-12 min-h-[48px] w-full rounded-xl text-base sm:w-auto",
                  embedded && "h-10 min-h-0 text-sm"
                )}
                onClick={() =>
                  runHeroCta(content.secondaryCtaTarget, {
                    label: content.secondaryCtaLabel,
                    placement: "hero_secondary",
                  })
                }
              >
                <Play className="h-4 w-4" />
                {content.secondaryCtaLabel}
              </Button>
            ) : null}
          </div>

          <p
            className={cn(
              "text-xs text-muted-foreground sm:text-sm",
              embedded && "text-[11px]"
            )}
          >
            全程可免費諮詢，確認適合再決定；補助資格以實際審核為準。
          </p>

          <div className="grid gap-3 rounded-2xl border bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:grid-cols-3 sm:p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">對齊就業技能</p>
                <p className="text-xs text-muted-foreground">
                  產出能投履歷的作品
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">每週可追進度</p>
                <p className="text-xs text-muted-foreground">
                  降低半途放棄風險
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">費用流程透明</p>
                <p className="text-xs text-muted-foreground">
                  補助／自付先講清楚
                </p>
              </div>
            </div>
          </div>

          {content.heroImage?.trim() ? (
            <div className="relative aspect-[16/9] w-full max-w-xl overflow-hidden rounded-2xl border shadow-sm">
              <Image
                src={content.heroImage.trim()}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 36rem"
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-5 lg:sticky lg:top-20">
          {content.showVideoPreview && videoProps ? (
            <HeroVideoBlock {...videoProps} />
          ) : null}
          <div className="hidden lg:block">
            <Card className="border-border/60 bg-card/85 backdrop-blur-md dark:border-border/50 dark:bg-card/70">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">先看真實轉變</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                下滑可看更多精選故事與影音宣傳，並保留 CTA 立即諮詢。
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div
        className={cn(
          "rounded-xl border bg-muted/20 dark:bg-muted/10",
          className
        )}
      >
        {inner}
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[380px] w-[min(100vw,900px)] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/12 via-sky-500/10 to-emerald-500/10 blur-3xl sm:h-[420px]" />
        <div className="absolute inset-0 bg-[radial-gradient(36rem_18rem_at_50%_0%,hsl(var(--background)/0.92),transparent)] dark:bg-[radial-gradient(36rem_18rem_at_50%_0%,hsl(var(--background)/0.5),transparent)]" />
      </div>
      {inner}
    </section>
  );
}
