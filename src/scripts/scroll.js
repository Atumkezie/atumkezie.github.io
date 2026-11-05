import Lenis from 'lenis';
import { heroMotion, revealMotion, wordOpacity, clamp } from './scene-state.mjs';

export function startScrollMotion() {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const track = document.querySelector('[data-hero-track]');
  const stage = document.querySelector('[data-hero-stage]');
  const intro = document.querySelector('[data-statement]');
  const words = intro ? [...intro.querySelectorAll('[data-word]')] : [];
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const images = [...document.querySelectorAll('.work-image-inner')];
  let lenis = null;
  let paused = false;
  let raf = 0;
  let active = true;

  function configure() {
    paused = media.matches || root.dataset.motion === 'paused';
    if (lenis) { lenis.destroy(); lenis = null; }
    if (!paused) {
      try {
        lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false, anchors: { offset: -80, duration: 1.1 } });
      } catch { /* Native scrolling stays available. */ }
    }
    root.dataset.scrollMotion = paused ? 'reduced' : 'active';
  }

  function update(time) {
    if (!active) return;
    raf = requestAnimationFrame(update);
    if (document.hidden) return;
    lenis?.raf(time);
    const height = window.innerHeight;
    if (track && stage) {
      const offset = track.getBoundingClientRect().top + window.scrollY;
      const state = heroMotion(window.scrollY, offset, stage.clientHeight, track.clientHeight, paused);
      stage.style.setProperty('--hero-scale', String(state.scale));
      stage.style.setProperty('--hero-radius', `${state.radius}px`);
      stage.style.setProperty('--hero-caption-y', `${state.captionY}px`);
      stage.style.setProperty('--hero-caption-opacity', String(state.captionOpacity));
    }
    if (intro) {
      const top = intro.getBoundingClientRect().top;
      const progress = clamp((height * .82 - top) / Math.max(height * .65, 1));
      words.forEach((word, i) => word.style.setProperty('--word-opacity', String(wordOpacity(progress, i, words.length, paused))));
    }
    reveals.forEach(element => {
      const previousY = parseFloat(element.style.getPropertyValue('--reveal-y')) || 0;
      const bounds = element.getBoundingClientRect();
      const top = bounds.top - previousY;
      const state = revealMotion(top, height, Number(element.dataset.revealOrder || 0), paused, bounds.height);
      element.style.setProperty('--reveal-y', `${state.y}px`);
      element.style.setProperty('--reveal-opacity', String(state.opacity));
    });
    images.forEach(image => {
      const parent = image.parentElement.getBoundingClientRect();
      const distance = (parent.top + parent.height * .5 - height * .5) / Math.max(height, 1);
      image.style.setProperty('--image-y', paused ? '0px' : `${clamp(distance, -1, 1) * -16}px`);
      image.style.setProperty('--image-scale', paused ? '1' : '1.025');
    });
  }
  new MutationObserver(configure).observe(root, { attributes: true, attributeFilter: ['data-motion'] });
  media.addEventListener('change', configure);
  configure();
  raf = requestAnimationFrame(update);
  window.addEventListener('pagehide', () => { active = false; cancelAnimationFrame(raf); lenis?.destroy(); lenis = null; });
  window.addEventListener('pageshow', event => {
    if (event.persisted && !active) { active = true; configure(); raf = requestAnimationFrame(update); }
  });
}
