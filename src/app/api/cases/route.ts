import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

const CaseUpsertSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().default(""),
  beforeStatus: z.string().default(""),
  afterStatus: z.string().default(""),
  quote: z.string().default(""),
  image: z.string().default(""),
  videoUrl: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(50),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const onlyFeatured = searchParams.get("featured") === "1";
  const onlyPublished = searchParams.get("published") === "1";

  const items = await prisma.caseItem.findMany({
    where: {
      ...(onlyFeatured ? { isFeatured: true } : {}),
      ...(onlyPublished ? { isPublished: true } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { title: { contains: q, mode: "insensitive" } },
              { summary: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const data = CaseUpsertSchema.parse(await req.json());
  const created = await prisma.caseItem.create({ data });
  return NextResponse.json(created, { status: 201 });
}

