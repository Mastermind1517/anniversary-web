import React, { useState, useEffect, useCallback } from 'react';
import type { LoveNote } from '../../types';
import { sound } from '../audio/SoundEngine';
import { Heart, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ElegantModal } from '../common/ElegantModal';

interface LoveNotesJarProps {
  notes: LoveNote[];
}

export const LoveNotesJar: React.FC<LoveNotesJarProps> = ({ notes }) => {
  const [openedNotes, setOpenedNotes] = useState<number[]>([]);
  const [activeModalNote, setActiveModalNote] = useState<LoveNote | null>(null);

  const handleOpenNote = useCallback((note: LoveNote) => {
    sound.playPaperRustle();
    setOpenedNotes((prev) => {
      if (!prev.includes(note.id)) {
        const next = [...prev, note.id];
        if (next.length === notes.length) {
          sound.playChime(659.25); // E5 celebration chime
        } else {
          sound.playChime(523.25); // C5 chime
        }
        return next;
      }
      return prev;
    });
    setActiveModalNote(note);
  }, [notes.length]);

  // Navigate to previous note in modal
  const handlePrevNote = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!activeModalNote) return;
    const currentIdx = notes.findIndex((n) => n.id === activeModalNote.id);
    const prevIdx = (currentIdx - 1 + notes.length) % notes.length;
    handleOpenNote(notes[prevIdx]);
  }, [activeModalNote, handleOpenNote, notes]);

  // Navigate to next note in modal
  const handleNextNote = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!activeModalNote) return;
    const currentIdx = notes.findIndex((n) => n.id === activeModalNote.id);
    const nextIdx = (currentIdx + 1) % notes.length;
    handleOpenNote(notes[nextIdx]);
  }, [activeModalNote, handleOpenNote, notes]);

  // Keyboard navigation for active modal (Left/Right arrows)
  useEffect(() => {
    if (!activeModalNote) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevNote();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextNote();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalNote, handlePrevNote, handleNextNote]);

  const progressPercent = Math.round((openedNotes.length / notes.length) * 100);

  return (
    <section id="notes-section" className="relative w-full py-28 px-4 sm:px-8 z-10 select-none">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#171717]/5 border border-[#171717]/10 text-[#8E1624] text-[11px] font-sans uppercase tracking-[0.28em] mb-3.5">
          <Heart className="w-3.5 h-3.5 fill-[#8E1624]" />
          <span>Anthology • Chapter IV</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#171717] tracking-wide mb-3">
          Twelve Inscribed Vows
        </h2>
        <p className="font-editorial text-base sm:text-xl text-[#71717A] italic leading-relaxed mb-6">
          A collection of folded keepsake letters. Unfold each letter to reveal a reason why loving you is effortless.
        </p>

        {/* Quiet Editorial Discovery Tracker */}
        <div className="inline-flex flex-col items-center gap-2 px-6 py-2.5 rounded-sm bg-white border border-[#171717]/10 shadow-[0_2px_8px_rgba(23,23,23,0.03)]">
          <div className="flex items-center gap-3 text-[10px] font-sans uppercase tracking-[0.24em] text-[#171717]/80">
            <span className="w-4 h-[1px] bg-[#171717]/20" />
            <span>
              Unveiled: {openedNotes.length} of {notes.length} Letters ({progressPercent}%)
            </span>
            <span className="w-4 h-[1px] bg-[#171717]/20" />
          </div>
          <div className="w-44 h-1 bg-[#F2EFEB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8E1624] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {openedNotes.length === notes.length && (
            <span className="font-editorial italic text-[#8E1624] text-xs mt-0.5">
              All twelve epistles unfolded. My heart is completely yours.
            </span>
          )}
        </div>
      </div>

      {/* Grid of Folded Keepsake Letter Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {notes.map((note) => {
          const isOpened = openedNotes.includes(note.id);
          const noteNumber = String(note.id).padStart(2, '0');

          return (
            <div
              key={note.id}
              onClick={() => handleOpenNote(note)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenNote(note);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Unfold letter ${noteNumber}: ${note.teaser}`}
              className={`relative p-5 sm:p-6 rounded-sm border transition-all duration-300 cursor-pointer text-left flex flex-col justify-between min-h-[160px] sm:min-h-[180px] shadow-[0_2px_12px_rgba(23,23,23,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(23,23,23,0.08)] hover:-translate-y-1 active:scale-[0.98] group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624] ${
                isOpened
                  ? 'bg-[#F9F8F5] border-[#8E1624]/25'
                  : 'bg-white border-[#171717]/10 hover:border-[#8E1624]/40'
              }`}
            >
              {/* Top Meta: Number & Category */}
              <div className="flex items-center justify-between pb-2 border-b border-[#171717]/8 text-xs">
                <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#71717A] font-medium group-hover:text-[#171717] transition-colors">
                  Letter {noteNumber}
                </span>
                {isOpened ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-sans uppercase tracking-widest text-[#8E1624] font-medium">
                    <Check className="w-3 h-3 text-[#8E1624]" />
                    <span>Read</span>
                  </span>
                ) : (
                  <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#8E1624] font-medium">
                    {note.category}
                  </span>
                )}
              </div>

              {/* Note Teaser Title */}
              <div className="my-2.5">
                <h3 className="font-serif text-lg sm:text-xl font-normal text-[#171717] leading-snug group-hover:text-[#8E1624] transition-colors">
                  "{note.teaser}"
                </h3>
              </div>

              {/* Bottom Affordance */}
              <div className="pt-2 border-t border-[#171717]/8 flex items-center justify-between text-[10px] font-sans text-[#8E1624]">
                <span className="font-medium tracking-wider uppercase group-hover:translate-x-0.5 transition-transform">
                  {isOpened ? 'Read Again →' : 'Unfold Letter →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note Unfolded Modal with In-Modal Pagination */}
      <ElegantModal
        isOpen={activeModalNote !== null}
        onClose={() => setActiveModalNote(null)}
        title={activeModalNote ? `"${activeModalNote.teaser}"` : ''}
        subtitle={activeModalNote ? `Letter 0${activeModalNote.id} • ${activeModalNote.category}` : ''}
        icon={<Heart className="w-3.5 h-3.5 fill-[#8E1624] text-[#8E1624]" />}
      >
        <div key={activeModalNote?.id} className="my-5 animate-note-unfold">
          <div className="relative py-3 px-2 sm:px-4">
            <p className="font-serif text-xl sm:text-2xl font-light text-[#171717] leading-relaxed italic text-center">
              "{activeModalNote?.content}"
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between pt-3 border-t border-[#171717]/10 text-xs text-[#524C48] font-sans">
            <span className="font-editorial italic text-xs text-[#524C48]">Inscribed in heart forever</span>
            <span className="font-handwriting text-2xl text-[#8E1624]">Forever Yours</span>
          </div>
        </div>

        {/* Modal Pagination Navigation Bar */}
        <div className="mt-4 pt-3 border-t border-[#171717]/10 flex items-center justify-between text-xs font-sans">
          <button
            onClick={handlePrevNote}
            className="inline-flex items-center gap-1.5 text-[#71717A] hover:text-[#8E1624] uppercase tracking-wider text-[10px] transition-colors cursor-pointer py-1 px-2 rounded hover:bg-black/5"
            aria-label="Previous letter (Left Arrow)"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest">
            {activeModalNote ? `${String(activeModalNote.id).padStart(2, '0')} / ${String(notes.length).padStart(2, '0')}` : ''}
          </span>

          <button
            onClick={handleNextNote}
            className="inline-flex items-center gap-1.5 text-[#71717A] hover:text-[#8E1624] uppercase tracking-wider text-[10px] transition-colors cursor-pointer py-1 px-2 rounded hover:bg-black/5"
            aria-label="Next letter (Right Arrow)"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </ElegantModal>
    </section>
  );
};
