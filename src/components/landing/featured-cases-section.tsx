"use client";

import * as React from "react";

import type { CaseItem } from "@/types";
import { selectLandingFeaturedCases } from "@/lib/landing-cases";
import { cn } from "@/lib/utils";

import { CaseCard } from "@/components/landing/case-card";
import {
  ScrollToFormButton,
  SectionCtaBar,
  scrollToLeadForm,
  track,
} from "@/components/landing/lead-form-actions";
import { VideoDialog, type VideoDialogPayload } from "@/components/landing/video-dialog";

export function FeaturedCasesSection({ cases }: { cases: CaseItem[] }) {
  const featured = React.useMemo(
    () => selectLandingFeaturedCases(cases),
    [cases]
  );

  const [videoPayload, setVideoPayload] = React.useState<VideoDialogPayload>(null);

  if (featured.length === 0) return null;

  const openCaseVideo = (c: CaseItem) => {
    if (!c.videoUrl?.trim()) return;
    track("case_story_video_open", { caseId: c.id, name: c.name });
    setVideoPayload({
      title: `${c.name}｜${c.title}`,
      description: c.summary,
      videoUrl: c.videoUrl,
    });
  };

  return (
    <section
      id="featured-cases"
      className="scroll-mt-20 border-y border-border/40 bg-muted/20 py-10 dark:bg-muted/10 sm:py-14"
      aria-label="精選學員案例"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              真實轉變
            </p>
            <h2 className="text-pretty text-xl font-bold tracking-tight sm:text-2xl">
              精選案例｜他們如何把「卡關」變成「可說服面試官的成果」
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              以下為精選見證：含轉變前後對照、重點摘要與學員原話。若你的情境相近，我們會在諮詢中協助對齊課程與補助方向。
            </p>
          </div>
          <ScrollToFormButton
            label="我也想諮詢類似路徑"
            placement="featured_cases_header"
            className="hidden h-11 shrink-0 sm:inline-flex"
            size="default"
          />
        </div>

        {/* 桌機：多欄；手機：橫向滑動 */}
        <div
          className={cn(
            "mt-8",
            "lg:grid lg:grid-cols-2 lg:gap-6 lg:pb-0",
            "flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:overflow-visible [&::-webkit-scrollbar]:hidden"
          )}
        >
          {featured.map((c) => (
            <div
              key={c.id}
              className="w-[min(100%,380px)] shrink-0 snap-start sm:w-[min(100%,440px)] lg:w-auto lg:shrink lg:snap-none"
            >
              <CaseCard
                item={c}
                onConsultCta={() => {
                  track("cta_click", {
                    placement: "case_card_consult",
                    caseId: c.id,
                    label: "免費預約諮詢",
                  });
                  scrollToLeadForm("case_card_consult", "免費預約諮詢");
                }}
                onRouteCta={() => {
                  track("cta_click", {
                    placement: "case_card_route",
                    caseId: c.id,
                    label: "了解可行路線",
                  });
                  scrollToLeadForm("case_card_route", "了解可行路線");
                }}
                onWatchStory={
                  c.videoUrl?.trim()
                    ? () => openCaseVideo(c)
                    : undefined
                }
              />
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-6 lg:mt-8">
          <SectionCtaBar
            title="想複製類似成果？先用免費諮詢對齊你的起點"
            subtitle="我們會依你的背景（待業／育兒／轉職）給你可執行建議，並說清楚補助與梯次；不推銷、不綁約。"
            primaryLabel="免費預約｜取得個人化路線"
            placementPrimary="featured_cases_cta"
          />
          <div className="lg:hidden">
            <ScrollToFormButton
              label="我也想諮詢類似路徑"
              placement="featured_cases_footer_mobile"
              className="h-12 w-full rounded-xl text-base"
            />
          </div>
        </div>
      </div>

      <VideoDialog
        open={videoPayload != null}
        onOpenChange={(o) => {
          if (!o) setVideoPayload(null);
        }}
        payload={videoPayload}
      />
    </section>
  );
}
