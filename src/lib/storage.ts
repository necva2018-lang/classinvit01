type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [k: string]: JsonValue }
  | JsonValue[];

export function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeStringifyJson(value: JsonValue) {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

export function storageGet<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  return safeParseJson<T>(localStorage.getItem(key), fallback);
}

export function storageSet<T extends JsonValue>(key: string, value: T): boolean {
  if (!isBrowser()) return false;
  const raw = safeStringifyJson(value);
  if (!raw) return false;
  localStorage.setItem(key, raw);
  return true;
}

export function storageRemove(key: string): boolean {
  if (!isBrowser()) return false;
  localStorage.removeItem(key);
  return true;
}

export function nowIso() {
  return new Date().toISOString();
}

export function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

