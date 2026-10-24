import React, { useState, useEffect, useRef } from 'react';
import type { HiddenMessage } from '../../types';
import { sound } from '../audio/SoundEngine';
import { Feather, X, Sparkles, Clock, BookOpen } from 'lucide-react';

interface FloatingMemoryWidgetProps {
  hiddenMessages: HiddenMessage[];
  anniversaryDate: string;
  onScrollTo: (sectionId: string) => void;
  onOpenMessageModal: (msg: HiddenMessage) => void;
}

export const FloatingMemoryWidget: React.FC<FloatingMemoryWidgetProps> = ({
  hiddenMessages,
  anniversaryDate,
  onScrollTo,
  onOpenMessageModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  // Purely initialize elapsed days based on anniversaryDate on mount
  const [elapsedDays] = useState<number>(() => {
    const start = new Date(anniversaryDate).getTime();
    return Math.floor(Math.max(0, Date.now() - start) / (1000 * 60 * 60 * 24));
  });

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    sound.playPaperRustle();
    setIsOpen(!isOpen);
  };

  const nextWhisper = () => {
    sound.playPaperRustle();
    setActiveMessageIndex((prev) => (prev + 1) % hiddenMessages.length);
  };

  const currentMsg = hiddenMessages[activeMessageIndex] || hiddenMessages[0];

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 select-none"
    >
      {/* EXPANDED KEEPSAKE PANEL */}
      {isOpen && (
        <div className="mb-3 w-[88vw] max-w-[320px] sm:max-w-[350px] bg-[#1a121e]/95 backdrop-blur-xl border border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 shadow-2xl text-[#fbf8f2] animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="font-serif text-sm font-medium tracking-wide text-[#fbf8f2]">
                Keepsake Companion
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close keepsake panel"
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Elapsed Days Milestone Banner */}
          <div className="bg-[#d4af37]/10 border border-[#d4af37]/25 rounded-xl p-3 mb-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-base font-semibold text-[#fbf8f2] block leading-none">
                {elapsedDays.toLocaleString()} Days
              </span>
              <span className="font-editorial text-xs text-[#d4af37] italic">
                of holding eternity in our hands
              </span>
            </div>
          </div>

          {/* Whispered Secret of the Moment */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 mb-3.5 relative">
            <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-widest text-[#d4af37] mb-1.5">
              <span>Whisper {activeMessageIndex + 1} of {hiddenMessages.length}</span>
              <button
                onClick={nextWhisper}
                className="hover:underline text-neutral-300 font-sans cursor-pointer text-[10px]"
              >
                Next whisper →
              </button>
            </div>

            <h5 className="font-serif text-xs font-semibold text-[#fbf8f2] mb-1">
              {currentMsg.title}
            </h5>
            <p className="font-handwriting text-base text-neutral-300 line-clamp-3 leading-snug">
              "{currentMsg.content}"
            </p>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenMessageModal(currentMsg);
              }}
              className="mt-2 text-[10px] font-sans text-[#d4af37] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3 h-3" />
              <span>Read complete archival note</span>
            </button>
          </div>

          {/* Quick Scene Jumper Shortcuts */}
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">
              Chapter Navigation
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-sans">
              <button
                onClick={() => {
                  onScrollTo('memories-section');
                  setIsOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37] text-left transition-colors cursor-pointer text-[11px]"
              >
                II • Chronicle
              </button>
              <button
                onClick={() => {
                  onScrollTo('mixtape-section');
                  setIsOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37] text-left transition-colors cursor-pointer text-[11px]"
              >
                III • Mixtape
              </button>
              <button
                onClick={() => {
                  onScrollTo('notes-section');
                  setIsOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37] text-left transition-colors cursor-pointer text-[11px]"
              >
                IV • Love Notes
              </button>
              <button
                onClick={() => {
                  onScrollTo('constellation-section');
                  setIsOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37] text-left transition-colors cursor-pointer text-[11px]"
              >
                V • Constellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TALISMAN BUTTON */}
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? 'Close keepsake companion' : 'Open keepsake companion and whispered secrets'}
        className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] via-[#b89327] to-[#8b1e2b] text-[#1b131c] shadow-[0_8px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.6)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-[#f5e4a8]/50 relative group ${
          isOpen ? 'rotate-90' : 'rotate-0'
        }`}
      >
        {/* Subtle breathing aura */}
        <span className="absolute inset-0 rounded-full bg-[#d4af37]/30 animate-ping pointer-events-none" />

        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Feather className="w-5 h-5 fill-current text-[#1b131c]" />
        )}
      </button>
    </div>
  );
};
