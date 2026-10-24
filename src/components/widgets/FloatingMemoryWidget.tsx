import React, { useState, useRef, useEffect } from 'react';
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

  // Calculate elapsed days
  const [elapsedDays] = useState(() => {
    const start = new Date(anniversaryDate).getTime();
    const now = new Date().getTime();
    return Math.floor(Math.max(0, now - start) / (1000 * 60 * 60 * 24));
  });

  // Handle outside click to close drawer
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const toggleOpen = () => {
    sound.playTapeClick();
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
        <div className="mb-3 w-[88vw] max-w-[320px] sm:max-w-[350px] bg-white/98 backdrop-blur-xl border border-[#171717]/10 rounded-sm p-4 sm:p-5 shadow-[0_20px_45px_-10px_rgba(23,23,23,0.15)] text-[#171717] animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#171717]/10 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#8E1624]" />
              <span className="font-serif text-sm font-medium tracking-wide text-[#171717]">
                Keepsake Companion
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close keepsake panel"
              className="p-1 rounded-full text-[#71717A] hover:text-[#171717] hover:bg-black/5 transition-colors cursor-pointer focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Elapsed Days Milestone Banner */}
          <div className="bg-[#F9F8F5] border border-[#171717]/8 rounded-sm p-3 mb-3.5 flex items-center gap-3">
            <div className="p-2 rounded-sm bg-[#8E1624]/10 text-[#8E1624]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-base font-semibold text-[#171717] block leading-none">
                {elapsedDays.toLocaleString()} Days
              </span>
              <span className="font-editorial text-xs text-[#8E1624] italic">
                of holding eternity in our hands
              </span>
            </div>
          </div>

          {/* Whispered Secret of the Moment */}
          <div className="bg-[#F9F8F5] border border-[#171717]/8 rounded-sm p-3.5 mb-3.5 relative">
            <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-widest text-[#8E1624] mb-1.5 font-medium">
              <span>Whisper {activeMessageIndex + 1} of {hiddenMessages.length}</span>
              <button
                onClick={nextWhisper}
                className="hover:underline text-[#71717A] font-sans cursor-pointer text-[10px] uppercase tracking-wider"
              >
                Next whisper →
              </button>
            </div>

            <h5 className="font-serif text-xs font-semibold text-[#171717] mb-1">
              {currentMsg.title}
            </h5>
            <p className="font-handwriting text-base text-[#171717] line-clamp-3 leading-snug">
              "{currentMsg.content}"
            </p>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenMessageModal(currentMsg);
              }}
              className="mt-2 text-[10px] font-sans uppercase tracking-wider text-[#8E1624] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
            >
              <BookOpen className="w-3 h-3" />
              <span>Read complete archival note</span>
            </button>
          </div>

          {/* Quick Scene Jumper Shortcuts */}
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#71717A] block mb-2 font-medium">
              Chapter Navigation
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-sans">
              <button
                onClick={() => {
                  onScrollTo('memories-section');
                  setIsOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-sm bg-white hover:bg-[#F2EFEB] border border-[#171717]/10 text-left transition-colors cursor-pointer text-[11px] text-[#171717]"
              >
                II • Chronicle
              </button>
              <button
                onClick={() => {
                  onScrollTo('mixtape-section');
                  setIsOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-sm bg-white hover:bg-[#F2EFEB] border border-[#171717]/10 text-left transition-colors cursor-pointer text-[11px] text-[#171717]"
              >
                III • Mixtape
              </button>
              <button
                onClick={() => {
                  onScrollTo('notes-section');
                  setIsOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-sm bg-white hover:bg-[#F2EFEB] border border-[#171717]/10 text-left transition-colors cursor-pointer text-[11px] text-[#171717]"
              >
                IV • Love Notes
              </button>
              <button
                onClick={() => {
                  onScrollTo('constellation-section');
                  setIsOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-sm bg-white hover:bg-[#F2EFEB] border border-[#171717]/10 text-left transition-colors cursor-pointer text-[11px] text-[#171717]"
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
        className={`w-12 h-12 rounded-full bg-[#171717] text-white shadow-[0_8px_25px_rgba(23,23,23,0.25)] hover:shadow-[0_12px_32px_rgba(142,22,36,0.3)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-[#303030] hover:border-[#8E1624]/60 relative group focus:outline-none focus-visible:ring-1 focus-visible:ring-white ${
          isOpen ? 'rotate-90' : 'rotate-0'
        }`}
      >
        {/* Subtle breathing aura with reduced-motion respect */}
        <span className="absolute inset-0 rounded-full bg-[#8E1624]/20 animate-ping pointer-events-none motion-reduce:hidden" />

        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Feather className="w-5 h-5 fill-current text-[#8E1624]" />
        )}
      </button>
    </div>
  );
};
