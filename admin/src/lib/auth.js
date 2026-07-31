const STORAGE_KEY = "vm_admin_session";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

/**
 * Static, client-side-only login. There is no backend auth endpoint —
 * credentials are compared against the values baked into .env at build
 * time, and a session flag is kept in localStorage so a refresh doesn't
 * log the admin out. This is fine for a single-admin internal tool, but
 * it is NOT real authentication: anyone who can read the deployed JS
 * bundle can see the credentials. Don't reuse this pattern for anything
 * that needs real access control.
 */
export function login(email, password) {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return {
      ok: false,
      error:
        "Admin credentials are not configured. Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD in .env.",
    };
  }

  const matches =
    email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase() &&
    password === ADMIN_PASSWORD;

  if (!matches) {
    return { ok: false, error: "Invalid email or password." };
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ email: ADMIN_EMAIL, at: Date.now() }),
  );
  return { ok: true };
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getSession());
}
