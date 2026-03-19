import type { Course, CourseCategory, ID } from "@/types";
import {
  generateId,
  isBrowser,
  nowIso,
  safeJsonResponse,
  storageGet,
  storageSet,
} from "@/lib/storage";
import { seedCourses } from "@/data/seed-courses";

const KEY = "cms:courses:v1";
const API = "/api/courses";

function normalize(items: Course[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function seedCoursesIfEmpty() {
  const existing = storageGet<Course[]>(KEY, []);
  if (existing.length > 0) {
    // 遷移：舊資料可能沒有 category，補上預設值並回寫
    const migrated = existing.map((c) => ({
      ...c,
      category: (c as Course).category ?? ("unemployed_subsidy" as CourseCategory),
    }));
    const hasChange = migrated.some(
      (c, i) => (existing[i] as Course).category !== c.category
    );
    if (hasChange) storageSet(KEY, migrated);
    return migrated;
  }
  storageSet(KEY, seedCourses);
  return seedCourses;
}

export function getAll() {
  return normalize(seedCoursesIfEmpty());
}

export function getByCategory(category: CourseCategory) {
  return getAll().filter((c) => c.category === category);
}

export function getById(id: ID) {
  return getAll().find((c) => c.id === id) ?? null;
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
  const items = await tryFetchJson<Course[]>(API, { cache: "no-store" });
  return items ? normalize(items) : getAll();
}

export async function apiCreate(
  input: Omit<Course, "id" | "createdAt" | "updatedAt">
) {
  const created = await tryFetchJson<Course>(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (created) return created;
  return create(input);
}

export async function apiUpdate(
  id: ID,
  patch: Partial<Omit<Course, "id" | "createdAt">>
) {
  const updated = await tryFetchJson<Course>(`${API}/${id}`, {
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
  const updated = await tryFetchJson<Course>(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished: item ? !item.isPublished : true }),
  });
  if (updated) return updated;
  return togglePublished(id);
}

export function create(input: Omit<Course, "id" | "createdAt" | "updatedAt">) {
  const items = getAll();
  const now = nowIso();
  const next: Course = {
    ...input,
    id: generateId("course"),
    createdAt: now,
    updatedAt: now,
  };
  storageSet(KEY, normalize([next, ...items]));
  return next;
}

export function update(
  id: ID,
  patch: Partial<Omit<Course, "id" | "createdAt">>
) {
  const items = getAll();
  const idx = items.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  const updated: Course = {
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

