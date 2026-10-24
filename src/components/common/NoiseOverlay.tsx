import React from 'react';

/**
 * Lightweight, subtle cotton paper grain texture overlay.
 * Uses local SVG fractal noise with multiply blend mode.
 */
export const NoiseOverlay: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 noise-overlay mix-blend-multiply opacity-25 select-none"
      aria-hidden="true"
    />
  );
};
