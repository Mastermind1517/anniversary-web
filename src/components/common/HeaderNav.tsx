import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Heart, Sparkles } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface HeaderNavProps {
  monogram: string;
  isEnvelopeOpen: boolean;
  onScrollTo: (sectionId: string) => void;
  onOpenMonogramSecret?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  monogram,
  isEnvelopeOpen,
  onScrollTo,
  onOpenMonogramSecret,
}) => {
  const { isPlaying, isMuted, togglePlay, toggleMute, frequencyData } = useAudio();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState('Prologue');

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const pct = (window.scrollY / totalScroll) * 100;
        setScrollProgress(pct);
      }

      // Dynamic active chapter detection
      const scrollPos = window.scrollY + 200;
      const memEl = document.getElementById('memories-section');
      const mixEl = document.getElementById('mixtape-section');
      const noteEl = document.getElementById('notes-section');
      const constEl = document.getElementById('constellation-section');
      const vowEl = document.getElementById('vow-section');

      if (vowEl && scrollPos >= vowEl.offsetTop) {
        setActiveChapter('Epilogue • The Vow');
      } else if (constEl && scrollPos >= constEl.offsetTop) {
        setActiveChapter('Chapter V • Stars');
      } else if (noteEl && scrollPos >= noteEl.offsetTop) {
        setActiveChapter('Chapter IV • Letters');
      } else if (mixEl && scrollPos >= mixEl.offsetTop) {
        setActiveChapter('Chapter III • Music');
      } else if (memEl && scrollPos >= memEl.offsetTop) {
        setActiveChapter('Chapter II • Chronicle');
      } else {
        setActiveChapter('Chapter I • Epistle');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-black/5 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#4F0D15] via-[#8E1624] to-[#A81E2E] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Glassmorphic Navigation Pill */}
      <header className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-40 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-[#F2EFEB] shadow-[0_4px_24px_rgba(23,23,23,0.08)] flex items-center gap-3 sm:gap-5 transition-all duration-500 hover:border-[#8E1624]/30 max-w-[94vw]">
        {/* Monogram / Brand (Clickable Discovery Easter Egg) */}
        <button
          onClick={onOpenMonogramSecret}
          title="Click to discover the Monogram Inscription secret"
          aria-label={`Anniversary Monogram: ${monogram}. Click to reveal secret inscription.`}
          className="flex items-center gap-1.5 sm:gap-2 text-[#8E1624] group cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#8E1624] text-[#8E1624] group-hover:scale-110 transition-transform" />
          <span className="font-serif tracking-widest text-xs font-semibold text-[#171717]">
            {monogram}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#8E1624]/40 group-hover:bg-[#8E1624] transition-colors" />
        </button>

        {/* Dynamic Chapter Indicator Pill */}
        {isEnvelopeOpen && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8E1624]/10 border border-[#8E1624]/20 text-[10px] font-sans uppercase tracking-wider text-[#8E1624]">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{activeChapter}</span>
          </div>
        )}

        <div className="w-[1px] h-3.5 bg-[#171717]/10 hidden sm:block" />

        {/* Section Quick Links (Visible once envelope has opened) */}
        {isEnvelopeOpen && (
          <nav className="hidden md:flex items-center gap-3 lg:gap-4 text-[11px] font-sans tracking-wider uppercase text-[#71717A]">
            <button
              onClick={() => onScrollTo('memories-section')}
              className="hover:text-[#8E1624] transition-colors cursor-pointer"
            >
              Memories
            </button>
            <button
              onClick={() => onScrollTo('mixtape-section')}
              className="hover:text-[#8E1624] transition-colors cursor-pointer"
            >
              Soundtracks
            </button>
            <button
              onClick={() => onScrollTo('notes-section')}
              className="hover:text-[#8E1624] transition-colors cursor-pointer"
            >
              Letters
            </button>
            <button
              onClick={() => onScrollTo('constellation-section')}
              className="hover:text-[#8E1624] transition-colors cursor-pointer"
            >
              Stars
            </button>
            <button
              onClick={() => onScrollTo('vow-section')}
              className="hover:text-[#4F0D15] transition-colors cursor-pointer text-[#8E1624] font-medium"
            >
              Our Vow
            </button>
          </nav>
        )}

        <div className="w-[1px] h-3.5 bg-[#171717]/10" />

        {/* Audio Quick Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Ambient Music Toggle Button */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause soundtrack' : 'Play ambient soundtrack'}
            className={`p-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              isPlaying
                ? 'bg-[#8E1624]/10 text-[#8E1624] border border-[#8E1624]/30'
                : 'text-[#71717A] hover:text-[#171717] hover:bg-black/5'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            {/* Visualizer Mini Bars */}
            {isPlaying && (
              <span className="flex items-end gap-[2px] h-3 px-0.5">
                {frequencyData.slice(0, 3).map((val, idx) => (
                  <span
                    key={idx}
                    className="w-[2px] bg-[#8E1624] rounded-full transition-all duration-75"
                    style={{ height: `${Math.max(25, val * 100)}%` }}
                  />
                ))}
              </span>
            )}
          </button>

          {/* Master Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-1.5 rounded-full text-[#71717A] hover:text-[#8E1624] hover:bg-black/5 transition-colors cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </header>
    </>
  );
};
