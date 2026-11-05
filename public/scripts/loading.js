(function () {
  'use strict';
  const root = document.documentElement;
  if (root.dataset.motion === 'paused') return;
  root.dataset.loading = 'true';
  const started = Date.now();
  let done = false;
  function finish() {
    if (done) return;
    done = true;
    root.dataset.loading = 'false';
  }
  function ready() {
    window.setTimeout(finish, Math.max(0, 650 - (Date.now() - started)));
  }
  // Finite escape hatch: failed assets cannot trap a visitor behind the intro.
  window.setTimeout(finish, 1800);
  if (document.readyState === 'complete') ready();
  else window.addEventListener('load', ready, { once: true });
  window.addEventListener('pageshow', event => { if (event.persisted) finish(); });
})();
