import type { ID, Lead } from "@/types";
import {
  generateId,
  isBrowser,
  nowIso,
  safeJsonResponse,
  storageGet,
  storageSet,
} from "@/lib/storage";

const KEY = "cms:leads:v1";
const API = "/api/leads";

export function getAll() {
  const items = storageGet<Lead[]>(KEY, []);
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getById(id: ID) {
  return getAll().find((l) => l.id === id) ?? null;
}

export function create(input: Omit<Lead, "id" | "createdAt">) {
  const items = getAll();
  const next: Lead = { ...input, id: generateId("lead"), createdAt: nowIso() };
  storageSet(KEY, [next, ...items]);
  return next;
}

async function tryFetchJson<T>(input: RequestInfo, init?: RequestInit) {
  if (!isBrowser()) return null;
  try {
    const res = await fetch(input, init);
    if (!res.ok) return null;
    return await safeJsonResponse<T>(res);
  } catch {
    return null;
  }
}

export async function apiGetAll() {
  const items = await tryFetchJson<
    Array<{
      id: string;
      name: string;
      phone: string;
      course: string;
      contactTime: string;
      createdAt: string;
    }>
  >(API, { cache: "no-store" });
  if (items) return items as Lead[];
  return getAll();
}

export async function apiCreate(input: Omit<Lead, "id" | "createdAt">) {
  const created = await tryFetchJson<Lead>(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (created) return created;
  return create(input);
}

export function remove(id: ID) {
  const items = getAll();
  const next = items.filter((l) => l.id !== id);
  storageSet(KEY, next);
  return next.length !== items.length;
}

export function getStats() {
  const all = getAll();
  const byCourse: Record<string, number> = {};
  for (const lead of all) {
    byCourse[lead.course] = (byCourse[lead.course] ?? 0) + 1;
  }
  return {
    total: all.length,
    byCourse,
    latestAt: all[0]?.createdAt ?? null,
  };
}

