"use client";

import * as React from "react";
import Link from "next/link";

import type { HeroContent, MediaItem } from "@/types";
import * as mediaStore from "@/lib/media";
import {
  buildHeroPutPayload,
  seedHeroContent,
  writeHeroBrowserCache,
} from "@/lib/hero";
import {
  databaseUrlMissingToastDescription,
  isDatabaseUrlMissingError,
} from "@/lib/database-url-messages";

import { saveHeroToDatabase } from "./actions";
import { HeroForm } from "@/components/admin/HeroForm";
import { HeroPreview } from "@/components/admin/HeroPreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type HeroAdminClientProps = {
  content: HeroContent;
  fromDatabase: boolean;
  loadError: string | null;
  dbConfigured: boolean;
};

function cleanHeroForSave(d: HeroContent): HeroContent {
  return {
    ...d,
    badges: d.badges.map((b) => b.trim()).filter(Boolean),
  };
}

export function HeroAdminClient({
  content: initialContent,
  fromDatabase: initialFromDb,
  loadError,
  dbConfigured,
}: HeroAdminClientProps) {
  const { toast } = useToast();
  const [draft, setDraft] = React.useState<HeroContent>(initialContent);
  const [fromDatabase, setFromDatabase] = React.useState(initialFromDb);
  const [heroMedia, setHeroMedia] = React.useState<MediaItem | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setDraft(initialContent);
    setFromDatabase(initialFromDb);
  }, [initialContent, initialFromDb]);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      const list = await mediaStore.apiGetPublishedByType("hero");
      if (!cancelled) setHeroMedia(list[0] ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadErrorToastRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!loadError || loadErrorToastRef.current === loadError) return;
    loadErrorToastRef.current = loadError;
    toast({
      title: "Hero 資料庫讀取失敗",
      description: loadError,
      variant: "destructive",
    });
  }, [loadError, toast]);

  const handleSave = React.useCallback(async () => {
    if (!dbConfigured) {
      toast({
        title: "無法儲存",
        description: databaseUrlMissingToastDescription(),
        variant: "destructive",
      });
      return;
    }

    const next = cleanHeroForSave(draft);
    setSaving(true);
    const result = await saveHeroToDatabase(buildHeroPutPayload(next));
    setSaving(false);

    if (result.ok) {
      setDraft(result.content);
      setFromDatabase(true);
      writeHeroBrowserCache(result.content);
      toast({
        title: "已儲存至資料庫",
        description: "全站已更新（含前台）；其他分頁若開著首頁，可重新整理查看。",
      });
      return;
    }

    toast({
      title: "儲存失敗",
      description: isDatabaseUrlMissingError(result.error, result.status)
        ? databaseUrlMissingToastDescription()
        : result.detail
          ? `${result.error}：${result.detail}`
          : result.error,
      variant: "destructive",
    });
  }, [dbConfigured, draft, toast]);

  return (
    <>
      <div className="border-b border-border/60 bg-muted/30 dark:bg-muted/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">首頁 Hero</h1>
            <p className="text-sm text-muted-foreground">
              伺服器直接寫入 PostgreSQL（Server Action）· 不再使用「僅本機」當成功狀態
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

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <section
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            dbConfigured
              ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-100"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          )}
          role="status"
        >
          {dbConfigured ? (
            <p>
              <span className="font-medium">資料庫已設定</span>
              {fromDatabase
                ? " · 目前內容來自資料庫。"
                : " · 尚無 SiteHero 列，按下儲存即會建立第一筆。"}
            </p>
          ) : (
            <div className="space-y-2">
              <p className="font-medium">尚未設定 DATABASE_URL，無法寫入資料庫</p>
              <p className="text-xs opacity-90 whitespace-pre-line">
                {databaseUrlMissingToastDescription()}
              </p>
            </div>
          )}
        </section>

        {loadError ? (
          <section
            className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
            role="alert"
          >
            <p className="font-medium">載入時發生錯誤（已顯示預設文案供編輯）</p>
            <p className="mt-1 text-xs opacity-90">{loadError}</p>
          </section>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <HeroPreview content={draft} heroMediaFallback={heroMedia} />
          <HeroForm
            value={draft}
            onChange={setDraft}
            onSave={() => void handleSave()}
            disabled={!dbConfigured || saving}
            isSaving={saving}
          />
        </div>
      </main>
    </>
  );
}
