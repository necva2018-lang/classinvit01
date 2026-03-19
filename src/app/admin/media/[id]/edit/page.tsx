"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import type { CourseCategory, MediaItem, MediaType } from "@/types";
import * as mediaStore from "@/lib/media";
import {
  COURSE_CATEGORY_ORDER,
  getCourseCategoryLabel,
} from "@/lib/course-categories";
import * as coursesStore from "@/lib/courses";
import * as casesStore from "@/lib/cases";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const MEDIA_TYPES: MediaType[] = ["hero", "course", "case", "promo"];
const MEDIA_TYPE_LABEL: Record<MediaType, string> = {
  hero: "Hero",
  course: "課程",
  case: "案例",
  promo: "宣傳",
};

export default function AdminMediaEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id;

  const courses = React.useMemo(() => coursesStore.getAll(), []);
  const cases = React.useMemo(() => casesStore.getAll(), []);

  const [item, setItem] = React.useState<MediaItem | null>(null);

  React.useEffect(() => {
    setItem(mediaStore.getById(id));
  }, [id]);

  if (!item) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">找不到影音</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              可能已被刪除，或資料尚未在此瀏覽器建立。
            </p>
            <Button asChild className="rounded-xl">
              <Link href="/admin/media">回影音列表</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const showCourse = item.type === "course";
  const showCase = item.type === "case";

  return (
    <>
      <div className="border-b border-border/60 bg-muted/30 dark:bg-muted/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight">編輯影音</h1>
              <Badge variant="secondary">{MEDIA_TYPE_LABEL[item.type]}</Badge>
              <Badge variant={item.isPublished ? "default" : "outline"}>
                {item.isPublished ? "已上架" : "未上架"}
              </Badge>
            </div>
            <p className="truncate text-sm text-muted-foreground">{item.title}</p>
          </div>
          <Button asChild variant="outline" className="shrink-0 rounded-xl">
            <Link href="/admin/media">回列表</Link>
          </Button>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">內容</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  void (async () => {
                    const next = await mediaStore.apiUpdate(id, item);
                    if (!next) return;
                    setItem(next);
                    toast({
                      title: "已儲存",
                      description: `影音「${next.title}」已更新。`,
                    });
                  })();
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>類型（type）</Label>
                    <Select
                      value={item.type}
                      onValueChange={(v) =>
                        setItem((x) =>
                          x
                            ? {
                                ...x,
                                type: v as MediaType,
                                relatedCourseId: undefined,
                                relatedCaseId: undefined,
                              }
                            : x
                        )
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MEDIA_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {MEDIA_TYPE_LABEL[t]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sortOrder">排序</Label>
                    <Input
                      id="sortOrder"
                      className="h-11"
                      type="number"
                      value={item.sortOrder}
                      onChange={(e) =>
                        setItem((x) =>
                          x ? { ...x, sortOrder: Number(e.target.value) } : x
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>課程分類（可選）</Label>
                  <p className="text-xs text-muted-foreground">
                    首頁影音分類 Tab 會優先採用此欄位；空白時可由關聯課程推斷。
                  </p>
                  <Select
                    value={item.category ?? "none"}
                    onValueChange={(v) =>
                      setItem((x) =>
                        x
                          ? {
                              ...x,
                              category:
                                v === "none" ? null : (v as CourseCategory),
                            }
                          : x
                      )
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="不指定" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">不指定</SelectItem>
                      {COURSE_CATEGORY_ORDER.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {getCourseCategoryLabel(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title">標題</Label>
                  <Input
                    id="title"
                    className="h-11"
                    value={item.title}
                    onChange={(e) =>
                      setItem((x) => (x ? { ...x, title: e.target.value } : x))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">簡述</Label>
                  <Textarea
                    id="description"
                    value={item.description}
                    onChange={(e) =>
                      setItem((x) =>
                        x ? { ...x, description: e.target.value } : x
                      )
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="videoUrl">影片連結</Label>
                    <Input
                      id="videoUrl"
                      className="h-11"
                      value={item.videoUrl}
                      onChange={(e) =>
                        setItem((x) =>
                          x ? { ...x, videoUrl: e.target.value } : x
                        )
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="thumbnailUrl">縮圖連結</Label>
                    <Input
                      id="thumbnailUrl"
                      className="h-11"
                      value={item.thumbnailUrl}
                      onChange={(e) =>
                        setItem((x) =>
                          x ? { ...x, thumbnailUrl: e.target.value } : x
                        )
                      }
                      required
                    />
                  </div>
                </div>

                {showCourse ? (
                  <div className="grid gap-2">
                    <Label>關聯課程（可選）</Label>
                    <Select
                      value={item.relatedCourseId ?? "none"}
                      onValueChange={(v) =>
                        setItem((x) =>
                          x
                            ? {
                                ...x,
                                relatedCourseId: v === "none" ? undefined : v,
                              }
                            : x
                        )
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="選擇課程" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">不指定</SelectItem>
                        {courses.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                {showCase ? (
                  <div className="grid gap-2">
                    <Label>關聯案例（可選）</Label>
                    <Select
                      value={item.relatedCaseId ?? "none"}
                      onValueChange={(v) =>
                        setItem((x) =>
                          x
                            ? {
                                ...x,
                                relatedCaseId: v === "none" ? undefined : v,
                              }
                            : x
                        )
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="選擇案例" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">不指定</SelectItem>
                        {cases.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}｜{c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">上架</p>
                    <p className="text-xs text-muted-foreground">上架後前台才會顯示</p>
                  </div>
                  <Switch
                    checked={item.isPublished}
                    onCheckedChange={(v) =>
                      setItem((x) => (x ? { ...x, isPublished: v } : x))
                    }
                  />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="destructive"
                    className="rounded-xl"
                    onClick={() => {
                      const ok = window.confirm(
                        `確定要刪除影音「${item.title}」嗎？此操作無法復原。`
                      );
                      if (!ok) return;
                      void (async () => {
                        await mediaStore.apiRemove(id);
                        toast({
                          title: "已刪除",
                          description: `已刪除影音「${item.title}」。`,
                        });
                        router.push("/admin/media");
                      })();
                    }}
                  >
                    刪除影音
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
              <CardTitle className="text-base">小提醒</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>- 影音類型會影響前台顯示位置（Hero/分類影音/宣傳）。</p>
              <p>- 若指定關聯課程/案例，可讓前台更精準地依情境展示。</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

