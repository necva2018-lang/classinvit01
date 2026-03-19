"use client";

import * as React from "react";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  Clock,
  Cpu,
  Gift,
  GraduationCap,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import type { CaseItem, Course, MediaItem } from "@/types";
import * as coursesStore from "@/lib/courses";
import * as casesStore from "@/lib/cases";
import * as mediaStore from "@/lib/media";
import * as leadsStore from "@/lib/leads";
import { cn } from "@/lib/utils";
import {
  COURSE_CATEGORIES,
  COURSE_CATEGORY_MARKETING,
  getCourseCategoryLabel,
} from "@/lib/course-categories";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  return hydrated;
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  } catch {
    return url;
  }
}

function track(event: string, payload?: Record<string, unknown>) {
  console.log(`[track] ${event}`, payload ?? {});
}

/** 平滑捲動到表單，並帶 CTA 追蹤 */
function scrollToLeadForm(placement: string, label: string) {
  track("cta_click", { placement, label });
  document
    .getElementById("lead-form")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ScrollToFormButton({
  className,
  label,
  placement,
  size = "lg",
  variant = "default",
}: {
  className?: string;
  label: string;
  placement: string;
  size?: React.ComponentProps<typeof Button>["size"];
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  return (
    <Button
      className={className}
      size={size}
      variant={variant}
      onClick={() => scrollToLeadForm(placement, label)}
    >
      {label}
    </Button>
  );
}

const HERO_BADGES: { label: string; icon?: React.ReactNode }[] = [
  { label: "政府補助可諮詢", icon: <Gift className="h-3 w-3" /> },
  { label: "免費諮詢零壓力" },
  { label: "零基礎可跟" },
  { label: "專業設備教室", icon: <Cpu className="h-3 w-3" /> },
  { label: "AI 工具應用", icon: <Bot className="h-3 w-3" /> },
];

function FeaturedCasesStories({
  items,
  onCta,
}: {
  items: CaseItem[];
  onCta: (label: string) => void;
}) {
  const featured = items
    .filter((c) => c.isPublished && c.isFeatured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 10);

  if (featured.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
            精選學員故事
          </h3>
          <p className="text-sm text-muted-foreground">
            看得見的轉變：原本狀態 → 成果 → 真實心得。
          </p>
        </div>
        <ScrollToFormButton
          label="我也想確認適合的路線"
          placement="cases_section_header"
          className="hidden h-10 sm:inline-flex"
          size="default"
        />
      </div>

      <div
        className={cn(
          "relative -mx-4 px-4",
          "overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        <div className="flex gap-4 snap-x snap-mandatory">
          {featured.map((c) => (
            <Card
              key={c.id}
              className={cn(
                "w-[88%] shrink-0 snap-start overflow-hidden border shadow-sm sm:w-[520px]",
                "bg-gradient-to-br from-background via-background to-muted/30"
              )}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{c.name}</Badge>
                      <Badge variant="outline">真實案例</Badge>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-snug">
                      {c.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {c.summary}
                    </p>
                  </div>
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border bg-muted">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                </div>

                <div className="grid gap-2 rounded-xl border bg-background/60 p-3 text-sm">
                  <div className="grid gap-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      原本狀態
                    </p>
                    <p className="font-medium">{c.beforeStatus}</p>
                  </div>
                  <div className="grid gap-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      轉變後成果
                    </p>
                    <p className="font-medium">{c.afterStatus}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border bg-muted/25 p-4">
                  <div className="flex items-start gap-2">
                    <Quote className="mt-0.5 h-4 w-4 text-primary" />
                    <p className="text-sm leading-relaxed">
                      <span className="font-medium">「</span>
                      {c.quote}
                      <span className="font-medium">」</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.tags.slice(0, 4).map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 border-t bg-muted/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  variant="outline"
                  className="w-full rounded-xl sm:w-auto"
                  onClick={() => onCta("我想了解更多案例與課程")}
                >
                  了解我的可行路線
                </Button>
                <Button
                  className="w-full rounded-xl sm:w-auto"
                  onClick={() => onCta("免費預約｜我也想達成類似成果")}
                >
                  免費預約諮詢
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="sm:hidden">
        <ScrollToFormButton
          label="我也想確認適合的路線"
          placement="cases_section_footer_mobile"
          className="h-12 w-full rounded-xl text-base"
        />
      </div>
    </div>
  );
}

function MediaPromoSection({
  courses,
  media,
}: {
  courses: Course[];
  media: MediaItem[];
}) {
  const byCourseId = React.useMemo(() => {
    const map = new Map<string, Course>();
    for (const c of courses) map.set(c.id, c);
    return map;
  }, [courses]);

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<MediaItem | null>(null);

  const openMedia = (m: MediaItem, placement: string) => {
    track("video_promo_open", { placement, id: m.id, type: m.type });
    setActive(m);
    setOpen(true);
  };

  const getForCategory = (cat: Course["category"]) => {
    const list = media
      .filter((m) => m.isPublished)
      .filter((m) => m.type === "promo" || m.type === "course")
      .filter((m) => {
        if (!m.relatedCourseId) return true; // 泛用 promo
        const c = byCourseId.get(m.relatedCourseId);
        return c?.category === cat;
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);

    // 讓「泛用 promo」永遠先出現
    const generic = list.filter((m) => !m.relatedCourseId);
    const specific = list.filter((m) => m.relatedCourseId);
    return [...generic, ...specific].slice(0, 6);
  };

  return (
    <section
      id="promo-media"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:py-14"
      aria-label="影音宣傳"
    >
      <div className="space-y-4 text-center sm:text-left">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          影音宣傳｜先看見上課成果與氛圍
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:mx-0 sm:max-w-none sm:text-base">
          不用只看文字。用 1–3 分鐘了解「你會做到什麼、怎麼被帶著做出成果」。
        </p>
      </div>

      <div className="mt-8">
        <Tabs defaultValue={COURSE_CATEGORIES[0]} className="w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="w-full sm:w-auto">
              {COURSE_CATEGORIES.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="flex-1 sm:flex-none">
                  {getCourseCategoryLabel(cat)}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollToFormButton
              label="免費預約｜我想看適合的影音與課程"
              placement="promo_media_header"
              className="hidden h-10 sm:inline-flex"
              size="default"
            />
          </div>

          {COURSE_CATEGORIES.map((cat) => {
            const list = getForCategory(cat);
            const m = COURSE_CATEGORY_MARKETING[cat];
            return (
              <TabsContent key={cat} value={cat} className="mt-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                    {m.tabTitle} 的影音
                  </h3>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    {m.tabSubtitle}
                  </p>
                </div>

                <div className="mt-5 -mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex gap-4">
                    {list.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        className={cn(
                          "group w-[82%] shrink-0 text-left sm:w-[360px]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
                        )}
                        onClick={() => openMedia(v, `promo_tab_${cat}`)}
                      >
                        <Card className="overflow-hidden border shadow-sm transition-shadow group-hover:shadow-md">
                          <div className="relative aspect-video w-full bg-muted">
                            <Image
                              src={v.thumbnailUrl}
                              alt={v.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 80vw, 360px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                              <div className="min-w-0">
                                <p className="line-clamp-1 text-sm font-semibold text-white/95">
                                  {v.title}
                                </p>
                                <p className="line-clamp-2 text-xs text-white/75">
                                  {v.description}
                                </p>
                              </div>
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-black shadow-md">
                                <Play className="h-5 w-5 translate-x-[1px]" />
                              </div>
                            </div>
                          </div>
                          <CardContent className="space-y-2 p-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary">
                                {v.relatedCourseId ? "課程影音" : "宣傳精華"}
                              </Badge>
                              <Badge variant="outline">{getCourseCategoryLabel(cat)}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {v.description}
                            </p>
                          </CardContent>
                        </Card>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <SectionCtaBar
                    title="想看最適合你的影音與課程路線？"
                    subtitle="留下聯絡方式，我們會依你的背景推薦對應分類與課程，並說清楚補助/名額/時段。"
                    primaryLabel={m.listCtaLabel}
                    placementPrimary={`promo_media_cta_${cat}`}
                  />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{active?.title ?? "播放影片"}</DialogTitle>
            <DialogDescription>{active?.description ?? ""}</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black">
              <iframe
                key={open ? active?.videoUrl : "closed"}
                className="absolute inset-0 h-full w-full"
                src={open && active?.videoUrl ? getYoutubeEmbedUrl(active.videoUrl) : undefined}
                title={active?.title ?? "video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function VideoPreview({ media }: { media: MediaItem | null }) {
  const [open, setOpen] = React.useState(false);
  if (!media) return null;

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
            track("video_preview_open", { id: media.id, type: media.type });
            setOpen(true);
          }}
          aria-label={`播放影片：${media.title}`}
        >
          <div className="relative aspect-video w-full">
            <Image
              src={media.thumbnailUrl}
              alt={media.title}
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
                  {media.title}
                </p>
                <p className="text-xs text-white/70 line-clamp-2">
                  {media.description}
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
            <DialogTitle>{media.title}</DialogTitle>
            <DialogDescription>{media.description}</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black">
              <iframe
                key={open ? media.videoUrl : "closed"}
                className="absolute inset-0 h-full w-full"
                src={open ? getYoutubeEmbedUrl(media.videoUrl) : undefined}
                title={media.title}
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

/** 區塊間 CTA 橫幅（高轉換節奏用） */
function SectionCtaBar({
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
  onSecondaryScrollTo,
  placementPrimary,
}: {
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onSecondaryScrollTo?: string;
  placementPrimary: string;
}) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-background px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 text-center sm:mx-0 sm:text-left">
        <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-3 md:justify-start">
          <ScrollToFormButton
            label={primaryLabel}
            placement={placementPrimary}
            className="h-12 rounded-xl text-base shadow-md"
          />
          {secondaryLabel && onSecondaryScrollTo ? (
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-xl text-base"
              onClick={() => {
                track("cta_click", {
                  placement: `${placementPrimary}_secondary`,
                  label: secondaryLabel,
                });
                document
                  .getElementById(onSecondaryScrollTo)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const hydrated = useHydrated();
  const { toast } = useToast();

  const [courses, setCourses] = React.useState<Course[]>([]);
  const [cases, setCases] = React.useState<CaseItem[]>([]);
  const [heroMedia, setHeroMedia] = React.useState<MediaItem | null>(null);
  const [media, setMedia] = React.useState<MediaItem[]>([]);

  React.useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      const [courses, cases, heroList, mediaAll] = await Promise.all([
        coursesStore.apiGetAll(),
        casesStore.apiGetAll(),
        mediaStore.apiGetPublishedByType("hero"),
        mediaStore.apiGetAll(),
      ]);
      if (cancelled) return;
      setCourses(courses.filter((c) => c.isPublished));
      setCases(cases.filter((c) => c.isPublished));
      setHeroMedia(heroList[0] ?? null);
      setMedia(mediaAll.filter((m) => m.isPublished));
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    course: "",
    contactTime: "平日白天",
  });

  const primaryCourse = courses[0] ?? null;
  /** 主轉換 CTA：比課程內建 cta 更偏「行動＋利益」 */
  const primaryCtaLabel =
    "免費預約｜確認補助與名額";
  const stickyCtaLabel = primaryCtaLabel;

  const handleCaseSectionCta = (label: string) => {
    scrollToLeadForm("cases_stories", label);
  };

  return (
    <div className="flex-1 pb-[4.5rem] sm:pb-0">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold">技能轉職職訓中心</p>
              <p className="truncate text-xs text-muted-foreground">
                補助 · 就業 · 作品集
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                document
                  .getElementById("social-proof")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              學員成果
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                document
                  .getElementById("understand")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              課程方案
            </Button>
            <ScrollToFormButton
              label="預約諮詢"
              placement="header"
              size="default"
            />
          </div>
        </div>
      </header>

      {/* —— SEE：首屏 —— */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[380px] w-[min(100vw,900px)] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/12 via-sky-500/10 to-emerald-500/10 blur-3xl sm:h-[420px]" />
          <div className="absolute inset-0 bg-[radial-gradient(36rem_18rem_at_50%_0%,hsl(var(--background)/0.92),transparent)] dark:bg-[radial-gradient(36rem_18rem_at_50%_0%,hsl(var(--background)/0.5),transparent)]" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:items-start">
            {/* 左：文案 + CTA（手機先呈現核心，不堆滿） */}
            <div className="space-y-5 sm:space-y-6">
              <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
                {HERO_BADGES.map((b) => (
                  <Badge
                    key={b.label}
                    variant="secondary"
                    className="shrink-0 rounded-full px-3 py-1 text-xs font-normal sm:text-[13px]"
                  >
                    {b.icon ? (
                      <span className="mr-1 inline-flex opacity-80">
                        {b.icon}
                      </span>
                    ) : null}
                    {b.label}
                  </Badge>
                ))}
              </div>

              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
                  職業訓練 · 就業導向
                </p>
                <h1 className="text-pretty text-[1.65rem] font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                  用
                  <span className="text-primary">可驗證的技能</span>
                  重返職場：
                  <span className="block sm:inline sm:pl-1">
                    補助、陪跑、作品集一次到位
                  </span>
                </h1>
                <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed">
                  專為失業／待業、二度就業、轉職與第二專長設計。先釐清補助與學習路線，再用每週任務把焦慮變成進度——
                  <span className="font-medium text-foreground/90">
                    你不需先很厲害才開始。
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <ScrollToFormButton
                  label={primaryCtaLabel}
                  placement="hero_primary"
                  className="h-12 min-h-[48px] w-full rounded-xl text-base font-semibold shadow-md sm:w-auto sm:min-w-[240px]"
                />
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 min-h-[48px] w-full rounded-xl text-base sm:w-auto"
                  onClick={() => {
                    track("cta_click", {
                      placement: "hero_secondary",
                      label: "先看課程介紹影片",
                    });
                    document
                      .getElementById("hero-video")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                >
                  <Play className="h-4 w-4" />
                  先看課程介紹影片
                </Button>
              </div>

              <p className="text-xs text-muted-foreground sm:text-sm">
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
            </div>

            {/* 右：影音 + 案例（桌機並排；手機留白足夠） */}
            <div className="space-y-5 lg:sticky lg:top-20">
              <VideoPreview media={heroMedia} />
              <div className="hidden lg:block">
                <Card className="border-white/10 bg-white/70 backdrop-blur dark:bg-black/30">
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
      </section>

      {/* —— TRUST：快速信任條 —— */}
      <section
        id="trust"
        className="border-y bg-muted/30 py-10 sm:py-12"
        aria-label="信任要素"
      >
        <div className="mx-auto max-w-6xl space-y-8 px-4">
          <div className="mx-auto max-w-2xl text-center sm:max-w-none sm:text-left">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              為什麼值得你先花 3 分鐘了解？
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              我們把「能不能做得到」拆成可執行步驟，而不是口號。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                t: "不只上課，更要能面試",
                d: "作品集、履歷與面試敘事一起打磨。",
              },
              {
                t: "卡關有人陪",
                d: "小班＋助教陪跑，問題不隔夜。",
              },
              {
                t: "補助與費用說清楚",
                d: "先確認資格與自付區間，再決定是否報名。",
              },
            ].map((x) => (
              <Card key={x.t} className="border bg-background/80 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{x.t}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {x.d}
                </CardContent>
              </Card>
            ))}
          </div>
          <SectionCtaBar
            title="還在猶豫適不適合？先用免費諮詢把路線釐清"
            subtitle="留下聯絡方式，顧問會依你的背景（育兒／待業／轉職）給你具體建議，不推銷、不綁約。"
            primaryLabel="免費預約｜一對一諮詢"
            secondaryLabel="先看學員故事"
            onSecondaryScrollTo="social-proof"
            placementPrimary="trust_section"
          />
        </div>
      </section>

      {/* —— 社會證明（案例已在 Hero 旁，此處作錨點與補強節奏） —— */}
      <section
        id="social-proof"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:py-14"
      >
        <div className="space-y-4 text-center sm:text-left">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            他們也曾卡關——後來選擇用「方法」而不是硬撐
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:mx-0 sm:max-w-none sm:text-base">
            精選案例可於首屏右側瀏覽；若你符合類似情境，我們會在諮詢中對照可行課程與補助方向。
          </p>
        </div>
        <div className="mt-8 space-y-8">
          <FeaturedCasesStories items={cases} onCta={handleCaseSectionCta} />
          <SectionCtaBar
            title="想知道自己能不能複製類似路徑？"
            subtitle="填寫表單後，我們會在 1 個工作天內聯繫，協助你對齊課程與補助評估。"
            primaryLabel="免費預約｜取得個人化建議"
            placementPrimary="social_proof_mid"
          />
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* 影音宣傳（依課程分類） */}
      <MediaPromoSection courses={courses} media={media} />

      <Separator className="mx-auto max-w-6xl" />

      {/* —— UNDERSTAND：適合對象 + 課程 —— */}
      <section
        id="understand"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:py-14"
      >
        <div className="space-y-10">
          <div className="rounded-2xl border bg-muted/20 px-4 py-8 sm:px-8 sm:py-10">
            <div className="mx-auto max-w-2xl text-center sm:mx-0 sm:max-w-none sm:text-left">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                適合對象
              </div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                如果你符合以下任一種，我們通常能幫你縮短摸索時間
              </h2>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "失業或待業，想盡快回到職場",
                "二度就業／育兒後重返，需要彈性與陪跑",
                "想轉職但不知道從哪個技能切入",
                "想學第二專長，增加投遞履歷的籌碼",
                "零基礎可開始，重視每週可交出的成果",
                "希望先了解補助與自付，再決定是否投入",
              ].map((line) => (
                <li
                  key={line}
                  className="flex gap-2 rounded-xl border bg-background px-4 py-3 text-sm leading-snug"
                >
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center sm:justify-start">
              <ScrollToFormButton
                label="免費預約｜幫我對照適合課程"
                placement="audience_section"
                className="h-12 rounded-xl px-6"
              />
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                  課程方案（依分類）
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                  先選分類再挑課程；諮詢時再依你的背景調整最短可行路線。
                </p>
              </div>
              <ScrollToFormButton
                label="免費預約｜幫我選最適合分類"
                placement="courses_header"
                className="hidden h-11 sm:inline-flex"
                size="default"
              />
            </div>

            <div className="mt-8">
              <Tabs defaultValue={COURSE_CATEGORIES[0]} className="w-full">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <TabsList className="w-full sm:w-auto">
                    {COURSE_CATEGORIES.map((cat) => (
                      <TabsTrigger key={cat} value={cat} className="flex-1 sm:flex-none">
                        {getCourseCategoryLabel(cat)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {COURSE_CATEGORIES.map((cat) => {
                  const m = COURSE_CATEGORY_MARKETING[cat];
                  const list = courses.filter((c) => c.category === cat);
                  return (
                    <TabsContent key={cat} value={cat} className="mt-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                            {m.tabTitle}
                          </h3>
                          <p className="text-sm text-muted-foreground sm:text-base">
                            {m.tabSubtitle}
                          </p>
                        </div>
                        <ScrollToFormButton
                          label={m.listCtaLabel}
                          placement={`courses_tab_${cat}`}
                          className="h-11 sm:h-10"
                          size="default"
                        />
                      </div>

                      <div className="mt-6 grid gap-6 md:grid-cols-2">
                        {list.length === 0 ? (
                          <div className="rounded-2xl border bg-muted/20 p-6 text-sm text-muted-foreground md:col-span-2">
                            目前此分類尚未上架課程。你仍可先預約諮詢，我們會依你的情況推薦最適合的方案。
                          </div>
                        ) : (
                          list.map((c) => (
                            <Card
                              key={c.id}
                              className="overflow-hidden border shadow-sm transition-shadow hover:shadow-md"
                            >
                              <div className="relative aspect-[16/9] w-full bg-muted">
                                <Image
                                  src={c.image}
                                  alt={c.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 520px"
                                />
                              </div>
                              <CardHeader className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="secondary">
                                    {getCourseCategoryLabel(c.category)}
                                  </Badge>
                                  {c.subsidy ? (
                                    <Badge variant="outline">補助可諮詢</Badge>
                                  ) : null}
                                </div>
                                <CardTitle className="text-lg leading-snug">
                                  {c.title}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {c.subtitle}
                                </p>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                  {c.shortDescription}
                                </p>
                                <div className="grid gap-2 text-sm">
                                  <div className="flex gap-2">
                                    <span className="w-14 shrink-0 text-muted-foreground">
                                      地點
                                    </span>
                                    <span className="font-medium">{c.location}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="w-14 shrink-0 text-muted-foreground">
                                      時間
                                    </span>
                                    <span className="font-medium">{c.schedule}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="w-14 shrink-0 text-muted-foreground">
                                      費用
                                    </span>
                                    <span className="font-medium">{c.fee}</span>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex flex-col gap-3 border-t bg-muted/20 pt-4 sm:flex-row sm:justify-stretch">
                                <Button
                                  variant="outline"
                                  className="h-11 w-full rounded-xl sm:flex-1"
                                  onClick={() => {
                                    track("cta_click", {
                                      placement: `course_card_${cat}`,
                                      courseId: c.id,
                                      label: m.cardSecondaryCtaLabel,
                                    });
                                    scrollToLeadForm(
                                      `course_card_${cat}`,
                                      m.cardSecondaryCtaLabel
                                    );
                                    setForm((f) => ({ ...f, course: c.title }));
                                  }}
                                >
                                  {m.cardSecondaryCtaLabel}
                                </Button>
                                <Button
                                  className="h-11 w-full rounded-xl font-semibold sm:flex-1"
                                  onClick={() => {
                                    track("cta_click", {
                                      placement: `course_card_primary_${cat}`,
                                      courseId: c.id,
                                      label: m.cardPrimaryCtaLabel,
                                    });
                                    scrollToLeadForm(
                                      `course_card_primary_${cat}`,
                                      m.cardPrimaryCtaLabel
                                    );
                                    setForm((f) => ({ ...f, course: c.title }));
                                  }}
                                >
                                  {m.cardPrimaryCtaLabel}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))
                        )}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>

            <div className="mt-8 sm:hidden">
              <ScrollToFormButton
                label="免費預約｜幫我選最適合分類"
                placement="courses_footer_mobile"
                className="h-12 w-full rounded-xl text-base"
              />
            </div>

            <div className="mt-10">
              <SectionCtaBar
                title="名額與梯次會依審核與報名狀況調整，建議先預約鎖定諮詢"
                subtitle="你不需要當下決定報名；我們會先幫你把補助、時程、學習負荷講清楚。"
                primaryLabel="免費預約｜保留諮詢優先序"
                placementPrimary="after_courses"
              />
            </div>
          </div>
        </div>
      </section>

      {/* —— ACT：表單 —— */}
      <section className="mx-auto max-w-6xl px-4 pb-28 pt-4 sm:pb-20 sm:pt-6">
        <Card
          id="lead-form"
          className="scroll-mt-20 overflow-hidden border-2 shadow-lg"
        >
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="space-y-4 border-b bg-muted/25 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                資料僅供諮詢聯繫
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                免費一對一諮詢
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                不推銷、不綁約。顧問會依你的背景協助確認
                <span className="font-medium text-foreground">
                  補助方向、課程是否適合、以及下一個可執行步驟
                </span>
                。
              </p>

              {/* 名額／開班緊迫感（靜態文案，日後可接 CMS） */}
              <div
                role="status"
                className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm"
              >
                <p className="flex items-start gap-2 font-semibold text-foreground">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  本梯諮詢名額有限，額滿將依序排入下一梯
                </p>
                <p className="mt-2 text-muted-foreground">
                  近期即將開班／說明會場次依資格審核與報名狀況滾動更新；送出表單後將於
                  <span className="font-medium text-foreground">
                    {" "}
                    1 個工作天內
                  </span>
                  與你聯繫確認時段。
                </p>
              </div>

              <div className="rounded-xl border bg-background p-4 text-sm">
                <p className="font-semibold text-foreground">你會帶走</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-muted-foreground">
                  <li>個人化：是否適合零基礎／AI 應用／設備實作等課程模組</li>
                  <li>補助與自付區間的初步評估方向（實際以審核為準）</li>
                  <li>可執行的下一步（不必當下決定是否報名）</li>
                </ul>
              </div>

              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  個資僅用於聯繫與課程諮詢
                </span>
                <span className="hidden sm:inline">·</span>
                <span>不發廣告簡訊、不轉售名單</span>
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <form
                className="space-y-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  track("form_submit", {
                    course: form.course || primaryCourse?.title || "",
                    nameLen: form.name.trim().length,
                  });
                  if (!form.name.trim() || !form.phone.trim()) {
                    toast({
                      title: "再一下就好",
                      description: "請填寫姓名與手機，我們才能安排專人聯繫。",
                      variant: "destructive",
                    });
                    return;
                  }
                  await leadsStore.apiCreate({
                    name: form.name.trim(),
                    phone: form.phone.trim(),
                    course: form.course || primaryCourse?.title || "未指定",
                    contactTime: form.contactTime,
                  });
                  toast({
                    title: "已成功送出",
                    description:
                      "感謝你的信任！我們將在 1 個工作天內與你聯繫，並協助確認補助與名額。",
                  });
                  setForm({
                    name: "",
                    phone: "",
                    course: "",
                    contactTime: "平日白天",
                  });
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2 sm:col-span-1">
                    <Label htmlFor="name" className="text-sm">
                      姓名<span className="text-destructive">＊</span>
                    </Label>
                    <Input
                      id="name"
                      autoComplete="name"
                      placeholder="例如：王小明"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="h-11"
                    />
                  </div>
                  <div className="grid gap-2 sm:col-span-1">
                    <Label htmlFor="phone" className="text-sm">
                      手機<span className="text-destructive">＊</span>
                    </Label>
                    <Input
                      id="phone"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="例如：0912-345-678"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="course">想了解的課程（可選）</Label>
                  <Input
                    id="course"
                    placeholder={
                      primaryCourse
                        ? `例如：${primaryCourse.title}`
                        : "例如：前端就業班 / 資料分析班"
                    }
                    value={form.course}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, course: e.target.value }))
                    }
                    className="h-11"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactTime">方便聯繫時段</Label>
                  <Input
                    id="contactTime"
                    placeholder="例如：平日晚上 7–9 點"
                    value={form.contactTime}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, contactTime: e.target.value }))
                    }
                    className="h-11"
                  />
                </div>

                <Button
                  className="h-12 w-full rounded-xl text-base font-semibold"
                  type="submit"
                >
                  送出｜安排免費諮詢（不綁約）
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  送出即表示你同意我們為聯繫諮詢使用你填寫的聯絡方式；隨時可要求停止使用。
                </p>
              </form>
            </div>
          </div>
        </Card>
      </section>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
          <Button
            className="h-12 flex-1 rounded-xl text-base font-semibold shadow-sm"
            onClick={() =>
              scrollToLeadForm("sticky_mobile", stickyCtaLabel)
            }
          >
            {stickyCtaLabel}
          </Button>
        </div>
      </div>

      <div className="hidden sm:block fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full px-6 py-6 text-base font-semibold shadow-lg"
          onClick={() =>
            scrollToLeadForm("sticky_desktop", stickyCtaLabel)
          }
        >
          {stickyCtaLabel}
        </Button>
      </div>
    </div>
  );
}
