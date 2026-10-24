import React, { useState, useEffect, useRef } from 'react';
import type { AnniversaryData } from '../../types';
import { sound } from '../audio/SoundEngine';
import { Heart, Sparkles, Printer, Lock, RotateCcw, Feather, Check } from 'lucide-react';
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
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [vaultPasscode, setVaultPasscode] = useState('');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [vaultErrorShake, setVaultErrorShake] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const letterRef = useRef<HTMLDivElement | null>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  // Scroll-driven progressive text reveal using GSAP ScrollTrigger
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
          y: 70,
          opacity: 0,
          scale: 0.96,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: letterRef.current,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );

      // 2. Line-by-line / paragraph-by-paragraph progressive reveal
      paragraphsRef.current.forEach((pEl) => {
        if (!pEl) return;
        gsap.fromTo(
          pEl,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: pEl,
              start: 'top 88%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [letter.paragraphs]);

  // Click seal interaction
  const handleSealVow = () => {
    if (isVowSealed) return;
    sound.playWaxCrack();
    sound.playChord(523.25); // Celestial C5 chord
    setIsVowSealed(true);
  };

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
    } else {
      sound.playTapeClick();
      setVaultErrorShake(true);
      setTimeout(() => setVaultErrorShake(false), 500);
    }
  };

  return (
    <section
      id="vow-section"
      ref={sectionRef}
      className="relative w-full py-28 px-4 sm:px-8 z-10 flex flex-col items-center overflow-hidden"
    >
      {/* Background Subtle Candlelight Radial Glow */}
      <div
        className="absolute w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(139, 30, 43, 0.04) 50%, transparent 75%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Editorial Chapter Header */}
      <div className="text-center max-w-xl mx-auto mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-xs font-sans uppercase tracking-widest mb-3.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Epilogue • The Grand Climax</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#fbf8f2] tracking-wide mb-3">
          Our Eternal Vow
        </h2>

        <p className="font-editorial text-lg sm:text-xl text-neutral-300 italic max-w-md mx-auto leading-relaxed">
          All our memories have led to this single, quiet promise. Words engraved from the deepest corners of the heart.
        </p>
      </div>

      {/* THE GRAND PARCHMENT LETTER */}
      <div
        ref={letterRef}
        className="relative w-full max-w-3xl bg-[#fcf9f2] text-[#2b231e] rounded-2xl p-6 sm:p-12 md:p-16 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7),0_0_35px_rgba(212,175,55,0.12)] border border-[#e4d7c2] transition-shadow duration-500"
      >
        {/* Top Archival Header Strip */}
        <div className="flex items-center justify-between border-b border-[#2b231e]/15 pb-4 mb-8 text-xs font-sans tracking-widest uppercase">
          <span className="text-[#8b1e2b] font-semibold flex items-center gap-1.5">
            <Feather className="w-3.5 h-3.5" />
            <span>Perpetual Covenant</span>
          </span>
          <span className="text-neutral-500 font-editorial italic lowercase text-sm">
            for {partner2}, with all my soul
          </span>
        </div>

        {/* Vintage Brass Corner Clips */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#b38f2b]/50 pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#b38f2b]/50 pointer-events-none" />

        {/* Salutation Greeting */}
        <div className="font-script text-4xl sm:text-5xl text-[#8b1e2b] mb-6">
          {letter.greeting}
        </div>

        {/* Letter Body Paragraphs with Progressive Ink Reveal */}
        <div className="space-y-6 text-[#231b14] font-editorial text-lg sm:text-2xl leading-relaxed italic">
          {letter.paragraphs.map((paragraph, idx) => (
            <p
              key={idx}
              ref={(el) => {
                paragraphsRef.current[idx] = el;
              }}
              className="transition-opacity duration-300"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Sign-off & Hand-Signed Signature */}
        <div className="mt-12 pt-6 border-t border-[#2b231e]/15 flex flex-col items-end">
          <span className="font-editorial text-lg text-neutral-600 italic">
            {letter.closing}
          </span>
          <span className="font-script text-4xl sm:text-6xl text-[#8b1e2b] mt-1.5 transform -rotate-1">
            {letter.signature}
          </span>
        </div>

        {/* INTERACTIVE WAX SEAL IMPRESSION */}
        <div className="mt-10 pt-8 border-t border-[#d4af37]/30 flex flex-col items-center justify-center">
          <button
            onClick={handleSealVow}
            aria-label={
              isVowSealed
                ? 'Vow sealed forever with official gold wax stamp'
                : 'Click to impress the permanent wax seal on our vow'
            }
            className={`group relative flex flex-col items-center justify-center transition-all duration-500 cursor-pointer ${
              isVowSealed ? 'cursor-default' : 'hover:scale-105 active:scale-95'
            }`}
          >
            {/* The Wax Seal Medallion */}
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-700 border-2 shadow-2xl relative ${
                isVowSealed
                  ? 'bg-gradient-to-tr from-[#9a741e] via-[#d4af37] to-[#ffe89e] text-[#2b231e] border-white/60 drop-shadow-[0_12px_24px_rgba(212,175,55,0.4)]'
                  : 'bg-gradient-to-br from-[#8b1e2b] via-[#6a1520] to-[#450a12] text-[#fbf8f2] border-[#d4af37]/40 hover:border-[#d4af37]'
              }`}
            >
              <Heart
                className={`w-6 h-6 transition-transform duration-300 ${
                  isVowSealed ? 'fill-[#8b1e2b] text-[#8b1e2b] scale-110' : 'fill-current text-[#d4af37]'
                }`}
              />

              <span className="font-serif text-[11px] font-bold tracking-widest uppercase mt-1">
                {isVowSealed ? 'SEALED' : 'SEAL VOW'}
              </span>

              <span className="font-sans text-[8px] tracking-wider uppercase opacity-80">
                {isVowSealed ? 'FOREVER' : 'TAP TO IMPRESS'}
              </span>

              {/* Verified check badge if sealed */}
              {isVowSealed && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#8b1e2b] text-white flex items-center justify-center border border-white/40 shadow-md">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Seal Subtitle Annotation */}
            <span className="font-handwriting text-xl sm:text-2xl text-[#8b1e2b] mt-4 text-center">
              {isVowSealed
                ? `"${partner1} & ${partner2} • Bound across all iterations of time"`
                : 'Click to stamp our names into eternity'}
            </span>
          </button>
        </div>
      </div>

      {/* TASTEFUL EPILOGUE ACTION SUITE */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-4 relative z-10">
        {/* Open Secret Vault Button */}
        <button
          onClick={() => {
            sound.playPaperRustle();
            setIsVaultOpen(true);
          }}
          className="px-6 py-3 rounded-full bg-[#18111b] hover:bg-[#221626] text-[#d4af37] border border-[#d4af37]/45 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all font-sans text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer group"
        >
          <Lock className="w-4 h-4 text-[#d4af37] transition-transform group-hover:scale-110" />
          <span>Open Secret Vault</span>
        </button>

        {/* Print Physical Keepsake */}
        <button
          onClick={handlePrint}
          aria-label="Print keepsake letter"
          className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 transition-all font-sans text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer group"
        >
          <Printer className="w-4 h-4 text-neutral-300 transition-transform group-hover:scale-110" />
          <span>Print Keepsake</span>
        </button>

        {/* Tasteful Replay Odyssey Button */}
        <button
          onClick={handleReplayClick}
          aria-label="Replay experience from the opening envelope"
          className="px-6 py-3 rounded-full bg-white/5 hover:bg-[#d4af37]/15 text-neutral-300 hover:text-[#d4af37] border border-white/15 hover:border-[#d4af37]/40 transition-all font-sans text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer group"
        >
          <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-90 duration-300" />
          <span>Replay Our Journey</span>
        </button>
      </div>

      {/* FINAL DEDICATION CLOSING BADGE */}
      <div className="mt-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#d4af37]/80 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>To {partner2}, {partner1} & All Our Tomorrows</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <p className="font-editorial italic text-neutral-400 text-sm max-w-sm mx-auto">
          "Whatever our souls are made of, yours and mine are the same."
        </p>
      </div>

      {/* SECRET VAULT MODAL (Using ElegantModal) */}
      <ElegantModal
        isOpen={isVaultOpen}
        onClose={() => {
          setIsVaultOpen(false);
          setIsVaultUnlocked(false);
          setVaultPasscode('');
        }}
        title={isVaultUnlocked ? 'Confidential Getaway' : 'The Secret Vault'}
        subtitle={isVaultUnlocked ? 'Surprise Revealed' : 'Restricted Keepsake'}
        dateTag={isVaultUnlocked ? 'November 15' : 'Passcode Required'}
        icon={<Lock className="w-4 h-4 text-[#8b1e2b]" />}
      >
        {!isVaultUnlocked ? (
          <form onSubmit={handleVaultSubmit} className="text-center py-2">
            <p className="font-editorial text-lg text-neutral-700 italic mb-4">
              A private surprise is sealed inside. Enter the four-digit anniversary passcode to open it.
            </p>

            <div
              className={`max-w-xs mx-auto mb-4 ${
                vaultErrorShake ? 'animate-bounce text-red-500' : ''
              }`}
            >
              <input
                type="password"
                maxLength={4}
                value={vaultPasscode}
                onChange={(e) => setVaultPasscode(e.target.value)}
                placeholder="• • • •"
                aria-label="Enter 4-digit passcode"
                className="w-full text-center tracking-[0.5em] font-mono text-2xl py-2.5 px-4 rounded-xl bg-black/5 border border-black/15 text-[#2b231e] focus:outline-none focus:border-[#d4af37] transition-all"
                autoFocus
              />
            </div>

            <p className="font-sans text-[11px] text-neutral-500 mb-5">
              Hint: {secretVault.hint}
            </p>

            <button
              type="submit"
              className="w-full max-w-xs py-2.5 rounded-xl bg-gradient-to-r from-[#8b1e2b] to-[#b32738] text-white font-sans text-xs uppercase tracking-widest font-semibold hover:brightness-110 shadow-md transition-all cursor-pointer"
            >
              Unlock Vault
            </button>
          </form>
        ) : (
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#8b1e2b] flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 fill-[#8b1e2b]" />
            </div>

            <h4 className="font-serif text-xl text-[#231b14] font-medium mb-3">
              A Weekend Just for Us
            </h4>

            <p className="font-handwriting text-2xl sm:text-3xl text-[#2b231e] leading-relaxed my-4 px-2">
              "{secretVault.secretMessage}"
            </p>
          </div>
        )}
      </ElegantModal>
    </section>
  );
};
