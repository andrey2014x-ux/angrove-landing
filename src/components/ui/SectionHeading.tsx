import React from 'react';

interface SectionHeadingProps {
  category?: string;
  titlePart1: string;
  titlePart2: string;
  subtitle?: string;
  align?: 'left' | 'center';
  isLight?: boolean;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  category,
  titlePart1,
  titlePart2,
  subtitle,
  align = 'left',
  isLight = false,
  as: Component = 'h2',
  className = '',
}) => {
  const alignClasses = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  const headingSizes = {
    h1: 'text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08]',
    h2: 'text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.12]',
    h3: 'text-xl sm:text-2xl lg:text-3xl tracking-tight leading-snug',
  }[Component];

  const part1Color = isLight ? 'text-text-dark' : 'text-white';
  const subtitleColor = isLight ? 'text-text-dark-muted' : 'text-slate-400';

  return (
    <div className={`flex flex-col ${alignClasses} ${className}`}>
      {category && (
        <span className="font-mono text-[11px] sm:text-xs font-bold text-accent tracking-[0.2em] uppercase mb-2 sm:mb-3">
          {category}
        </span>
      )}

      <Component className={`font-display font-black ${headingSizes}`}>
        <span className={part1Color}>{titlePart1}</span>{' '}
        <span className="text-accent-bright drop-shadow-sm">{titlePart2}</span>
      </Component>

      {subtitle && (
        <p className={`mt-3 sm:mt-4 text-sm sm:text-base max-w-2xl leading-relaxed ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
