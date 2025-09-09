// Minimal setup de Motion.dev para scroll suave en anclas y utilidades globales
import { animate } from "motion";

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function smoothScrollTo(targetY: number, durationMs = 700) {
  const startY = window.scrollY || document.documentElement.scrollTop;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / durationMs);
    const eased = easeOutQuart(progress);
    const current = startY + distance * eased;
    window.scrollTo(0, current);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function setupAnchorSmoothScroll() {
  document.addEventListener("click", (ev) => {
    const target = ev.target as HTMLElement | null;
    if (!target) return;
    const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null;
    if (!anchor) return;
    const hash = anchor.getAttribute("href");
    if (!hash || hash === "#") return;
    const el = document.querySelector(hash) as HTMLElement | null;
    if (!el) return;
    ev.preventDefault();
    const rect = el.getBoundingClientRect();
    const y = rect.top + (window.scrollY || document.documentElement.scrollTop) - 16; // pequeño offset
    smoothScrollTo(y, 700);
  });
}

// Helper para animaciones puntuales con Motion (por ejemplo hover/focus), accesible globalmente si se necesitara
declare global {
  interface Window { $m?: typeof animate }
}

export function initMotionClient() {
  if (typeof window === "undefined") return;
  if (!window.$m) window.$m = animate;
  setupAnchorSmoothScroll();
}

// Autoinit
initMotionClient();


