import type { HeroContent } from "@/types";
import { createSeedHeroContent } from "@/data/seed-hero";
import { isBrowser, nowIso, storageSet } from "@/lib/storage";

/** 供前台跨分頁刷新：僅在「成功寫入資料庫」後由後台呼叫 */
export const HERO_STORAGE_KEY = "cms:hero_content:v1";

const API = "/api/hero";

export function seedHeroContent(): HeroContent {
  return createSeedHeroContent();
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function normalizeHero(raw: unknown): HeroContent | null {
  if (!isRecord(raw)) return null;
  if ("error" in raw && typeof raw.error === "string" && !("title" in raw)) {
    return null;
  }
  const s = seedHeroContent();
  const badges = raw.badges;
  const merged: HeroContent = {
    ...s,
    id: typeof raw.id === "string" && raw.id ? raw.id : s.id,
    title: typeof raw.title === "string" ? raw.title : s.title,
    subtitle: typeof raw.subtitle === "string" ? raw.subtitle : s.subtitle,
    description:
      typeof raw.description === "string" ? raw.description : s.description,
    badges: Array.isArray(badges)
      ? badges.filter((x): x is string => typeof x === "string")
      : s.badges,
    primaryCtaLabel:
      typeof raw.primaryCtaLabel === "string"
        ? raw.primaryCtaLabel
        : s.primaryCtaLabel,
    primaryCtaTarget:
      typeof raw.primaryCtaTarget === "string"
        ? raw.primaryCtaTarget
        : s.primaryCtaTarget,
    secondaryCtaLabel:
      typeof raw.secondaryCtaLabel === "string"
        ? raw.secondaryCtaLabel
        : s.secondaryCtaLabel,
    secondaryCtaTarget:
      typeof raw.secondaryCtaTarget === "string"
        ? raw.secondaryCtaTarget
        : s.secondaryCtaTarget,
    heroImage: typeof raw.heroImage === "string" ? raw.heroImage : s.heroImage,
    heroVideoUrl:
      typeof raw.heroVideoUrl === "string" ? raw.heroVideoUrl : s.heroVideoUrl,
    heroVideoThumbnail:
      typeof raw.heroVideoThumbnail === "string"
        ? raw.heroVideoThumbnail
        : s.heroVideoThumbnail,
    showBadges:
      typeof raw.showBadges === "boolean" ? raw.showBadges : s.showBadges,
    showSecondaryCta:
      typeof raw.showSecondaryCta === "boolean"
        ? raw.showSecondaryCta
        : s.showSecondaryCta,
    showVideoPreview:
      typeof raw.showVideoPreview === "boolean"
        ? raw.showVideoPreview
        : s.showVideoPreview,
    isPublished:
      typeof raw.isPublished === "boolean" ? raw.isPublished : s.isPublished,
    updatedAt:
      typeof raw.updatedAt === "string" ? raw.updatedAt : s.updatedAt,
  };
  return merged;
}

/** 送進 API / Server Action 的 JSON（與 Prisma 欄位對齊） */
export function buildHeroPutPayload(content: HeroContent): Record<string, unknown> {
  const s = seedHeroContent();
  const c = { ...s, ...content };
  return {
    title: (c.title?.trim() || s.title).slice(0, 2000),
    subtitle: c.subtitle ?? "",
    description: c.description ?? "",
    badges: Array.isArray(c.badges) ? c.badges.map((b) => String(b)) : s.badges,
    primaryCtaLabel: (c.primaryCtaLabel?.trim() || s.primaryCtaLabel).slice(
      0,
      500
    ),
    primaryCtaTarget: c.primaryCtaTarget ?? "form",
    secondaryCtaLabel: c.secondaryCtaLabel ?? "",
    secondaryCtaTarget: c.secondaryCtaTarget ?? "hero-video",
    heroImage: c.heroImage ?? "",
    heroVideoUrl: c.heroVideoUrl ?? "",
    heroVideoThumbnail: c.heroVideoThumbnail ?? "",
    showBadges: Boolean(c.showBadges),
    showSecondaryCta: Boolean(c.showSecondaryCta),
    showVideoPreview: Boolean(c.showVideoPreview),
    isPublished: Boolean(c.isPublished),
  };
}

async function tryFetchJson<T>(input: RequestInfo, init?: RequestInit) {
  if (!isBrowser()) return null;
  try {
    const res = await fetch(input, { ...init, cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** 前台／公開 API：從 /api/hero 讀取 */
export async function apiFetchHero(): Promise<HeroContent | null> {
  const j = await tryFetchJson<unknown>(API);
  if (!j) return null;
  return normalizeHero(j);
}

/** 成功存檔後寫入瀏覽器，讓其他分頁的 storage 監聽可刷新首頁 */
export function writeHeroBrowserCache(content: HeroContent): void {
  if (!isBrowser()) return;
  const next: HeroContent = {
    ...content,
    updatedAt: content.updatedAt || nowIso(),
  };
  storageSet(
    HERO_STORAGE_KEY,
    next as Parameters<typeof storageSet>[1]
  );
}

/**
 * 可編輯來源：僅 API + 預設 seed（不再用 localStorage 當資料來源）。
 */
export async function loadHeroEditable(): Promise<HeroContent> {
  if (!isBrowser()) return seedHeroContent();
  const api = await apiFetchHero();
  return api ?? seedHeroContent();
}

/**
 * 前台：讀可編輯來源後套用「未發佈則回退 seed」。
 */
export async function loadHeroForPublic(): Promise<HeroContent> {
  const raw = await loadHeroEditable();
  if (!raw.isPublished) return seedHeroContent();
  return raw;
}
