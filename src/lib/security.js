// Security helpers.
//
// Everything here uses only the browser's native Web Crypto API
// (window.crypto.subtle / crypto.randomUUID) -- no third-party crypto or
// auth library is installed. That keeps the dependency count down and
// avoids trusting an external package with password handling.

/**
 * Hash a password with a per-install random salt using SHA-256.
 * This is a *local* admin gate meant to deter casual access on a shared
 * machine, not a hardened multi-user auth system (there is no server to
 * rate-limit attempts against). It is documented as such in the README.
 */
export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateSalt() {
  return crypto.randomUUID();
}

export function generateId(prefix = 'id') {
  return `${prefix}-${crypto.randomUUID()}`;
}

/**
 * Restrict destination URLs to safe schemes: same-site relative paths,
 * in-page hash anchors, and http(s) links. This blocks javascript:, data:,
 * vbscript:, and similar URI schemes from being stored and later rendered
 * in an href/src attribute (stored-XSS prevention), since module and
 * button destinations are user-editable from the Admin Dashboard.
 */
export function sanitizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '#';
  const url = rawUrl.trim();
  if (url === '') return '#';

  if (url.startsWith('#') || url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return url;
  }

  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return url;
    }
  } catch {
    // Not a fully-qualified URL -- fall through to the relative-path check.
  }

  // Plain relative path/slug, e.g. "contact" or "pricing?ref=home".
  if (/^[a-zA-Z0-9/_\-.?=&%]+$/.test(url)) return url;

  return '#';
}

/** Slugify page names for the Page Manager (letters, numbers, hyphens only). */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Basic hex color validator used before writing user input to CSS custom properties. */
export function isValidHexColor(value) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(String(value || '').trim());
}
