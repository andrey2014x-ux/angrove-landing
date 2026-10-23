import React, { useRef, useState, useEffect } from 'react';

interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export const CardSpotlight: React.FC<CardSpotlightProps> = ({
  children,
  className = '',
  maxTilt = 6,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState(false);
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    // Only enable 3D tilt on desktop with fine pointer
    const isFinePointer = window.matchMedia('(pointer: fine) and (min-width: 768px)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCanTilt(isFinePointer && !isReducedMotion);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`,
      '--mouse-x': `${x}px`,
      '--mouse-y': `${y}px`,
    } as React.CSSProperties);
  };

  const handleMouseEnter = () => {
    if (canTilt) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!canTilt) return;
    setIsHovered(false);
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`relative group overflow-hidden ${
        canTilt ? 'will-change-transform' : ''
      } ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Radial Highlight */}
      {canTilt && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle 350px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(97, 125, 255, 0.12), transparent 80%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Subtle Specular Glare */}
      {canTilt && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay transition-opacity duration-300 z-20"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />
      )}

      {children}
    </div>
  );
};
