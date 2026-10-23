import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export interface MotionConfig {
  isMobile: boolean;
  isReducedMotion: boolean;
  lenis: Lenis | null;
}

let lenisInstance: Lenis | null = null;

/**
 * Initializes Lenis smooth scrolling and binds it directly to GSAP ScrollTrigger ticker.
 * Automatically respects prefers-reduced-motion and provides accessible keyboard/anchor support.
 */
export function initSmoothScroll(): Lenis | null {
  if (typeof window === 'undefined') return null;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) {
    // Disable smooth scroll for users preferring reduced motion
    return null;
  }

  // Prevent multiple instances
  if (lenisInstance) {
    return lenisInstance;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenisInstance = lenis;

  // Sync Lenis scroll with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Link GSAP ticker to Lenis requestAnimationFrame
  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  // Setup accessible anchor link handling with Lenis
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        lenis.scrollTo(targetElement as HTMLElement, {
          offset: -80,
          duration: 1.2,
        });
        // Update URL hash without jumping
        history.pushState(null, '', href);
      }
    }
  });

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Helper to check if current device prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Helper to check if current viewport is mobile (< 768px).
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}
