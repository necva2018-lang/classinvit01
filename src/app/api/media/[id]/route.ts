import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

const MediaPatchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  videoUrl: z.string().min(1).optional(),
  thumbnailUrl: z.string().min(1).optional(),
  type: z.enum(["hero", "course", "case", "promo"]).optional(),
  relatedCourseId: z.string().optional().nullable(),
  relatedCaseId: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.mediaItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patch = MediaPatchSchema.parse(await req.json());
  const updated = await prisma.mediaItem.update({ where: { id }, data: patch });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.mediaItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

