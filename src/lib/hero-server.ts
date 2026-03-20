import "server-only";

import { z } from "zod";
import { Prisma } from "@prisma/client";

import { createSeedHeroContent } from "@/data/seed-hero";
import { responseIfDatabaseUrlMissing } from "@/lib/database-url-guard";
import { prisma } from "@/lib/db";
import type { HeroContent } from "@/types";
import { NextResponse } from "next/server";

export const SITE_HERO_ID = "site";

export const HeroUpsertSchema = z.object({
  title: z.string().min(1, "主標題不可為空"),
  subtitle: z.string().default(""),
  description: z.string().default(""),
  badges: z.array(z.string()).default([]),
  primaryCtaLabel: z.string().min(1, "主按鈕文案不可為空"),
  primaryCtaTarget: z.string().default("form"),
  secondaryCtaLabel: z.string().default(""),
  secondaryCtaTarget: z.string().default("hero-video"),
  heroImage: z.string().default(""),
  heroVideoUrl: z.string().default(""),
  heroVideoThumbnail: z.string().default(""),
  showBadges: z.boolean().default(true),
  showSecondaryCta: z.boolean().default(true),
  showVideoPreview: z.boolean().default(true),
  isPublished: z.boolean().default(false),
});

export function prismaRowToHeroContent(row: {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badges: string[];
  primaryCtaLabel: string;
  primaryCtaTarget: string;
  secondaryCtaLabel: string;
  secondaryCtaTarget: string;
  heroImage: string;
  heroVideoUrl: string;
  heroVideoThumbnail: string;
  showBadges: boolean;
  showSecondaryCta: boolean;
  showVideoPreview: boolean;
  isPublished: boolean;
  updatedAt: Date;
}): HeroContent {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    badges: row.badges,
    primaryCtaLabel: row.primaryCtaLabel,
    primaryCtaTarget: row.primaryCtaTarget,
    secondaryCtaLabel: row.secondaryCtaLabel,
    secondaryCtaTarget: row.secondaryCtaTarget,
    heroImage: row.heroImage,
    heroVideoUrl: row.heroVideoUrl,
    heroVideoThumbnail: row.heroVideoThumbnail,
    showBadges: row.showBadges,
    showSecondaryCta: row.showSecondaryCta,
    showVideoPreview: row.showVideoPreview,
    isPublished: row.isPublished,
    updatedAt: row.updatedAt.toISOString(),
  };
}

function prismaErrorJson(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    const hint =
      e.code === "P2021"
        ? "（資料表尚未建立，請執行 npx prisma db push）"
        : e.code === "P1001"
          ? "（無法連線資料庫，請檢查 DATABASE_URL）"
          : "";
    return {
      status: 500 as const,
      body: {
        error: `資料庫錯誤 ${e.code}: ${e.message}${hint}`,
        code: e.code,
      },
    };
  }
  const message = e instanceof Error ? e.message : "Unknown error";
  return { status: 500 as const, body: { error: message } };
}

/** 供 Server Action／RSC：是否具備寫入條件（不觸發 Prisma） */
export function isHeroDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/**
 * 後台首屏：從 DB 讀一筆；無列則回傳預設 seed 形狀（尚未建檔＝可首次儲存）。
 */
export async function loadSiteHeroForAdmin(): Promise<{
  content: HeroContent;
  fromDatabase: boolean;
  error: string | null;
}> {
  if (!isHeroDatabaseConfigured()) {
    return {
      content: createSeedHeroContent(),
      fromDatabase: false,
      error: null,
    };
  }
  try {
    const row = await prisma.siteHero.findUnique({
      where: { id: SITE_HERO_ID },
    });
    if (!row) {
      return {
        content: createSeedHeroContent(),
        fromDatabase: false,
        error: null,
      };
    }
    return {
      content: prismaRowToHeroContent(row),
      fromDatabase: true,
      error: null,
    };
  } catch (e) {
    const { body } = prismaErrorJson(e);
    return {
      content: createSeedHeroContent(),
      fromDatabase: false,
      error: typeof body.error === "string" ? body.error : "讀取失敗",
    };
  }
}

export type UpsertHeroServerResult =
  | { ok: true; content: HeroContent }
  | {
      ok: false;
      status: number;
      error: string;
      code?: string;
      detail?: string;
      issues?: z.core.$ZodIssue[];
    };

export async function upsertSiteHeroFromUnknown(
  raw: unknown
): Promise<UpsertHeroServerResult> {
  if (!isHeroDatabaseConfigured()) {
    return {
      ok: false,
      status: 503,
      error:
        "伺服器未設定 DATABASE_URL，無法寫入。請在 Zeabur 的 Next.js Web Service 新增環境變數。",
      code: "DATABASE_URL_MISSING",
    };
  }

  if (raw === null || typeof raw !== "object") {
    return {
      ok: false,
      status: 400,
      error: "請求內容必須為 JSON 物件",
    };
  }

  const parsed = HeroUpsertSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    return {
      ok: false,
      status: 422,
      error: "資料驗證失敗",
      detail: msg,
      issues: parsed.error.issues,
    };
  }

  const body = parsed.data;

  try {
    const row = await prisma.siteHero.upsert({
      where: { id: SITE_HERO_ID },
      create: {
        id: SITE_HERO_ID,
        ...body,
      },
      update: body,
    });
    return { ok: true, content: prismaRowToHeroContent(row) };
  } catch (e) {
    const { status, body: b } = prismaErrorJson(e);
    return {
      ok: false,
      status,
      error: typeof b.error === "string" ? b.error : "寫入失敗",
      code: "code" in b && typeof b.code === "string" ? b.code : undefined,
    };
  }
}

/** 供 Route Handler：維持既有 HTTP 契約 */
export async function handleSiteHeroGet(): Promise<NextResponse> {
  const missing = responseIfDatabaseUrlMissing();
  if (missing) return missing;

  try {
    const row = await prisma.siteHero.findUnique({
      where: { id: SITE_HERO_ID },
    });
    if (!row) {
      return NextResponse.json(createSeedHeroContent());
    }
    return NextResponse.json(prismaRowToHeroContent(row));
  } catch (e) {
    const { status, body } = prismaErrorJson(e);
    return NextResponse.json(body, { status });
  }
}

export async function handleSiteHeroUpsert(req: Request): Promise<NextResponse> {
  const missing = responseIfDatabaseUrlMissing();
  if (missing) return missing;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "無效的 JSON" }, { status: 400 });
  }

  const result = await upsertSiteHeroFromUnknown(raw);
  if (result.ok) {
    return NextResponse.json(result.content);
  }

  const { status, error, detail, issues, code } = result;
  return NextResponse.json(
    detail
      ? { error, detail, issues, code }
      : code
        ? { error, code }
        : { error },
    { status }
  );
}
