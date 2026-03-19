"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import type { MediaType } from "@/types";
import * as mediaStore from "@/lib/media";

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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  return hydrated;
}

const MEDIA_TYPES: (MediaType | "all")[] = ["all", "hero", "course", "case", "promo"];
const MEDIA_TYPE_LABEL: Record<MediaType | "all", string> = {
  all: "全部",
  hero: "Hero",
  course: "課程",
  case: "案例",
  promo: "宣傳",
};

export default function AdminMediaPage() {
  const hydrated = useHydrated();
  const { toast } = useToast();
  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState<MediaType | "all">("all");
  const [onlyPublished, setOnlyPublished] = React.useState(false);
  const [items, setItems] = React.useState<ReturnType<typeof mediaStore.getAll>>([]);

  const refresh = React.useCallback(() => {
    void (async () => {
      const all = await mediaStore.apiGetAll();
      setItems(all);
    })();
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    refresh();
  }, [hydrated, refresh]);

  const filtered = items
    .filter((m) => (type === "all" ? true : m.type === type))
    .filter((m) => (onlyPublished ? m.isPublished : true))
    .filter((m) => {
      const s = q.trim().toLowerCase();
      if (!s) return true;
      return (
        m.title.toLowerCase().includes(s) ||
        m.description.toLowerCase().includes(s) ||
        m.videoUrl.toLowerCase().includes(s)
      );
    });

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold">影音管理</p>
            <p className="text-xs text-muted-foreground">
              桌機表格｜手機卡片｜支援上架切換
            </p>
          </div>
          <Button asChild className="rounded-xl">
            <Link href="/admin/media/new">
              <Plus className="h-4 w-4" />
              新增影音
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">搜尋與篩選</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <div className="grid gap-2">
              <Label htmlFor="search">關鍵字</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  className="pl-9"
                  placeholder="搜尋標題、描述、連結..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>類型</Label>
              <Select value={type} onValueChange={(v) => setType(v as MediaType | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇類型" />
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
            <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/20 px-4 py-3">
              <div className="text-sm">只看已上架</div>
              <Switch checked={onlyPublished} onCheckedChange={setOnlyPublished} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            共 {hydrated ? filtered.length : "-"} 筆
          </p>
          <Button variant="outline" className="rounded-xl" onClick={refresh}>
            重新整理
          </Button>
        </div>

        {/* Mobile */}
        <div className="grid gap-3 lg:hidden">
          {!hydrated ? (
            <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
              載入中…
            </div>
          ) : null}
          {hydrated
            ? filtered.map((m) => (
                <Card key={m.id} className="overflow-hidden">
                  <CardHeader className="space-y-2 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="truncate text-sm font-semibold">{m.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {m.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <Badge variant="secondary">{MEDIA_TYPE_LABEL[m.type]}</Badge>
                        <Badge variant={m.isPublished ? "default" : "outline"}>
                          {m.isPublished ? "已上架" : "未上架"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-3 py-2">
                      <span className="text-xs font-medium text-muted-foreground">上架</span>
                      <Switch
                        checked={m.isPublished}
                        onCheckedChange={() => {
                          void (async () => {
                            await mediaStore.apiTogglePublished(m.id);
                            refresh();
                            toast({
                              title: m.isPublished ? "已下架" : "已上架",
                              description: `影音「${m.title}」狀態已更新。`,
                            });
                          })();
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button asChild variant="outline" className="rounded-xl">
                        <Link href={`/admin/media/${m.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          編輯
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        className="rounded-xl"
                        onClick={() => {
                          const ok = window.confirm(
                            `確定要刪除影音「${m.title}」嗎？此操作無法復原。`
                          );
                          if (!ok) return;
                          void (async () => {
                            await mediaStore.apiRemove(m.id);
                            refresh();
                            toast({
                              title: "已刪除",
                              description: `已刪除影音「${m.title}」。`,
                            });
                          })();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        刪除
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            : null}
          {hydrated && filtered.length === 0 ? (
            <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
              沒有符合條件的影音。
            </div>
          ) : null}
        </div>

        {/* Desktop */}
        <div className="hidden lg:block">
          {!hydrated ? (
            <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
              載入中…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>標題</TableHead>
                  <TableHead>類型</TableHead>
                  <TableHead>上架</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">{m.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {m.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{MEDIA_TYPE_LABEL[m.type]}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={m.isPublished}
                          onCheckedChange={() => {
                            void (async () => {
                              await mediaStore.apiTogglePublished(m.id);
                              refresh();
                              toast({
                                title: m.isPublished ? "已下架" : "已上架",
                                description: `影音「${m.title}」狀態已更新。`,
                              });
                            })();
                          }}
                        />
                        <Badge variant={m.isPublished ? "default" : "outline"}>
                          {m.isPublished ? "已上架" : "未上架"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{m.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <Button asChild size="sm" variant="outline" className="rounded-lg">
                          <Link href={`/admin/media/${m.id}/edit`}>編輯</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-lg"
                          onClick={() => {
                            const ok = window.confirm(
                              `確定要刪除影音「${m.title}」嗎？此操作無法復原。`
                            );
                            if (!ok) return;
                            void (async () => {
                              await mediaStore.apiRemove(m.id);
                              refresh();
                              toast({
                                title: "已刪除",
                                description: `已刪除影音「${m.title}」。`,
                              });
                            })();
                          }}
                        >
                          刪除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      沒有符合條件的影音。
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}

