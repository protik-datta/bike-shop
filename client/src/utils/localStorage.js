/**
 * Safe localStorage helpers — always fail silently (SSR / private-mode safe).
 */

export function lsGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or unavailable — ignore
  }
}

export function lsRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function lsClear() {
  try {
    localStorage.clear();
  } catch {
    // ignore
  }
}
