"use client";

import * as React from "react";
import { RefreshCw, Users } from "lucide-react";

import * as leadsStore from "@/lib/leads";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [items, setItems] = React.useState<ReturnType<typeof leadsStore.getAll>>([]);

  const refresh = React.useCallback(() => {
    void (async () => {
      const all = await leadsStore.apiGetAll();
      setItems(all);
    })();
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    refresh();
  }, [hydrated, refresh]);

  return (
    <>
      <div className="border-b border-border/60 bg-muted/30 dark:bg-muted/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">諮詢名單</h1>
            <p className="text-sm text-muted-foreground">
              來自前台表單（API 或本地備援），依建立時間新到舊排序
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="shrink-0 rounded-xl"
            onClick={() => refresh()}
          >
            <RefreshCw className="h-4 w-4" />
            重新整理
          </Button>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <Card className="border-primary/15 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/80">
                <Users className="h-4 w-4 text-primary" />
              </span>
              <div>
                <CardTitle className="text-base">總覽</CardTitle>
                <CardDescription>
                  共 {hydrated ? items.length : "—"} 筆名單
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
                    <Badge variant="secondary" className="max-w-full whitespace-normal text-left">
                      {l.course}
                    </Badge>
                    <Separator />
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>方便聯繫：{l.contactTime}</p>
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
                      <Badge variant="outline" className="max-w-[220px] truncate font-normal">
                        {l.course}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{l.contactTime}</TableCell>
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
