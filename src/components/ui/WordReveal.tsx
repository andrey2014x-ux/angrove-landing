import React, { useRef, useEffect } from 'react';
import { gsap } from '../../lib/motion';

interface WordRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  delay?: number;
  stagger?: number;
  highlightWords?: { [key: string]: string }; // word -> custom class (e.g. font-serif italic text-blue)
}

/**
 * WordReveal: Splices text into word tokens, each masked inside an overflow-hidden wrapper.
 * On scroll entry into viewport, words smoothly glide up from below with ease and stagger.
 */
export const WordReveal: React.FC<WordRevealProps> = ({
  text,
  className = '',
  wordClassName = '',
  as: Component = 'h2',
  delay = 0,
  stagger = 0.045,
  highlightWords = {},
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const words = containerRef.current.querySelectorAll('.word-token');
    if (!words.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          y: '110%',
          opacity: 0,
          rotateZ: 2,
        },
        {
          y: '0%',
          opacity: 1,
          rotateZ: 0,
          duration: 0.75,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [delay, stagger]);

  const tokens = text.split(' ');

  return (
    // @ts-expect-error dynamic component type
    <Component ref={containerRef} className={`block ${className}`}>
      {tokens.map((token, idx) => {
        const cleanToken = token.toLowerCase().replace(/[^a-zа-я0-9]/gi, '');
        const customClass = highlightWords[token] || highlightWords[cleanToken];

        return (
          <span
            key={idx}
            className="inline-block overflow-hidden align-top mr-[0.28em] pb-[0.08em]"
          >
            <span
              className={`word-token inline-block transform-gpu will-change-transform ${customClass || wordClassName}`}
            >
              {token}
            </span>
          </span>
        );
      })}
    </Component>
  );
};
