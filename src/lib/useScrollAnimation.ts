import { useEffect, RefObject } from 'react';
import { gsap } from './motion';

interface SectionRevealOptions {
  triggerStart?: string;
  cardStagger?: number;
}

/**
 * useSectionReveal:
 * Automatically finds elements marked with [data-reveal] within a section and animates them on scroll:
 * - [data-reveal="badge"]: subtle fade & slide up
 * - [data-reveal="desc"]: smooth paragraph entrance
 * - [data-reveal="card"]: sequential domino stagger entrance (y: 40 -> 0, opacity: 0 -> 1, scale: 0.98 -> 1)
 */
export function useSectionReveal(
  sectionRef: RefObject<HTMLElement | null>,
  options: SectionRevealOptions = {}
) {
  const { triggerStart = 'top 85%', cardStagger = 0.1 } = options;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // 1. Badge / Tagline
      const badges = el.querySelectorAll('[data-reveal="badge"]');
      if (badges.length) {
        gsap.fromTo(
          badges,
          { opacity: 0, y: 16, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: triggerStart,
              once: true,
            },
          }
        );
      }

      // 2. Subtitles & Descriptions
      const descs = el.querySelectorAll('[data-reveal="desc"]');
      if (descs.length) {
        gsap.fromTo(
          descs,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: triggerStart,
              once: true,
            },
          }
        );
      }

      // 3. Cards & Grid items
      const cards = el.querySelectorAll('[data-reveal="card"]');
      if (cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 45, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: cardStagger,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cards[0],
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      // 4. Standalone featured stages / simulator containers
      const stages = el.querySelectorAll('[data-reveal="stage"]');
      if (stages.length) {
        gsap.fromTo(
          stages,
          { opacity: 0, y: 50, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stages[0],
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [sectionRef, triggerStart, cardStagger]);
}
