import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const RADIUS = 19;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const scrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;

      // Flip visibility state only when crossing the 380px threshold
      const shouldBeVisible = scrollY > 380;
      if (shouldBeVisible !== isVisibleRef.current) {
        isVisibleRef.current = shouldBeVisible;
        setIsVisible(shouldBeVisible);
      }

      // Update progress ring directly in DOM (zero React re-renders)
      if (circleRef.current && totalScroll > 0) {
        const progress = Math.min(1, Math.max(0, scrollY / totalScroll));
        const offset = CIRCUMFERENCE - progress * CIRCUMFERENCE;
        circleRef.current.style.strokeDashoffset = String(offset);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { duration: 1.15 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 group flex items-center justify-center w-12 h-12 rounded-full bg-[#0A0C16]/85 hover:bg-[#0A0C16] backdrop-blur-md border border-white/12 hover:border-blue/60 text-white shadow-lg shadow-black/30 hover:shadow-[0_0_24px_rgba(61,92,255,0.45)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue cursor-pointer select-none"
          aria-label="Переместиться наверх страницы"
          title="Наверх страницы"
        >
          {/* Circular Scroll Progress Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 48 48"
          >
            {/* Background track */}
            <circle
              cx="24"
              cy="24"
              r={RADIUS}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="2"
            />
            {/* Animated progress stroke */}
            <circle
              ref={circleRef}
              cx="24"
              cy="24"
              r={RADIUS}
              fill="none"
              stroke="#3D5CFF"
              strokeWidth="2"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
              strokeLinecap="round"
              className="will-change-[stroke-dashoffset]"
            />
          </svg>

          {/* Central Arrow Icon */}
          <ArrowUp
            size={18}
            className="text-zinc-300 group-hover:text-blue-light group-hover:-translate-y-0.5 transition-all duration-200 z-10"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
