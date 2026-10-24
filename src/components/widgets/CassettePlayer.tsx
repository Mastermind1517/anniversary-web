import React from 'react';
import type { MixtapeTrack } from '../../types';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, SkipForward, SkipBack, Disc, Volume2 } from 'lucide-react';

interface CassettePlayerProps {
  tracks?: MixtapeTrack[];
}

export const CassettePlayer: React.FC<CassettePlayerProps> = () => {
  const {
    isPlaying,
    currentTrack,
    currentTrackIndex,
    tracks,
    progress,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
  } = useAudio();

  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    seekTo(pct);
  };

  return (
    <section id="mixtape-section" className="relative w-full py-24 px-4 sm:px-8 flex flex-col items-center justify-center z-10">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-xs font-sans uppercase tracking-widest mb-3">
          <Disc className="w-3.5 h-3.5" />
          <span>Chapter III</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#fbf8f2] tracking-wide mb-3">
          Soundtracks of Us
        </h2>
        <p className="font-editorial text-lg sm:text-xl text-neutral-300 italic">
          Every love story has a rhythm. Press play and let the melody carry you through our favorite nights.
        </p>
      </div>

      {/* Skeuomorphic Cassette Tape Box */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-[#140e16] border-2 border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Cassette Screws in 4 Corners */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-neutral-700 border border-neutral-500 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[1px] bg-neutral-400 rotate-45" />
        </div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-neutral-700 border border-neutral-500 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[1px] bg-neutral-400 -rotate-45" />
        </div>
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-neutral-700 border border-neutral-500 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[1px] bg-neutral-400 -rotate-15" />
        </div>
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-neutral-700 border border-neutral-500 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[1px] bg-neutral-400 rotate-30" />
        </div>

        {/* Vintage Paper Label on Tape */}
        <div className="relative bg-[#f4eedf] text-[#2b231e] rounded-lg p-4 mb-6 shadow-md border border-[#2b231e]/15">
          <div className="flex items-center justify-between border-b border-[#2b231e]/15 pb-2 mb-2">
            <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#8b1e2b]">
              SIDE A • STEREO 90
            </span>
            <span className="font-sans text-[10px] uppercase tracking-wider text-neutral-500">
              Tape No. 04
            </span>
          </div>

          <div className="text-center py-1">
            <span className="font-handwriting text-2xl sm:text-3xl text-[#2b231e] block">
              {currentTrack.title}
            </span>
            <span className="font-editorial italic text-xs text-neutral-600">
              "{currentTrack.subtitle}"
            </span>
          </div>
        </div>

        {/* Clear Cassette Middle Window with Spinning Tape Spools */}
        <div className="relative w-full h-24 sm:h-28 bg-[#0a070b]/90 rounded-xl border border-white/10 p-3 flex items-center justify-between px-8 sm:px-14 shadow-inner overflow-hidden">
          {/* Left Reel */}
          <div className="relative flex items-center justify-center">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-dashed border-[#d4af37]/70 bg-neutral-800 flex items-center justify-center shadow-lg ${
                isPlaying ? 'animate-spin [animation-duration:3s]' : ''
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#140e16] border border-[#d4af37]/40 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
              </div>
            </div>
          </div>

          {/* Magnetic Tape Bridge & Visualizer */}
          <div className="flex-1 px-4 flex flex-col items-center justify-center gap-1.5">
            {/* Visualizer audio bars */}
            <div className="flex items-end justify-center gap-1 h-8 w-full">
              {[40, 75, 55, 90, 65, 80, 45, 95, 70, 50, 85].map((height, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#d4af37] rounded-full transition-all duration-150"
                  style={{
                    height: isPlaying ? `${Math.max(15, (height * (Math.sin(progress + i) + 1)) / 2)}%` : '15%',
                    opacity: isPlaying ? 0.85 : 0.3,
                  }}
                />
              ))}
            </div>
            <span className="font-sans text-[9px] uppercase tracking-widest text-[#d4af37]/70">
              {currentTrack.mood}
            </span>
          </div>

          {/* Right Reel */}
          <div className="relative flex items-center justify-center">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-dashed border-[#d4af37]/70 bg-neutral-800 flex items-center justify-center shadow-lg ${
                isPlaying ? 'animate-spin [animation-duration:3s]' : ''
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#140e16] border border-[#d4af37]/40 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Scrubbable Progress Bar */}
        <div
          onClick={handleScrubClick}
          role="slider"
          tabIndex={0}
          aria-label="Cassette track progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-5 w-full bg-white/10 h-2 rounded-full overflow-hidden cursor-pointer group py-0.5"
        >
          <div
            className="h-full bg-gradient-to-r from-[#8b1e2b] via-[#d4af37] to-[#f4eedf] rounded-full transition-all duration-150 group-hover:brightness-110"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Player Controls Bar */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-left">
            <span className="font-sans text-[11px] text-neutral-400 block">
              Track {currentTrackIndex + 1} of {tracks.length}
            </span>
            <span className="font-sans text-xs text-[#d4af37] font-medium">
              {currentTrack.duration}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={prevTrack}
              aria-label="Previous track"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause tape' : 'Play tape'}
              className="p-4 rounded-full bg-[#8b1e2b] hover:bg-[#a62435] text-white shadow-[0_0_20px_rgba(139,30,43,0.6)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all transform hover:scale-105 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={nextTrack}
              aria-label="Next track"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Stereo</span>
          </div>
        </div>
      </div>
    </section>
  );
};
