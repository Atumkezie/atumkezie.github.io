(function () {
  'use strict';
  const prefs = window.HKPreferences;
  const root = document.documentElement;
  const storage = prefs.storageOf(window);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const status = document.querySelector('[data-environment-status]');
  const themeButtons = [...document.querySelectorAll('[data-theme-choice]')];
  const motionButton = document.querySelector('[data-motion-toggle]');
  let userPaused = prefs.read(storage, prefs.MOTION_KEY) === 'paused';

  function updateMotion() {
    const paused = prefs.paused(userPaused ? 'paused' : 'running', reduced.matches);
    root.dataset.motion = paused ? 'paused' : 'running';
    if (!motionButton) return;
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.disabled = reduced.matches;
    motionButton.querySelector('[data-motion-label]').textContent = reduced.matches ? 'Motion off · system preference' : paused ? 'Resume motion' : 'Pause motion';
    motionButton.querySelector('.motion-symbol').textContent = paused ? '▷' : 'Ⅱ';
  }
  function updateTheme() {
    themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === root.dataset.theme)));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', root.dataset.theme === 'night' ? '#101b30' : '#c7e1f1');
  }
  themeButtons.forEach(button => button.addEventListener('click', () => {
    const theme = prefs.theme(button.dataset.themeChoice);
    if (root.dataset.theme === theme) return;
    root.dataset.theme = theme;
    prefs.write(storage, prefs.THEME_KEY, theme);
    updateTheme();
    if (status) status.textContent = `${theme === 'night' ? 'Night' : 'Day'} mode selected.`;
  }));
  motionButton?.addEventListener('click', () => {
    userPaused = !userPaused;
    prefs.write(storage, prefs.MOTION_KEY, userPaused ? 'paused' : 'running');
    updateMotion();
  });
  reduced.addEventListener('change', updateMotion);

  const video = document.querySelector('#keyboard-performance');
  const soundButton = document.querySelector('[data-performance-toggle]');
  const listenButton = document.querySelector('[data-performance-link]');
  if (video) {
    function syncSound() {
      const playing = !video.paused && !video.ended;
      soundButton?.setAttribute('aria-pressed', String(playing));
      soundButton?.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} Harikrishna's keyboard performance`);
      listenButton?.setAttribute('aria-pressed', String(playing));
      const label = listenButton?.querySelector('[data-performance-label]');
      if (label) label.textContent = playing ? 'Pause the recording' : 'Play the recording';
    }
    async function toggleSound() {
      if (!video.paused && !video.ended) { video.pause(); return; }
      try {
        if (video.ended) video.currentTime = 0;
        await video.play();
        syncSound();
      } catch {
        syncSound();
        if (status) status.textContent = 'The recording could not start. Use the video controls in Music, or download the performance.';
      }
    }
    ['play', 'pause', 'ended', 'error'].forEach(event => video.addEventListener(event, syncSound));
    soundButton?.addEventListener('click', toggleSound);
    listenButton?.addEventListener('click', toggleSound);
    syncSound();
  }
  updateTheme();
  updateMotion();
})();
