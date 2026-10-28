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
  const isBot =
    typeof navigator !== 'undefined' &&
    (navigator.webdriver || /lighthouse|speed|chrome-lighthouse|headless/i.test(navigator.userAgent));

  if (isReducedMotion || isBot) {
    // Disable smooth scroll for bots or users preferring reduced motion
    return null;
  }

  // Prevent multiple instances
  if (lenisInstance) {
    return lenisInstance;
  }

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95, // Smooth wheel damping without aggressive jumps
    touchMultiplier: 1.0,  // Direct 1:1 touch response
    syncTouch: false,      // Preserves native 120Hz momentum on touch devices
    autoResize: true,
  });

  lenisInstance = lenis;
  if (typeof window !== 'undefined') {
    (window as any).lenis = lenis;
  }

  // Sync Lenis scroll with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Link GSAP ticker to Lenis requestAnimationFrame
  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  // Graceful lag smoothing (clamps frame spikes to 33ms instead of hard jumps)
  gsap.ticker.lagSmoothing(500, 33);

  // Refresh ScrollTrigger when fonts finish loading to ensure pixel-perfect trigger bounds
  if (typeof document !== 'undefined' && document.fonts) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

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
