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

  // Archival washi tape styling (Strict editorial palette)
  const renderTape = () => {
    switch (memory.tapeStyle) {
      case 'vellum':
        return (
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-white/70 border-y border-[#F2EFEB] shadow-sm backdrop-blur-sm pointer-events-none z-20 flex items-center justify-center"
            style={{ transform: 'translateX(-50%) rotate(2deg)' }}
          >
            <span className="font-serif text-[9px] tracking-wider text-[#71717A] italic">
              {memory.stampText || 'ARCHIVE'}
            </span>
          </div>
        );
      case 'kraft':
      default:
        return (
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#F2EFEB] border-y border-[#71717A]/30 shadow-sm backdrop-blur-[2px] pointer-events-none z-20 flex items-center justify-center"
            style={{ transform: 'translateX(-50%) rotate(-1deg)' }}
          >
            <span className="font-sans text-[8px] tracking-widest text-[#303030] uppercase font-bold">
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
      className={`relative group bg-[#FFFFFF] text-[#171717] rounded-xl p-3.5 sm:p-4 pb-4 sm:pb-5 cursor-pointer transition-all duration-300 ease-out select-none shadow-[0_12px_32px_-8px_rgba(23,23,23,0.08),0_4px_12px_rgba(23,23,23,0.04)] hover:shadow-[0_20px_44px_-6px_rgba(23,23,23,0.12),0_8px_20px_rgba(142,22,36,0.08)] border border-[#F2EFEB] ${sizeClasses} ${className}`}
      style={{
        transform,
      }}
    >
      {/* Top Washi Tape / Archival Mount */}
      {renderTape()}

      {/* Subtle Corner Photo Mounts */}
      <div className="absolute top-3.5 left-3.5 w-3 h-3 border-t-2 border-l-2 border-[#303030]/25 pointer-events-none z-10" />
      <div className="absolute top-3.5 right-3.5 w-3 h-3 border-t-2 border-r-2 border-[#303030]/25 pointer-events-none z-10" />

      {/* Photo Frame Window */}
      <div className={`relative w-full ${aspectClasses} bg-[#171717] rounded-sm overflow-hidden shadow-inner mb-3`}>
        {imageFailed ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#F2EFEB] text-[#71717A] text-center select-none border border-[#F2EFEB]">
            <Sparkles className="w-6 h-6 mb-2 text-[#8E1624] animate-pulse" />
            <span className="font-serif text-sm sm:text-base text-[#171717] tracking-wide mb-1 px-2 line-clamp-2">
              {memory.title}
            </span>
            <span className="font-sans text-[9px] uppercase tracking-widest text-[#71717A]">
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

        {/* Vintage Film Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />

        {/* Location Badge (Bottom-Left) */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] font-sans border border-white/10 shadow-sm">
          <MapPin className="w-2.5 h-2.5 text-[#8E1624]" />
          <span className="tracking-wide">{memory.location}</span>
        </div>

        {/* Date Tag Badge (Top-Right) */}
        {memory.dateTag && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm text-white text-[9px] font-sans tracking-wider uppercase border border-white/10">
            {memory.dateTag}
          </div>
        )}

        {/* Hover Cue Overlay */}
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-[#171717] font-serif text-xs shadow-lg border border-[#F2EFEB] transform -translate-y-1">
            <BookOpen className="w-3.5 h-3.5 text-[#8E1624]" />
            <span>Open & Read Secret Note</span>
          </span>
        </div>
      </div>

      {/* Archival Label & Handwritten Caption */}
      <div className="px-1 text-center">
        <h4 className="font-serif text-base sm:text-lg font-medium text-[#171717] leading-snug tracking-tight">
          {memory.title}
        </h4>
        <p className="font-handwriting text-base sm:text-lg text-[#8E1624] mt-1 leading-snug line-clamp-2">
          {memory.caption}
        </p>
        <div className="mt-2 pt-1.5 border-t border-[#171717]/10 flex items-center justify-between text-[10px] text-[#71717A] font-sans tracking-wider">
          <span className="uppercase">{memory.date}</span>
          <span className="inline-flex items-center gap-1 text-[#8E1624] font-medium group-hover:underline">
            <Sparkles className="w-2.5 h-2.5 text-[#8E1624]" />
            Flip Note
          </span>
        </div>
      </div>
    </div>
  );
};
