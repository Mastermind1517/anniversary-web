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
      // Pinned for ~280vh of natural scroll distance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.85,
          pin: stageRef.current,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Natural sound cues tied to scroll position
            if (self.progress > 0.15 && !hasOpenedSoundFired.current) {
              sound.playWaxCrack();
              hasOpenedSoundFired.current = true;
            } else if (self.progress < 0.10) {
              hasOpenedSoundFired.current = false;
            }

            if (self.progress > 0.65 && !hasUnfoldedSoundFired.current) {
              sound.playPaperRustle();
              hasUnfoldedSoundFired.current = true;
            } else if (self.progress < 0.50) {
              hasUnfoldedSoundFired.current = false;
            }
          },
          onLeave: () => {
            onOpenComplete?.();
          },
        },
      });

      // 1. Initial State Setup
      gsap.set(flapRef.current, { transformOrigin: 'top center', rotateX: 0, zIndex: 30 });
      gsap.set(letterTopFoldRef.current, { transformOrigin: 'top center', rotateX: -160 });
      gsap.set(letterBottomFoldRef.current, { transformOrigin: 'bottom center', rotateX: 160 });
      gsap.set(letterRef.current, { yPercent: 0, scale: 0.98, overflow: 'hidden', zIndex: 10 });
      gsap.set([
        epistleRibbonRef.current,
        salutationRef.current,
        line1Ref.current,
        line2Ref.current,
        line3Ref.current,
        closingRef.current,
        unfoldedHintRef.current,
      ], { opacity: 0, y: 10 });
      if (flourishPathRef.current) {
        gsap.set(flourishPathRef.current, { strokeDasharray: 140, strokeDashoffset: 140 });
      }

      // 2. Deliberate Pause & Anticipation: Affordance fades, Header softens (0.00 -> 0.12)
      tl.to(invitationRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.08,
        ease: 'power1.out',
      }, 0);

      tl.to(headerRef.current, {
        opacity: 0,
        y: -12,
        duration: 0.14,
        ease: 'power1.out',
      }, 0.02);

      // 3. Wax Seal Tension & Release (0.12 -> 0.22)
      tl.to(sealRef.current, {
        scale: 1.08,
        y: -5,
        duration: 0.06,
        ease: 'power2.out',
      }, 0.12);

      tl.to(sealRef.current, {
        opacity: 0,
        scale: 1.25,
        duration: 0.07,
        ease: 'power1.in',
      }, 0.16);

      // 4. Flap Hinges Open with Authentic Cardstock Physics (0.22 -> 0.52)
      tl.to(flapRef.current, {
        rotateX: 180,
        duration: 0.30,
        ease: 'power2.inOut',
      }, 0.22);

      // Flip flap z-index as it rotates past 90 degrees so opened lid rests behind letter
      tl.set(flapRef.current, { zIndex: 12 }, 0.37);

      // Light penetrates pocket mouth, dissolving inner ambient occlusion
      tl.to(pocketShadowRef.current, {
        opacity: 0.08,
        duration: 0.24,
        ease: 'power1.out',
      }, 0.28);

      // 5. Letter Emerges from Envelope Pocket (0.50 -> 0.76)
      const isMobile = window.innerWidth < 640;
      tl.set(letterRef.current, { overflow: 'visible' }, 0.50);

      tl.to(letterRef.current, {
        yPercent: isMobile ? -84 : -72,
        scale: 1.02,
        duration: 0.26,
        ease: 'power2.out',
      }, 0.50);

      // Elevate letter above front pocket flaps once mostly extracted
      tl.set(letterRef.current, { zIndex: 28 }, 0.65);

      // 6. Accordion Folds Settle Flat (0.72 -> 0.88)
      tl.to(letterTopFoldRef.current, {
        rotateX: 0,
        duration: 0.18,
        ease: 'power2.out',
      }, 0.72);

      tl.to(letterBottomFoldRef.current, {
        rotateX: 0,
        duration: 0.18,
        ease: 'power2.out',
      }, 0.76);

      // Dissolve crease fold shadows
      tl.to([creaseShadowTopRef.current, creaseShadowBottomRef.current], {
        opacity: 0,
        duration: 0.14,
        ease: 'power1.out',
      }, 0.75);

      // 7. Progressive Editorial Ink Reveal (0.84 -> 0.98)
      tl.to(epistleRibbonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.10,
        ease: 'power1.out',
      }, 0.84);

      tl.to(salutationRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.12,
        ease: 'power1.out',
      }, 0.87);

      tl.to(line1Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.12,
        ease: 'power1.out',
      }, 0.90);

      tl.to(line2Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.12,
        ease: 'power1.out',
      }, 0.92);

      tl.to(line3Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.12,
        ease: 'power1.out',
      }, 0.94);

      tl.to(closingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.12,
        ease: 'power1.out',
      }, 0.95);

      if (flourishPathRef.current) {
        tl.to(flourishPathRef.current, {
          strokeDashoffset: 0,
          duration: 0.14,
          ease: 'power2.out',
        }, 0.95);
      }

      tl.to(unfoldedHintRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.10,
        ease: 'power1.out',
      }, 0.97);

      // 8. Subtle Narrative Bridge at End of Pin (0.97 -> 1.00)
      tl.to(envelopeWrapRef.current, {
        opacity: 0.9,
        duration: 0.05,
      }, 0.98);

    }, trackRef);

    return () => ctx.revert();
  }, [onOpenComplete]);

  // Click or keyboard trigger to smoothly scroll down and unfold
  const handleScrollToUnfold = () => {
    sound.playWaxCrack();
    if (trackRef.current) {
      const targetY = trackRef.current.offsetTop + trackRef.current.offsetHeight * 0.92;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <div ref={trackRef} className="relative w-full min-h-[280vh] z-20">
      {/* Pinned Stage Viewport Container */}
      <section
        ref={stageRef}
        className="relative h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden select-none"
      >
        {/* Soft Ambient Keylight Halo behind envelope */}
        <div 
          className="absolute w-[460px] sm:w-[640px] h-[460px] sm:h-[640px] rounded-full pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(142, 22, 36, 0.035) 0%, rgba(242, 239, 235, 0.7) 45%, transparent 72%)',
            filter: 'blur(55px)',
          }}
        />

        {/* Editorial Scene Header */}
        <div ref={headerRef} className="text-center mb-6 sm:mb-8 max-w-xl transition-all duration-700 pointer-events-none">
          <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#8E1624] font-semibold block mb-2">
            Anniversary Epistle
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-wide text-[#171717] mb-2 leading-tight">
            {partner1} <span className="font-editorial italic text-[#8E1624] text-3xl sm:text-5xl mx-1.5">&</span> {partner2}
          </h1>
          <p className="font-editorial text-base sm:text-xl text-[#71717A] italic tracking-wide">
            "{tagline}"
          </p>
        </div>

        {/* The Physical 3D Envelope Construct */}
        <div 
          ref={envelopeWrapRef} 
          className="relative w-[88vw] max-w-[480px] aspect-[1.5/1] perspective-1600 flex items-center justify-center transition-opacity"
        >
          {/* Ambient Multi-Layered Desk Contact Shadows */}
          <div className="absolute -bottom-7 sm:-bottom-9 left-1/2 -translate-x-1/2 w-[86%] h-9 bg-[#171717]/35 rounded-[50%] blur-2xl pointer-events-none" />
          <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-[72%] h-4 bg-[#09090A]/40 rounded-[50%] blur-md pointer-events-none" />

          {/* Envelope Shell Body with Cardstock Grain and Physical Shadow */}
          <div className="relative w-full h-full cardstock-grain rounded-xl envelope-desk-shadow border border-[#303030]/80 flex items-center justify-center overflow-visible">
            
            {/* Inner Pocket Lining (Dark Felt & Subtle Silk Grid) */}
            <div className="absolute inset-1.5 sm:inset-2 rounded-lg bg-[#09090A] border border-[#303030]/50 overflow-hidden">
              <div 
                className="w-full h-full opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(rgba(142, 22, 36, 0.4) 1px, transparent 1px)',
                  backgroundSize: '14px 14px',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Inner Pocket Ambient Occlusion Shadow */}
            <div
              ref={pocketShadowRef}
              className="absolute inset-1.5 sm:inset-2 rounded-lg bg-black/70 pointer-events-none z-10 transition-opacity"
            />

            {/* FOLDED PARCHMENT LETTER */}
            <div
              ref={letterRef}
              className="absolute bottom-2 sm:bottom-2.5 w-[92%] sm:w-[94%] h-[88%] bg-[#F9F8F5] text-[#171717] rounded-lg paper-shadow p-4 sm:p-6 flex flex-col justify-between border border-[#F2EFEB]"
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
                  <span className="font-handwriting text-2xl sm:text-4xl text-[#8E1624] mb-1.5 block">
                    {openingLetter?.salutation || `Dearest ${partner2},`}
                  </span>
                </div>

                {/* Staggered Line 1 */}
                <p 
                  ref={line1Ref} 
                  className="font-editorial text-xs sm:text-base text-[#171717] leading-relaxed italic max-w-sm mx-auto"
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
                <div ref={closingRef} className="mt-2 flex flex-col items-center">
                  <span ref={signatureRef} className="font-handwriting text-xl sm:text-3xl text-[#8E1624]">
                    {openingLetter?.closing || 'Always yours,'} {openingLetter?.signature || partner1}
                  </span>
                  
                  {/* Botanical SVG Flourish under signature */}
                  <svg 
                    className="w-20 sm:w-24 h-3.5 sm:h-4 text-[#8E1624] opacity-80 mt-0.5 overflow-visible" 
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

            {/* REALISTIC EURO-FLAP FRONT POCKET (Precision Vector Geometry) */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
              <svg 
                className="w-full h-full" 
                viewBox="0 0 480 320" 
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Left Flap Gradient */}
                  <linearGradient id="pocketLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e1e21" />
                    <stop offset="60%" stopColor="#171718" />
                    <stop offset="100%" stopColor="#101011" />
                  </linearGradient>

                  {/* Right Flap Gradient */}
                  <linearGradient id="pocketRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1b1b1e" />
                    <stop offset="60%" stopColor="#151516" />
                    <stop offset="100%" stopColor="#0e0e0f" />
                  </linearGradient>

                  {/* Bottom Flap Gradient */}
                  <linearGradient id="pocketBottomGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#222226" />
                    <stop offset="45%" stopColor="#19191b" />
                    <stop offset="100%" stopColor="#121213" />
                  </linearGradient>

                  {/* Bottom Flap Upward Contact Shadow onto side flaps */}
                  <filter id="bottomFlapThroatShadow" x="-10%" y="-25%" width="120%" height="150%">
                    <feDropShadow dx="0" dy="-3" stdDeviation="4" floodColor="#000000" floodOpacity="0.55" />
                  </filter>
                </defs>

                {/* Left Side Inward Flap */}
                <path
                  d="M 0,0 L 175,160 L 0,320 Z"
                  fill="url(#pocketLeftGrad)"
                  stroke="#2d2d30"
                  strokeWidth="0.75"
                />

                {/* Right Side Inward Flap */}
                <path
                  d="M 480,0 L 305,160 L 480,320 Z"
                  fill="url(#pocketRightGrad)"
                  stroke="#2d2d30"
                  strokeWidth="0.75"
                />

                {/* Bottom Overlapping Flap with Soft Throat Line Contour */}
                <path
                  d="M 0,320 L 120,165 Q 240,145 360,165 L 480,320 Z"
                  fill="url(#pocketBottomGrad)"
                  filter="url(#bottomFlapThroatShadow)"
                />

                {/* Bottom Flap Crisp Hairline Paper Stock Edge Highlight */}
                <path
                  d="M 0,320 L 120,165 Q 240,145 360,165 L 480,320"
                  fill="none"
                  stroke="#38383c"
                  strokeWidth="0.85"
                />
              </svg>
            </div>

            {/* TOP HINGED EURO FLAP (Lid with 3D folding and organic wax seal) */}
            <div
              ref={flapRef}
              className="absolute top-0 left-0 w-full h-[58%] origin-top preserve-3d z-30"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'top center',
              }}
            >
              {/* Outer Flap Face (Visible when closed) */}
              <div 
                className="w-full h-full backface-hidden"
                style={{
                  filter: 'drop-shadow(0px 8px 14px rgba(0, 0, 0, 0.45))',
                }}
              >
                <svg 
                  className="w-full h-full" 
                  viewBox="0 0 480 186" 
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="topFlapOuterGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#2c2c30" />
                      <stop offset="50%" stopColor="#1e1e21" />
                      <stop offset="100%" stopColor="#161618" />
                    </linearGradient>
                  </defs>

                  {/* Euro-Flap Contour with Soft Rounded Apex */}
                  <path
                    d="M 0,0 L 480,0 L 265,174 Q 240,186 215,174 Z"
                    fill="url(#topFlapOuterGrad)"
                  />

                  {/* Flap Hairline Edge Highlight */}
                  <path
                    d="M 0,0 L 215,174 Q 240,186 265,174 L 480,0"
                    fill="none"
                    stroke="#38383c"
                    strokeWidth="0.9"
                  />
                </svg>
              </div>

              {/* Reverse Flap Face (Visible when rotated 180deg) */}
              <div
                className="absolute inset-0"
                style={{
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                  filter: 'drop-shadow(0px -4px 10px rgba(0, 0, 0, 0.35))',
                }}
              >
                <svg 
                  className="w-full h-full" 
                  viewBox="0 0 480 186" 
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="topFlapInnerGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                      <stop offset="0%" stopColor="#121214" />
                      <stop offset="70%" stopColor="#1a1a1d" />
                      <stop offset="100%" stopColor="#242428" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 0,0 L 480,0 L 265,174 Q 240,186 215,174 Z"
                    fill="url(#topFlapInnerGrad)"
                    stroke="#2a2a2d"
                    strokeWidth="0.8"
                  />
                </svg>
              </div>

              {/* Organic Matte Crimson Wax Seal at the Euro-Flap Apex */}
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

        {/* BESPOKE MINIMAL EDITORIAL AFFORDANCE */}
        <div
          ref={invitationRef}
          onClick={handleScrollToUnfold}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleScrollToUnfold();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Scroll to unfold or tap the wax seal to open"
          className="mt-8 sm:mt-10 flex flex-col items-center gap-2 cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]/60 rounded-md px-4 py-2 transition-all duration-300 hover:opacity-85"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 sm:w-12 h-[1px] bg-[#171717]/25 transition-all duration-300 group-hover:w-14 group-hover:bg-[#8E1624]/50" />
            <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#171717]/80 group-hover:text-[#8E1624] font-medium transition-colors">
              {invitation?.scrollPrompt || 'Scroll to Unfold'}
            </span>
            <span className="w-8 sm:w-12 h-[1px] bg-[#171717]/25 transition-all duration-300 group-hover:w-14 group-hover:bg-[#8E1624]/50" />
          </div>
          <span className="font-serif italic text-xs tracking-wide text-[#71717A] group-hover:text-[#303030] transition-colors">
            {invitation?.tapSealPrompt || '(or tap the wax seal)'}
          </span>
        </div>
      </section>
    </div>
  );
};
