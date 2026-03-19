import { NextResponse } from "next/server";
import { z } from "zod";

import { createSeedHeroContent } from "@/data/seed-hero";
import { prisma } from "@/lib/db";
import type { HeroContent } from "@/types";

const SITE_HERO_ID = "site";

const HeroUpsertSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string(),
  description: z.string(),
  badges: z.array(z.string()),
  primaryCtaLabel: z.string().min(1),
  primaryCtaTarget: z.string(),
  secondaryCtaLabel: z.string(),
  secondaryCtaTarget: z.string(),
  heroImage: z.string(),
  heroVideoUrl: z.string(),
  heroVideoThumbnail: z.string(),
  showBadges: z.boolean(),
  showSecondaryCta: z.boolean(),
  showVideoPreview: z.boolean(),
  isPublished: z.boolean(),
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

export async function PUT(req: Request) {
  try {
    const body = HeroUpsertSchema.parse(await req.json());
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
    const message = e instanceof Error ? e.message : "Invalid body";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
