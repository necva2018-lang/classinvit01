"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import type { HeroContent } from "@/types";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const TARGET_PRESETS = [
  { value: "form", label: "捲動至諮詢表單" },
  { value: "hero-video", label: "捲動至 Hero 影片區" },
  { value: "featured-cases", label: "捲動至精選案例" },
  { value: "featured-courses", label: "捲動至課程方案" },
  { value: "faq", label: "捲動至常見問題" },
  { value: "trust", label: "捲動至信任區塊" },
] as const;

type HeroFormProps = {
  value: HeroContent;
  onChange: (next: HeroContent) => void;
  onSave: () => void;
  disabled?: boolean;
  isSaving?: boolean;
};

export function HeroForm({
  value,
  onChange,
  onSave,
  disabled,
  isSaving,
}: HeroFormProps) {
  const patch = React.useCallback(
    (p: Partial<HeroContent>) => onChange({ ...value, ...p }),
    [onChange, value]
  );

  const setBadge = (index: number, text: string) => {
    const next = [...value.badges];
    next[index] = text;
    patch({ badges: next });
  };

  const addBadge = () => patch({ badges: [...value.badges, "新標籤"] });

  const removeBadge = (index: number) => {
    patch({ badges: value.badges.filter((_, i) => i !== index) });
  };

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="space-y-1 border-b bg-muted/15 pb-4 dark:bg-muted/10">
        <CardTitle className="text-base">Hero 內容設定</CardTitle>
        <CardDescription>
          僅一組首屏內容。儲存即寫入資料庫；未勾選「已發佈」時，前台訪客仍看到系統預設文案。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 pt-6">
        <div className="flex flex-col gap-4 rounded-xl border bg-muted/10 p-4 dark:bg-muted/5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">已發佈（前台顯示）</p>
            <p className="text-xs text-muted-foreground">
              關閉時訪客看到預設 Hero，此處草稿僅在預覽與後台可見。
            </p>
          </div>
          <Switch
            checked={value.isPublished}
            onCheckedChange={(v) => patch({ isPublished: v })}
            disabled={disabled}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hero-subtitle">副標（Eyebrow）</Label>
          <Input
            id="hero-subtitle"
            value={value.subtitle}
            onChange={(e) => patch({ subtitle: e.target.value })}
            disabled={disabled}
            className="h-11"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hero-title">主標題</Label>
          <Textarea
            id="hero-title"
            rows={3}
            value={value.title}
            onChange={(e) => patch({ title: e.target.value })}
            disabled={disabled}
            className="min-h-[5rem] resize-y"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hero-description">描述段落</Label>
          <Textarea
            id="hero-description"
            rows={5}
            value={value.description}
            onChange={(e) => patch({ description: e.target.value })}
            disabled={disabled}
            className="min-h-[8rem] resize-y"
          />
        </div>

        <Separator />

        <div className="grid gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Label>重點標籤（Badges）</Label>
              <p className="text-xs text-muted-foreground">
                可新增／刪除列；留空列請刪除以免顯示空白標籤。
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">顯示</span>
              <Switch
                checked={value.showBadges}
                onCheckedChange={(v) => patch({ showBadges: v })}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="grid gap-2">
            {value.badges.map((b, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={b}
                  onChange={(e) => setBadge(i, e.target.value)}
                  disabled={disabled}
                  placeholder="例如：政府補助可諮詢"
                  className="h-11"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 shrink-0"
                  onClick={() => removeBadge(i)}
                  disabled={disabled}
                  aria-label="刪除此標籤"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit rounded-lg"
              onClick={addBadge}
              disabled={disabled}
            >
              <Plus className="h-4 w-4" />
              新增標籤
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="primary-label">主按鈕文案</Label>
            <Input
              id="primary-label"
              value={value.primaryCtaLabel}
              onChange={(e) => patch({ primaryCtaLabel: e.target.value })}
              disabled={disabled}
              className="h-11"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="primary-target">主按鈕目標</Label>
            <p className="text-xs text-muted-foreground">
              快速套用常見錨點，或自行輸入元素 id／外連網址。
            </p>
            <div className="flex flex-wrap gap-2">
              {TARGET_PRESETS.map((p) => (
                <Button
                  key={p.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs"
                  onClick={() => patch({ primaryCtaTarget: p.value })}
                  disabled={disabled}
                >
                  {p.label}
                </Button>
              ))}
            </div>
            <Input
              id="primary-target"
              value={value.primaryCtaTarget}
              onChange={(e) => patch({ primaryCtaTarget: e.target.value })}
              disabled={disabled}
              placeholder="form 或區塊 id（如 hero-video）；http 開頭為外開連結"
              className="h-11"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border bg-muted/10 p-4 dark:bg-muted/5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">顯示次要按鈕</p>
            <p className="text-xs text-muted-foreground">
              通常導向影片或錨點區塊。
            </p>
          </div>
          <Switch
            checked={value.showSecondaryCta}
            onCheckedChange={(v) => patch({ showSecondaryCta: v })}
            disabled={disabled}
          />
        </div>

        {value.showSecondaryCta ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="secondary-label">次要按鈕文案</Label>
              <Input
                id="secondary-label"
                value={value.secondaryCtaLabel}
                onChange={(e) => patch({ secondaryCtaLabel: e.target.value })}
                disabled={disabled}
                className="h-11"
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="secondary-target">次要按鈕目標</Label>
              <div className="flex flex-wrap gap-2">
                {TARGET_PRESETS.map((p) => (
                  <Button
                    key={`sec-${p.value}`}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-xs"
                    onClick={() => patch({ secondaryCtaTarget: p.value })}
                    disabled={disabled}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
              <Input
                id="secondary-target"
                value={value.secondaryCtaTarget}
                onChange={(e) => patch({ secondaryCtaTarget: e.target.value })}
                disabled={disabled}
                className="h-11"
              />
            </div>
          </div>
        ) : null}

        <Separator />

        <div className="flex flex-col gap-4 rounded-xl border bg-muted/10 p-4 dark:bg-muted/5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">顯示影片預覽</p>
            <p className="text-xs text-muted-foreground">
              若下方網址留空，前台會改用最後一筆「已上架 Hero 類」影音當備援。
            </p>
          </div>
          <Switch
            checked={value.showVideoPreview}
            onCheckedChange={(v) => patch({ showVideoPreview: v })}
            disabled={disabled}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="hero-video-url">Hero 影片網址</Label>
            <Input
              id="hero-video-url"
              value={value.heroVideoUrl}
              onChange={(e) => patch({ heroVideoUrl: e.target.value })}
              disabled={disabled}
              placeholder="YouTube 等連結"
              className="h-11"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="hero-video-thumb">Hero 影片縮圖 URL</Label>
            <Input
              id="hero-video-thumb"
              value={value.heroVideoThumbnail}
              onChange={(e) => patch({ heroVideoThumbnail: e.target.value })}
              disabled={disabled}
              placeholder="https://..."
              className="h-11"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hero-image">Hero 形象圖 URL（可選）</Label>
          <Input
            id="hero-image"
            value={value.heroImage}
            onChange={(e) => patch({ heroImage: e.target.value })}
            disabled={disabled}
            placeholder="留空則不顯示"
            className="h-11"
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            className="h-11 rounded-xl"
            onClick={onSave}
            disabled={disabled}
          >
            {isSaving ? "儲存中…" : "儲存至資料庫"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          最後更新（儲存後刷新）：{value.updatedAt
            ? new Date(value.updatedAt).toLocaleString()
            : "—"}
        </p>
      </CardContent>
    </Card>
  );
}
