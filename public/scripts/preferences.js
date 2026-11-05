/* Shared by the first-paint script and browser controls; no network or tracking. */
(function (global) {
  'use strict';
  const THEME_KEY = 'hk-theme-v1';
  // A fresh motion setting for the remake; do not inherit the broken preview's pause state.
  const MOTION_KEY = 'hk-motion-v2';
  function read(storage, key) { try { return storage.getItem(key); } catch { return null; } }
  function write(storage, key, value) { try { storage.setItem(key, value); } catch { /* Private/file storage can be unavailable. */ } }
  function storageOf(host) { try { return host.localStorage; } catch { return null; } }
  function theme(value) { return value === 'night' ? 'night' : 'day'; }
  function paused(value, reduced) { return reduced || value === 'paused'; }
  function restore(storage, reduced) { return { theme: theme(read(storage, THEME_KEY)), paused: paused(read(storage, MOTION_KEY), reduced) }; }
  function applyInitial(root, host) {
    const reduced = Boolean(host.matchMedia && host.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const state = restore(storageOf(host), reduced);
    root.dataset.theme = state.theme;
    root.dataset.motion = state.paused ? 'paused' : 'running';
    return state;
  }
  global.HKPreferences = { THEME_KEY, MOTION_KEY, read, write, storageOf, theme, paused, restore, applyInitial };
})(globalThis);
