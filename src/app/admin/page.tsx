"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Film,
  LayoutDashboard,
  Newspaper,
  PlayCircle,
  TrendingUp,
  Users,
} from "lucide-react";

import * as coursesStore from "@/lib/courses";
import * as casesStore from "@/lib/cases";
import * as mediaStore from "@/lib/media";
import * as leadsStore from "@/lib/leads";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  return hydrated;
}

type Stat = {
  label: string;
  value: number;
  hint?: string;
  icon: React.ReactNode;
  tone?: "default" | "primary";
};

export default function AdminDashboardPage() {
  const hydrated = useHydrated();
  const [stats, setStats] = React.useState<Stat[]>([]);
  const [latestLeads, setLatestLeads] = React.useState<ReturnType<typeof leadsStore.getAll>>([]);
  const [byCourse, setByCourse] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    if (!hydrated) return;
    const courses = coursesStore.getAll();
    const cases = casesStore.getAll();
    const media = mediaStore.getAll();
    const leads = leadsStore.getAll();
    const publishedCount =
      courses.filter((c) => c.isPublished).length +
      cases.filter((c) => c.isPublished).length +
      media.filter((m) => m.isPublished).length;

    const leadStats = leadsStore.getStats();
    setByCourse(leadStats.byCourse);
    setLatestLeads(leads.slice(0, 8));
    setStats([
      {
        label: "課程數量",
        value: courses.length,
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        label: "案例數量",
        value: cases.length,
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        label: "影音數量",
        value: media.length,
        icon: <Film className="h-4 w-4" />,
      },
      {
        label: "已上架數",
        value: publishedCount,
        icon: <PlayCircle className="h-4 w-4" />,
        tone: "primary",
      },
      {
        label: "Leads 數量",
        value: leads.length,
        icon: <Users className="h-4 w-4" />,
      },
    ]);
  }, [hydrated]);

  return (
    <div className="min-h-[calc(100vh-0px)] bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">後台管理</p>
              <p className="text-xs text-muted-foreground">行動版卡片｜桌機可擴充表格</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/">回前台預覽</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s) => (
            <Card
              key={s.label}
              className={
                s.tone === "primary"
                  ? "border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background"
                  : ""
              }
            >
              <CardHeader className="space-y-2 pb-2">
                <CardDescription className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border bg-muted/30">
                      {s.icon}
                    </span>
                    {s.label}
                  </span>
                  {s.tone === "primary" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Live
                    </span>
                  ) : null}
                </CardDescription>
                <CardTitle className="text-3xl">
                  {hydrated ? s.value : "-"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {s.hint ?? "localStorage 模擬（可升級 API/DB）"}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg">最近名單</CardTitle>
              <CardDescription>用於快速回覆需求與追蹤熱門課程。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Mobile-first card list */}
              <div className="grid gap-3">
                {latestLeads.length === 0 ? (
                  <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                    目前尚無名單。你可以到前台填一次表單測試流程。
                  </div>
                ) : (
                  latestLeads.map((l) => (
                    <div key={l.id} className="rounded-xl border bg-background p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold">{l.name}</p>
                          <p className="text-xs text-muted-foreground">{l.phone}</p>
                        </div>
                        <Badge variant="secondary" className="max-w-[55%] truncate">
                          {l.course}
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span>方便時段：{l.contactTime}</span>
                        <span>{new Date(l.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg">名單分佈（依課程）</CardTitle>
              <CardDescription>先看哪些課最常被詢問。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.keys(byCourse).length === 0 ? (
                <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                  目前沒有可統計的資料。
                </div>
              ) : (
                <div className="grid gap-2">
                  {Object.entries(byCourse)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2">
                        <span className="text-sm font-medium truncate">{k}</span>
                        <Badge variant="outline">{v}</Badge>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <Card className="sm:col-span-3">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg">下一步（管理入口）</CardTitle>
              <CardDescription>
                我會接著把 Courses / Cases / Media 做成完整 CRUD。行動版會優先卡片式，桌機提供表格＋搜尋／篩選。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <Button asChild variant="outline" className="justify-between">
                <Link href="/admin/courses">
                  課程管理 <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/admin/cases">
                  案例管理 <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/admin/media">
                  影音管理 <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

