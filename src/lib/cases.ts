import type { CaseItem, ID } from "@/types";
import {
  generateId,
  isBrowser,
  nowIso,
  safeJsonResponse,
  storageGet,
  storageSet,
} from "@/lib/storage";
import { seedCases } from "@/data/seed-cases";

const KEY = "cms:cases:v1";
const API = "/api/cases";

function normalize(items: CaseItem[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function seedCasesIfEmpty() {
  const existing = storageGet<CaseItem[]>(KEY, []);
  if (existing.length > 0) return existing;
  storageSet(KEY, seedCases);
  return seedCases;
}

export function getAll() {
  return normalize(seedCasesIfEmpty());
}

export function getById(id: ID) {
  return getAll().find((c) => c.id === id) ?? null;
}

export function create(
  input: Omit<CaseItem, "id" | "createdAt" | "updatedAt">
) {
  const items = getAll();
  const now = nowIso();
  const next: CaseItem = {
    ...input,
    id: generateId("case"),
    createdAt: now,
    updatedAt: now,
  };
  storageSet(KEY, normalize([next, ...items]));
  return next;
}

export function update(
  id: ID,
  patch: Partial<Omit<CaseItem, "id" | "createdAt">>
) {
  const items = getAll();
  const idx = items.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  const updated: CaseItem = {
    ...items[idx],
    ...patch,
    updatedAt: nowIso(),
  };
  const next = [...items];
  next[idx] = updated;
  storageSet(KEY, normalize(next));
  return updated;
}

export function remove(id: ID) {
  const items = getAll();
  const next = items.filter((c) => c.id !== id);
  storageSet(KEY, normalize(next));
  return next.length !== items.length;
}

export function togglePublished(id: ID) {
  const item = getById(id);
  if (!item) return null;
  return update(id, { isPublished: !item.isPublished });
}

export function toggleFeatured(id: ID) {
  const item = getById(id);
  if (!item) return null;
  return update(id, { isFeatured: !item.isFeatured });
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
  const items = await tryFetchJson<CaseItem[]>(API, { cache: "no-store" });
  return items ? normalize(items) : getAll();
}

export async function apiCreate(
  input: Omit<CaseItem, "id" | "createdAt" | "updatedAt">
) {
  const created = await tryFetchJson<CaseItem>(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (created) return created;
  return create(input);
}

export async function apiUpdate(
  id: ID,
  patch: Partial<Omit<CaseItem, "id" | "createdAt">>
) {
  const updated = await tryFetchJson<CaseItem>(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (updated) return updated;
  return update(id, patch);
}

export async function apiRemove(id: ID) {
  const ok = await tryFetchJson<{ ok: true }>(`${API}/${id}`, {
    method: "DELETE",
  });
  if (ok) return true;
  return remove(id);
}

export async function apiTogglePublished(id: ID) {
  const item = getById(id);
  const updated = await tryFetchJson<CaseItem>(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished: item ? !item.isPublished : true }),
  });
  if (updated) return updated;
  return togglePublished(id);
}

export async function apiToggleFeatured(id: ID) {
  const item = getById(id);
  const updated = await tryFetchJson<CaseItem>(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isFeatured: item ? !item.isFeatured : true }),
  });
  if (updated) return updated;
  return toggleFeatured(id);
}

