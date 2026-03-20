import type { HeroContent } from "@/types";
import { createSeedHeroContent } from "@/data/seed-hero";
import {
  isBrowser,
  nowIso,
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

/** 合併 seed，確保 JSON 不會因 undefined 缺欄位 */
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

function readApiError(json: unknown, fallback: string): string {
  if (!isRecord(json)) return fallback;
  const err = json.error;
  const detail = json.detail;
  if (typeof err === "string") {
    return typeof detail === "string" ? `${err}：${detail}` : err;
  }
  return fallback;
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

/** 從 API 取得 Hero（失敗回傳 null） */
export async function apiFetchHero(): Promise<HeroContent | null> {
  const j = await tryFetchJson<unknown>(API);
  if (!j) return null;
  return normalizeHero(j);
}

export type HeroEditableLoadState =
  | { source: "api"; content: HeroContent }
  | { source: "fallback"; content: HeroContent; reason?: string };

/**
 * 後台載入：區分「真的從 API/DB 讀到」與「失敗改讀 localStorage」，
 * 避免 GET 曾靜默回 seed 時誤以為已連上資料庫。
 */
export async function loadHeroEditableState(): Promise<HeroEditableLoadState> {
  if (!isBrowser()) {
    return { source: "fallback", content: seedHeroContent() };
  }
  try {
    const res = await fetch(API, { cache: "no-store" });
    const text = await res.text();
    let j: unknown = null;
    if (text) {
      try {
        j = JSON.parse(text) as unknown;
      } catch {
        return {
          source: "fallback",
          content: loadStoredHero(),
          reason: "伺服器回應不是有效 JSON",
        };
      }
    }
    if (!res.ok) {
      const err =
        isRecord(j) && typeof j.error === "string"
          ? j.error
          : `無法載入（HTTP ${res.status}）`;
      return {
        source: "fallback",
        content: loadStoredHero(),
        reason: err,
      };
    }
    const n = normalizeHero(j);
    if (n) {
      return { source: "api", content: n };
    }
    return {
      source: "fallback",
      content: loadStoredHero(),
      reason: "回傳內容格式無法辨識",
    };
  } catch (e) {
    return {
      source: "fallback",
      content: loadStoredHero(),
      reason: e instanceof Error ? e.message : "網路錯誤",
    };
  }
}

export type ApiSaveHeroResult =
  | { ok: true; data: HeroContent }
  | { ok: false; error: string; status?: number };

/**
 * 寫入 API（PUT，405 時改 POST）；成功時同步寫入 localStorage 作快取。
 */
export async function apiSaveHero(content: HeroContent): Promise<ApiSaveHeroResult> {
  if (!isBrowser()) {
    return { ok: false, error: "非瀏覽器環境無法呼叫 API" };
  }

  const payload = buildHeroPutPayload(content);
  const init: RequestInit = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  };

  try {
    let res = await fetch(API, init);
    if (res.status === 405) {
      res = await fetch(API, { ...init, method: "POST" });
    }

    const text = await res.text();
    let json: unknown = null;
    if (text) {
      try {
        json = JSON.parse(text) as unknown;
      } catch {
        json = { error: text.slice(0, 300) };
      }
    }

    if (!res.ok) {
      return {
        ok: false,
        error: readApiError(json, text.slice(0, 200) || `HTTP ${res.status}`),
        status: res.status,
      };
    }

    const n = normalizeHero(json);
    if (!n) {
      return { ok: false, error: "伺服器回傳格式無法解析" };
    }
    storageSet(HERO_STORAGE_KEY, n as Parameters<typeof storageSet>[1]);
    return { ok: true, data: n };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "網路錯誤";
    return { ok: false, error: msg };
  }
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
  const s = await loadHeroEditableState();
  return s.content;
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
 * 優先 API，失敗則僅存 localStorage。
 */
export async function persistHero(content: HeroContent): Promise<{
  ok: boolean;
  source: "api" | "local" | "none";
  data: HeroContent;
  /** API 失敗原因（即使已改存 localStorage 也會帶上） */
  apiError?: string;
  /** 例如 503＝多半為未設定 DATABASE_URL */
  apiStatus?: number;
}> {
  const next: HeroContent = {
    ...content,
    id: content.id || seedHeroContent().id,
    updatedAt: nowIso(),
  };

  const apiResult = await apiSaveHero(next);
  if (apiResult.ok) {
    return { ok: true, source: "api", data: apiResult.data };
  }

  const localOk = saveHeroContent(next);
  return {
    ok: localOk,
    source: localOk ? "local" : "none",
    data: localOk ? loadStoredHero() : next,
    apiError: apiResult.error,
    apiStatus: apiResult.status,
  };
}
