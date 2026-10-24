import React, { useState } from 'react';
import type { LoveNote } from '../../types';
import { sound } from '../audio/SoundEngine';
import { Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { ElegantModal } from '../common/ElegantModal';

interface LoveNotesJarProps {
  notes: LoveNote[];
}

export const LoveNotesJar: React.FC<LoveNotesJarProps> = ({ notes }) => {
  const [openedNotes, setOpenedNotes] = useState<number[]>([]);
  const [activeModalNote, setActiveModalNote] = useState<LoveNote | null>(null);

  const handleOpenNote = (note: LoveNote) => {
    sound.playPaperRustle();
    if (!openedNotes.includes(note.id)) {
      const nextOpened = [...openedNotes, note.id];
      setOpenedNotes(nextOpened);
      if (nextOpened.length === notes.length) {
        sound.playChime(659.25); // E5 celebration chime
      } else {
        sound.playChime(523.25); // C5 chime
      }
    }
    setActiveModalNote(note);
  };

  const progressPercent = Math.round((openedNotes.length / notes.length) * 100);

  return (
    <section id="notes-section" className="relative w-full py-24 px-4 sm:px-8 z-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-xs font-sans uppercase tracking-widest mb-3">
          <Heart className="w-3.5 h-3.5" />
          <span>Chapter IV</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#fbf8f2] tracking-wide mb-3">
          Twelve Unspoken Reasons
        </h2>
        <p className="font-editorial text-lg sm:text-xl text-neutral-300 italic mb-6">
          A collection of folded origami keepsakes. Click each letter to unfold a reason why loving you is effortless.
        </p>

        {/* Discovery Tracker */}
        <div className="inline-flex flex-col items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#18111b]/80 border border-[#d4af37]/30 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#d4af37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              Unfolded: {openedNotes.length} of {notes.length} Love Notes ({progressPercent}%)
            </span>
          </div>
          <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8b1e2b] via-[#d4af37] to-[#f5e4a8] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {openedNotes.length === notes.length && (
            <span className="font-handwriting text-[#d4af37] text-lg animate-pulse">
              You found all 12 secrets! My heart is completely yours.
            </span>
          )}
        </div>
      </div>

      {/* Grid of Folded Origami Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {notes.map((note) => {
          const isOpened = openedNotes.includes(note.id);
          return (
            <div
              key={note.id}
              onClick={() => handleOpenNote(note)}
              role="button"
              tabIndex={0}
              aria-label={`Open note: ${note.teaser}`}
              className={`relative p-5 rounded-xl border transition-all duration-300 cursor-pointer text-left flex flex-col justify-between min-h-[150px] sm:min-h-[170px] select-none ${
                isOpened
                  ? 'bg-[#201520] border-[#d4af37]/40 shadow-lg'
                  : 'bg-[#18101a] border-white/10 hover:border-[#d4af37]/50 hover:bg-[#201520] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(212,175,55,0.15)]'
              }`}
            >
              {/* Origami Fold Angle Gradient */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/10 to-transparent rounded-tr-xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="font-sans text-[10px] tracking-widest uppercase text-[#d4af37] font-semibold">
                  Note #{note.id}
                </span>
                {isOpened ? (
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                ) : (
                  <Heart className="w-3.5 h-3.5 text-neutral-500 hover:text-[#8b1e2b] transition-colors" />
                )}
              </div>

              <div className="my-2">
                <span className="font-handwriting text-2xl text-[#fbf8f2] block leading-snug">
                  "{note.teaser}"
                </span>
                <span className="font-sans text-[10px] uppercase tracking-wider text-neutral-400 mt-1 block">
                  {note.category}
                </span>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-sans text-[#8b1e2b]">
                <span className="font-medium hover:underline">
                  {isOpened ? 'Read again' : 'Unfold note →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note Unfolded Modal */}
      <ElegantModal
        isOpen={activeModalNote !== null}
        onClose={() => setActiveModalNote(null)}
        title={activeModalNote ? `"${activeModalNote.teaser}"` : ''}
        subtitle={activeModalNote ? `Reason #${activeModalNote.id} • ${activeModalNote.category}` : ''}
        icon={<Heart className="w-4 h-4 fill-[#8b1e2b] text-[#8b1e2b]" />}
      >
        <p className="font-editorial text-xl sm:text-2xl text-[#2b231e] leading-relaxed italic border-l-2 border-[#8b1e2b]/50 pl-4 my-4">
          {activeModalNote?.content}
        </p>

        <div className="pt-3 border-t border-[#2b231e]/15 flex items-center justify-between text-xs text-neutral-500 font-sans">
          <span>Kept in my heart forever</span>
          <span className="font-script text-2xl text-[#8b1e2b]">Forever Yours</span>
        </div>
      </ElegantModal>
    </section>
  );
};
