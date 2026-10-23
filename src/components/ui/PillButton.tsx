import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface PillButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  magnetic?: boolean;
}

export const PillButton: React.FC<PillButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  target,
  rel,
  type = 'button',
  disabled = false,
  magnetic = true,
}) => {
  const btnRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const [canMagnetic, setCanMagnetic] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine) and (min-width: 768px)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCanMagnetic(isFinePointer && !isReducedMotion && magnetic);
  }, [magnetic]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canMagnetic || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    // Magnetic pull dampening factor (up to 12px)
    gsap.to(btnRef.current, {
      x: x * 0.25,
      y: y * 0.25,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!canMagnetic || !btnRef.current) return;
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  const baseClasses = `
    group relative inline-flex items-center justify-center font-bold tracking-tight rounded-full
    transition-shadow duration-300 select-none overflow-hidden active:scale-95 disabled:opacity-50
    disabled:pointer-events-none cursor-pointer will-change-transform
  `;

  const sizeClasses = {
    sm: 'text-xs px-4 py-2 gap-1.5',
    md: 'text-sm sm:text-base px-6 py-3 sm:py-3.5 gap-2',
    lg: 'text-base sm:text-lg px-8 py-4 sm:py-4.5 gap-2.5 shadow-md',
  }[size];

  const variantStyles = {
    primary: {
      btn: 'bg-accent text-white border border-accent-bright/40 shadow-glow-accent hover:shadow-glow-accent-lg',
      wave: 'bg-gradient-to-t from-accent-bright to-[#4C6BFF]',
    },
    secondary: {
      btn: 'bg-surface text-white border border-line hover:border-accent hover:text-white hover:shadow-card-soft',
      wave: 'bg-gradient-to-t from-accent/30 to-surface',
    },
    outline: {
      btn: 'bg-transparent text-white border border-line hover:border-accent',
      wave: 'bg-accent/20',
    },
    dark: {
      btn: 'bg-text-dark text-white border border-text-dark hover:shadow-glow-accent',
      wave: 'bg-accent',
    },
  }[variant];

  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantStyles.btn} ${className}`;

  const innerContent = (
    <>
      {/* Wave Fill from bottom to top on hover */}
      <span
        className={`absolute inset-0 w-full h-full ${variantStyles.wave} translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none z-0`}
        aria-hidden="true"
      />
      {/* Content wrapper */}
      <span className="relative z-10 inline-flex items-center gap-2 transition-transform duration-300 group-hover:scale-[1.02]">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={btnRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={combinedClasses}
        target={target}
        rel={rel}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={combinedClasses}
      disabled={disabled}
    >
      {innerContent}
    </button>
  );
};
