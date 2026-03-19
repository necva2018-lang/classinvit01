"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import type { Course, CourseCategory } from "@/types";
import * as coursesStore from "@/lib/courses";
import {
  COURSE_CATEGORIES,
  getCourseCategoryLabel,
} from "@/lib/course-categories";

import { Badge } from "@/components/ui/badge";
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

function arrayToLines(arr: string[]) {
  return (arr ?? []).join("\n");
}
function linesToArray(s: string) {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function AdminCoursesEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const { toast } = useToast();

  const [item, setItem] = React.useState<Course | null>(null);

  const [audienceText, setAudienceText] = React.useState("");
  const [highlightsText, setHighlightsText] = React.useState("");
  const [contentsText, setContentsText] = React.useState("");

  React.useEffect(() => {
    const c = coursesStore.getById(id);
    setItem(c);
    if (c) {
      setAudienceText(arrayToLines(c.audience));
      setHighlightsText(arrayToLines(c.highlights));
      setContentsText(arrayToLines(c.contents));
    }
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">找不到課程</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                可能已被刪除，或資料尚未在此瀏覽器建立。
              </p>
              <Button asChild className="rounded-xl">
                <Link href="/admin/courses">回課程列表</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold">編輯課程</p>
              <Badge variant="secondary">
                {getCourseCategoryLabel(item.category)}
              </Badge>
            </div>
            <p className="truncate text-xs text-muted-foreground">{item.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/admin/courses">回列表</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">課程資料</CardTitle>
            </CardHeader>
            <CardContent>
            <form
              className="grid gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                void (async () => {
                  const next = await coursesStore.apiUpdate(id, {
                    ...item,
                    audience: linesToArray(audienceText),
                    highlights: linesToArray(highlightsText),
                    contents: linesToArray(contentsText),
                  });
                  if (!next) return;
                  setItem(next);
                  toast({
                    title: "已儲存",
                    description: `課程「${next.title}」已更新。`,
                  });
                })();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="title">課程名稱</Label>
                  <Input
                    id="title"
                    className="h-11"
                    value={item.title}
                    onChange={(e) =>
                      setItem((v) => (v ? { ...v, title: e.target.value } : v))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    className="h-11"
                    value={item.slug}
                    onChange={(e) =>
                      setItem((v) => (v ? { ...v, slug: e.target.value } : v))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>分類（category）</Label>
                  <Select
                    value={item.category}
                    onValueChange={(v) =>
                      setItem((x) =>
                        x ? { ...x, category: v as CourseCategory } : x
                      )
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
                    value={item.sortOrder}
                    onChange={(e) =>
                      setItem((v) =>
                        v ? { ...v, sortOrder: Number(e.target.value) } : v
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">上架狀態</p>
                  <p className="text-xs text-muted-foreground">
                    上架後會出現在前台與首頁分類 Tabs。
                  </p>
                </div>
                <Switch
                  checked={item.isPublished}
                  onCheckedChange={(v) =>
                    setItem((x) => (x ? { ...x, isPublished: v } : x))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subtitle">副標</Label>
                <Input
                  id="subtitle"
                  className="h-11"
                  value={item.subtitle}
                  onChange={(e) =>
                    setItem((v) =>
                      v ? { ...v, subtitle: e.target.value } : v
                    )
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="shortDescription">短描述</Label>
                <Textarea
                  id="shortDescription"
                  value={item.shortDescription}
                  onChange={(e) =>
                    setItem((v) =>
                      v ? { ...v, shortDescription: e.target.value } : v
                    )
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">詳細介紹</Label>
                <Textarea
                  id="description"
                  value={item.description}
                  onChange={(e) =>
                    setItem((v) =>
                      v ? { ...v, description: e.target.value } : v
                    )
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="location">上課地點</Label>
                  <Input
                    id="location"
                    className="h-11"
                    value={item.location}
                    onChange={(e) =>
                      setItem((v) =>
                        v ? { ...v, location: e.target.value } : v
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule">上課時間</Label>
                  <Input
                    id="schedule"
                    className="h-11"
                    value={item.schedule}
                    onChange={(e) =>
                      setItem((v) =>
                        v ? { ...v, schedule: e.target.value } : v
                      )
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
                    value={item.subsidy}
                    onChange={(e) =>
                      setItem((v) =>
                        v ? { ...v, subsidy: e.target.value } : v
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fee">費用顯示</Label>
                  <Input
                    id="fee"
                    className="h-11"
                    value={item.fee}
                    onChange={(e) =>
                      setItem((v) => (v ? { ...v, fee: e.target.value } : v))
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
                    value={item.image}
                    onChange={(e) =>
                      setItem((v) => (v ? { ...v, image: e.target.value } : v))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="videoUrl">宣傳影片 URL</Label>
                  <Input
                    id="videoUrl"
                    className="h-11"
                    value={item.videoUrl}
                    onChange={(e) =>
                      setItem((v) =>
                        v ? { ...v, videoUrl: e.target.value } : v
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ctaLabel">課程 CTA 文案</Label>
                <Input
                  id="ctaLabel"
                  className="h-11"
                  value={item.ctaLabel}
                  onChange={(e) =>
                    setItem((v) =>
                      v ? { ...v, ctaLabel: e.target.value } : v
                    )
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

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-xl"
                  onClick={() => {
                    const ok = window.confirm(
                      `確定要刪除課程「${item.title}」嗎？此操作無法復原。`
                    );
                    if (!ok) return;
                    void (async () => {
                      await coursesStore.apiRemove(id);
                      toast({
                        title: "已刪除",
                        description: `已刪除課程「${item.title}」。`,
                      });
                      router.push("/admin/courses");
                    })();
                  }}
                >
                  刪除課程
                </Button>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button type="submit" className="rounded-xl">
                    儲存變更
                  </Button>
                </div>
              </div>
            </form>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base">預覽重點</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                - 分類：<span className="font-medium text-foreground">{getCourseCategoryLabel(item.category)}</span>
              </p>
              <p>
                - 上架：<span className="font-medium text-foreground">{item.isPublished ? "已上架" : "未上架"}</span>
              </p>
              <p>
                - 排序：<span className="font-medium text-foreground">{item.sortOrder}</span>
              </p>
              <p className="pt-2">
                建議：副標（subtitle）用「時間＋成果」描述，短描述保持 1–2 句更好讀。
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

