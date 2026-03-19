import type { ID, MediaItem, MediaType } from "@/types";
import { generateId, nowIso, storageGet, storageSet } from "@/lib/storage";
import { seedMedia } from "@/data/seed-media";

const KEY = "cms:media:v1";

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

