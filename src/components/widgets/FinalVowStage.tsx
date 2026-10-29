import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { AnniversaryData } from '../../types';
import { sound } from '../audio/SoundEngine';
import { Heart, Sparkles, Printer, Lock, Unlock, RotateCcw, Feather, Check, MapPin, Calendar } from 'lucide-react';
import { ElegantModal } from '../common/ElegantModal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FinalVowStageProps {
  partner1: string;
  partner2: string;
  letter: AnniversaryData['finalLetter'];
  secretVault: AnniversaryData['secretVault'];
  onReplay: () => void;
}

export const FinalVowStage: React.FC<FinalVowStageProps> = ({
  partner1,
  partner2,
  letter,
  secretVault,
  onReplay,
}) => {
  const [isVowSealed, setIsVowSealed] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [vaultPasscode, setVaultPasscode] = useState('');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [vaultErrorShake, setVaultErrorShake] = useState(false);
  const [vaultErrorMessage, setVaultErrorMessage] = useState('');

  const holdTimerRef = useRef<number | null>(null);
  const holdStartTimeRef = useRef<number | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const letterRef = useRef<HTMLDivElement | null>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const flourishPathRef = useRef<SVGPathElement | null>(null);

  // Scroll-driven progressive reveal using GSAP ScrollTrigger
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.fromTo(
          letterRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        );
        return;
      }

      // 1. Grand letter card elevation entrance
      gsap.fromTo(
        letterRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: letterRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 2. Paragraph-by-paragraph progressive reveal
      paragraphsRef.current.forEach((pEl) => {
        if (!pEl) return;
        gsap.fromTo(
          pEl,
          {
            opacity: 0,
            y: 16,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: pEl,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // 3. Signature botanical flourish draw
      if (flourishPathRef.current) {
        gsap.fromTo(
          flourishPathRef.current,
          { strokeDasharray: 140, strokeDashoffset: 140 },
          {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: flourishPathRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [letter.paragraphs]);

  // Tactile press-and-hold seal interaction
  const handleSealVow = () => {
    if (isVowSealed) return;
    sound.playWaxCrack();
    sound.playChord(523.25); // Celestial C5 chord
    setIsVowSealed(true);
    setIsHolding(false);
    setHoldProgress(100);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.72 },
        colors: ['#8E1624', '#A81E2E', '#F9F8F5', '#C5A880'],
        disableForReducedMotion: true,
      });
    } catch {
      // Safe fallback
    }
  };

  const startHold = () => {
    if (isVowSealed) return;
    setIsHolding(true);
    sound.playPaperRustle();
    holdStartTimeRef.current = Date.now();
    const duration = 1500; // 1.5 seconds

    const tick = () => {
      const elapsed = Date.now() - (holdStartTimeRef.current || Date.now());
      const p = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(p);

      if (p >= 100) {
        handleSealVow();
      } else {
        holdTimerRef.current = requestAnimationFrame(tick);
      }
    };

    holdTimerRef.current = requestAnimationFrame(tick);
  };

  const cancelHold = () => {
    if (isVowSealed) return;
    setIsHolding(false);
    if (holdTimerRef.current) {
      cancelAnimationFrame(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        cancelAnimationFrame(holdTimerRef.current);
      }
    };
  }, []);

  const handlePrint = () => {
    sound.playPaperRustle();
    window.print();
  };

  const handleReplayClick = () => {
    sound.playTapeClick();
    setIsVaultOpen(false);
    onReplay();
  };

  const handleVaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vaultPasscode.trim() === secretVault.passcode) {
      sound.playChord(659.25); // E5 triumph chord
      setIsVaultUnlocked(true);
      setVaultErrorMessage('');
    } else {
      sound.playTapeClick();
      setVaultErrorShake(true);
      setVaultErrorMessage('Incorrect passcode. Please check the hint and try again.');
      setTimeout(() => setVaultErrorShake(false), 500);
    }
  };

  return (
    <section
      id="vow-section"
      ref={sectionRef}
      className="relative w-full py-28 px-4 sm:px-8 z-10 flex flex-col items-center overflow-hidden select-none"
    >
      {/* Background Subtle Candlelight Radial Ambient Keylight */}
      <div
        className="absolute w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(circle, rgba(142, 22, 36, 0.035) 0%, rgba(242, 239, 235, 0.6) 50%, transparent 75%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Editorial Chapter Header */}
      <div className="text-center max-w-xl mx-auto mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#171717]/5 border border-[#171717]/10 text-[#8E1624] text-[11px] font-sans uppercase tracking-[0.28em] mb-3.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Anthology • Epilogue</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#171717] tracking-wide mb-3">
          Our Eternal Vow
        </h2>

        <p className="font-editorial text-base sm:text-xl text-[#71717A] italic max-w-md mx-auto leading-relaxed">
          All our memories and songs have led to this single, quiet promise. Words engraved from the deepest corners of the heart.
        </p>
      </div>

      {/* THE GRAND PARCHMENT LETTER */}
      <article
        ref={letterRef}
        aria-label="Our Eternal Vow Parchment Letter"
        className="relative w-full max-w-3xl bg-[#FFFFFF] text-[#171717] rounded-sm p-8 sm:p-14 md:p-16 shadow-[0_20px_50px_-10px_rgba(23,23,23,0.08)] border border-[#171717]/10 transition-shadow duration-500"
      >
        {/* Top Archival Header Strip */}
        <div className="flex items-center justify-between border-b border-[#171717]/10 pb-3 mb-8 text-xs font-sans tracking-widest uppercase">
          <span className="text-[#8E1624] font-medium flex items-center gap-1.5 text-[10px] tracking-[0.26em]">
            <Feather className="w-3.5 h-3.5" />
            <span>Perpetual Covenant</span>
          </span>
          <span className="text-[#71717A] font-editorial italic lowercase text-sm">
            for {partner2}, with all my soul
          </span>
        </div>

        {/* Salutation Greeting */}
        <div className="font-handwriting text-3xl sm:text-4xl text-[#8E1624] mb-6">
          {letter.greeting}
        </div>

        {/* Letter Body Paragraphs with Generous Negative Space & Editorial Measure */}
        <div className="space-y-6 text-[#171717] font-serif text-lg sm:text-2xl font-light leading-relaxed">
          {letter.paragraphs.map((paragraph, idx) => (
            <p
              key={idx}
              ref={(el) => {
                paragraphsRef.current[idx] = el;
              }}
              className="transition-opacity duration-300"
            >
              {idx === 0 && (
                <>
                  If you had told me four years ago that a single glance across a quiet room could realign the trajectory of my entire life, I would have thought you were speaking poetry. But with you, <span className="font-editorial italic text-[#8E1624]/90">poetry became our daily reality</span>.
                </>
              )}
              {idx === 1 && (
                <>
                  We have lived through seasons of brilliant sunlight and seasons of quiet, gentle storms. Through every joy, every late-night conversation, every early morning when the world was asleep and only we were awake, you have been my <span className="font-editorial italic text-[#8E1624]/90">anchor</span>, my sweetest comfort, and my greatest adventure.
                </>
              )}
              {idx === 2 && (
                <>
                  Thank you for loving me not just when it is easy, but especially when life feels heavy. Thank you for your patience, your boundless grace, your hilarious sense of humor, and the profound safety I feel wrapped in your arms.
                </>
              )}
              {idx === 3 && (
                <>
                  Four years together is only the prologue to the epic story we are writing. As long as I have breath, my heart belongs to you, <span className="font-editorial italic text-[#8E1624]/90 font-normal">wholly and without hesitation</span>.
                </>
              )}
              {idx > 3 && paragraph}
            </p>
          ))}
        </div>

        {/* Sign-off & Hand-Signed Signature */}
        <div className="mt-12 pt-6 border-t border-[#171717]/10 flex flex-col items-end">
          <span className="font-editorial text-base sm:text-lg text-[#71717A] italic">
            {letter.closing}
          </span>
          <span className="font-handwriting text-4xl sm:text-5xl text-[#8E1624] mt-1 transform -rotate-1">
            {letter.signature}
          </span>

          {/* Botanical SVG Flourish under signature */}
          <svg 
            className="w-28 h-4 text-[#8E1624] opacity-80 mt-1 overflow-visible" 
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

        {/* INTERACTIVE WAX SEAL IMPRESSION */}
        <div className="mt-12 pt-8 border-t border-[#171717]/10 flex flex-col items-center justify-center select-none">
          <button
            type="button"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSealVow();
              }
            }}
            aria-label={
              isVowSealed
                ? 'Vow sealed forever with official wax impression'
                : 'Press and hold to impress the permanent wax seal on our vow'
            }
            className={`group relative flex flex-col items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E1624] rounded-full p-3 touch-none ${
              isVowSealed ? 'cursor-default' : isHolding ? 'scale-95' : 'hover:scale-105 active:scale-95'
            }`}
          >
            {/* SVG Radial Hold Progress Ring */}
            {!isVowSealed && (
              <svg
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                viewBox="0 0 128 128"
              >
                {/* Track */}
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="#171717"
                  strokeOpacity="0.08"
                  strokeWidth="2.5"
                />
                {/* Filling Progress Stroke */}
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="#8E1624"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="364.4"
                  strokeDashoffset={364.4 - (holdProgress / 100) * 364.4}
                  className="transition-[stroke-dashoffset] duration-75"
                />
              </svg>
            )}

            {/* Organic Matte Crimson Wax Seal Medallion */}
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-700 shadow-xl relative border ${
                isVowSealed
                  ? 'bg-gradient-to-br from-[#8E1624] via-[#500D15] to-[#38080E] text-white border-white/20 shadow-[0_8px_24px_rgba(79,13,21,0.35)]'
                  : isHolding
                  ? 'bg-[#261014] text-[#F9F8F5] border-[#8E1624]'
                  : 'bg-[#171717] text-[#F9F8F5] border-[#303030] hover:border-[#8E1624]'
              }`}
            >
              <Heart
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${
                  isVowSealed
                    ? 'fill-white text-white scale-110'
                    : isHolding
                    ? 'fill-[#8E1624] text-[#8E1624] scale-125'
                    : 'fill-current text-[#8E1624]'
                }`}
              />

              <span className="font-serif text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase mt-1">
                {isVowSealed ? 'SEALED' : isHolding ? `${Math.round(holdProgress)}%` : 'SEAL VOW'}
              </span>

              <span className="font-sans text-[8px] tracking-wider uppercase opacity-75">
                {isVowSealed ? 'FOR ALL TIME' : isHolding ? 'HOLDING...' : 'HOLD TO SEAL'}
              </span>

              {/* Verified check badge if sealed */}
              {isVowSealed && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#8E1624] text-white flex items-center justify-center border border-white/40 shadow-md">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Seal Subtitle Annotation */}
            <span className="font-editorial italic text-base sm:text-lg text-[#8E1624] mt-4 text-center max-w-sm">
              {isVowSealed
                ? `"${partner1} & ${partner2} • Bound across all iterations of time"`
                : isHolding
                ? 'Holding seal... keep holding to seal'
                : 'Press and hold to impress our seal into eternity'}
            </span>
          </button>
        </div>
      </article>

      {/* TASTEFUL EPILOGUE ACTION SUITE */}
      <div className="mt-14 flex flex-wrap items-center justify-center gap-4 relative z-10">
        {/* Open Secret Vault Button */}
        <button
          onClick={() => {
            sound.playPaperRustle();
            setIsVaultOpen(true);
          }}
          aria-label="Open secret keepsake vault"
          className="px-6 py-3 rounded-sm bg-white hover:bg-[#171717] active:scale-95 text-[#171717] hover:text-[#F9F8F5] border border-[#171717]/15 shadow-sm hover:shadow transition-all duration-300 font-sans text-xs uppercase tracking-[0.24em] flex items-center gap-2.5 cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
        >
          <Lock className="w-3.5 h-3.5 text-[#8E1624] group-hover:text-white transition-colors" />
          <span>Open Secret Vault</span>
        </button>

        {/* Print Physical Keepsake */}
        <button
          onClick={handlePrint}
          aria-label="Print keepsake letter"
          className="px-6 py-3 rounded-sm bg-white hover:bg-[#171717] active:scale-95 text-[#171717] hover:text-[#F9F8F5] border border-[#171717]/15 shadow-sm hover:shadow transition-all duration-300 font-sans text-xs uppercase tracking-[0.24em] flex items-center gap-2.5 cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
        >
          <Printer className="w-3.5 h-3.5 text-[#71717A] group-hover:text-white transition-colors" />
          <span>Print Keepsake</span>
        </button>

        {/* Tasteful Replay Odyssey Button */}
        <button
          onClick={handleReplayClick}
          aria-label="Replay experience from the opening envelope"
          className="px-6 py-3 rounded-sm bg-white hover:bg-[#171717] active:scale-95 text-[#171717] hover:text-[#F9F8F5] border border-[#171717]/15 shadow-sm hover:shadow transition-all duration-300 font-sans text-xs uppercase tracking-[0.24em] flex items-center gap-2.5 cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#71717A] group-hover:text-white transition-colors group-hover:-rotate-90 duration-300" />
          <span>Replay Our Journey</span>
        </button>
      </div>

      {/* FINAL DEDICATION CLOSING BADGE */}
      <footer className="mt-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.24em] text-[#71717A] mb-2">
          <Sparkles className="w-3 h-3 text-[#8E1624]" />
          <span>To {partner2}, {partner1} & All Our Tomorrows</span>
          <Sparkles className="w-3 h-3 text-[#8E1624]" />
        </div>
        <p className="font-editorial italic text-[#71717A] text-sm max-w-sm mx-auto">
          "Whatever our souls are made of, yours and mine are the same."
        </p>
      </footer>

      {/* SECRET VAULT MODAL (Using Luxury ElegantModal Folio) */}
      <ElegantModal
        isOpen={isVaultOpen}
        onClose={() => {
          setIsVaultOpen(false);
          setIsVaultUnlocked(false);
          setVaultPasscode('');
          setVaultErrorMessage('');
        }}
        title={isVaultUnlocked ? 'Confidential Getaway' : 'The Secret Vault'}
        subtitle={isVaultUnlocked ? 'Surprise Revealed' : 'Keepsake Vault'}
        dateTag={isVaultUnlocked ? secretVault.date : 'Passcode Protected'}
        icon={isVaultUnlocked ? <Unlock className="w-4 h-4 text-[#8E1624]" /> : <Lock className="w-4 h-4 text-[#8E1624]" />}
      >
        {!isVaultUnlocked ? (
          <form onSubmit={handleVaultSubmit} className="text-center py-2">
            <p className="font-editorial text-base sm:text-lg text-[#71717A] italic mb-5 leading-relaxed">
              A private surprise is sealed inside. Enter our four-digit anniversary date to open the vault.
            </p>

            <div
              className={`max-w-xs mx-auto mb-3 transition-transform ${
                vaultErrorShake ? 'animate-shake' : ''
              }`}
            >
              <label htmlFor="vault-passcode-input" className="sr-only">
                Enter 4-digit anniversary passcode
              </label>
              <input
                id="vault-passcode-input"
                type="password"
                maxLength={4}
                value={vaultPasscode}
                onChange={(e) => {
                  setVaultPasscode(e.target.value);
                  if (vaultErrorMessage) setVaultErrorMessage('');
                }}
                placeholder="• • • •"
                aria-label="Enter 4-digit passcode"
                className={`w-full text-center tracking-[0.5em] font-mono text-2xl py-3 px-4 rounded-sm bg-[#FFFFFF] border text-[#171717] focus:outline-none transition-all ${
                  vaultErrorMessage
                    ? 'border-[#8E1624] focus:ring-1 focus:ring-[#8E1624]'
                    : 'border-[#171717]/15 focus:border-[#8E1624]'
                }`}
                autoFocus
              />
            </div>

            {/* Error Message Announcement for Accessibility */}
            <div aria-live="polite" className="min-h-[20px] mb-3">
              {vaultErrorMessage && (
                <span className="font-sans text-xs text-[#8E1624] font-medium block">
                  {vaultErrorMessage}
                </span>
              )}
            </div>

            <p className="font-sans text-[11px] text-[#71717A] mb-6">
              Hint: {secretVault.hint}
            </p>

            <button
              type="submit"
              className="w-full max-w-xs py-3 rounded-sm bg-[#8E1624] hover:bg-[#A81E2E] text-white font-sans text-xs uppercase tracking-[0.24em] font-medium shadow-md transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              Unlock Vault
            </button>
          </form>
        ) : (
          <div className="py-2 text-left">
            {/* Archival Boarding Pass / Getaway Certificate Motif */}
            <div className="border border-[#171717]/10 bg-[#FFFFFF] rounded-sm p-5 sm:p-6 mb-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#171717]/10 pb-2.5 mb-3">
                <span className="font-sans text-[10px] uppercase tracking-[0.26em] text-[#8E1624] font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{secretVault.destination}</span>
                </span>
                <span className="font-sans text-[10px] uppercase tracking-wider text-[#71717A] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#8E1624]" />
                  <span>{secretVault.date}</span>
                </span>
              </div>

              <h4 className="font-serif text-2xl font-light text-[#171717] mb-3 text-center">
                A Weekend Just for Us
              </h4>

              <div className="bg-[#171717]/[0.025] rounded-sm p-4 sm:p-5 border border-[#171717]/8 my-3">
                <p className="font-editorial text-lg sm:text-xl text-[#171717] leading-relaxed italic text-center">
                  "{secretVault.secretMessage}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#524C48] font-sans pt-2">
              <span className="font-editorial italic text-[#524C48]">Pack your bags, my love</span>
              <span className="font-handwriting text-2xl text-[#8E1624]">Forever {letter.signature || partner1}</span>
            </div>
          </div>
        )}
      </ElegantModal>
    </section>
  );
};
