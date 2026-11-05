export const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
export function heroMotion(scrollY, offset, viewportHeight, trackHeight, reduced = false) {
  const progress = clamp((scrollY - offset) / Math.max(trackHeight - viewportHeight, 1));
  if (reduced) return { progress, scale: 1, radius: 0, captionY: 0, captionOpacity: 1, rotation: 0 };
  const p = ease(progress);
  return { progress, scale: 1 - p * .018, radius: p * 22, captionY: -p * 22, captionOpacity: 1 - p * .7, rotation: p * .22 };
}
export function revealMotion(top, height, order = 0, reduced = false, elementHeight = 160) {
  if (reduced) return { opacity: 1, y: 0 };
  const fromBottom = ease((height * .96 - top - order * 18) / Math.max(height * .27, 1));
  const fromTop = ease((top + elementHeight - height * .02) / Math.max(height * .19, 1));
  // Position, not a one-time flag: entering from either edge reverses smoothly.
  return { opacity: .12 + .88 * Math.min(fromBottom, fromTop), y: 32 * (fromTop - fromBottom) };
}
export function wordOpacity(progress, index, count, reduced = false) {
  return reduced ? 1 : .18 + .82 * ease(progress * (count + 2) - index);
}
