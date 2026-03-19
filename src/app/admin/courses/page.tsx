"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import type { CourseCategory } from "@/types";
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

export default function AdminCoursesPage() {
  const hydrated = useHydrated();
  const { toast } = useToast();
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState<CourseCategory | "all">("all");
  const [items, setItems] = React.useState<ReturnType<typeof coursesStore.getAll>>([]);

  const refresh = React.useCallback(() => {
    setItems(coursesStore.getAll());
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    refresh();
  }, [hydrated, refresh]);

  const filtered = items
    .filter((c) => (category === "all" ? true : c.category === category))
    .filter((c) => {
      const s = q.trim().toLowerCase();
      if (!s) return true;
      return (
        c.title.toLowerCase().includes(s) ||
        c.subtitle.toLowerCase().includes(s) ||
        c.slug.toLowerCase().includes(s)
      );
    });

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold">課程管理</p>
            <p className="text-xs text-muted-foreground">
              手機卡片式列表｜可依分類篩選
            </p>
          </div>
          <Button asChild className="rounded-xl">
            <Link href="/admin/courses/new">
              <Plus className="h-4 w-4" />
              新增課程
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">搜尋與篩選</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="search">關鍵字</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  className="pl-9"
                  placeholder="搜尋課程名稱、slug..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>分類</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as CourseCategory | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇分類" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分類</SelectItem>
                  {COURSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {getCourseCategoryLabel(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {c.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {c.slug}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <Badge variant="secondary">
                          {getCourseCategoryLabel(c.category)}
                        </Badge>
                        <Badge variant={c.isPublished ? "default" : "outline"}>
                          {c.isPublished ? "已上架" : "未上架"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {c.subtitle}
                    </p>
                  </CardHeader>
                  <Separator />
                  <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-muted-foreground">
                      排序 {c.sortOrder} · {c.isPublished ? "已上架" : "未上架"}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/20 px-3 py-2 sm:hidden">
                        <span className="text-xs font-medium text-muted-foreground">
                          上架狀態
                        </span>
                        <Switch
                          checked={c.isPublished}
                          onCheckedChange={() => {
                            coursesStore.togglePublished(c.id);
                            refresh();
                            toast({
                              title: c.isPublished ? "已下架" : "已上架",
                              description: `課程「${c.title}」狀態已更新。`,
                            });
                          }}
                        />
                      </div>
                      <Button asChild variant="outline" className="rounded-xl">
                        <Link href={`/admin/courses/${c.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          編輯
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        className="rounded-xl"
                        onClick={() => {
                          const ok = window.confirm(
                            `確定要刪除課程「${c.title}」嗎？此操作無法復原。`
                          );
                          if (!ok) return;
                          coursesStore.remove(c.id);
                          refresh();
                          toast({
                            title: "已刪除",
                            description: `已刪除課程「${c.title}」。`,
                          });
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
              沒有符合條件的課程。
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
                  <TableHead>課程</TableHead>
                  <TableHead>分類</TableHead>
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
                        <p className="text-sm font-semibold">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getCourseCategoryLabel(c.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={c.isPublished}
                          onCheckedChange={() => {
                            coursesStore.togglePublished(c.id);
                            refresh();
                            toast({
                              title: c.isPublished ? "已下架" : "已上架",
                              description: `課程「${c.title}」狀態已更新。`,
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
                        <Button asChild size="sm" variant="outline" className="rounded-lg">
                          <Link href={`/admin/courses/${c.id}/edit`}>編輯</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-lg"
                          onClick={() => {
                            const ok = window.confirm(
                              `確定要刪除課程「${c.title}」嗎？此操作無法復原。`
                            );
                            if (!ok) return;
                            coursesStore.remove(c.id);
                            refresh();
                            toast({
                              title: "已刪除",
                              description: `已刪除課程「${c.title}」。`,
                            });
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
                      沒有符合條件的課程。
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

