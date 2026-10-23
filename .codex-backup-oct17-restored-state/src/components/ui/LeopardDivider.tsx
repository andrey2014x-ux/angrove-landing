import React from 'react';

interface LeopardDividerProps {
  className?: string;
  height?: number;
}

export const LeopardDivider: React.FC<LeopardDividerProps> = ({ 
  className = '', 
  height = 10 
}) => {
  return (
    <div 
      className={`w-full overflow-hidden select-none relative ${className}`} 
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <svg 
        className="w-full h-full" 
        preserveAspectRatio="none"
        viewBox="0 0 800 20" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="leopardPattern" width="120" height="20" patternUnits="userSpaceOnUse">
            {/* Background base #A8B4D6 */}
            <rect width="120" height="20" fill="#A8B4D6" />

            {/* Rosettes and spots in #262A36 and #7686B8 */}
            {/* Spot 1: Rosette */}
            <path d="M12 4C14 2 18 2 20 4C22 7 21 11 18 12C15 13 11 11 10 8C9.5 6.5 10.5 4.5 12 4Z" fill="#7686B8" />
            <path d="M11 3C13 1.5 17 1 19 3C18 4 15 4 13 5C12 5.5 11 4.5 11 3Z" fill="#262A36" />
            <path d="M19 6C21 8 20 11 18 13C16 11 18 8 19 6Z" fill="#262A36" />
            <path d="M9 7C10 9 11 12 13 13C11 12 9 10 9 7Z" fill="#262A36" />

            {/* Spot 2: Solid small spot */}
            <ellipse cx="38" cy="14" rx="4" ry="2.5" fill="#262A36" />
            
            {/* Spot 3: Rosette */}
            <path d="M52 5C55 3 60 4 62 7C63 10 61 14 57 15C53 15 50 12 50 8C50 6 51 5 52 5Z" fill="#7686B8" />
            <path d="M51 4C54 2 59 3 61 5C59 6 56 6 53 6C52 6 51 5 51 4Z" fill="#262A36" />
            <path d="M62 8C64 11 62 14 59 15C59 13 61 10 62 8Z" fill="#262A36" />
            <path d="M49 8C50 11 52 14 55 15C52 13 50 11 49 8Z" fill="#262A36" />

            {/* Spot 4: Solid accent spot */}
            <ellipse cx="80" cy="6" rx="5" ry="3" fill="#262A36" transform="rotate(-15 80 6)" />

            {/* Spot 5: Rosette */}
            <path d="M95 6C98 4 103 4 105 7C107 10 105 14 102 15C98 15 95 12 94 9C93 7 94 6 95 6Z" fill="#7686B8" />
            <path d="M94 5C97 3 101 3 104 5C102 6 99 6 96 6C95 6 94 5 94 5Z" fill="#262A36" />
            <path d="M105 8C107 11 105 14 103 15C103 13 104 10 105 8Z" fill="#262A36" />
            <path d="M93 9C94 12 96 14 99 15C96 13 94 11 93 9Z" fill="#262A36" />

            {/* Tiny accent dots */}
            <circle cx="28" cy="5" r="1.5" fill="#262A36" />
            <circle cx="70" cy="15" r="1.8" fill="#7686B8" />
            <circle cx="112" cy="11" r="1.5" fill="#262A36" />
          </pattern>
        </defs>
        <rect width="800" height="20" fill="url(#leopardPattern)" />
      </svg>
    </div>
  );
};
