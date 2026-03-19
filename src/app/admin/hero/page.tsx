"use client";

import * as React from "react";
import Link from "next/link";

import type { HeroContent, MediaItem } from "@/types";
import * as mediaStore from "@/lib/media";
import {
  loadHeroEditable,
  persistHero,
  seedHeroContent,
} from "@/lib/hero";

import { HeroForm } from "@/components/admin/HeroForm";
import { HeroPreview } from "@/components/admin/HeroPreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  return hydrated;
}

function cleanHeroForSave(d: HeroContent): HeroContent {
  return {
    ...d,
    badges: d.badges.map((b) => b.trim()).filter(Boolean),
  };
}

export default function AdminHeroPage() {
  const hydrated = useHydrated();
  const { toast } = useToast();
  const [draft, setDraft] = React.useState<HeroContent>(() => seedHeroContent());
  const [heroMedia, setHeroMedia] = React.useState<MediaItem | null>(null);

  React.useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    void (async () => {
      const [h, list] = await Promise.all([
        loadHeroEditable(),
        mediaStore.apiGetPublishedByType("hero"),
      ]);
      if (cancelled) return;
      setDraft(h);
      setHeroMedia(list[0] ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  const handleSave = React.useCallback(() => {
    const next = cleanHeroForSave(draft);
    void (async () => {
      const { ok, source, data, apiError } = await persistHero(next);
      if (ok) {
        setDraft(data);
        toast({
          title: source === "api" ? "已儲存" : "已儲存（僅本機）",
          description:
            source === "api"
              ? "已寫入資料庫（全站共用）；並已同步到此瀏覽器快取。"
              : apiError
                ? `無法寫入資料庫：${apiError}。內容已暫存於此瀏覽器，其他裝置看不到。`
                : "已改存此瀏覽器 localStorage（僅本機有效）。",
        });
      } else {
        toast({
          title: "儲存失敗",
          description: "請確認網路、資料庫連線或瀏覽器儲存空間。",
          variant: "destructive",
        });
      }
    })();
  }, [draft, toast]);

  return (
    <>
      <div className="border-b border-border/60 bg-muted/30 dark:bg-muted/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">首頁 Hero</h1>
            <p className="text-sm text-muted-foreground">
              單筆設定 · 優先寫入伺服器資料庫 · API 失敗時改存 localStorage
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/admin">回總覽</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/" target="_blank" rel="noreferrer">
                開新分頁看前台
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {!hydrated ? (
          <p className="text-sm text-muted-foreground">載入編輯器…</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <HeroPreview content={draft} heroMediaFallback={heroMedia} />
            <HeroForm
              value={draft}
              onChange={setDraft}
              onSave={handleSave}
            />
          </div>
        )}
      </main>
    </>
  );
}
