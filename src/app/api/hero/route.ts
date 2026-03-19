import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { createSeedHeroContent } from "@/data/seed-hero";
import { prisma } from "@/lib/db";
import type { HeroContent } from "@/types";

const SITE_HERO_ID = "site";

/** 欄位皆給 default，避免客戶端 JSON 缺 key 導致驗證失敗 */
const HeroUpsertSchema = z.object({
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

function prismaRowToContent(row: {
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

async function parseJsonBody(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

/** GET：無資料列時回傳內建 seed（JSON），方便前台／後台一致 */
export async function GET() {
  try {
    const row = await prisma.siteHero.findUnique({
      where: { id: SITE_HERO_ID },
    });
    if (!row) {
      return NextResponse.json(createSeedHeroContent());
    }
    return NextResponse.json(prismaRowToContent(row));
  } catch {
    return NextResponse.json(createSeedHeroContent());
  }
}

async function upsertHero(req: Request) {
  const raw = await parseJsonBody(req);
  if (raw === null || typeof raw !== "object") {
    return NextResponse.json(
      { error: "請求內容必須為 JSON 物件" },
      { status: 400 }
    );
  }

  const parsed = HeroUpsertSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    return NextResponse.json(
      { error: "資料驗證失敗", detail: msg, issues: parsed.error.issues },
      { status: 422 }
    );
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
    return NextResponse.json(prismaRowToContent(row));
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      const hint =
        e.code === "P2021"
          ? "（資料表尚未建立，請在伺服器執行 npm run db:push 或 migrate）"
          : e.code === "P1001"
            ? "（無法連線資料庫，請檢查 DATABASE_URL）"
            : "";
      return NextResponse.json(
        {
          error: `資料庫寫入失敗 ${e.code}: ${e.message}${hint}`,
          code: e.code,
        },
        { status: 500 }
      );
    }
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return upsertHero(req);
}

/** 部分環境或 Proxy 對 PUT 較嚴格，提供 POST 同行為 */
export async function POST(req: Request) {
  return upsertHero(req);
}
