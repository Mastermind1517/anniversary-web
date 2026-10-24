import React from 'react';

/**
 * Editorial studio background with subtle natural paper luminance.
 * Dominated by Cotton Paper (#F9F8F5) with restrained Raw Linen (#F2EFEB) depth.
 * Zero gold or purple; subtle and tactile.
 */
export const AmbientCanvas: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#F9F8F5]">
      {/* Soft overhead keylight for warm editorial paper luminance */}
      <div 
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] max-w-[140vw] h-[750px] opacity-75 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 30%, rgba(255, 255, 255, 0.85) 0%, rgba(242, 239, 235, 0.5) 60%, transparent 90%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Subtle whisper of raw linen depth toward bottom */}
      <div 
        className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[1100px] max-w-[120vw] h-[550px] opacity-50 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 70%, rgba(242, 239, 235, 0.7) 0%, transparent 85%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Understated perimeter vignette for focus */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, transparent 55%, rgba(48, 48, 48, 0.025) 100%)',
        }}
      />
    </div>
  );
};
