import React, { useState } from 'react';

interface DuotonePhotoProps {
  src?: string;
  alt?: string;
  className?: string;
  aspectRatio?: string;
}

export const DuotonePhoto: React.FC<DuotonePhotoProps> = ({
  src = '/andrey.jpg',
  alt = 'Андрей (_angrove_) — автоматизация бизнеса',
  className = '',
  aspectRatio = 'aspect-[4/5]',
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-card-lg border border-accent/40 shadow-glow-accent bg-surface ${aspectRatio} ${className}`}>
      {!hasError ? (
        <div className="relative w-full h-full">
          {/* Base Grayscale image */}
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover object-top filter grayscale contrast-125"
            loading="lazy"
          />
          {/* Duotone Blue Tint Gradient Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-color opacity-90"
            style={{
              background: 'linear-gradient(135deg, #151A33 0%, #3D5CFF 70%, #BFD4FF 100%)'
            }}
          />
          {/* Subtle Contrast & Vignette Multiply Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40"
            style={{
              background: 'radial-gradient(circle at 50% 30%, transparent 40%, #0A0E1C 90%)'
            }}
          />
          {/* Thin inner border */}
          <div className="absolute inset-0 rounded-card-lg border border-accent-bright/30 pointer-events-none" />
        </div>
      ) : (
        /* Stylized Placeholder when photo is absent */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-surface to-ink">
          <div className="w-20 h-20 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent-bright font-display text-3xl font-extrabold mb-4 shadow-glow-accent">
            _a_
          </div>
          <div className="font-display font-black text-xl text-white mb-1">
            АНДРЕЙ
          </div>
          <div className="font-mono text-xs text-accent-bright tracking-wider uppercase">
            _angrove_ · IT-ИНЖЕНЕР
          </div>
        </div>
      )}
    </div>
  );
};
