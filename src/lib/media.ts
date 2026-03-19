import type { ID, MediaItem, MediaType } from "@/types";
import {
  generateId,
  isBrowser,
  nowIso,
  safeJsonResponse,
  storageGet,
  storageSet,
} from "@/lib/storage";
import { seedMedia } from "@/data/seed-media";

const KEY = "cms:media:v1";
const API = "/api/media";

function normalize(items: MediaItem[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function seedMediaIfEmpty() {
  const existing = storageGet<MediaItem[]>(KEY, []);
  if (existing.length > 0) return existing;
  storageSet(KEY, seedMedia);
  return seedMedia;
}

export function getAll() {
  return normalize(seedMediaIfEmpty());
}

export function getById(id: ID) {
  return getAll().find((m) => m.id === id) ?? null;
}

export function getPublishedByType(type: MediaType) {
  return getAll().filter((m) => m.type === type && m.isPublished);
}

export function create(
  input: Omit<MediaItem, "id" | "createdAt" | "updatedAt">
) {
  const items = getAll();
  const now = nowIso();
  const next: MediaItem = {
    ...input,
    id: generateId("media"),
    createdAt: now,
    updatedAt: now,
  };
  storageSet(KEY, normalize([next, ...items]));
  return next;
}

export function update(
  id: ID,
  patch: Partial<Omit<MediaItem, "id" | "createdAt">>
) {
  const items = getAll();
  const idx = items.findIndex((m) => m.id === id);
  if (idx < 0) return null;
  const updated: MediaItem = {
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
  const next = items.filter((m) => m.id !== id);
  storageSet(KEY, normalize(next));
  return next.length !== items.length;
}

export function togglePublished(id: ID) {
  const item = getById(id);
  if (!item) return null;
  return update(id, { isPublished: !item.isPublished });
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
  const items = await tryFetchJson<MediaItem[]>(API, { cache: "no-store" });
  return items ? normalize(items) : getAll();
}

export async function apiGetPublishedByType(type: MediaType) {
  const items = await tryFetchJson<MediaItem[]>(`${API}?type=${type}&published=1`, {
    cache: "no-store",
  });
  return items ? normalize(items) : getPublishedByType(type);
}

export async function apiCreate(
  input: Omit<MediaItem, "id" | "createdAt" | "updatedAt">
) {
  const created = await tryFetchJson<MediaItem>(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (created) return created;
  return create(input);
}

export async function apiUpdate(
  id: ID,
  patch: Partial<Omit<MediaItem, "id" | "createdAt">>
) {
  const updated = await tryFetchJson<MediaItem>(`${API}/${id}`, {
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
  const updated = await tryFetchJson<MediaItem>(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished: item ? !item.isPublished : true }),
  });
  if (updated) return updated;
  return togglePublished(id);
}

