import { NextResponse } from "next/server";
import { z } from "zod";

import { isPhoneLikelyValid } from "@/lib/lead-validation";
import {
  createLead,
  getLeads,
  mapLeadToViewModel,
} from "@/lib/leads-repository";

const LeadCreateSchema = z.object({
  name: z.string().trim().min(1, "請填寫姓名"),
  phone: z
    .string()
    .trim()
    .min(1, "請填寫手機")
    .refine(isPhoneLikelyValid, "請填寫正確的手機號碼（至少 8 位數字）"),
  course: z.string().optional().default(""),
  contactTime: z.string().optional().default(""),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? undefined;
    const course = searchParams.get("course") ?? undefined;

    const rows = await getLeads({ q, course, take: 500 });
    return NextResponse.json(rows.map(mapLeadToViewModel));
  } catch (e) {
    const message = e instanceof Error ? e.message : "讀取失敗";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "無效的 JSON" }, { status: 400 });
  }

  const parsed = LeadCreateSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const msg = first ? `${first.path.join(".")}: ${first.message}` : "驗證失敗";
    return NextResponse.json(
      { error: msg, issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { name, phone, course, contactTime } = parsed.data;

  try {
    const row = await createLead({
      name,
      phone,
      course: course || null,
      contactTime: contactTime || null,
    });
    return NextResponse.json(mapLeadToViewModel(row), { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "寫入失敗";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
