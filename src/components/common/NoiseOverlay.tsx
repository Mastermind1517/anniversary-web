import React from 'react';

export const NoiseOverlay: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 noise-overlay mix-blend-soft-light opacity-30 select-none"
      aria-hidden="true"
    />
  );
};
