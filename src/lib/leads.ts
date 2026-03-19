import type { ID, Lead } from "@/types";
import { generateId, nowIso, storageGet, storageSet } from "@/lib/storage";

const KEY = "cms:leads:v1";

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

