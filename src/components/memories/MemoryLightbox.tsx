import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { MemoryItem } from '../../types';
import { anniversaryData } from '../../data/anniversaryContent';
import { sound } from '../audio/SoundEngine';
import { getLenis } from '../../hooks/useLenis';
import gsap from 'gsap';
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
  getSourceRect?: (index: number) => DOMRect | null;
}

export const MemoryLightbox: React.FC<MemoryLightboxProps> = ({
  memories,
  currentIndex,
  onClose,
  onNavigate,
  getSourceRect,
}) => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [isClosing, setIsClosing] = useState(false);

  const backdropRef = useRef<HTMLDivElement | null>(null);
  const stageCardRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingRef = useRef(false);

  // Touch gesture state for mobile swiping
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < memories.length;
  const memory = isOpen ? memories[currentIndex] : null;
  const isFlipped = isOpen && flippedIndex === currentIndex;

  // 1. Lock body scroll and stop Lenis smoothly
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

  // 2. Shared-Layout Entrance Transition (FLIP)
  useEffect(() => {
    if (!isOpen || currentIndex === null || isClosing) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(stageCardRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      return;
    }

    const sourceRect = getSourceRect?.(currentIndex);
    const targetEl = stageCardRef.current;

    if (!targetEl) return;

    isAnimatingRef.current = true;

    if (sourceRect && sourceRect.width > 0 && sourceRect.height > 0) {
      const targetRect = targetEl.getBoundingClientRect();

      const deltaX = (sourceRect.left + sourceRect.width / 2) - (targetRect.left + targetRect.width / 2);
      const deltaY = (sourceRect.top + sourceRect.height / 2) - (targetRect.top + targetRect.height / 2);
      const scaleX = sourceRect.width / targetRect.width;
      const scaleY = sourceRect.height / targetRect.height;

      gsap.killTweensOf([backdropRef.current, stageCardRef.current, headerRef.current, footerRef.current]);

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      // Backdrop dissolves in
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: 'power2.out' },
        0
      );

      // Card smoothly expands and translates from thumbnail rect into center stage
      tl.fromTo(
        stageCardRef.current,
        {
          x: deltaX,
          y: deltaY,
          scaleX: scaleX,
          scaleY: scaleY,
          borderRadius: '2px',
        },
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          borderRadius: '4px',
          duration: 0.5,
          ease: 'power3.out',
        },
        0
      );

      // Header & footer fade in with slight vertical travel
      tl.fromTo(
        [headerRef.current, footerRef.current],
        { opacity: 0, y: (i: number) => (i === 0 ? -12 : 12) },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
        0.18
      );
    } else {
      // Fallback if source rect not available
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 });
      gsap.fromTo(
        stageCardRef.current,
        { opacity: 0, scale: 0.94, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.42,
          ease: 'power2.out',
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        }
      );
      gsap.fromTo(
        [headerRef.current, footerRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 0.3, delay: 0.15 }
      );
    }
  }, [isOpen, currentIndex, getSourceRect, isClosing]);

  // 3. Shared-Layout Exit Transition (Reverse FLIP)
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reset card flip to front so return image matches source thumbnail
    setFlippedIndex(null);

    const cleanupAndNotify = () => {
      gsap.set([backdropRef.current, stageCardRef.current, headerRef.current, footerRef.current], {
        clearProps: 'all',
      });
      setIsClosing(false);
      onClose();
    };

    if (prefersReducedMotion || !stageCardRef.current) {
      cleanupAndNotify();
      return;
    }

    const sourceRect = currentIndex !== null ? getSourceRect?.(currentIndex) : null;
    const currentTargetRect = stageCardRef.current.getBoundingClientRect();

    gsap.killTweensOf([backdropRef.current, stageCardRef.current, headerRef.current, footerRef.current]);

    if (sourceRect && sourceRect.width > 0 && sourceRect.height > 0) {
      const deltaX = (sourceRect.left + sourceRect.width / 2) - (currentTargetRect.left + currentTargetRect.width / 2);
      const deltaY = (sourceRect.top + sourceRect.height / 2) - (currentTargetRect.top + currentTargetRect.height / 2);
      const scaleX = sourceRect.width / currentTargetRect.width;
      const scaleY = sourceRect.height / currentTargetRect.height;

      const tl = gsap.timeline({
        onComplete: cleanupAndNotify,
      });

      tl.to(
        [headerRef.current, footerRef.current],
        { opacity: 0, duration: 0.18, ease: 'power1.out' },
        0
      );

      tl.to(
        stageCardRef.current,
        {
          x: deltaX,
          y: deltaY,
          scaleX: scaleX,
          scaleY: scaleY,
          opacity: 0,
          duration: 0.38,
          ease: 'power3.inOut',
        },
        0.04
      );

      tl.to(
        backdropRef.current,
        { opacity: 0, duration: 0.34, ease: 'power2.in' },
        0.04
      );
    } else {
      // Fallback exit
      const tl = gsap.timeline({ onComplete: cleanupAndNotify });
      tl.to([headerRef.current, footerRef.current], { opacity: 0, duration: 0.15 }, 0);
      tl.to(stageCardRef.current, { opacity: 0, scale: 0.94, duration: 0.25, ease: 'power2.in' }, 0);
      tl.to(backdropRef.current, { opacity: 0, duration: 0.28, ease: 'power2.in' }, 0);
    }
  }, [currentIndex, getSourceRect, isClosing, onClose]);

  // 4. Navigation Handlers
  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex === null || isClosing) return;
    sound.playPaperRustle();
    setFlippedIndex(null);
    const nextIdx = (currentIndex - 1 + memories.length) % memories.length;

    // Cross-fade animation on navigate
    if (stageCardRef.current) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.fromTo(
          stageCardRef.current,
          { opacity: 0.6 },
          { opacity: 1, duration: 0.2, ease: 'power1.out' }
        );
      } else {
        gsap.fromTo(
          stageCardRef.current,
          { x: -16, opacity: 0.85 },
          { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
    }
    onNavigate(nextIdx);
  }, [currentIndex, isClosing, memories.length, onNavigate]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex === null || isClosing) return;
    sound.playPaperRustle();
    setFlippedIndex(null);
    const nextIdx = (currentIndex + 1) % memories.length;

    // Cross-fade animation on navigate
    if (stageCardRef.current) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.fromTo(
          stageCardRef.current,
          { opacity: 0.6 },
          { opacity: 1, duration: 0.2, ease: 'power1.out' }
        );
      } else {
        gsap.fromTo(
          stageCardRef.current,
          { x: 16, opacity: 0.85 },
          { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
    }
    onNavigate(nextIdx);
  }, [currentIndex, isClosing, memories.length, onNavigate]);

  const handleFlip = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex === null || isClosing) return;
    sound.playPaperRustle();
    setFlippedIndex((prev) => (prev === currentIndex ? null : currentIndex));
  }, [currentIndex, isClosing]);

  // 5. Touch Swipe Listeners for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;

    // Horizontal swipe threshold: 45px, with minimal vertical deviation (< 75px)
    if (Math.abs(diffX) > 45 && Math.abs(diffY) < 75) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // 6. Keyboard navigation: Escape to close, Arrows to paginate, Space to flip
  useEffect(() => {
    if (!isOpen || isClosing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
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
  }, [isOpen, isClosing, handleClose, handlePrev, handleNext, handleFlip]);

  if (!isOpen || !memory || typeof document === 'undefined') return null;

  const plateNumber = String(currentIndex + 1).padStart(2, '0');

  return createPortal(
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing archival plate ${plateNumber}: ${memory.title}`}
      className="fixed inset-0 z-[999] bg-[#09090A]/94 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
      onClick={handleClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header
        ref={headerRef}
        className="fixed top-4 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between z-[1000] pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Plate Indicator & Title */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 rounded-sm bg-[#171717]/80 backdrop-blur-md border border-white/10 text-xs text-[#F2EFEB] font-sans shadow-lg">
          <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#8E1624] font-medium">
            Plate {plateNumber}
          </span>
          <span className="text-white/30">•</span>
          <span className="font-serif italic text-sm text-[#FFFFFF] hidden sm:inline">
            {memory.title}
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-[10px] font-sans uppercase tracking-widest text-[#71717A]">
            {currentIndex + 1} of {memories.length}
          </span>
        </div>

        {/* Minimal Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close archival viewer (Escape)"
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#171717]/80 hover:bg-[#8E1624]/80 border border-white/10 text-white transition-all duration-300 cursor-pointer group shadow-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
        >
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] hidden sm:inline">Close</span>
          <X className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" />
        </button>
      </header>

      {/* ================= MAIN INTERACTIVE STAGE ================= */}
      <div
        ref={stageCardRef}
        className="relative w-full max-w-xl perspective-1600 my-auto z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrow: Previous */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous photograph (Left Arrow)"
          className="absolute -left-3 sm:-left-14 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-[#171717]/80 hover:bg-[#8E1624] text-white border border-white/15 hover:border-[#8E1624] transition-all duration-300 shadow-2xl cursor-pointer z-30 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Navigation Arrow: Next */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next photograph (Right Arrow)"
          className="absolute -right-3 sm:-right-14 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-[#171717]/80 hover:bg-[#8E1624] text-white border border-white/15 hover:border-[#8E1624] transition-all duration-300 shadow-2xl cursor-pointer z-30 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* 3D Flip Card Container */}
        <div
          className={`relative w-full min-h-[480px] sm:min-h-[560px] md:min-h-[590px] transition-transform duration-500 ease-out preserve-3d cursor-pointer motion-reduce:transition-none ${
            isFlipped ? 'rotate-y-180' : 'rotate-y-0'
          }`}
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
          onClick={handleFlip}
          tabIndex={0}
          role="region"
          aria-label="Archival exhibition plate. Click or press Space to inspect the reverse inscription."
        >
          {/* ================= FRONT OF ARCHIVAL PLATE ================= */}
          <div className="absolute inset-0 bg-[#FFFFFF] text-[#171717] rounded-sm p-4 sm:p-6 shadow-2xl backface-hidden flex flex-col justify-between border border-[#171717]/10">
            {/* Top Plate Catalog Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#171717]/10 text-xs">
              <span className="font-sans text-[10px] uppercase tracking-[0.24em] font-medium text-[#71717A]">
                Archival Plate {plateNumber} • {memory.location}
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#8E1624] font-medium">
                {memory.dateTag || memory.date}
              </span>
            </div>

            {/* High-Resolution Photograph Display with Responsive Proportions */}
            <div className="relative w-full flex-1 my-3 bg-[#171717] rounded-[2px] overflow-hidden border border-[#171717]/10 min-h-[280px] sm:min-h-[360px] md:min-h-[380px]">
              {failedImages[currentIndex] ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#F9F8F5] text-[#71717A] text-center select-none">
                  <Sparkles className="w-8 h-8 mb-3 text-[#8E1624] opacity-80" />
                  <span className="font-serif text-lg sm:text-xl text-[#171717] tracking-wide mb-1 px-4">
                    {memory.title}
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[#71717A]">
                    Plate {plateNumber} • Archival Photographic Record
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

              {/* Bottom Subtle Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

              {/* Location Pill */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-sm bg-black/65 backdrop-blur-md text-white text-xs font-sans border border-white/10 shadow-sm pointer-events-none">
                <MapPin className="w-3.5 h-3.5 text-[#8E1624]" />
                <span className="font-light">{memory.location}</span>
              </div>
            </div>

            {/* Bottom Caption & Interactive Flip Affordance */}
            <div className="flex flex-col items-center text-center">
              <h3 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal tracking-tight">
                {memory.title}
              </h3>
              <p className="font-editorial italic text-xs sm:text-sm text-[#71717A] mt-1 max-w-md leading-relaxed">
                "{memory.caption}"
              </p>

              <div className="mt-3 flex items-center justify-between w-full pt-2.5 border-t border-[#171717]/10 text-xs text-[#71717A] font-sans">
                <span className="flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-wider text-[#71717A]">
                  <Calendar className="w-3.5 h-3.5 text-[#8E1624]" />
                  {memory.date}
                </span>

                <button
                  type="button"
                  onClick={handleFlip}
                  className="inline-flex items-center gap-1.5 text-[#8E1624] hover:text-[#4F0D15] font-medium transition-colors cursor-pointer group text-xs uppercase tracking-wider font-sans focus:outline-none"
                >
                  <RotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
                  <span>Read Inscription on Reverse</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= BACK OF ARCHIVAL PLATE (Handwritten Note) ================= */}
          <div
            className="absolute inset-0 bg-[#F9F8F5] text-[#171717] rounded-sm p-6 sm:p-8 shadow-2xl backface-hidden flex flex-col justify-between border border-[#171717]/10"
            style={{
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Top Postcard / Archival Postal Header */}
            <div className="flex items-center justify-between border-b border-[#171717]/10 pb-3">
              <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#8E1624] font-semibold">
                Archival Inscription • {memory.location}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm border border-[#8E1624]/20 bg-[#8E1624]/5 text-[#8E1624] text-[9px] font-sans tracking-widest uppercase">
                <Heart className="w-2.5 h-2.5 fill-[#8E1624]" />
                <span>Private Record</span>
              </div>
            </div>

            {/* Vintage Postmark Stamp (Right Watermark) & Intimate Note */}
            <div className="my-auto relative py-6 flex flex-col items-center text-center">
              {/* Subtle Postmark Postal Watermark */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-dashed border-[#8E1624]/10 pointer-events-none flex items-center justify-center -rotate-12 select-none">
                <span className="font-sans text-[8px] uppercase tracking-[0.22em] text-[#8E1624]/30 text-center font-bold leading-tight">
                  OFFICIAL KEEPSAKE<br />ARCHIVE • INSCRIBED
                </span>
              </div>

              {/* Handwritten Note Content */}
              <p className="font-handwriting text-2xl sm:text-3xl md:text-4xl text-[#171717] leading-relaxed relative z-10 px-2 sm:px-6">
                "{memory.handwrittenNote}"
              </p>
            </div>

            {/* Bottom Details & Flip Back Button */}
            <div className="pt-3.5 border-t border-[#171717]/10 flex items-center justify-between text-xs text-[#71717A] font-sans">
              <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
                <span className="font-mono text-[#71717A] uppercase">{memory.date}</span>
                <span className="text-[#8E1624] font-editorial italic text-sm">{anniversaryData.partner1} & {anniversaryData.partner2}</span>
              </div>

              <button
                type="button"
                onClick={handleFlip}
                className="inline-flex items-center gap-1.5 text-[#8E1624] hover:text-[#4F0D15] font-medium transition-colors cursor-pointer group text-xs uppercase tracking-wider font-sans focus:outline-none"
              >
                <RotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:-rotate-180" />
                <span>Return to Photograph</span>
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard & Swipe Affordance */}
        <footer
          ref={footerRef}
          className="text-center mt-3 text-neutral-400 text-xs font-sans tracking-wide hidden sm:block pointer-events-none"
        >
          Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">←</kbd> and{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">→</kbd> to navigate,{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">Space</kbd> to flip,{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">Esc</kbd> to exit
        </footer>
      </div>
    </div>,
    document.body
  );
};
