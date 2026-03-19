import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import type { CourseCategory } from "@/types";

const CourseUpsertSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.enum(["unemployed_subsidy", "employed_subsidy", "self_paid"]),
  subtitle: z.string().default(""),
  shortDescription: z.string().default(""),
  description: z.string().default(""),
  audience: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  contents: z.array(z.string()).default([]),
  location: z.string().default(""),
  schedule: z.string().default(""),
  subsidy: z.string().default(""),
  fee: z.string().default(""),
  image: z.string().default(""),
  videoUrl: z.string().default(""),
  ctaLabel: z.string().default(""),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(50),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") as CourseCategory | null;
  const q = (searchParams.get("q") ?? "").trim();

  const items = await prisma.course.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { subtitle: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const data = CourseUpsertSchema.parse(await req.json());
  const created = await prisma.course.create({ data });
  return NextResponse.json(created, { status: 201 });
}

