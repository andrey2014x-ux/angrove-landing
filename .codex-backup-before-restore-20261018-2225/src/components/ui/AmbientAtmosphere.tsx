import React, { useEffect, useRef } from 'react';

export const AmbientAtmosphere: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Soft interactive ambient cursor light follower
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${e.clientX - 200}px, ${
          e.clientY - 200
        }px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Interactive soft ambient cursor light (subtle, non-distracting) */}
      <div
        ref={glowRef}
        className="w-[400px] h-[400px] rounded-full absolute top-0 left-0 transition-transform duration-300 ease-out opacity-20 filter blur-[100px] will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(61,92,255,0.2) 0%, rgba(97,125,255,0.05) 50%, transparent 75%)',
        }}
      />
    </div>
  );
};
