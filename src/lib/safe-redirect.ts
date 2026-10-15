const ORIGIN = "http://localhost";

/**
 * Returns a same-origin path taken from a `redirect` query param.
 * Only paths starting with a single "/" are accepted; protocol-relative
 * ("//host"), backslash variants ("/\\host"), absolute URLs and control
 * characters fall back to `fallback`.
 */
export function getSafeRedirect(value: string | null, fallback = "/"): string {
  if (!value || !value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (value.includes("\\")) return fallback;
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (c <= 0x1f || c === 0x7f) return fallback;
  }

  try {
    if (new URL(value, ORIGIN).origin !== ORIGIN) return fallback;
  } catch {
    return fallback;
  }

  return value;
}

/** Appends `?redirect=` to a path, skipping it when redirect is the default "/". */
export function withRedirect(path: string, redirect: string): string {
  return redirect !== "/" ? `${path}?redirect=${encodeURIComponent(redirect)}` : path;
}
