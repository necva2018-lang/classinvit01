"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Star, Trash2 } from "lucide-react";

import * as casesStore from "@/lib/cases";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function AdminCasesPage() {
  const hydrated = useHydrated();
  const { toast } = useToast();
  const [q, setQ] = React.useState("");
  const [onlyFeatured, setOnlyFeatured] = React.useState(false);
  const [onlyPublished, setOnlyPublished] = React.useState(false);
  const [items, setItems] = React.useState<ReturnType<typeof casesStore.getAll>>(
    []
  );

  const refresh = React.useCallback(() => {
    void (async () => {
      const all = await casesStore.apiGetAll();
      setItems(all);
    })();
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    refresh();
  }, [hydrated, refresh]);

  const filtered = items
    .filter((c) => (onlyFeatured ? c.isFeatured : true))
    .filter((c) => (onlyPublished ? c.isPublished : true))
    .filter((c) => {
      const s = q.trim().toLowerCase();
      if (!s) return true;
      return (
        c.name.toLowerCase().includes(s) ||
        c.title.toLowerCase().includes(s) ||
        c.summary.toLowerCase().includes(s)
      );
    });

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold">案例管理</p>
            <p className="text-xs text-muted-foreground">
              桌機表格｜手機卡片｜支援精選/上架切換
            </p>
          </div>
          <Button asChild className="rounded-xl">
            <Link href="/admin/cases/new">
              <Plus className="h-4 w-4" />
              新增案例
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
                  placeholder="搜尋姓名、標題、摘要..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/20 px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-muted-foreground" />
                只看精選
              </div>
              <Switch checked={onlyFeatured} onCheckedChange={setOnlyFeatured} />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/20 px-4 py-3">
              <div className="text-sm">只看已上架</div>
              <Switch
                checked={onlyPublished}
                onCheckedChange={setOnlyPublished}
              />
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

        {/* Mobile: card list */}
        <div className="grid gap-3 lg:hidden">
          {!hydrated ? (
            <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
              載入中…
            </div>
          ) : null}
          {hydrated
            ? filtered.map((c) => (
                <Card key={c.id} className="overflow-hidden">
                  <CardHeader className="space-y-2 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="truncate text-sm font-semibold">
                          {c.name}｜{c.title}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {c.summary}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        {c.isFeatured ? (
                          <Badge variant="secondary">精選</Badge>
                        ) : (
                          <Badge variant="outline">一般</Badge>
                        )}
                        <Badge variant={c.isPublished ? "default" : "outline"}>
                          {c.isPublished ? "已上架" : "未上架"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="space-y-3 pt-4">
                    <div className="grid gap-2 text-sm">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          原本狀態
                        </p>
                        <p className="font-medium">{c.beforeStatus}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          轉變後成果
                        </p>
                        <p className="font-medium">{c.afterStatus}</p>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-3 py-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          上架
                        </span>
                        <Switch
                          checked={c.isPublished}
                          onCheckedChange={async () => {
                            await casesStore.apiTogglePublished(c.id);
                            refresh();
                            toast({
                              title: c.isPublished ? "已下架" : "已上架",
                              description: `案例「${c.name}」狀態已更新。`,
                            });
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-3 py-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          精選
                        </span>
                        <Switch
                          checked={c.isFeatured}
                          onCheckedChange={async () => {
                            await casesStore.apiToggleFeatured(c.id);
                            refresh();
                            toast({
                              title: c.isFeatured ? "已取消精選" : "已設為精選",
                              description: `案例「${c.name}」已更新。`,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button asChild variant="outline" className="rounded-xl">
                        <Link href={`/admin/cases/${c.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          編輯
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        className="rounded-xl"
                        onClick={() => {
                          const ok = window.confirm(
                            `確定要刪除案例「${c.name}｜${c.title}」嗎？此操作無法復原。`
                          );
                          if (!ok) return;
                          void (async () => {
                            await casesStore.apiRemove(c.id);
                            refresh();
                            toast({
                              title: "已刪除",
                              description: `已刪除案例「${c.name}」。`,
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
              沒有符合條件的案例。
            </div>
          ) : null}
        </div>

        {/* Desktop: table */}
        <div className="hidden lg:block">
          {!hydrated ? (
            <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
              載入中…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>人物 / 標題</TableHead>
                  <TableHead>精選</TableHead>
                  <TableHead>上架</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">
                          {c.name}｜{c.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {c.summary}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={c.isFeatured}
                          onCheckedChange={async () => {
                            await casesStore.apiToggleFeatured(c.id);
                            refresh();
                            toast({
                              title: c.isFeatured ? "已取消精選" : "已設為精選",
                              description: `案例「${c.name}」已更新。`,
                            });
                          }}
                        />
                        <Badge variant={c.isFeatured ? "secondary" : "outline"}>
                          {c.isFeatured ? "精選" : "一般"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={c.isPublished}
                          onCheckedChange={async () => {
                            await casesStore.apiTogglePublished(c.id);
                            refresh();
                            toast({
                              title: c.isPublished ? "已下架" : "已上架",
                              description: `案例「${c.name}」狀態已更新。`,
                            });
                          }}
                        />
                        <Badge variant={c.isPublished ? "default" : "outline"}>
                          {c.isPublished ? "已上架" : "未上架"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{c.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                        >
                          <Link href={`/admin/cases/${c.id}/edit`}>編輯</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-lg"
                          onClick={() => {
                            const ok = window.confirm(
                              `確定要刪除案例「${c.name}｜${c.title}」嗎？此操作無法復原。`
                            );
                            if (!ok) return;
                            void (async () => {
                              await casesStore.apiRemove(c.id);
                              refresh();
                              toast({
                                title: "已刪除",
                                description: `已刪除案例「${c.name}」。`,
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
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      沒有符合條件的案例。
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

