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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8E1624]/10 border border-[#8E1624]/20 text-[#8E1624] text-xs font-sans uppercase tracking-widest mb-3">
          <Heart className="w-3.5 h-3.5 fill-[#8E1624]" />
          <span>Chapter IV • Keepsake Notes</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#171717] tracking-wide mb-3">
          Twelve Unspoken Reasons
        </h2>
        <p className="font-editorial text-lg sm:text-xl text-[#71717A] italic mb-6">
          A collection of folded origami keepsakes. Click each letter to unfold a reason why loving you is effortless.
        </p>

        {/* Discovery Tracker */}
        <div className="inline-flex flex-col items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-[#F2EFEB] shadow-sm">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#8E1624]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              Unfolded: {openedNotes.length} of {notes.length} Love Notes ({progressPercent}%)
            </span>
          </div>
          <div className="w-48 h-1.5 bg-[#F2EFEB] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4F0D15] via-[#8E1624] to-[#A81E2E] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {openedNotes.length === notes.length && (
            <span className="font-handwriting text-[#8E1624] text-lg animate-pulse">
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
                  ? 'bg-[#F9F8F5] border-[#8E1624]/30 shadow-sm'
                  : 'bg-white border-[#F2EFEB] hover:border-[#8E1624]/40 hover:shadow-md hover:-translate-y-1'
              }`}
            >
              {/* Origami Fold Angle Gradient */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-black/5 to-transparent rounded-tr-xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="font-sans text-[10px] tracking-widest uppercase text-[#8E1624] font-semibold">
                  Note #{note.id}
                </span>
                {isOpened ? (
                  <CheckCircle2 className="w-4 h-4 text-[#8E1624]" />
                ) : (
                  <Heart className="w-3.5 h-3.5 text-[#71717A] hover:text-[#8E1624] transition-colors" />
                )}
              </div>

              <div className="my-2">
                <span className="font-handwriting text-2xl text-[#171717] block leading-snug">
                  "{note.teaser}"
                </span>
                <span className="font-sans text-[10px] uppercase tracking-wider text-[#71717A] mt-1 block">
                  {note.category}
                </span>
              </div>

              <div className="pt-2 border-t border-[#171717]/5 flex items-center justify-between text-[11px] font-sans text-[#8E1624]">
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
        icon={<Heart className="w-4 h-4 fill-[#8E1624] text-[#8E1624]" />}
      >
        <p className="font-editorial text-xl sm:text-2xl text-[#171717] leading-relaxed italic border-l-2 border-[#8E1624]/50 pl-4 my-4">
          {activeModalNote?.content}
        </p>

        <div className="pt-3 border-t border-[#171717]/10 flex items-center justify-between text-xs text-[#71717A] font-sans">
          <span>Kept in my heart forever</span>
          <span className="font-handwriting text-2xl text-[#8E1624]">Forever Yours</span>
        </div>
      </ElegantModal>
    </section>
  );
};
