"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { CaseItem } from "@/types";
import * as casesStore from "@/lib/cases";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

function linesToArray(s: string) {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function AdminCasesNewPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [draft, setDraft] = React.useState<
    Omit<CaseItem, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    title: "",
    summary: "",
    beforeStatus: "",
    afterStatus: "",
    quote: "",
    image: "",
    videoUrl: "",
    tags: [],
    isFeatured: false,
    isPublished: true,
    sortOrder: 50,
  });

  const [tagsText, setTagsText] = React.useState("");

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold">新增案例</p>
            <p className="text-xs text-muted-foreground">表單分組更清楚</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/cases">回列表</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">人物與故事</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">人物名稱</Label>
                  <Input
                    id="name"
                    className="h-11"
                    value={draft.name}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, name: e.target.value }))
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

              <div className="grid gap-2">
                <Label htmlFor="title">標題</Label>
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
                <Label htmlFor="summary">摘要</Label>
                <Textarea
                  id="summary"
                  value={draft.summary}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, summary: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="beforeStatus">原本狀態</Label>
                  <Textarea
                    id="beforeStatus"
                    value={draft.beforeStatus}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, beforeStatus: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="afterStatus">轉變後成果</Label>
                  <Textarea
                    id="afterStatus"
                    value={draft.afterStatus}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, afterStatus: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quote">見證語錄</Label>
                <Textarea
                  id="quote"
                  value={draft.quote}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, quote: e.target.value }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">素材與狀態</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="image">圖片 URL</Label>
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
                  <Label htmlFor="videoUrl">影片 URL（可選）</Label>
                  <Input
                    id="videoUrl"
                    className="h-11"
                    value={draft.videoUrl ?? ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, videoUrl: e.target.value }))
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
                <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">上架</p>
                    <p className="text-xs text-muted-foreground">
                      上架後才會在前台顯示。
                    </p>
                  </div>
                  <Switch
                    checked={draft.isPublished}
                    onCheckedChange={(v) =>
                      setDraft((d) => ({ ...d, isPublished: v }))
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
                    checked={draft.isFeatured}
                    onCheckedChange={(v) =>
                      setDraft((d) => ({ ...d, isFeatured: v }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">操作</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button
                  className="rounded-xl"
                  onClick={() => {
                    if (!draft.name.trim() || !draft.title.trim()) {
                      toast({
                        title: "請補齊必要欄位",
                        description: "人物名稱與標題為必填。",
                        variant: "destructive",
                      });
                      return;
                    }
                    void (async () => {
                      const created = await casesStore.apiCreate({
                        ...draft,
                        tags: linesToArray(tagsText),
                      });
                      toast({
                        title: "建立成功",
                        description: `已建立案例「${created.name}」。`,
                      });
                      router.push(`/admin/cases/${created.id}/edit`);
                    })();
                  }}
                >
                  建立案例
                </Button>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/admin/cases">取消</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

