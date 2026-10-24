import React, { useState, useEffect, useRef } from 'react';
import type { MemoryItem } from '../../types';
import { PolaroidCard } from './PolaroidCard';
import { MemoryLightbox } from './MemoryLightbox';
import { Camera, Sparkles, Compass, Feather } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PolaroidGalleryProps {
  memories: MemoryItem[];
  onOpenFootnote?: () => void;
}

export const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({ memories, onOpenFootnote }) => {
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        cardsRef.current.forEach((cardEl) => {
          if (!cardEl) return;
          gsap.fromTo(
            cardEl,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.8,
              scrollTrigger: {
                trigger: cardEl,
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        });
        return;
      }

      // Staggered directional entrances for each card
      cardsRef.current.forEach((cardEl, idx) => {
        if (!cardEl) return;
        const mem = memories[idx];
        if (!mem) return;

        const dir = mem.direction || (idx % 2 === 0 ? 'left' : 'right');

        // Restrain translation distances on mobile to avoid overflow
        const xOffset = isMobile ? (dir === 'left' ? -35 : dir === 'right' ? 35 : 0) : (dir === 'left' ? -80 : dir === 'right' ? 80 : 0);
        const yOffset = isMobile ? (dir === 'top' ? -35 : dir === 'bottom' ? 45 : 20) : (dir === 'top' ? -65 : dir === 'bottom' ? 75 : 30);
        const rotOffset = isMobile ? (dir === 'left' ? -3 : 3) : (dir === 'left' ? -6 : 6);

        // Main directional reveal
        gsap.fromTo(
          cardEl,
          {
            x: xOffset,
            y: yOffset,
            opacity: 0,
            scale: 0.93,
            rotation: mem.rotation + rotOffset,
            filter: 'blur(5px)',
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: mem.rotation,
            filter: 'blur(0px)',
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardEl,
              start: isMobile ? 'top 92%' : 'top 86%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        // Parallax depth scrub (only on desktop for smooth frame rates)
        if (!isMobile && mem.parallaxSpeed) {
          gsap.to(cardEl, {
            yPercent: mem.parallaxSpeed * 35,
            ease: 'none',
            scrollTrigger: {
              trigger: cardEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        }
      });

      // Background ambient decor subtle parallax
      gsap.to('.gallery-watermark', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.6,
        },
      });
    }, galleryRef);

    return () => ctx.revert();
  }, [memories]);

  return (
    <section
      id="memories-section"
      ref={galleryRef}
      className="relative w-full py-28 px-4 sm:px-8 md:px-12 overflow-hidden z-10 selection:bg-[#8E1624]/15"
    >
      {/* Background Atmosphere & Subtle Paper Grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F2EFEB]/30 to-transparent pointer-events-none" />

      {/* Archival Compass Rose / Botanical Background Watermark */}
      <div className="gallery-watermark absolute top-40 right-10 w-96 h-96 rounded-full border border-[#303030]/10 pointer-events-none flex items-center justify-center opacity-30 select-none">
        <Compass className="w-80 h-80 text-[#71717A]/15 stroke-1 animate-[spin_120s_linear_infinite]" />
      </div>

      <div className="gallery-watermark absolute bottom-40 -left-20 w-[480px] h-[480px] rounded-full border border-[#303030]/10 pointer-events-none flex items-center justify-center opacity-25 select-none">
        <div className="w-[440px] h-[440px] rounded-full border border-dashed border-[#8E1624]/15" />
      </div>

      {/* Editorial Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8E1624]/10 border border-[#8E1624]/20 text-[#8E1624] text-xs font-sans uppercase tracking-widest mb-3.5 shadow-sm">
          <Camera className="w-3.5 h-3.5" />
          <span>Chapter II • Visual Anthology</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#171717] tracking-wide mb-4">
          The Chronicle of Us
        </h2>

        <p className="font-editorial text-lg sm:text-xl md:text-2xl text-[#71717A] italic max-w-2xl mx-auto leading-relaxed">
          Fragments of light captured across the years. Every photograph holds a private handwritten note
          inscribed on the back.
        </p>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs font-sans uppercase tracking-widest text-[#71717A]">
          <Sparkles className="w-3 h-3 text-[#8E1624]" />
          <span>Tap or click any photograph to read its secret</span>
          <Sparkles className="w-3 h-3 text-[#8E1624]" />
        </div>
      </div>

      {/* ================= EDITORIAL ASYMMETRIC GALLERY COMPOSITION ================= */}
      <div className="relative max-w-6xl mx-auto z-10 space-y-24 sm:space-y-32">
        {/* ACT 1: The Spark & Horizon */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Card 0: Featured Portrait (Left Col) */}
          {memories[0] && (
            <div
              ref={(el) => { cardsRef.current[0] = el; }}
              className="md:col-span-5 flex justify-center md:justify-start"
            >
              <PolaroidCard
                memory={memories[0]}
                onClick={() => setSelectedMemoryIndex(0)}
                index={0}
              />
            </div>
          )}

          {/* Center Calligraphic Interlude */}
          <div className="hidden md:flex md:col-span-1 justify-center items-center">
            <div className="h-44 w-[1px] bg-gradient-to-b from-transparent via-[#8E1624]/30 to-transparent relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#8E1624]" />
            </div>
          </div>

          {/* Card 1: Wide Hero Landscape (Right Col) */}
          {memories[1] && (
            <div
              ref={(el) => { cardsRef.current[1] = el; }}
              className="md:col-span-6 flex justify-center md:justify-end"
            >
              <PolaroidCard
                memory={memories[1]}
                onClick={() => setSelectedMemoryIndex(1)}
                index={1}
              />
            </div>
          )}
        </div>

        {/* Editorial Marginalia Quote & Curator Footnote Easter Egg */}
        <div className="text-center py-4 border-y border-[#F2EFEB] max-w-xl mx-auto relative group">
          <button
            onClick={onOpenFootnote}
            title="Inspect archival curator's secret footnote"
            aria-label="Inspect archival curator's secret footnote"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[#71717A] hover:text-[#8E1624] bg-white hover:bg-[#F2EFEB] border border-[#F2EFEB] transition-all cursor-pointer mb-2 shadow-sm"
          >
            <Feather className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#8E1624] font-medium">
              Secret Footnote
            </span>
          </button>
          <p className="font-serif italic text-base sm:text-lg text-[#71717A]">
            "We took photographs not to freeze time, but to remember how fiercely we loved being alive in it."
          </p>
        </div>

        {/* ACT 2: Intimate Domestic Rhythms & Secret Archives */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
          {/* Card 2: Square Cozy Vignette (Left-Center) */}
          {memories[2] && (
            <div
              ref={(el) => { cardsRef.current[2] = el; }}
              className="md:col-span-6 md:col-start-2 flex justify-center md:justify-center"
            >
              <PolaroidCard
                memory={memories[2]}
                onClick={() => setSelectedMemoryIndex(2)}
                index={2}
              />
            </div>
          )}

          {/* Card 3: Old Bookshop Portrait (Right-Center) */}
          {memories[3] && (
            <div
              ref={(el) => { cardsRef.current[3] = el; }}
              className="md:col-span-5 flex justify-center md:justify-start"
            >
              <PolaroidCard
                memory={memories[3]}
                onClick={() => setSelectedMemoryIndex(3)}
                index={3}
              />
            </div>
          )}
        </div>

        {/* ACT 3: The Wide Wild & The Dawn Vespa */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Card 4: Starry Pines Featured Landscape (Left Col) */}
          {memories[4] && (
            <div
              ref={(el) => { cardsRef.current[4] = el; }}
              className="md:col-span-7 flex justify-center md:justify-start"
            >
              <PolaroidCard
                memory={memories[4]}
                onClick={() => setSelectedMemoryIndex(4)}
                index={4}
              />
            </div>
          )}

          {/* Card 5: Compact Vespa Vignette (Right Col) */}
          {memories[5] && (
            <div
              ref={(el) => { cardsRef.current[5] = el; }}
              className="md:col-span-5 flex justify-center md:justify-center"
            >
              <PolaroidCard
                memory={memories[5]}
                onClick={() => setSelectedMemoryIndex(5)}
                index={5}
              />
            </div>
          )}
        </div>

        {/* ACT 4: The Sanctuary & The Climax Centerpiece */}
        <div className="flex flex-col items-center gap-16">
          {/* Card 6: Botanical Glasshouse Portrait */}
          {memories[6] && (
            <div
              ref={(el) => { cardsRef.current[6] = el; }}
              className="w-full flex justify-center"
            >
              <PolaroidCard
                memory={memories[6]}
                onClick={() => setSelectedMemoryIndex(6)}
                index={6}
              />
            </div>
          )}

          {/* Card 7: Grand Climax Hero: Today & All Our Tomorrows */}
          {memories[7] && (
            <div
              ref={(el) => { cardsRef.current[7] = el; }}
              className="w-full flex flex-col items-center"
            >
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-[#8E1624]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Present & Forever</span>
              </div>

              <PolaroidCard
                memory={memories[7]}
                onClick={() => setSelectedMemoryIndex(7)}
                index={7}
                className="ring-1 ring-[#8E1624]/30 shadow-[0_25px_60px_-15px_rgba(23,23,23,0.1)]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal with Full Navigation & Keyboard Accessibility */}
      <MemoryLightbox
        memories={memories}
        currentIndex={selectedMemoryIndex}
        onClose={() => setSelectedMemoryIndex(null)}
        onNavigate={(newIndex) => setSelectedMemoryIndex(newIndex)}
      />
    </section>
  );
};
