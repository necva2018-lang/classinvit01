/**
 * Leads 瀏覽器端：僅透過 `/api/leads`，勿 import `@/lib/leads`（server-only）。
 */
import type { Lead } from "@/types";
import { isBrowser, safeJsonResponse } from "@/lib/storage";

const API = "/api/leads";

export type SubmitLeadPayload = {
  name: string;
  phone: string;
  course?: string;
  contactTime?: string;
};

export type SubmitLeadResult =
  | { ok: true; lead: Lead }
  | { ok: false; error: string; status?: number };

function buildQuery(params: { q?: string; course?: string }) {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.course?.trim()) sp.set("course", params.course.trim());
  const qs = sp.toString();
  return qs ? `${API}?${qs}` : API;
}

export async function apiGetAll(params?: {
  q?: string;
  course?: string;
}): Promise<Lead[]> {
  if (!isBrowser()) return [];
  try {
    const url = buildQuery(params ?? {});
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await safeJsonResponse<Lead[]>(res);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function apiCreate(
  input: SubmitLeadPayload
): Promise<SubmitLeadResult> {
  if (!isBrowser()) {
    return { ok: false, error: "無法在伺服器端送出表單" };
  }
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        phone: input.phone,
        course: input.course ?? "",
        contactTime: input.contactTime ?? "",
      }),
    });

    const json = (await res.json().catch(() => ({}))) as unknown;

    if (!res.ok) {
      const msg =
        typeof json === "object" &&
        json !== null &&
        "error" in json &&
        typeof (json as { error: string }).error === "string"
          ? (json as { error: string }).error
          : `送出失敗（${res.status}）`;
      return { ok: false, error: msg, status: res.status };
    }

    const lead = json as Lead;
    if (!lead?.id || !lead?.name) {
      return { ok: false, error: "回傳資料異常" };
    }
    return { ok: true, lead };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "網路錯誤";
    return { ok: false, error: msg };
  }
}
