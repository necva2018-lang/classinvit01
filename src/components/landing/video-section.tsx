"use client";

import * as React from "react";

import type { Course, MediaItem } from "@/types";
import {
  courseMapById,
  selectPromoMediaForCategory,
  selectSpotlightVideos,
} from "@/lib/course-catalog";
import {
  COURSE_CATEGORY_MARKETING,
  COURSE_CATEGORY_ORDER,
  getCourseCategoryLabel,
} from "@/lib/course-categories";
import { cn } from "@/lib/utils";

import {
  ScrollToFormButton,
  SectionCtaBar,
  track,
} from "@/components/landing/lead-form-actions";
import { VideoCard } from "@/components/landing/video-card";
import { VideoDialog, type VideoDialogPayload } from "@/components/landing/video-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function VideoSection({
  courses,
  media,
}: {
  courses: Course[];
  media: MediaItem[];
}) {
  const byCourseId = React.useMemo(() => courseMapById(courses), [courses]);
  const spotlight = React.useMemo(
    () => selectSpotlightVideos(media, 3),
    [media]
  );

  const [payload, setPayload] = React.useState<VideoDialogPayload>(null);

  const openMedia = (m: MediaItem, placement: string) => {
    track("video_section_open", { placement, id: m.id, type: m.type });
    setPayload({
      title: m.title,
      description: m.description,
      videoUrl: m.videoUrl,
    });
  };

  const hasAny =
    spotlight.length > 0 ||
    COURSE_CATEGORY_ORDER.some(
      (cat) =>
        selectPromoMediaForCategory(media, byCourseId, cat, 3).length > 0
    );

  if (!hasAny) return null;

  return (
    <section
      id="promo-video"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:py-14"
      aria-label="影音宣傳"
    >
      <div className="space-y-3 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          影音見證
        </p>
        <h2 className="text-pretty text-xl font-bold tracking-tight sm:text-2xl">
          先聽、先看｜用幾分鐘建立「你真的做得到」的信心
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:mx-0 sm:max-w-none sm:text-base">
          精選短片呈現學習節奏、作品方向與上課氛圍；也可依課程分類快速找到最貼近你現況的內容。
        </p>
      </div>

      {spotlight.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-foreground sm:text-base">
            精選宣傳片
          </h3>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            建議先從這 {spotlight.length} 支開始，快速理解我們怎麼帶你做出成果。
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spotlight.map((m) => (
              <VideoCard
                key={m.id}
                item={m}
                onPlay={() => openMedia(m, "spotlight")}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className={cn("mt-10", spotlight.length === 0 && "mt-8")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold sm:text-base">
              依課程分類瀏覽
            </h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              每個分類最多顯示 3 支；未指定分類的宣傳片會出現在各分類最前方。
            </p>
          </div>
          <ScrollToFormButton
            label="免費預約｜幫我配對影音與課程"
            placement="video_section_header"
            className="hidden h-10 sm:inline-flex"
            size="default"
          />
        </div>

        <Tabs defaultValue={COURSE_CATEGORY_ORDER[0]} className="mt-6 w-full">
          <TabsList className="grid h-auto w-full grid-cols-1 gap-1 p-1 sm:inline-flex sm:h-10 sm:w-auto sm:grid-cols-none">
            {COURSE_CATEGORY_ORDER.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="min-h-11 flex-1 px-3 py-2.5 text-sm sm:min-h-0 sm:flex-none sm:py-1.5"
              >
                {getCourseCategoryLabel(cat)}
              </TabsTrigger>
            ))}
          </TabsList>

          {COURSE_CATEGORY_ORDER.map((cat) => {
            const list = selectPromoMediaForCategory(media, byCourseId, cat, 3);
            const m = COURSE_CATEGORY_MARKETING[cat];
            return (
              <TabsContent key={cat} value={cat} className="mt-6">
                <p className="text-sm text-muted-foreground sm:text-base">
                  {m.tabSubtitle}
                </p>
                {list.length === 0 ? (
                  <div className="mt-6 rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center text-sm text-muted-foreground dark:bg-muted/10">
                    此分類尚無上架影音，可先觀看上方精選或預約諮詢取得建議。
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((item) => (
                      <VideoCard
                        key={item.id}
                        item={item}
                        categoryLabel={getCourseCategoryLabel(cat)}
                        onPlay={() =>
                          openMedia(item, `video_tab_${cat}`)
                        }
                      />
                    ))}
                  </div>
                )}
                <div className="mt-8">
                  <SectionCtaBar
                    title="想鎖定最適合你的分類與梯次？"
                    subtitle="留下聯絡方式，顧問會依你的背景推薦對應課程與補助方向，並附上最相關的影音重點。"
                    primaryLabel={m.listCtaLabel}
                    placementPrimary={`video_section_cta_${cat}`}
                  />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      <div className="mt-6 sm:hidden">
        <ScrollToFormButton
          label="免費預約｜幫我配對影音與課程"
          placement="video_section_footer_mobile"
          className="h-12 w-full rounded-xl text-base"
        />
      </div>

      <VideoDialog
        open={payload != null}
        onOpenChange={(o) => {
          if (!o) setPayload(null);
        }}
        payload={payload}
      />
    </section>
  );
}
