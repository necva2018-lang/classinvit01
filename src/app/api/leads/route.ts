import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

const LeadCreateSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  course: z.string().min(1),
  contactTime: z.string().min(1),
});

export async function GET() {
  const items = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const data = LeadCreateSchema.parse(await req.json());
  const created = await prisma.lead.create({ data });
  return NextResponse.json(created, { status: 201 });
}

