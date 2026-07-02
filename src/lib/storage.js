// Local-only data store.
//
// All site content lives in a single localStorage key as JSON. There is no
// server, no database, and no network call anywhere in this module -- every
// read and write is synchronous and local to the browser. Design note: this
// intentionally uses the browser's native subscribe/notify pattern
// (compatible with React's `useSyncExternalStore`) rather than pulling in a
// state-management library, since the amount of state here doesn't justify
// an extra dependency.
//
// Swapping this out for real files or IndexedDB later (see README > Future
// Improvements) only means changing the body of `load()` / `persist()` --
// every component consumes data through the `store` API below, never
// through localStorage directly.

import { DEFAULT_DATA, STORAGE_VERSION } from '../data/defaultData.js';

const STORAGE_KEY = 'sitecraft:data';

function cloneDefaults() {
  return typeof structuredClone === 'function'
    ? structuredClone(DEFAULT_DATA)
    : JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function mergeWithDefaults(parsed) {
  const defaults = cloneDefaults();
  if (!parsed || typeof parsed !== 'object') return defaults;
  return {
    ...defaults,
    ...parsed,
    siteConfig: { ...defaults.siteConfig, ...(parsed.siteConfig || {}) },
    theme: { ...defaults.theme, ...(parsed.theme || {}) },
    navigation: Array.isArray(parsed.navigation) ? parsed.navigation : defaults.navigation,
    modules: Array.isArray(parsed.modules) ? parsed.modules : defaults.modules,
    features: Array.isArray(parsed.features) ? parsed.features : defaults.features,
    buttons: Array.isArray(parsed.buttons) ? parsed.buttons : defaults.buttons,
    pages: Array.isArray(parsed.pages) ? parsed.pages : defaults.pages,
  };
}

function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaults();
    return mergeWithDefaults(JSON.parse(raw));
  } catch (err) {
    console.warn('[sitecraft] Could not read local storage, falling back to defaults.', err);
    return cloneDefaults();
  }
}

let state = load();
const listeners = new Set();

function notify() {
  for (const listener of listeners) listener();
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[sitecraft] Failed to save to local storage (storage may be full or disabled).', err);
  }
  notify();
}

// Keep multiple tabs/windows in sync with each other.
window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY) return;
  state = load();
  notify();
});

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function setState(updater) {
  state = { ...state, ...updater(state) };
  persist();
}

function nextOrder(list) {
  return list.length ? Math.max(...list.map((item) => item.order ?? 0)) + 1 : 1;
}

export const store = {
  subscribe,
  getSnapshot,
  version: STORAGE_VERSION,

  // ---- Site config ----
  updateSiteConfig(patch) {
    setState((s) => ({ siteConfig: { ...s.siteConfig, ...patch } }));
  },

  // ---- Theme ----
  updateTheme(patch) {
    setState((s) => ({ theme: { ...s.theme, ...patch } }));
  },
  resetTheme() {
    setState(() => ({ theme: cloneDefaults().theme }));
  },

  // ---- Navigation ----
  addNavItem(item) {
    setState((s) => ({ navigation: [...s.navigation, { ...item, order: nextOrder(s.navigation) }] }));
  },
  updateNavItem(id, patch) {
    setState((s) => ({ navigation: s.navigation.map((n) => (n.id === id ? { ...n, ...patch } : n)) }));
  },
  deleteNavItem(id) {
    setState((s) => ({ navigation: s.navigation.filter((n) => n.id !== id) }));
  },
  reorderNav(orderedList) {
    setState(() => ({ navigation: orderedList.map((n, i) => ({ ...n, order: i + 1 })) }));
  },

  // ---- Modules ----
  addModule(mod) {
    setState((s) => ({ modules: [...s.modules, { ...mod, order: nextOrder(s.modules) }] }));
  },
  updateModule(id, patch) {
    setState((s) => ({ modules: s.modules.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
  },
  deleteModule(id) {
    setState((s) => ({ modules: s.modules.filter((m) => m.id !== id) }));
  },
  reorderModules(orderedList) {
    setState(() => ({ modules: orderedList.map((m, i) => ({ ...m, order: i + 1 })) }));
  },
  toggleModuleVisibility(id) {
    setState((s) => ({ modules: s.modules.map((m) => (m.id === id ? { ...m, visible: !m.visible } : m)) }));
  },

  // ---- Buttons ----
  addButton(btn) {
    setState((s) => ({ buttons: [...s.buttons, btn] }));
  },
  updateButton(id, patch) {
    setState((s) => ({ buttons: s.buttons.map((b) => (b.id === id ? { ...b, ...patch } : b)) }));
  },
  deleteButton(id) {
    setState((s) => ({ buttons: s.buttons.filter((b) => b.id !== id) }));
  },

  // ---- Pages ----
  addPage(page) {
    setState((s) => ({ pages: [...s.pages, { ...page, order: nextOrder(s.pages) }] }));
  },
  updatePage(id, patch) {
    setState((s) => ({ pages: s.pages.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  },
  deletePage(id) {
    setState((s) => ({ pages: s.pages.filter((p) => p.id !== id) }));
  },
  reorderPages(orderedList) {
    setState(() => ({ pages: orderedList.map((p, i) => ({ ...p, order: i + 1 })) }));
  },

  // ---- Import / export / reset (all local, file-based) ----
  exportJson() {
    return JSON.stringify(state, null, 2);
  },
  importJson(json) {
    const parsed = JSON.parse(json);
    state = mergeWithDefaults(parsed);
    persist();
  },
  resetAll() {
    state = cloneDefaults();
    persist();
  },
};
