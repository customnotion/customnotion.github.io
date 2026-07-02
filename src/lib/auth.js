// Local admin authentication.
//
// This is an *optional*, local-only convenience gate for the Admin
// Dashboard on a shared machine -- not a substitute for real multi-user
// auth (there is no server, so there's nothing to rate-limit or lock out).
// The password itself is never stored: only a salted SHA-256 hash lives in
// localStorage. The active session flag lives in sessionStorage, so it
// clears automatically when the browser tab/window is closed.

import { hashPassword, generateSalt } from './security.js';

const AUTH_KEY = 'sitecraft:auth';
const SESSION_KEY = 'sitecraft:admin-session';

function readAuthConfig() {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isPasswordProtectionEnabled() {
  return Boolean(readAuthConfig());
}

export async function setAdminPassword(password) {
  const salt = generateSalt();
  const hash = await hashPassword(password, salt);
  window.localStorage.setItem(AUTH_KEY, JSON.stringify({ salt, hash }));
}

export function disableAdminPassword() {
  window.localStorage.removeItem(AUTH_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}

export async function verifyAdminPassword(password) {
  const config = readAuthConfig();
  if (!config) return true; // No password configured -- dashboard is open.
  const candidate = await hashPassword(password, config.salt);
  return candidate === config.hash;
}

export function startAdminSession() {
  window.sessionStorage.setItem(SESSION_KEY, '1');
}

export function endAdminSession() {
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function hasActiveAdminSession() {
  if (!isPasswordProtectionEnabled()) return true;
  return window.sessionStorage.getItem(SESSION_KEY) === '1';
}
