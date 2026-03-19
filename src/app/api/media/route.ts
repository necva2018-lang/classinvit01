import { NextResponse } from "next/server";
import { z } from "zod";

import { courseCategorySchema } from "@/lib/course-categories";
import { prisma } from "@/lib/db";
import type { MediaType } from "@/types";

const MediaUpsertSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  videoUrl: z.string().min(1),
  thumbnailUrl: z.string().min(1),
  type: z.enum(["hero", "course", "case", "promo"]),
  category: courseCategorySchema.nullable().optional(),
  relatedCourseId: z.string().optional(),
  relatedCaseId: z.string().optional(),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(50),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as MediaType | null;
  const q = (searchParams.get("q") ?? "").trim();
  const onlyPublished = searchParams.get("published") === "1";

  const items = await prisma.mediaItem.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(onlyPublished ? { isPublished: true } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { videoUrl: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const data = MediaUpsertSchema.parse(await req.json());
  const created = await prisma.mediaItem.create({ data });
  return NextResponse.json(created, { status: 201 });
}

