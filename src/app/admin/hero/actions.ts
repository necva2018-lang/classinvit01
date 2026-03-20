"use server";

import { revalidatePath } from "next/cache";

import { upsertSiteHeroFromUnknown } from "@/lib/hero-server";
import type { HeroContent } from "@/types";

export type SaveHeroResult =
  | { ok: true; content: HeroContent }
  | {
      ok: false;
      error: string;
      detail?: string;
      code?: string;
      status: number;
    };

export async function saveHeroToDatabase(
  payload: Record<string, unknown>
): Promise<SaveHeroResult> {
  const result = await upsertSiteHeroFromUnknown(payload);
  if (result.ok) {
    revalidatePath("/");
    revalidatePath("/admin/hero");
    return { ok: true, content: result.content };
  }
  return {
    ok: false,
    error: result.error,
    detail: result.detail,
    code: result.code,
    status: result.status,
  };
}
