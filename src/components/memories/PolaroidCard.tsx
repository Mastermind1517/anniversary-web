import React, { useRef, useState } from 'react';
import type { MemoryItem } from '../../types';
import { sound } from '../audio/SoundEngine';
import { MapPin, Sparkles, BookOpen } from 'lucide-react';

interface PolaroidCardProps {
  memory: MemoryItem;
  onClick: () => void;
  index: number;
  className?: string;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({ memory, onClick, className = '' }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState(`rotate(${memory.rotation}deg)`);
  const [isHovered, setIsHovered] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / rect.height) * 12;
    const rotateY = (x / rect.width) * 12;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform(`rotate(${memory.rotation}deg) scale3d(1, 1, 1)`);
  };

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

  // Dimensions based on size tier
  const sizeClasses = {
    hero: 'w-full max-w-[420px] sm:max-w-[500px] md:max-w-[540px]',
    featured: 'w-full max-w-[340px] sm:max-w-[390px] md:max-w-[420px]',
    standard: 'w-full max-w-[290px] sm:max-w-[330px] md:max-w-[350px]',
    compact: 'w-full max-w-[260px] sm:max-w-[290px] md:max-w-[310px]',
  }[memory.size || 'standard'];

  // Image height / aspect ratio
  const aspectClasses = {
    landscape: 'h-52 sm:h-64 md:h-72 aspect-[4/3]',
    portrait: 'h-64 sm:h-76 md:h-84 aspect-[3/4]',
    square: 'h-56 sm:h-64 md:h-68 aspect-square',
    panoramic: 'h-48 sm:h-56 md:h-64 aspect-[16/9]',
  }[memory.aspectRatio || 'portrait'];

  // Washi tape styling
  const renderTape = () => {
    switch (memory.tapeStyle) {
      case 'kraft':
        return (
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#b88c56]/50 border-y border-[#8e6533]/40 shadow-sm backdrop-blur-[2px] pointer-events-none z-20 flex items-center justify-center"
            style={{ transform: 'translateX(-50%) rotate(-1.5deg)' }}
          >
            <span className="font-sans text-[8px] tracking-widest text-[#3d240d]/70 uppercase font-bold">
              {memory.stampText || 'MEMOIRE'}
            </span>
          </div>
        );
      case 'vellum':
        return (
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-white/40 border-y border-white/60 shadow-sm backdrop-blur-sm pointer-events-none z-20 flex items-center justify-center"
            style={{ transform: 'translateX(-50%) rotate(2deg)' }}
          >
            <span className="font-serif text-[9px] tracking-wider text-[#2b231e]/70 italic">
              {memory.stampText || 'ARCHIVE'}
            </span>
          </div>
        );
      case 'gold':
      default:
        return (
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-gradient-to-r from-[#d4af37]/35 via-[#f3df91]/50 to-[#d4af37]/35 border-y border-[#d4af37]/50 shadow-sm backdrop-blur-[2px] pointer-events-none z-20 flex items-center justify-center"
            style={{ transform: 'translateX(-50%) rotate(-1deg)' }}
          >
            <span className="font-sans text-[8px] tracking-widest text-[#5a430d]/80 uppercase font-semibold">
              {memory.stampText || 'KEEPSAKE'}
            </span>
          </div>
        );
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Open memory: ${memory.title}, from ${memory.location}, dated ${memory.date}`}
      className={`relative group bg-[#fbf8f2] text-[#2b231e] rounded-xl p-3.5 sm:p-4 pb-4 sm:pb-5 cursor-pointer transition-all duration-300 ease-out select-none shadow-[0_16px_36px_-8px_rgba(0,0,0,0.55),0_6px_16px_rgba(0,0,0,0.35)] hover:shadow-[0_24px_48px_-6px_rgba(212,175,55,0.22),0_12px_24px_rgba(0,0,0,0.45)] border border-[#e8dfcf] ${sizeClasses} ${className}`}
      style={{
        transform,
      }}
    >
      {/* Top Washi Tape / Archival Mount */}
      {renderTape()}

      {/* Brass Corner Photo Mounts (Vintage Detail) */}
      <div className="absolute top-3.5 left-3.5 w-3 h-3 border-t-2 border-l-2 border-[#b38f2b]/40 pointer-events-none z-10" />
      <div className="absolute top-3.5 right-3.5 w-3 h-3 border-t-2 border-r-2 border-[#b38f2b]/40 pointer-events-none z-10" />

      {/* Photo Frame Window */}
      <div className={`relative w-full ${aspectClasses} bg-[#161214] rounded-sm overflow-hidden shadow-inner mb-3`}>
        {imageFailed ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#1d161f] via-[#281b25] to-[#140e15] text-[#d4af37]/80 text-center select-none border border-[#d4af37]/20">
            <Sparkles className="w-6 h-6 mb-2 text-[#d4af37]/70 animate-pulse" />
            <span className="font-serif text-sm sm:text-base text-[#fbf8f2] tracking-wide mb-1 px-2 line-clamp-2">
              {memory.title}
            </span>
            <span className="font-sans text-[9px] uppercase tracking-widest text-[#d4af37]/60">
              Archival Keepsake
            </span>
          </div>
        ) : (
          <img
            src={memory.imageUrl}
            alt={memory.title}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Vintage Film Grain / Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />

        {/* Location Badge (Bottom-Left) */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] font-sans border border-white/10 shadow-sm">
          <MapPin className="w-2.5 h-2.5 text-[#d4af37]" />
          <span className="tracking-wide">{memory.location}</span>
        </div>

        {/* Date Tag Badge (Top-Right) */}
        {memory.dateTag && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm text-[#fbf8f2] text-[9px] font-sans tracking-wider uppercase border border-white/10">
            {memory.dateTag}
          </div>
        )}

        {/* Hover Cue Overlay */}
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fbf8f2]/95 text-[#2b231e] font-serif text-xs shadow-lg transform -translate-y-1">
            <BookOpen className="w-3.5 h-3.5 text-[#8b1e2b]" />
            <span>Open & Read Secret Note</span>
          </span>
        </div>
      </div>

      {/* Archival Label & Handwritten Caption */}
      <div className="px-1 text-center">
        <h4 className="font-serif text-base sm:text-lg font-medium text-[#231b14] leading-snug tracking-tight">
          {memory.title}
        </h4>
        <p className="font-handwriting text-base sm:text-lg text-[#8b1e2b] mt-1 leading-snug line-clamp-2">
          {memory.caption}
        </p>
        <div className="mt-2 pt-1.5 border-t border-[#2b231e]/10 flex items-center justify-between text-[10px] text-neutral-500 font-sans tracking-wider">
          <span className="uppercase">{memory.date}</span>
          <span className="inline-flex items-center gap-1 text-[#8b1e2b] font-medium group-hover:underline">
            <Sparkles className="w-2.5 h-2.5 text-[#d4af37]" />
            Flip Note
          </span>
        </div>
      </div>
    </div>
  );
};
