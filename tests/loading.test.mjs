import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const code = readFileSync(new URL('../public/scripts/loading.js', import.meta.url), 'utf8');
function harness({ paused = false, complete = false } = {}) {
  let now = 0;
  const timers = [], events = {};
  const root = { dataset: { motion: paused ? 'paused' : 'running' } };
  const window = { setTimeout(fn, delay) { timers.push({ fn, time: now + delay }); }, addEventListener(name, fn) { events[name] = fn; } };
  runInNewContext(code, { document: { documentElement: root, readyState: complete ? 'complete' : 'loading' }, window, Date: { now: () => now } });
  function advance(time) {
    now = time;
    for (let i = 0; i < timers.length; i++) if (!timers[i].done && timers[i].time <= now) { timers[i].done = true; timers[i].fn(); }
  }
  return { root, events, advance };
}
test('fast page loads show a brief intro then release it', () => {
  const h = harness();assert.equal(h.root.dataset.loading, 'true');h.events.load();
  h.advance(649);assert.equal(h.root.dataset.loading, 'true');h.advance(650);assert.equal(h.root.dataset.loading, 'false');
});
test('failed or delayed assets cannot leave the loader stuck', () => {
  const h = harness();h.advance(1800);assert.equal(h.root.dataset.loading, 'false');
  h.events.load();h.advance(2500);assert.equal(h.root.dataset.loading, 'false');
});
test('initial visit and reload each get their own intro', () => {
  const first = harness({ complete: true });first.advance(650);assert.equal(first.root.dataset.loading, 'false');
  const reload = harness({ complete: true });assert.equal(reload.root.dataset.loading, 'true');reload.advance(650);assert.equal(reload.root.dataset.loading, 'false');
});
test('the resolved motion preference skips the animated loader', () => {
  const h = harness({ paused: true });assert.equal(h.root.dataset.loading, undefined);
});
test('returning from browser history immediately dismisses the loader', () => {
  const h = harness();h.events.pageshow({ persisted: true });assert.equal(h.root.dataset.loading, 'false');
});
