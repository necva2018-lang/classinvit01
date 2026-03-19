"use client";

import * as React from "react";
import Image from "next/image";
import {
  Bot,
  Clock,
  Cpu,
  Gift,
  GraduationCap,
  Play,
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
import { getYoutubeEmbedUrl } from "@/lib/video-embed";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { CoursePlanSection } from "@/components/landing/course-plan-section";
import { FeaturedCasesSection } from "@/components/landing/featured-cases-section";
import { FaqSection } from "@/components/landing/faq-section";
import { VideoSection } from "@/components/landing/video-section";
import {
  ScrollToFormButton,
  SectionCtaBar,
  scrollToLeadForm,
  track,
} from "@/components/landing/lead-form-actions";

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
import { useToast } from "@/components/ui/use-toast";

function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  return hydrated;
}

const HERO_BADGES: { label: string; icon?: React.ReactNode }[] = [
  { label: "政府補助可諮詢", icon: <Gift className="h-3 w-3" /> },
  { label: "免費諮詢零壓力" },
  { label: "零基礎可跟" },
  { label: "專業設備教室", icon: <Cpu className="h-3 w-3" /> },
  { label: "AI 工具應用", icon: <Bot className="h-3 w-3" /> },
];

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

  return (
    <div className="flex-1 pb-[4.5rem] sm:pb-0">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-3">
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
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                document
                  .getElementById("featured-cases")
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
                  .getElementById("featured-courses")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              課程方案
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                document
                  .getElementById("faq")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              常見問題
            </Button>
            <ScrollToFormButton
              label="預約諮詢"
              placement="header"
              size="default"
            />
          </div>
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
            onSecondaryScrollTo="featured-cases"
            placementPrimary="trust_section"
          />
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      <section
        id="featured-courses"
        className="scroll-mt-20 mx-auto max-w-6xl px-4 py-10 sm:py-14"
      >
        <CoursePlanSection
          courses={courses}
          onCourseLeadCta={({ placement, label, courseTitle }) => {
            scrollToLeadForm(placement, label);
            if (courseTitle) {
              setForm((f) => ({ ...f, course: courseTitle }));
            }
          }}
        />
      </section>

      <Separator className="mx-auto max-w-6xl" />

      <FeaturedCasesSection cases={cases} />

      <Separator className="mx-auto max-w-6xl" />

      <VideoSection courses={courses} media={media} />

      <Separator className="mx-auto max-w-6xl" />

      {/* —— UNDERSTAND：亮點 + 適合對象 —— */}
      <section
        id="understand"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:py-14"
      >
        <div className="space-y-10">
          <div className="rounded-2xl border border-border/80 bg-muted/20 px-4 py-8 dark:bg-muted/10 sm:px-8 sm:py-10">
            <div className="mx-auto max-w-2xl text-center sm:mx-0 sm:max-w-none sm:text-left">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                課程亮點
              </div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                我們把學習設計成「每週都交得出東西」
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                不是聽完就算了——你會持續產出可放進履歷與作品集的具體成果。
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  t: "作品集導向",
                  d: "每週任務串成可展示專題，面試時說得出「你做了什麼」。",
                },
                {
                  t: "助教陪跑制",
                  d: "卡關不隔夜，降低自學中斷與放棄率。",
                },
                {
                  t: "就業敘事訓練",
                  d: "履歷、自我介紹與技術問答一起打磨，對齊真實職缺語言。",
                },
              ].map((x) => (
                <Card
                  key={x.t}
                  className="border bg-background/90 shadow-sm dark:bg-background/50"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{x.t}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {x.d}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 flex justify-center sm:justify-start">
              <ScrollToFormButton
                label="免費預約｜我想了解學習節奏"
                placement="highlights_section"
                className="h-12 rounded-xl px-6"
              />
            </div>
          </div>

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
        </div>
      </section>

      <FaqSection />

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
                className="rounded-xl border border-amber-500/35 bg-amber-500/[0.07] px-4 py-3 text-sm dark:border-amber-500/25 dark:bg-amber-500/10"
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
