import React, { useRef, useState } from 'react';
import type { MemoryItem } from '../../types';
import { sound } from '../audio/SoundEngine';
import { MapPin, Sparkles, ArrowUpRight } from 'lucide-react';

interface PolaroidCardProps {
  memory: MemoryItem;
  onClick: () => void;
  index: number;
  className?: string;
  cardRefCallback?: (el: HTMLDivElement | null) => void;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  memory,
  onClick,
  index,
  className = '',
  cardRefCallback,
}) => {
  const localRef = useRef<HTMLDivElement | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  const handleClick = () => {
    sound.playPaperRustle();
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Curated maximum dimensions based on editorial tier
  const sizeClasses = {
    hero: 'w-full max-w-[540px]',
    featured: 'w-full max-w-[440px]',
    standard: 'w-full max-w-[380px]',
    compact: 'w-full max-w-[320px]',
  }[memory.size || 'standard'];

  // Reserved aspect ratios to guarantee 0 cumulative layout shift (CLS)
  const aspectClass = {
    landscape: 'aspect-[16/10]',
    portrait: 'aspect-[4/5]',
    square: 'aspect-square',
    panoramic: 'aspect-[16/9]',
  }[memory.aspectRatio || 'portrait'];

  const plateNumber = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={(el) => {
        localRef.current = el;
        cardRefCallback?.(el);
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open archival plate ${plateNumber}: ${memory.title}, ${memory.location}, ${memory.date}`}
      className={`group relative bg-[#FFFFFF] rounded-sm p-3.5 sm:p-4.5 pb-4.5 sm:pb-5.5 border border-[#171717]/10 transition-all duration-500 ease-out select-none cursor-pointer shadow-[0_4px_20px_-4px_rgba(23,23,23,0.06),0_1px_4px_rgba(23,23,23,0.03)] hover:shadow-[0_16px_36px_-6px_rgba(23,23,23,0.12),0_4px_12px_rgba(142,22,36,0.05)] hover:-translate-y-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]/60 ${sizeClasses} ${className}`}
    >
      {/* Archival Catalog Header */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#171717]/8 text-[#71717A]">
        <span className="font-sans text-[10px] uppercase tracking-[0.26em] font-medium text-[#71717A] group-hover:text-[#171717] transition-colors">
          Plate {plateNumber}
        </span>
        <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#8E1624] font-medium">
          {memory.dateTag || memory.date}
        </span>
      </div>

      {/* Editorial Photograph Display Window with Reserved Aspect Ratio */}
      <div className={`relative w-full ${aspectClass} bg-[#F2EFEB] rounded-[2px] overflow-hidden border border-[#171717]/8 mb-3.5`}>
        {imageFailed ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 bg-[#F9F8F5] text-[#71717A] text-center select-none">
            <Sparkles className="w-5 h-5 mb-2 text-[#8E1624] opacity-80" />
            <span className="font-serif text-sm text-[#171717] tracking-wide mb-1 px-2 line-clamp-2">
              {memory.title}
            </span>
            <span className="font-sans text-[9px] uppercase tracking-widest text-[#71717A]">
              Archival Plate {plateNumber}
            </span>
          </div>
        ) : (
          <img
            src={memory.imageUrl}
            alt={memory.title}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}

        {/* Subtle Dark Bottom Fade for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none" />

        {/* Location Stamp (Lower Left) */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-black/60 backdrop-blur-md text-white text-[10px] font-sans border border-white/10 shadow-sm pointer-events-none">
          <MapPin className="w-2.5 h-2.5 text-[#8E1624]" />
          <span className="tracking-wide font-light">{memory.location}</span>
        </div>

        {/* Hover Cue: Discreet Editorial Inspection Indicator */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-white/95 text-[#171717] font-sans text-[10px] tracking-wider uppercase shadow-md border border-[#F2EFEB]">
            <span>Inspect</span>
            <ArrowUpRight className="w-2.5 h-2.5 text-[#8E1624]" />
          </span>
        </div>
      </div>

      {/* Archival Label & Intimate Caption */}
      <div className="px-0.5">
        <h3 className="font-serif text-lg sm:text-xl font-normal text-[#171717] leading-snug tracking-tight group-hover:text-[#8E1624] transition-colors">
          {memory.title}
        </h3>

        <p className="font-editorial italic text-xs sm:text-sm text-[#71717A] mt-1 leading-relaxed line-clamp-2">
          "{memory.caption}"
        </p>

        {/* Hairline Editorial Footer */}
        <div className="mt-3 pt-2 border-t border-[#171717]/8 flex items-center justify-between text-[10px] text-[#71717A] font-sans tracking-wider">
          <span className="uppercase text-[#71717A]/80">{memory.date}</span>
          <span className="inline-flex items-center gap-1 text-[#8E1624] font-medium group-hover:translate-x-0.5 transition-transform">
            <span>Read Inscription</span>
            <ArrowUpRight className="w-3 h-3 text-[#8E1624]" />
          </span>
        </div>
      </div>
    </div>
  );
};
