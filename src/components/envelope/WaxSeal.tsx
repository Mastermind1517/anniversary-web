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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as unknown as React.MouseEvent);
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label="Break wax seal to open anniversary letter"
      className={`relative w-20 h-20 sm:w-24 sm:h-24 cursor-pointer select-none transition-all duration-500 z-30 outline-none ${
        isHovered && !isBroken ? 'scale-105' : 'scale-100'
      }`}
    >
      {/* SVG Wax Seal — Organic Matte Crimson with Blind Intaglio Deboss */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full transition-all duration-700 ${
          isBroken ? 'opacity-0 scale-125 pointer-events-none' : 'opacity-100'
        } ${
          isHovered
            ? 'drop-shadow-[0_10px_22px_rgba(15,10,12,0.65)]'
            : 'drop-shadow-[0_4px_12px_rgba(15,10,12,0.5)]'
        }`}
      >
        <defs>
          {/* Natural Matte Wax Body Gradient (Soft directional lighting) */}
          <radialGradient id="matteWaxBody" cx="36%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#A81E2E" />
            <stop offset="30%" stopColor="#8E1624" />
            <stop offset="72%" stopColor="#5B1019" />
            <stop offset="100%" stopColor="#38080E" />
          </radialGradient>

          {/* Stamped Die Bed Gradient (Recessed depression) */}
          <radialGradient id="stampedWell" cx="42%" cy="38%" r="60%">
            <stop offset="0%" stopColor="#7E1420" />
            <stop offset="70%" stopColor="#500D15" />
            <stop offset="100%" stopColor="#35070D" />
          </radialGradient>

          {/* Subtle Organic Wax Surface Texture */}
          <filter id="waxMatteTexture" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Hand-Poured Organic Outer Rim with Natural Asymmetric Lobes */}
        <path
          d="M 50 4.5 C 64 3.5, 75 8, 83 16.5 C 91 25, 96 36, 96.5 48 C 97 61, 91.5 73, 83.5 82 C 75.5 91, 63 96, 50 96.5 C 37 97, 24 92, 16 83.5 C 8 75, 3.5 62, 4 50 C 4.5 38, 9 26, 17 17.5 C 25 9, 36 5.5, 50 4.5 Z"
          fill="url(#matteWaxBody)"
          filter="url(#waxMatteTexture)"
        />

        {/* Subtle Matte Wax Lip Soft Rim Catchlight (Top) & Shadow (Bottom) */}
        <path
          d="M 22 22 C 30 14, 40 10, 52 10 C 64 10, 74 14, 82 22"
          fill="none"
          stroke="#A81E2E"
          strokeWidth="1.2"
          opacity="0.35"
          strokeLinecap="round"
        />
        <path
          d="M 20 78 C 30 86, 42 90, 54 90 C 66 90, 78 86, 84 78"
          fill="none"
          stroke="#2A050A"
          strokeWidth="1.8"
          opacity="0.6"
          strokeLinecap="round"
        />

        {/* Stamped Die Circular Depression (Where brass seal pressed into hot wax) */}
        <circle
          cx="50"
          cy="50"
          r="33"
          fill="url(#stampedWell)"
        />

        {/* Die Rim Cast Shadow (Top-Left) and Reflected Light (Bottom-Right) */}
        <circle
          cx="50"
          cy="50"
          r="33"
          fill="none"
          stroke="#2B050B"
          strokeWidth="2.2"
          opacity="0.8"
        />
        <circle
          cx="50.5"
          cy="50.5"
          r="32"
          fill="none"
          stroke="#A81E2E"
          strokeWidth="0.8"
          opacity="0.25"
        />

        {/* Inner Concentric Beaded / Scored Seal Ring */}
        <circle
          cx="50"
          cy="50"
          r="29"
          fill="none"
          stroke="#38080E"
          strokeWidth="1"
          opacity="0.6"
          strokeDasharray="2.5 2"
        />

        {/* Intaglio Debossed Monogram (Recessed into wax with groove shadow & subtle catchlight) */}
        <g style={{ filter: 'drop-shadow(0px -1px 0.5px rgba(20, 4, 7, 0.85)) drop-shadow(0px 1px 0.5px rgba(168, 30, 46, 0.3))' }}>
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fill="#38080E"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontSize="18"
            fontWeight="600"
            letterSpacing="2"
          >
            {monogram}
          </text>

          {/* Blind-Debossed Heart Motif Below Monogram */}
          <path
            d="M 50 66 C 48 63, 44 63, 44 66.5 C 44 69.5, 50 73, 50 73 C 50 73, 56 69.5, 56 66.5 C 56 63, 52 63, 50 66 Z"
            fill="#38080E"
            opacity="0.9"
          />
        </g>
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
