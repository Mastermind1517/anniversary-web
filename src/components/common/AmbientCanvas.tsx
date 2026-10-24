import React from 'react';

/**
 * Restrained, cinematic studio lighting background.
 * Soft overhead keylight with warm candlelight gradient falloff.
 * No excessive glows, zero random particles, zero distraction.
 */
export const AmbientCanvas: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#0a080d]">
      {/* Soft directional overhead key light focused toward center-top */}
      <div 
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] max-w-[140vw] h-[750px] opacity-60 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 30%, rgba(212, 175, 55, 0.09) 0%, rgba(139, 30, 43, 0.05) 50%, transparent 80%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Subtle warm desk vignette along the lower half */}
      <div 
        className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[1000px] max-w-[120vw] h-[500px] opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 70%, rgba(40, 20, 32, 0.4) 0%, transparent 80%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Subtle perimeter film vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, transparent 45%, rgba(6, 4, 8, 0.75) 100%)',
        }}
      />
    </div>
  );
};
