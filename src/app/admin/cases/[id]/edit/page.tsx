"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import type { CaseItem } from "@/types";
import * as casesStore from "@/lib/cases";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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

export default function AdminCasesEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id;

  const [item, setItem] = React.useState<CaseItem | null>(null);
  const [tagsText, setTagsText] = React.useState("");

  React.useEffect(() => {
    const c = casesStore.getById(id);
    setItem(c);
    if (c) setTagsText(arrayToLines(c.tags));
  }, [id]);

  if (!item) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">找不到案例</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              可能已被刪除，或資料尚未在此瀏覽器建立。
            </p>
            <Button asChild className="rounded-xl">
              <Link href="/admin/cases">回案例列表</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-border/60 bg-muted/30 dark:bg-muted/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight">編輯案例</h1>
              {item.isFeatured ? (
                <Badge variant="secondary">精選</Badge>
              ) : (
                <Badge variant="outline">一般</Badge>
              )}
              <Badge variant={item.isPublished ? "default" : "outline"}>
                {item.isPublished ? "已上架" : "未上架"}
              </Badge>
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {item.name}｜{item.title}
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 rounded-xl">
            <Link href="/admin/cases">回列表</Link>
          </Button>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">人物與故事</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  void (async () => {
                    const next = await casesStore.apiUpdate(id, {
                      ...item,
                      tags: linesToArray(tagsText),
                    });
                    if (!next) return;
                    setItem(next);
                    toast({
                      title: "已儲存",
                      description: `案例「${next.name}」已更新。`,
                    });
                  })();
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">人物名稱</Label>
                    <Input
                      id="name"
                      className="h-11"
                      value={item.name}
                      onChange={(e) =>
                        setItem((v) => (v ? { ...v, name: e.target.value } : v))
                      }
                      required
                    />
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

                <div className="grid gap-2">
                  <Label htmlFor="title">標題</Label>
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
                  <Label htmlFor="summary">摘要</Label>
                  <Textarea
                    id="summary"
                    value={item.summary}
                    onChange={(e) =>
                      setItem((v) =>
                        v ? { ...v, summary: e.target.value } : v
                      )
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="beforeStatus">原本狀態</Label>
                    <Textarea
                      id="beforeStatus"
                      value={item.beforeStatus}
                      onChange={(e) =>
                        setItem((v) =>
                          v ? { ...v, beforeStatus: e.target.value } : v
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="afterStatus">轉變後成果</Label>
                    <Textarea
                      id="afterStatus"
                      value={item.afterStatus}
                      onChange={(e) =>
                        setItem((v) =>
                          v ? { ...v, afterStatus: e.target.value } : v
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="quote">見證語錄</Label>
                  <Textarea
                    id="quote"
                    value={item.quote}
                    onChange={(e) =>
                      setItem((v) => (v ? { ...v, quote: e.target.value } : v))
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">上架</p>
                    <p className="text-xs text-muted-foreground">
                      上架後才會在前台顯示。
                    </p>
                  </div>
                  <Switch
                    checked={item.isPublished}
                    onCheckedChange={(v) =>
                      setItem((x) => (x ? { ...x, isPublished: v } : x))
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">精選</p>
                    <p className="text-xs text-muted-foreground">
                      精選會優先出現在首頁故事牆。
                    </p>
                  </div>
                  <Switch
                    checked={item.isFeatured}
                    onCheckedChange={(v) =>
                      setItem((x) => (x ? { ...x, isFeatured: v } : x))
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
                        `確定要刪除案例「${item.name}｜${item.title}」嗎？此操作無法復原。`
                      );
                      if (!ok) return;
                      void (async () => {
                        await casesStore.apiRemove(id);
                        toast({
                          title: "已刪除",
                          description: `已刪除案例「${item.name}」。`,
                        });
                        router.push("/admin/cases");
                      })();
                    }}
                  >
                    刪除案例
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

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">素材與標籤</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="image">圖片 URL</Label>
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
                  <Label htmlFor="videoUrl">影片 URL（可選）</Label>
                  <Input
                    id="videoUrl"
                    className="h-11"
                    value={item.videoUrl ?? ""}
                    onChange={(e) =>
                      setItem((v) =>
                        v ? { ...v, videoUrl: e.target.value } : v
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">標籤（每行一個）</Label>
                  <Textarea
                    id="tags"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    placeholder={"例如：二度就業\n作品集\n陪跑"}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">小提醒</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  - 原本狀態/成果/語錄越具體，首頁的真實感越強。
                </p>
                <p>- 影片 URL 可留空，首頁仍會顯示文字內容。</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

