import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WaxSeal } from './WaxSeal';
import { sound } from '../audio/SoundEngine';
import type { OpeningLetter, OpeningInvitation } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface EnvelopeStageProps {
  monogram: string;
  tagline: string;
  partner1: string;
  partner2: string;
  anniversaryDate?: string;
  isOpen?: boolean;
  onOpenComplete?: () => void;
  openingLetter?: OpeningLetter;
  invitation?: OpeningInvitation;
}

export const EnvelopeStage: React.FC<EnvelopeStageProps> = ({
  monogram,
  tagline,
  partner1,
  partner2,
  anniversaryDate,
  onOpenComplete,
  openingLetter,
  invitation,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const invitationRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const envelopeWrapRef = useRef<HTMLDivElement | null>(null);
  const flapRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);
  const letterRef = useRef<HTMLDivElement | null>(null);
  const pocketShadowRef = useRef<HTMLDivElement | null>(null);
  const letterTopFoldRef = useRef<HTMLDivElement | null>(null);
  const letterBottomFoldRef = useRef<HTMLDivElement | null>(null);
  const creaseShadowTopRef = useRef<HTMLDivElement | null>(null);
  const creaseShadowBottomRef = useRef<HTMLDivElement | null>(null);
  
  // Staggered text line refs for progressive editorial ink reveal
  const epistleRibbonRef = useRef<HTMLDivElement | null>(null);
  const salutationRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLParagraphElement | null>(null);
  const line2Ref = useRef<HTMLParagraphElement | null>(null);
  const line3Ref = useRef<HTMLParagraphElement | null>(null);
  const closingRef = useRef<HTMLDivElement | null>(null);
  const signatureRef = useRef<HTMLSpanElement | null>(null);
  const flourishPathRef = useRef<SVGPathElement | null>(null);
  const unfoldedHintRef = useRef<HTMLDivElement | null>(null);

  const hasOpenedSoundFired = useRef(false);
  const hasUnfoldedSoundFired = useRef(false);

  const formattedDate = React.useMemo(() => {
    if (anniversaryDate) {
      try {
        const d = new Date(anniversaryDate);
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      } catch {
        return anniversaryDate;
      }
    }
    return 'Anniversary Edition';
  }, [anniversaryDate]);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Reduced motion fallback: Simple subtle opacity cross-fades
        gsap.timeline({
          scrollTrigger: {
            trigger: trackRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        })
          .to(invitationRef.current, { opacity: 0, duration: 0.15 }, 0)
          .to(sealRef.current, { opacity: 0, duration: 0.15 }, 0.1)
          .to(letterRef.current, { yPercent: -50, opacity: 1, duration: 0.4 }, 0.2)
          .to([salutationRef.current, line1Ref.current, line2Ref.current, signatureRef.current], {
            opacity: 1,
            stagger: 0.1,
            duration: 0.3,
          }, 0.5);
        return;
      }

      // Master Cinematic Scroll-Scrubbed Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          pin: stageRef.current,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Natural sound cues tied to scroll position
            if (self.progress > 0.16 && !hasOpenedSoundFired.current) {
              sound.playWaxCrack();
              hasOpenedSoundFired.current = true;
            } else if (self.progress < 0.10) {
              hasOpenedSoundFired.current = false;
            }

            if (self.progress > 0.65 && !hasUnfoldedSoundFired.current) {
              sound.playPaperRustle();
              hasUnfoldedSoundFired.current = true;
            } else if (self.progress < 0.52) {
              hasUnfoldedSoundFired.current = false;
            }
          },
          onLeave: () => {
            onOpenComplete?.();
          },
        },
      });

      // 1. Initial State Initialization
      gsap.set(flapRef.current, { transformOrigin: 'top center', rotateX: 0, zIndex: 30 });
      gsap.set(letterTopFoldRef.current, { transformOrigin: 'top center', rotateX: -160 });
      gsap.set(letterBottomFoldRef.current, { transformOrigin: 'bottom center', rotateX: 160 });
      gsap.set(letterRef.current, { yPercent: 0, scale: 0.98, overflow: 'hidden', zIndex: 20 });
      gsap.set([
        epistleRibbonRef.current,
        salutationRef.current,
        line1Ref.current,
        line2Ref.current,
        line3Ref.current,
        closingRef.current,
        unfoldedHintRef.current,
      ], { opacity: 0, y: 12 });
      if (flourishPathRef.current) {
        gsap.set(flourishPathRef.current, { strokeDasharray: 140, strokeDashoffset: 140 });
      }

      // 2. Invitation & Header Softening (0% -> 12%)
      tl.to(invitationRef.current, {
        opacity: 0,
        y: -14,
        duration: 0.12,
        ease: 'power1.out',
      }, 0);

      tl.to(headerRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.2,
        ease: 'power1.out',
      }, 0.05);

      // 3. Wax Seal lifts and fractures (4% -> 18%)
      tl.to(sealRef.current, {
        scale: 1.12,
        y: -8,
        duration: 0.09,
        ease: 'power2.out',
      }, 0.04);

      tl.to(sealRef.current, {
        opacity: 0,
        scale: 1.3,
        duration: 0.09,
        ease: 'power1.in',
      }, 0.13);

      // 4. Top Flap hinges open in 3D perspective (10% -> 44%)
      tl.to(flapRef.current, {
        rotateX: 180,
        duration: 0.34,
        ease: 'power2.inOut',
      }, 0.10);

      // Switch Flap z-index as it rotates past 90 degrees so opened flap sits BEHIND the letter
      tl.set(flapRef.current, { zIndex: 12 }, 0.26);

      // Light enters the pocket mouth (inner shadow dissolves)
      tl.to(pocketShadowRef.current, {
        opacity: 0.1,
        duration: 0.28,
        ease: 'power1.out',
      }, 0.16);

      // 5. Letter emerges from envelope pocket (36% -> 68%)
      const isMobile = window.innerWidth < 640;
      tl.set(letterRef.current, { overflow: 'visible' }, 0.38);
      
      tl.to(letterRef.current, {
        yPercent: isMobile ? -82 : -70,
        scale: 1.03,
        duration: 0.32,
        ease: 'power2.out',
      }, 0.38);

      // Elevate letter above front pocket flaps once mostly extracted
      tl.set(letterRef.current, { zIndex: 28 }, 0.55);

      // 6. Accordion Unfolds (62% -> 84%)
      tl.to(letterTopFoldRef.current, {
        rotateX: 0,
        duration: 0.22,
        ease: 'power2.out',
      }, 0.62);

      tl.to(letterBottomFoldRef.current, {
        rotateX: 0,
        duration: 0.22,
        ease: 'power2.out',
      }, 0.68);

      // Dissolve crease fold shadows as paper flattens
      tl.to([creaseShadowTopRef.current, creaseShadowBottomRef.current], {
        opacity: 0,
        duration: 0.16,
        ease: 'power1.out',
      }, 0.68);

      // 7. Progressive Line-by-Line Editorial Ink Reveal (72% -> 96%)
      tl.to(epistleRibbonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.14,
        ease: 'power1.out',
      }, 0.72);

      tl.to(salutationRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.16,
        ease: 'power1.out',
      }, 0.76);

      tl.to(line1Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.15,
        ease: 'power1.out',
      }, 0.80);

      tl.to(line2Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.15,
        ease: 'power1.out',
      }, 0.84);

      tl.to(line3Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.15,
        ease: 'power1.out',
      }, 0.88);

      tl.to(closingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.14,
        ease: 'power1.out',
      }, 0.91);

      // Draw the hand-crafted botanical flourish under the signature
      if (flourishPathRef.current) {
        tl.to(flourishPathRef.current, {
          strokeDashoffset: 0,
          duration: 0.16,
          ease: 'power2.out',
        }, 0.92);
      }

      tl.to(unfoldedHintRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.12,
        ease: 'power1.out',
      }, 0.95);

      // 8. Continuous Narrative Bridge: Soft focus shift at completion (96% -> 100%)
      tl.to(envelopeWrapRef.current, {
        opacity: 0.85,
        duration: 0.08,
      }, 0.96);

    }, trackRef);

    return () => ctx.revert();
  }, [onOpenComplete]);

  // Click invitation to smoothly scroll down and unfold
  const handleScrollToUnfold = () => {
    sound.playWaxCrack();
    if (trackRef.current) {
      const targetY = trackRef.current.offsetTop + trackRef.current.offsetHeight * 0.92;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <div ref={trackRef} className="relative w-full min-h-[270vh] z-20">
      {/* Pinned Stage Viewport Container */}
      <section
        ref={stageRef}
        className="relative h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden select-none"
      >
        {/* Soft Ambient Keylight Halo behind envelope */}
        <div 
          className="absolute w-[460px] sm:w-[620px] h-[460px] sm:h-[620px] rounded-full pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(142, 22, 36, 0.04) 0%, rgba(242, 239, 235, 0.6) 50%, transparent 75%)',
            filter: 'blur(55px)',
          }}
        />

        {/* Editorial Scene Header */}
        <div ref={headerRef} className="text-center mb-6 sm:mb-8 max-w-xl transition-all duration-700 pointer-events-none">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#8E1624] font-semibold block mb-2">
            Anniversary Epistle
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-wide text-[#171717] mb-2 leading-tight">
            {partner1} <span className="font-editorial italic text-[#8E1624] text-3xl sm:text-5xl mx-1.5">&</span> {partner2}
          </h1>
          <p className="font-editorial text-base sm:text-xl text-[#71717A] italic tracking-wide">
            "{tagline}"
          </p>
        </div>

        {/* The 3D Envelope Construct */}
        <div 
          ref={envelopeWrapRef} 
          className="relative w-[88vw] max-w-[480px] aspect-[1.5/1] perspective-1600 flex items-center justify-center transition-opacity"
        >
          {/* Ambient Desk Contact Shadow */}
          <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 w-[88%] h-8 bg-black/60 rounded-full blur-xl pointer-events-none" />

          {/* Envelope Shell Body */}
          <div className="relative w-full h-full bg-[#171717] rounded-xl paper-shadow border border-[#303030] flex items-center justify-center overflow-visible">
            
            {/* Inner Pocket Felt / Silk Lining */}
            <div className="absolute inset-2 rounded-lg bg-[#09090A] border border-[#303030]/40 overflow-hidden">
              <div 
                className="w-full h-full opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(rgba(142, 22, 36, 0.25) 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
            </div>

            {/* Inner Pocket Ambient Occlusion Shadow */}
            <div
              ref={pocketShadowRef}
              className="absolute inset-2 rounded-lg bg-black/60 pointer-events-none z-10 transition-opacity"
            />

            {/* FOLDED PARCHMENT LETTER */}
            <div
              ref={letterRef}
              className="absolute bottom-2.5 w-[92%] sm:w-[93%] h-[88%] bg-[#F9F8F5] text-[#171717] rounded-lg paper-shadow p-4 sm:p-6 flex flex-col justify-between border border-[#F2EFEB]"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Accordion Top Fold */}
              <div
                ref={letterTopFoldRef}
                className="relative preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  ref={creaseShadowTopRef}
                  className="absolute inset-0 crease-shadow-top pointer-events-none z-10"
                />
                <div ref={epistleRibbonRef} className="flex items-center justify-between border-b border-[#171717]/10 pb-2 mb-2">
                  <span className="font-editorial italic text-xs tracking-widest text-[#8E1624] font-semibold">
                    A Keepsake Letter Across Time
                  </span>
                  <span className="font-sans text-[10px] tracking-widest uppercase text-[#71717A]">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {/* Central Letter Body with Progressive Staggered Lines */}
              <div className="flex-1 flex flex-col justify-center text-center my-1">
                {/* Salutation */}
                <div ref={salutationRef}>
                  <span className="font-handwriting text-3xl sm:text-4xl text-[#8E1624] mb-1.5 block">
                    {openingLetter?.salutation || `Dearest ${partner2},`}
                  </span>
                </div>

                {/* Staggered Line 1 */}
                <p 
                  ref={line1Ref} 
                  className="font-editorial text-sm sm:text-base text-[#171717] leading-relaxed italic max-w-sm mx-auto"
                >
                  {openingLetter?.lines?.[0] || 'Every year with you unfolds like a romance I never want to put down.'}
                </p>

                {/* Staggered Line 2 */}
                <p 
                  ref={line2Ref} 
                  className="font-editorial text-xs sm:text-sm text-[#71717A] leading-relaxed italic max-w-sm mx-auto mt-1"
                >
                  {openingLetter?.lines?.[1] || 'From quiet sunrise tea to late-night highway melodies, you are my home.'}
                </p>

                {/* Staggered Line 3 */}
                <p 
                  ref={line3Ref} 
                  className="font-editorial text-xs sm:text-sm text-[#71717A] leading-relaxed italic max-w-sm mx-auto mt-1"
                >
                  {openingLetter?.lines?.[2] || 'Walk with me through our memories, our songs, and all our tomorrows.'}
                </p>

                {/* Closing & Flourish Signature */}
                <div ref={closingRef} className="mt-2.5 flex flex-col items-center">
                  <span ref={signatureRef} className="font-handwriting text-2xl sm:text-3xl text-[#8E1624]">
                    {openingLetter?.closing || 'Always yours,'} {openingLetter?.signature || partner1}
                  </span>
                  
                  {/* Subtle Botanical SVG Flourish under signature */}
                  <svg 
                    className="w-24 h-4 text-[#8E1624] opacity-80 mt-0.5 overflow-visible" 
                    viewBox="0 0 140 20" 
                    fill="none"
                  >
                    <path
                      ref={flourishPathRef}
                      d="M 10,12 C 35,4 55,18 70,10 C 85,2 105,16 130,10 M 70,6 C 68,3 64,3 64,7 C 64,10 70,14 70,14 C 70,14 76,10 76,7 C 76,3 72,3 70,6 Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Accordion Bottom Fold */}
              <div
                ref={letterBottomFoldRef}
                className="relative preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  ref={creaseShadowBottomRef}
                  className="absolute inset-0 crease-shadow-bottom pointer-events-none z-10"
                />
                <div ref={unfoldedHintRef} className="pt-2 border-t border-[#171717]/10 text-center">
                  <span className="font-sans text-[10px] tracking-widest uppercase text-[#8E1624] font-medium">
                    {invitation?.unfoldedHint || 'Scroll down to explore our story ↓'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pocket Triangular Side & Bottom Flaps (CSS polygon geometry) */}
            <div className="absolute inset-0 z-25 pointer-events-none">
              {/* Left Pocket Flap */}
              <div
                className="absolute inset-0 bg-[#171717] rounded-xl border border-[#303030] shadow-md"
                style={{
                  clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
                }}
              />
              {/* Right Pocket Flap */}
              <div
                className="absolute inset-0 bg-[#141416] rounded-xl border border-[#303030] shadow-md"
                style={{
                  clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)',
                }}
              />
              {/* Bottom Pocket Flap */}
              <div
                className="absolute inset-0 bg-[#1F1F22] rounded-xl border-t border-[#303030] shadow-inner"
                style={{
                  clipPath: 'polygon(0% 100%, 50% 48%, 100% 100%)',
                }}
              />
            </div>

            {/* TOP HINGED FLAP (Lid with 3D folding) */}
            <div
              ref={flapRef}
              className="absolute top-0 left-0 w-full h-[58%] origin-top preserve-3d z-30"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'top center',
              }}
            >
              {/* Outer Flap Surface (Visible when closed) */}
              <div
                className="w-full h-full bg-gradient-to-b from-[#303030] to-[#171717] rounded-t-xl border border-[#303030] backface-hidden shadow-xl"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                }}
              />

              {/* Reverse Flap Surface (Visible when rotated 180deg) */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#141416] to-[#26262A] rounded-b-xl border border-[#303030] shadow-inner"
                style={{
                  clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)',
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                }}
              />

              {/* Wax Seal at the Apex of the Flap */}
              <div
                ref={sealRef}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-35 flex flex-col items-center"
              >
                <WaxSeal
                  monogram={monogram}
                  isBroken={false}
                  onBreak={handleScrollToUnfold}
                />
              </div>
            </div>

          </div>
        </div>

        {/* REFINED INVITATION AFFORDANCE */}
        <div
          ref={invitationRef}
          onClick={handleScrollToUnfold}
          role="button"
          tabIndex={0}
          aria-label="Scroll down or click to open letter"
          className="mt-8 sm:mt-10 flex flex-col items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#71717A] font-medium">
            {invitation?.scrollPrompt || 'Scroll to Unfold'}
          </span>
          <div className="w-5 h-8 rounded-full border border-[#303030]/40 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-[#8E1624] animate-bounce" />
          </div>
          <span className="font-editorial text-xs italic text-[#71717A]">
            {invitation?.tapSealPrompt || '(or tap the wax seal)'}
          </span>
        </div>
      </section>
    </div>
  );
};
