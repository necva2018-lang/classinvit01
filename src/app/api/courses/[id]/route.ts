import { NextResponse } from "next/server";
import { z } from "zod";

import { courseCategorySchema } from "@/lib/course-categories";
import { prisma } from "@/lib/db";

const CoursePatchSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  category: courseCategorySchema.optional(),
  subtitle: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  audience: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  contents: z.array(z.string()).optional(),
  location: z.string().optional(),
  schedule: z.string().optional(),
  subsidy: z.string().optional(),
  fee: z.string().optional(),
  image: z.string().optional(),
  videoUrl: z.string().optional(),
  ctaLabel: z.string().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.course.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patch = CoursePatchSchema.parse(await req.json());
  const updated = await prisma.course.update({ where: { id }, data: patch });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

