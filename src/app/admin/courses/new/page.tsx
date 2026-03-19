"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Course, CourseCategory } from "@/types";
import * as coursesStore from "@/lib/courses";
import {
  COURSE_CATEGORIES,
  getCourseCategoryLabel,
} from "@/lib/course-categories";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

function linesToArray(s: string) {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function AdminCoursesNewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [draft, setDraft] = React.useState<
    Omit<Course, "id" | "createdAt" | "updatedAt">
  >({
    title: "",
    slug: "",
    category: "unemployed_subsidy",
    subtitle: "",
    shortDescription: "",
    description: "",
    audience: [],
    highlights: [],
    contents: [],
    location: "",
    schedule: "",
    subsidy: "",
    fee: "",
    image: "",
    videoUrl: "",
    ctaLabel: "",
    isPublished: true,
    sortOrder: 50,
  });

  const [audienceText, setAudienceText] = React.useState("");
  const [highlightsText, setHighlightsText] = React.useState("");
  const [contentsText, setContentsText] = React.useState("");

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold">新增課程</p>
            <p className="text-xs text-muted-foreground">包含分類設定</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/courses">回列表</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">基本資料</CardTitle>
            </CardHeader>
            <CardContent>
            <form
              className="grid gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                const payload = {
                  ...draft,
                  audience: linesToArray(audienceText),
                  highlights: linesToArray(highlightsText),
                  contents: linesToArray(contentsText),
                  ctaLabel: draft.ctaLabel || "免費預約｜確認補助與名額",
                };
                const created = coursesStore.create(payload);
                toast({
                  title: "建立成功",
                  description: `已建立課程「${created.title}」。`,
                });
                router.push(`/admin/courses/${created.id}/edit`);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="title">課程名稱</Label>
                  <Input
                    id="title"
                    className="h-11"
                    value={draft.title}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    className="h-11"
                    value={draft.slug}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, slug: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>分類（category）</Label>
                  <Select
                    value={draft.category}
                    onValueChange={(v) =>
                      setDraft((d) => ({
                        ...d,
                        category: v as CourseCategory,
                      }))
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {getCourseCategoryLabel(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sortOrder">排序（越小越前）</Label>
                  <Input
                    id="sortOrder"
                    className="h-11"
                    type="number"
                    value={draft.sortOrder}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        sortOrder: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">上架狀態</p>
                  <p className="text-xs text-muted-foreground">
                    上架後會出現在前台（依分類 Tabs 顯示）。
                  </p>
                </div>
                <Switch
                  checked={draft.isPublished}
                  onCheckedChange={(v) =>
                    setDraft((d) => ({ ...d, isPublished: v }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subtitle">副標</Label>
                <Input
                  id="subtitle"
                  className="h-11"
                  value={draft.subtitle}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, subtitle: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="shortDescription">短描述</Label>
                <Textarea
                  id="shortDescription"
                  value={draft.shortDescription}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      shortDescription: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">詳細介紹</Label>
                <Textarea
                  id="description"
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, description: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="location">上課地點</Label>
                  <Input
                    id="location"
                    className="h-11"
                    value={draft.location}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, location: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule">上課時間</Label>
                  <Input
                    id="schedule"
                    className="h-11"
                    value={draft.schedule}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, schedule: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="subsidy">補助資訊</Label>
                  <Input
                    id="subsidy"
                    className="h-11"
                    value={draft.subsidy}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, subsidy: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fee">費用顯示</Label>
                  <Input
                    id="fee"
                    className="h-11"
                    value={draft.fee}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, fee: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="image">封面圖 URL</Label>
                  <Input
                    id="image"
                    className="h-11"
                    value={draft.image}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, image: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="videoUrl">宣傳影片 URL</Label>
                  <Input
                    id="videoUrl"
                    className="h-11"
                    value={draft.videoUrl}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, videoUrl: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ctaLabel">課程 CTA 文案（可留空）</Label>
                <Input
                  id="ctaLabel"
                  className="h-11"
                  value={draft.ctaLabel}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, ctaLabel: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2 sm:col-span-1">
                  <Label htmlFor="audience">適合對象（每行一項）</Label>
                  <Textarea
                    id="audience"
                    value={audienceText}
                    onChange={(e) => setAudienceText(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 sm:col-span-1">
                  <Label htmlFor="highlights">課程亮點（每行一項）</Label>
                  <Textarea
                    id="highlights"
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 sm:col-span-1">
                  <Label htmlFor="contents">課程內容（每行一項）</Label>
                  <Textarea
                    id="contents"
                    value={contentsText}
                    onChange={(e) => setContentsText(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="submit" className="rounded-xl">
                  建立課程
                </Button>
              </div>
            </form>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base">填寫小提示</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                - <span className="font-medium text-foreground">分類</span>
                會影響前台 Tabs 與影音宣傳的顯示內容。
              </p>
              <p>
                - <span className="font-medium text-foreground">副標</span>
                建議寫「時間＋成果」更容易轉換。
              </p>
              <p>
                - <span className="font-medium text-foreground">短描述</span>
                建議 1–2 句，避免太長。
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

