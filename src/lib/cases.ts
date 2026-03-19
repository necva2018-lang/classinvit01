import type { CaseItem, ID } from "@/types";
import { generateId, nowIso, storageGet, storageSet } from "@/lib/storage";
import { seedCases } from "@/data/seed-cases";

const KEY = "cms:cases:v1";

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

