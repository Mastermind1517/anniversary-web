import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { MemoryItem } from '../../types';
import { sound } from '../audio/SoundEngine';
import { getLenis } from '../../hooks/useLenis';
import {
  X,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  MapPin,
  Calendar,
  Heart,
  Sparkles,
} from 'lucide-react';

interface MemoryLightboxProps {
  memories: MemoryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const MemoryLightbox: React.FC<MemoryLightboxProps> = ({
  memories,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < memories.length;
  const memory = isOpen ? memories[currentIndex] : null;
  const isFlipped = isOpen && flippedIndex === currentIndex;

  // Lock body scroll and stop Lenis smoothly without altering window.scrollY
  useEffect(() => {
    if (!isOpen) return;

    const lenis = getLenis();
    if (lenis) {
      lenis.stop();
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      if (lenis) {
        lenis.start();
      }
    };
  }, [isOpen]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex === null) return;
    sound.playPaperRustle();
    setFlippedIndex(null);
    const nextIdx = (currentIndex - 1 + memories.length) % memories.length;
    onNavigate(nextIdx);
  }, [currentIndex, memories.length, onNavigate]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex === null) return;
    sound.playPaperRustle();
    setFlippedIndex(null);
    const nextIdx = (currentIndex + 1) % memories.length;
    onNavigate(nextIdx);
  }, [currentIndex, memories.length, onNavigate]);

  const handleFlip = useCallback(() => {
    if (currentIndex === null) return;
    sound.playPaperRustle();
    setFlippedIndex((prev) => (prev === currentIndex ? null : currentIndex));
  }, [currentIndex]);

  // Keyboard navigation: Escape to close, Arrows to paginate, Space/Enter to flip
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === ' ' || e.key === 'Enter') {
        const target = e.target as HTMLElement;
        if (target && target.tagName !== 'BUTTON') {
          e.preventDefault();
          handleFlip();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext, handleFlip]);

  if (!isOpen || !memory || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing memory: ${memory.title}`}
      className="fixed inset-0 z-[999] bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all duration-300"
      onClick={onClose}
    >
      {/* Top Bar: Progress Indicator & Close Button */}
      <div
        className="fixed top-4 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between z-[1000] pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-neutral-300 font-sans shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>
            {currentIndex + 1} of {memories.length}
          </span>
          <span className="text-white/40">•</span>
          <span className="text-[#fbf8f2] font-serif italic hidden sm:inline">
            {memory.title}
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close memory modal (Escape)"
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white hover:text-[#d4af37] transition-all cursor-pointer group shadow-lg"
        >
          <span className="text-xs font-sans tracking-wide hidden sm:inline">Close</span>
          <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div
        className="relative w-full max-w-xl perspective-1500 my-auto z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrow: Previous */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous photograph (Left Arrow)"
          className="absolute -left-3 sm:-left-14 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 hover:border-[#d4af37] transition-all shadow-2xl cursor-pointer z-30 group"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Navigation Arrow: Next */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next photograph (Right Arrow)"
          className="absolute -right-3 sm:-right-14 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 hover:border-[#d4af37] transition-all shadow-2xl cursor-pointer z-30 group"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* 3D Flip Card Container */}
        <div
          className={`relative w-full min-h-[500px] sm:min-h-[560px] md:min-h-[600px] transition-transform duration-700 preserve-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : 'rotate-y-0'
          }`}
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
          onClick={handleFlip}
          tabIndex={0}
          role="region"
          aria-label="Polaroid memory card. Click to flip."
        >
          {/* ================= FRONT OF POLAROID ================= */}
          <div className="absolute inset-0 bg-[#fbf8f2] text-[#2b231e] rounded-xl p-4 sm:p-6 shadow-2xl backface-hidden flex flex-col justify-between border border-[#e2d8c7]">
            {/* Top Washi Tape Strip */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-gradient-to-r from-[#d4af37]/40 via-[#f4e29b]/60 to-[#d4af37]/40 border-y border-[#d4af37]/50 shadow-sm backdrop-blur-sm pointer-events-none flex items-center justify-center">
              <span className="font-sans text-[8px] uppercase tracking-widest text-[#422e0a] font-bold">
                {memory.stampText || 'KEEPSAKE ARCHIVE'}
              </span>
            </div>

            {/* Vintage Brass Corner Clips */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#b38f2b]/50 pointer-events-none" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#b38f2b]/50 pointer-events-none" />

            {/* Large Photo Display */}
            <div className="relative w-full h-[310px] sm:h-[370px] md:h-[400px] bg-neutral-900 rounded-sm overflow-hidden shadow-inner">
              {failedImages[currentIndex] ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1d161f] via-[#281b25] to-[#140e15] text-[#d4af37]/80 text-center select-none border border-[#d4af37]/20">
                  <Sparkles className="w-8 h-8 mb-3 text-[#d4af37]/70 animate-pulse" />
                  <span className="font-serif text-lg sm:text-xl text-[#fbf8f2] tracking-wide mb-1 px-4">
                    {memory.title}
                  </span>
                  <span className="font-sans text-[11px] uppercase tracking-widest text-[#d4af37]/60">
                    Archival Keepsake
                  </span>
                </div>
              ) : (
                <img
                  src={memory.imageUrl}
                  alt={memory.title}
                  onError={() => setFailedImages((prev) => ({ ...prev, [currentIndex]: true }))}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />

              {/* Location Pill */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-sans border border-white/10 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{memory.location}</span>
              </div>

              {/* Date tag in photo corner */}
              {memory.dateTag && (
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded bg-black/55 backdrop-blur-sm text-neutral-200 text-[10px] font-sans tracking-wider uppercase border border-white/10">
                  {memory.dateTag}
                </div>
              )}
            </div>

            {/* Polaroid Bottom Note Area */}
            <div className="mt-4 flex flex-col items-center text-center">
              <h3 className="font-serif text-xl sm:text-2xl text-[#231b14] font-medium tracking-tight">
                {memory.title}
              </h3>
              <p className="font-editorial italic text-sm sm:text-base text-neutral-700 mt-1 max-w-md">
                "{memory.caption}"
              </p>

              <div className="mt-3 flex items-center justify-between w-full pt-2.5 border-t border-[#2b231e]/15 text-xs text-neutral-500 font-sans">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8b1e2b]" />
                  {memory.date}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                  className="inline-flex items-center gap-1.5 text-[#8b1e2b] font-medium hover:text-[#5c131c] transition-colors cursor-pointer group"
                >
                  <RotateCw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-500" />
                  <span>Flip to read note</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= BACK OF POLAROID (Handwritten Note) ================= */}
          <div
            className="absolute inset-0 bg-[#f6f0e2] text-[#2b231e] rounded-xl p-6 sm:p-8 shadow-2xl backface-hidden flex flex-col justify-between border border-[#decbb0]"
            style={{
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Top Postcard / Archival Header */}
            <div className="flex items-center justify-between border-b border-[#2b231e]/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-serif italic text-xs tracking-wider text-[#8b1e2b] font-semibold uppercase">
                  Confidential Memory • {memory.location}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#8b1e2b]/30 bg-[#8b1e2b]/5 text-[#8b1e2b] text-[10px] font-sans">
                <Heart className="w-3 h-3 fill-[#8b1e2b]" />
                <span>FOR YOUR EYES ONLY</span>
              </div>
            </div>

            {/* Vintage Postmark Stamp (Right Side Watermark) */}
            <div className="my-auto relative py-6">
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-dashed border-[#8b1e2b]/15 pointer-events-none flex items-center justify-center -rotate-12">
                <span className="font-sans text-[9px] uppercase tracking-widest text-[#8b1e2b]/30 text-center font-bold">
                  OFFICIAL KEEPSAKE<br />ARCHIVE • SEALED
                </span>
              </div>

              {/* Handwritten Note Content */}
              <p className="font-handwriting text-2xl sm:text-3xl md:text-4xl text-[#231b14] leading-relaxed relative z-10 px-2 sm:px-4">
                "{memory.handwrittenNote}"
              </p>
            </div>

            {/* Bottom Details & Flip Back Button */}
            <div className="pt-3.5 border-t border-[#2b231e]/15 flex items-center justify-between text-xs text-neutral-600 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="font-mono text-[11px] text-neutral-500">{memory.date}</span>
                <span className="text-[#8b1e2b] font-medium italic text-[11px]">Julian & Elena</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="inline-flex items-center gap-1.5 text-[#8b1e2b] font-medium hover:text-[#5c131c] transition-colors cursor-pointer group"
              >
                <RotateCw className="w-3.5 h-3.5 transition-transform group-hover:-rotate-180 duration-500" />
                <span>Return to photograph</span>
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard hint beneath modal */}
        <div className="text-center mt-3 text-neutral-400 text-xs font-sans tracking-wide hidden sm:block">
          Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">←</kbd> and{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">→</kbd> to navigate,{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">Space</kbd> to flip,{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">Esc</kbd> to exit
        </div>
      </div>
    </div>,
    document.body
  );
};
