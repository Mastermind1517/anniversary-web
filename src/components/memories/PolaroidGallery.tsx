import React, { useState, useEffect, useRef } from 'react';
import type { MemoryItem } from '../../types';
import { PolaroidCard } from './PolaroidCard';
import { MemoryLightbox } from './MemoryLightbox';
import { Feather, Camera } from 'lucide-react';
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
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      thumbnailRefs.current.forEach((cardEl) => {
        if (!cardEl) return;

        if (prefersReducedMotion) {
          gsap.fromTo(
            cardEl,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.6,
              scrollTrigger: {
                trigger: cardEl,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          );
          return;
        }

        // Restrained editorial entrance: subtle upward float with zero chaotic twisting
        gsap.fromTo(
          cardEl,
          {
            y: 24,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardEl,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, galleryRef);

    return () => ctx.revert();
  }, [memories]);

  // Provide accurate on-screen rect for the shared-layout FLIP transition
  const getSourceRect = (index: number): DOMRect | null => {
    const el = thumbnailRefs.current[index];
    return el ? el.getBoundingClientRect() : null;
  };

  return (
    <section
      id="memories-section"
      ref={galleryRef}
      className="relative w-full py-28 px-4 sm:px-8 md:px-12 overflow-hidden z-10 selection:bg-[#8E1624]/15"
    >
      {/* Subtle Archival Atmosphere Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F2EFEB]/20 to-transparent pointer-events-none" />

      {/* Editorial Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#171717]/5 border border-[#171717]/10 text-[#8E1624] text-[11px] font-sans uppercase tracking-[0.28em] mb-3.5">
          <Camera className="w-3.5 h-3.5" />
          <span>Anthology • 2022—2026</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#171717] tracking-wide mb-4">
          The Chronicle of Us
        </h2>

        <p className="font-editorial text-base sm:text-xl text-[#71717A] italic max-w-2xl mx-auto leading-relaxed">
          Photographs and inscribed memories curated across the years. Select any photograph to open the
          archival viewer and read the private inscription on its reverse.
        </p>

        <div className="flex items-center justify-center gap-3 mt-4 text-[10px] font-sans uppercase tracking-[0.24em] text-[#71717A]">
          <span className="w-6 h-[1px] bg-[#171717]/20" />
          <span>Curated Photographic Plates</span>
          <span className="w-6 h-[1px] bg-[#171717]/20" />
        </div>
      </div>

      {/* ================= EDITORIAL ASYMMETRIC GALLERY COMPOSITION ================= */}
      <div className="relative max-w-6xl mx-auto z-10 space-y-24 sm:space-y-32">
        {/* ACT 1: The Inception (Rue Saint-Louis & The Bluffs) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Plate 01: Featured Portrait */}
          {memories[0] && (
            <div className="md:col-span-5 flex justify-center md:justify-start">
              <PolaroidCard
                memory={memories[0]}
                onClick={() => setSelectedMemoryIndex(0)}
                index={0}
                cardRefCallback={(el) => {
                  thumbnailRefs.current[0] = el;
                }}
              />
            </div>
          )}

          {/* Center Calligraphic Hairline Pacing Divider */}
          <div className="hidden md:flex md:col-span-1 justify-center items-center">
            <div className="h-44 w-[1px] bg-gradient-to-b from-transparent via-[#171717]/20 to-transparent relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#8E1624]" />
            </div>
          </div>

          {/* Plate 02: Wide Hero Landscape */}
          {memories[1] && (
            <div className="md:col-span-6 flex justify-center md:justify-end">
              <PolaroidCard
                memory={memories[1]}
                onClick={() => setSelectedMemoryIndex(1)}
                index={1}
                cardRefCallback={(el) => {
                  thumbnailRefs.current[1] = el;
                }}
              />
            </div>
          )}
        </div>

        {/* Editorial Marginalia Quote & Curator Footnote Easter Egg */}
        <div className="text-center py-5 border-y border-[#171717]/10 max-w-xl mx-auto relative group">
          <button
            onClick={onOpenFootnote}
            title="Inspect archival curator's secret footnote"
            aria-label="Inspect archival curator's secret footnote"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[#71717A] hover:text-[#8E1624] bg-white hover:bg-[#F2EFEB] border border-[#171717]/10 transition-all cursor-pointer mb-2.5 shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
          >
            <Feather className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-sans uppercase tracking-[0.24em] text-[#8E1624] font-medium">
              Curator's Note
            </span>
          </button>
          <p className="font-serif italic text-base sm:text-lg text-[#71717A]">
            "We took photographs not to freeze time, but to remember how fiercely we loved being alive in it."
          </p>
        </div>

        {/* ACT 2: Quiet Intimacy (Midnight Kitchen & Old Bookshop) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
          {/* Plate 03: Square Cozy Vignette */}
          {memories[2] && (
            <div className="md:col-span-6 md:col-start-2 flex justify-center md:justify-center">
              <PolaroidCard
                memory={memories[2]}
                onClick={() => setSelectedMemoryIndex(2)}
                index={2}
                cardRefCallback={(el) => {
                  thumbnailRefs.current[2] = el;
                }}
              />
            </div>
          )}

          {/* Plate 04: Old Bookshop Portrait */}
          {memories[3] && (
            <div className="md:col-span-5 flex justify-center md:justify-start">
              <PolaroidCard
                memory={memories[3]}
                onClick={() => setSelectedMemoryIndex(3)}
                index={3}
                cardRefCallback={(el) => {
                  thumbnailRefs.current[3] = el;
                }}
              />
            </div>
          )}
        </div>

        {/* ACT 3: The Wide Wild & The Dawn Vespa */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Plate 05: Starry Pines Featured Landscape */}
          {memories[4] && (
            <div className="md:col-span-7 flex justify-center md:justify-start">
              <PolaroidCard
                memory={memories[4]}
                onClick={() => setSelectedMemoryIndex(4)}
                index={4}
                cardRefCallback={(el) => {
                  thumbnailRefs.current[4] = el;
                }}
              />
            </div>
          )}

          {/* Plate 06: Compact Vespa Vignette */}
          {memories[5] && (
            <div className="md:col-span-5 flex justify-center md:justify-center">
              <PolaroidCard
                memory={memories[5]}
                onClick={() => setSelectedMemoryIndex(5)}
                index={5}
                cardRefCallback={(el) => {
                  thumbnailRefs.current[5] = el;
                }}
              />
            </div>
          )}
        </div>

        {/* ACT 4: The Sanctuary & The Climax Centerpiece */}
        <div className="flex flex-col items-center gap-16">
          {/* Plate 07: Botanical Glasshouse Portrait */}
          {memories[6] && (
            <div className="w-full flex justify-center">
              <PolaroidCard
                memory={memories[6]}
                onClick={() => setSelectedMemoryIndex(6)}
                index={6}
                cardRefCallback={(el) => {
                  thumbnailRefs.current[6] = el;
                }}
              />
            </div>
          )}

          {/* Plate 08: Grand Climax Hero: Today & All Our Tomorrows */}
          {memories[7] && (
            <div className="w-full flex flex-col items-center">
              <div className="mb-4 inline-flex items-center gap-2 text-[10px] font-sans tracking-[0.24em] uppercase text-[#8E1624] font-medium">
                <span className="w-4 h-[1px] bg-[#8E1624]/40" />
                <span>The Present & Forever</span>
                <span className="w-4 h-[1px] bg-[#8E1624]/40" />
              </div>

              <PolaroidCard
                memory={memories[7]}
                onClick={() => setSelectedMemoryIndex(7)}
                index={7}
                className="ring-1 ring-[#8E1624]/30 shadow-[0_20px_50px_-12px_rgba(23,23,23,0.1)]"
                cardRefCallback={(el) => {
                  thumbnailRefs.current[7] = el;
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Shared-Layout Lightbox Modal with Full Navigation & Keyboard/Touch Accessibility */}
      <MemoryLightbox
        memories={memories}
        currentIndex={selectedMemoryIndex}
        onClose={() => setSelectedMemoryIndex(null)}
        onNavigate={(newIndex) => setSelectedMemoryIndex(newIndex)}
        getSourceRect={getSourceRect}
      />
    </section>
  );
};
