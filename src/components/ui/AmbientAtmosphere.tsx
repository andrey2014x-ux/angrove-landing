import React from 'react';

/**
 * AmbientAtmosphere provides a subtle, calm gradient lighting at the edges of the viewport
 * without distracting mouse-following glows or AI-style neon blobs.
 */
export const AmbientAtmosphere: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Very soft stationary radial depth at the top */}
      <div
        className="w-full h-[400px] absolute top-0 left-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(61, 92, 255, 0.04) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};
