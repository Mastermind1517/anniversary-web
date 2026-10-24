import React, { useState } from 'react';
import { sound } from '../audio/SoundEngine';

interface WaxSealProps {
  monogram: string;
  isBroken: boolean;
  onBreak: () => void;
}

export const WaxSeal: React.FC<WaxSealProps> = ({ monogram, isBroken, onBreak }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBroken) return;
    sound.playWaxCrack();
    onBreak();
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label="Break wax seal to open anniversary letter"
      className={`relative w-20 h-20 sm:w-24 sm:h-24 cursor-pointer select-none transition-transform duration-500 z-30 ${
        isHovered && !isBroken ? 'scale-105' : 'scale-100'
      }`}
    >
      {/* Outer Crimson Glow on Hover */}
      <div
        className={`absolute -inset-3 rounded-full bg-[#8E1624]/30 blur-md transition-opacity duration-500 pointer-events-none ${
          isHovered && !isBroken ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* SVG Wax Seal */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-2xl transition-all duration-700 ${
          isBroken ? 'opacity-0 scale-125 pointer-events-none' : 'opacity-100'
        }`}
      >
        <defs>
          <radialGradient id="waxGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#A81E2E" />
            <stop offset="40%" stopColor="#8E1624" />
            <stop offset="80%" stopColor="#4F0D15" />
            <stop offset="100%" stopColor="#171717" />
          </radialGradient>

          <filter id="waxRoughness" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          <linearGradient id="intaglioStamp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#F2EFEB" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Organic Wax Rim with subtle drip contours */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="url(#waxGrad)"
          filter="url(#waxRoughness)"
        />

        {/* Inner Stamped Rim Depression */}
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke="#4F0D15"
          strokeWidth="2.5"
          opacity="0.85"
        />
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="url(#intaglioStamp)"
          strokeWidth="0.8"
          opacity="0.35"
          strokeDasharray="2 3"
        />

        {/* Embossed Intaglio Monogram */}
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fill="url(#intaglioStamp)"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="18"
          fontWeight="600"
          letterSpacing="1.5"
          style={{
            filter: 'drop-shadow(0px 1px 2px rgba(15, 10, 12, 0.9))',
          }}
        >
          {monogram}
        </text>

        {/* Delicate Heart Icon Below Monogram */}
        <path
          d="M50 67 C48 64 43 64 43 68 C43 71 50 75 50 75 C50 75 57 71 57 68 C57 64 52 64 50 67 Z"
          fill="url(#intaglioStamp)"
          opacity="0.8"
        />
      </svg>

      {/* Wax Fracture Shards Overlay when Broken */}
      {isBroken && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#8E1624] rounded-tl-full animate-out fade-out zoom-out duration-700 transform -translate-x-4 -translate-y-4 rotate-[-15deg] opacity-0" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#8E1624] rounded-tr-full animate-out fade-out zoom-out duration-700 transform translate-x-4 -translate-y-4 rotate-[15deg] opacity-0" />
          <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-[#8E1624] rounded-b-full animate-out fade-out zoom-out duration-700 transform translate-y-6 rotate-[5deg] opacity-0" />
        </div>
      )}
    </div>
  );
};
