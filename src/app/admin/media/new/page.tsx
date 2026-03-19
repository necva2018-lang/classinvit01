"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { MediaItem, MediaType } from "@/types";
import * as mediaStore from "@/lib/media";
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

export default function AdminMediaNewPage() {
  const router = useRouter();
  const { toast } = useToast();

  const courses = React.useMemo(() => coursesStore.getAll(), []);
  const cases = React.useMemo(() => casesStore.getAll(), []);

  const [draft, setDraft] = React.useState<
    Omit<MediaItem, "id" | "createdAt" | "updatedAt">
  >({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    type: "promo",
    relatedCourseId: undefined,
    relatedCaseId: undefined,
    isPublished: true,
    sortOrder: 50,
  });

  const showCourse = draft.type === "course";
  const showCase = draft.type === "case";

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold">新增影音</p>
            <p className="text-xs text-muted-foreground">可指定顯示位置與關聯</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/media">回列表</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">內容</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>類型（type）</Label>
                  <Select
                    value={draft.type}
                    onValueChange={(v) =>
                      setDraft((d) => ({
                        ...d,
                        type: v as MediaType,
                        relatedCourseId: undefined,
                        relatedCaseId: undefined,
                      }))
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
                    value={draft.sortOrder}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) }))
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
                <Label htmlFor="description">簡述</Label>
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
                  <Label htmlFor="videoUrl">影片連結</Label>
                  <Input
                    id="videoUrl"
                    className="h-11"
                    value={draft.videoUrl}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, videoUrl: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnailUrl">縮圖連結</Label>
                  <Input
                    id="thumbnailUrl"
                    className="h-11"
                    value={draft.thumbnailUrl}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, thumbnailUrl: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              {showCourse ? (
                <div className="grid gap-2">
                  <Label>關聯課程（可選）</Label>
                  <Select
                    value={draft.relatedCourseId ?? "none"}
                    onValueChange={(v) =>
                      setDraft((d) => ({
                        ...d,
                        relatedCourseId: v === "none" ? undefined : v,
                      }))
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
                    value={draft.relatedCaseId ?? "none"}
                    onValueChange={(v) =>
                      setDraft((d) => ({
                        ...d,
                        relatedCaseId: v === "none" ? undefined : v,
                      }))
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
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">顯示狀態</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">上架</p>
                    <p className="text-xs text-muted-foreground">上架後前台才會顯示</p>
                  </div>
                  <Switch
                    checked={draft.isPublished}
                    onCheckedChange={(v) =>
                      setDraft((d) => ({ ...d, isPublished: v }))
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
                    if (!draft.title.trim() || !draft.videoUrl.trim() || !draft.thumbnailUrl.trim()) {
                      toast({
                        title: "請補齊必要欄位",
                        description: "標題、影片連結、縮圖連結為必填。",
                        variant: "destructive",
                      });
                      return;
                    }
                    void (async () => {
                      const created = await mediaStore.apiCreate(draft);
                      toast({
                        title: "建立成功",
                        description: `已建立影音「${created.title}」。`,
                      });
                      router.push(`/admin/media/${created.id}/edit`);
                    })();
                  }}
                >
                  建立影音
                </Button>
                <div className="rounded-xl border bg-muted/20 p-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">目前設定</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">{MEDIA_TYPE_LABEL[draft.type]}</Badge>
                    <Badge variant={draft.isPublished ? "default" : "outline"}>
                      {draft.isPublished ? "已上架" : "未上架"}
                    </Badge>
                  </div>
                </div>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/admin/media">取消</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

