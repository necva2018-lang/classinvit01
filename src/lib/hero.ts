import type { HeroContent } from "@/types";
import { createSeedHeroContent } from "@/data/seed-hero";
import {
  isBrowser,
  nowIso,
  safeJsonResponse,
  storageGet,
  storageSet,
} from "@/lib/storage";

/** 與其他 CMS key 風格一致；語意等同「hero_content」 */
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

async function tryFetchJson<T>(input: RequestInfo, init?: RequestInit) {
  if (!isBrowser()) return null;
  try {
    const res = await fetch(input, { ...init, cache: "no-store" });
    if (!res.ok) return null;
    return await safeJsonResponse<T>(res);
  } catch {
    return null;
  }
}

/** 從 API 取得 Hero（失敗回傳 null） */
export async function apiFetchHero(): Promise<HeroContent | null> {
  const j = await tryFetchJson<unknown>(API);
  if (!j) return null;
  return normalizeHero(j);
}

/** 寫入 API；成功時同步寫入 localStorage 作快取 */
export async function apiSaveHero(
  content: HeroContent
): Promise<HeroContent | null> {
  const body = {
    title: content.title,
    subtitle: content.subtitle,
    description: content.description,
    badges: content.badges,
    primaryCtaLabel: content.primaryCtaLabel,
    primaryCtaTarget: content.primaryCtaTarget,
    secondaryCtaLabel: content.secondaryCtaLabel,
    secondaryCtaTarget: content.secondaryCtaTarget,
    heroImage: content.heroImage,
    heroVideoUrl: content.heroVideoUrl,
    heroVideoThumbnail: content.heroVideoThumbnail,
    showBadges: content.showBadges,
    showSecondaryCta: content.showSecondaryCta,
    showVideoPreview: content.showVideoPreview,
    isPublished: content.isPublished,
  };
  const j = await tryFetchJson<unknown>(API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!j) return null;
  const n = normalizeHero(j);
  if (n) {
    storageSet(HERO_STORAGE_KEY, n as Parameters<typeof storageSet>[1]);
    return n;
  }
  return null;
}

/** 讀取 localStorage 合併預設；無資料或格式錯誤時回傳 seed */
export function loadStoredHero(): HeroContent {
  if (!isBrowser()) return seedHeroContent();
  const raw = storageGet<unknown>(HERO_STORAGE_KEY, null);
  if (raw == null) return seedHeroContent();
  const n = normalizeHero(raw);
  return n ?? seedHeroContent();
}

/**
 * 後台／資料來源：優先 API，失敗則 localStorage。
 */
export async function loadHeroEditable(): Promise<HeroContent> {
  const api = await apiFetchHero();
  if (api) return api;
  return loadStoredHero();
}

/**
 * 前台：先取可編輯來源，再套用「未發佈則回退 seed」。
 */
export async function loadHeroForPublic(): Promise<HeroContent> {
  const raw = await loadHeroEditable();
  if (!raw.isPublished) return seedHeroContent();
  return raw;
}

/**
 * 同步讀取（僅 localStorage + 發佈規則），供不需 await 的場景。
 */
export function getHeroContent(): HeroContent {
  const stored = loadStoredHero();
  if (!stored.isPublished) return seedHeroContent();
  return stored;
}

/** 後台編輯（同步）：僅本地；請優先使用 loadHeroEditable */
export function getHeroEditable(): HeroContent {
  return loadStoredHero();
}

/** 僅寫入 localStorage */
export function saveHeroContent(content: HeroContent): boolean {
  const next: HeroContent = {
    ...content,
    id: content.id || seedHeroContent().id,
    updatedAt: nowIso(),
  };
  return storageSet(
    HERO_STORAGE_KEY,
    next as Parameters<typeof storageSet>[1]
  );
}

/**
 * 優先 PUT /api/hero，失敗則僅存 localStorage。
 * @returns 是否成功持久化（其一成功即 true）
 */
export async function persistHero(content: HeroContent): Promise<{
  ok: boolean;
  source: "api" | "local" | "none";
  data: HeroContent;
}> {
  const next: HeroContent = {
    ...content,
    id: content.id || seedHeroContent().id,
    updatedAt: nowIso(),
  };
  const fromApi = await apiSaveHero(next);
  if (fromApi) {
    return { ok: true, source: "api", data: fromApi };
  }
  const localOk = saveHeroContent(next);
  return {
    ok: localOk,
    source: localOk ? "local" : "none",
    data: localOk ? loadStoredHero() : next,
  };
}
