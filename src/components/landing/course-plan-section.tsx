"use client";

import * as React from "react";
import Image from "next/image";

import type { Course } from "@/types";
import { buildPublishedCourseTabPanels } from "@/lib/course-catalog";
import {
  COURSE_CATEGORY_ORDER,
  getCourseCategoryLabel,
} from "@/lib/course-categories";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ScrollToFormButton,
  SectionCtaBar,
  track,
} from "@/components/landing/lead-form-actions";

type LeadCtaPayload = {
  placement: string;
  label: string;
  courseTitle?: string;
};

export function CoursePlanSection({
  courses,
  onCourseLeadCta,
}: {
  /** 已篩選為上架、供首頁顯示的課程 */
  courses: Course[];
  onCourseLeadCta: (payload: LeadCtaPayload) => void;
}) {
  const tabPanels = React.useMemo(
    () => buildPublishedCourseTabPanels(courses),
    [courses]
  );

  return (
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
        <Tabs defaultValue={COURSE_CATEGORY_ORDER[0]} className="w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="grid h-auto w-full grid-cols-1 gap-1 p-1 sm:inline-flex sm:h-10 sm:w-auto sm:grid-cols-none">
              {tabPanels.map((p) => (
                <TabsTrigger
                  key={p.category}
                  value={p.category}
                  className="min-h-11 flex-1 px-3 py-2.5 text-sm sm:min-h-0 sm:flex-none sm:py-1.5"
                >
                  {getCourseCategoryLabel(p.category)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabPanels.map(({ category, marketing: m, courses: list }) => (
            <TabsContent key={category} value={category} className="mt-6">
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
                  placement={`courses_tab_${category}`}
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
                              placement: `course_card_${category}`,
                              courseId: c.id,
                              label: m.cardSecondaryCtaLabel,
                            });
                            onCourseLeadCta({
                              placement: `course_card_${category}`,
                              label: m.cardSecondaryCtaLabel,
                              courseTitle: c.title,
                            });
                          }}
                        >
                          {m.cardSecondaryCtaLabel}
                        </Button>
                        <Button
                          className="h-11 w-full rounded-xl font-semibold sm:flex-1"
                          onClick={() => {
                            track("cta_click", {
                              placement: `course_card_primary_${category}`,
                              courseId: c.id,
                              label: m.cardPrimaryCtaLabel,
                            });
                            onCourseLeadCta({
                              placement: `course_card_primary_${category}`,
                              label: m.cardPrimaryCtaLabel,
                              courseTitle: c.title,
                            });
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
          ))}
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
  );
}
