"use client";

import * as React from "react";
import { RefreshCw, Search, Users } from "lucide-react";

import * as leadsStore from "@/lib/leads-http";
import type { Lead } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  return hydrated;
}

export default function AdminLeadsPage() {
  const hydrated = useHydrated();
  const [items, setItems] = React.useState<Lead[]>([]);
  const [qInput, setQInput] = React.useState("");
  const [courseInput, setCourseInput] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [debouncedCourse, setDebouncedCourse] = React.useState("");

  React.useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(qInput.trim()), 350);
    return () => window.clearTimeout(t);
  }, [qInput]);

  React.useEffect(() => {
    const t = window.setTimeout(() => setDebouncedCourse(courseInput.trim()), 350);
    return () => window.clearTimeout(t);
  }, [courseInput]);

  const refresh = React.useCallback(async () => {
    const all = await leadsStore.apiGetAll({
      q: debouncedQ || undefined,
      course: debouncedCourse || undefined,
    });
    setItems(all);
  }, [debouncedQ, debouncedCourse]);

  React.useEffect(() => {
    if (!hydrated) return;
    void refresh();
  }, [hydrated, refresh]);

  return (
    <>
      <div className="border-b border-border/60 bg-muted/30 dark:bg-muted/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">諮詢名單</h1>
            <p className="text-sm text-muted-foreground">
              資料來自 PostgreSQL（/api/leads），依建立時間新到舊排序
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="shrink-0 rounded-xl"
            onClick={() => void refresh()}
          >
            <RefreshCw className="h-4 w-4" />
            重新整理
          </Button>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">搜尋與篩選</CardTitle>
            <CardDescription>
              關鍵字會比對姓名、手機、課程；課程欄可輸入部分課程名稱。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="lead-q">關鍵字</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="lead-q"
                  className="h-11 pl-9"
                  placeholder="姓名、手機或課程…"
                  value={qInput}
                  onChange={(e) => setQInput(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-course">課程關鍵字</Label>
              <Input
                id="lead-course"
                className="h-11"
                placeholder="例如：前端、資料分析"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/15 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/80">
                <Users className="h-4 w-4 text-primary" />
              </span>
              <div>
                <CardTitle className="text-base">總覽</CardTitle>
                <CardDescription>
                  共 {hydrated ? items.length : "—"} 筆（符合目前篩選）
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-3 lg:hidden">
          {!hydrated ? (
            <div className="rounded-xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
              載入中…
            </div>
          ) : null}
          {hydrated && items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center text-sm text-muted-foreground dark:bg-muted/10">
              尚無名單。可到前台首頁送出表單測試流程。
            </div>
          ) : null}
          {hydrated
            ? items.map((l) => (
                <Card key={l.id} className="overflow-hidden border-border/80 shadow-sm">
                  <CardHeader className="space-y-1 pb-2">
                    <CardTitle className="text-base">{l.name}</CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {l.phone}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <Badge
                      variant="secondary"
                      className="max-w-full whitespace-normal text-left"
                    >
                      {l.course?.trim() ? l.course : "未填寫課程"}
                    </Badge>
                    <Separator />
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>
                        方便聯繫：
                        {l.contactTime?.trim() ? l.contactTime : "未填寫"}
                      </p>
                      <p>{new Date(l.createdAt).toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            : null}
        </div>

        <div className="hidden lg:block">
          {!hydrated ? (
            <div className="rounded-xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
              載入中…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>手機</TableHead>
                  <TableHead>課程</TableHead>
                  <TableHead>方便聯繫</TableHead>
                  <TableHead className="text-right">建立時間</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {l.phone}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="max-w-[220px] whitespace-normal text-left font-normal"
                      >
                        {l.course?.trim() ? l.course : "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {l.contactTime?.trim() ? l.contactTime : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {new Date(l.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-12 text-center text-sm text-muted-foreground"
                    >
                      尚無名單。可到前台首頁送出表單測試流程。
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </>
  );
}
