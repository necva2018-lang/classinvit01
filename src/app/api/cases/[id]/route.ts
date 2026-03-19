import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

const CasePatchSchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  summary: z.string().optional(),
  beforeStatus: z.string().optional(),
  afterStatus: z.string().optional(),
  quote: z.string().optional(),
  image: z.string().optional(),
  videoUrl: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.caseItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patch = CasePatchSchema.parse(await req.json());
  const updated = await prisma.caseItem.update({ where: { id }, data: patch });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.caseItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

