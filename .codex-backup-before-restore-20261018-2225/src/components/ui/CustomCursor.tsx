import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isOnInput, setIsOnInput] = useState<boolean>(false);

  useEffect(() => {
    // Only activate for desktop fine pointer
    const isFinePointer = window.matchMedia('(pointer: fine) and (min-width: 768px)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || isReducedMotion) return;

    setIsVisible(true);

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (dotRef.current) {
        gsap.to(dotRef.current, {
          x: mouse.x,
          y: mouse.y,
          duration: 0.08,
          ease: 'power2.out',
        });
      }

      // Check hover target
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInput = !!target.closest('input, textarea, select');
      setIsOnInput(isInput);

      const downloadTrigger = target.closest('[data-cursor="download"], a[href="#guide"], a[download]');
      const photoTrigger = target.closest('[data-cursor="photo"], .duotone-container');
      const interactiveTrigger = target.closest('a, button, [role="button"], input[type="checkbox"]');

      if (downloadTrigger) {
        setCursorText('Скачать');
        setIsHovered(true);
      } else if (photoTrigger) {
        setCursorText('Смотреть');
        setIsHovered(true);
      } else if (interactiveTrigger && !isInput) {
        setCursorText('');
        setIsHovered(true);
      } else {
        setCursorText('');
        setIsHovered(false);
      }
    };

    // Trailing ring with smooth lerp on ticker
    const updateRing = () => {
      pos.x += (mouse.x - pos.x) * 0.18;
      pos.y += (mouse.y - pos.y) * 0.18;

      if (ringRef.current) {
        gsap.set(ringRef.current, {
          x: pos.x,
          y: pos.y,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    gsap.ticker.add(updateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(updateRing);
    };
  }, []);

  if (!isVisible || isOnInput) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] select-none overflow-hidden" aria-hidden="true">
      {/* Center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent-bright mix-blend-difference transition-opacity duration-150"
      />

      {/* Trailing Ring / Pill with inertia */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 mix-blend-difference flex items-center justify-center transition-all duration-300 ${
          cursorText
            ? 'px-3 py-1.5 w-auto h-auto bg-white/20 backdrop-blur-xs'
            : isHovered
            ? 'w-12 h-12 bg-white/10 scale-125'
            : 'w-7 h-7 bg-transparent'
        }`}
      >
        {cursorText && (
          <span
            ref={textRef}
            className="text-[10px] font-mono font-bold tracking-wider uppercase text-white whitespace-nowrap px-1"
          >
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
