import React from 'react';
import { Disc, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import type { MixtapeTrack } from '../../types';

interface CassettePlayerProps {
  tracks: MixtapeTrack[];
}

export const CassettePlayer: React.FC<CassettePlayerProps> = ({ tracks }) => {
  const {
    isPlaying,
    isMuted,
    currentTrackIndex,
    progress,
    currentTimeFormatted,
    totalDurationFormatted,
    togglePlay,
    toggleMute,
    nextTrack,
    prevTrack,
    seekTo,
    frequencyData,
  } = useAudio();

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    seekTo(newPercent);
  };

  const trackNum = String(currentTrackIndex + 1).padStart(2, '0');
  const totalTracks = String(tracks.length).padStart(2, '0');

  // Realistic tape thickness: Left spool depletes from 52px to 24px; Right spool winds from 24px to 52px
  const leftTapeRadius = Math.max(24, Math.round(52 - (progress / 100) * 28));
  const rightTapeRadius = Math.max(24, Math.round(24 + (progress / 100) * 28));

  return (
    <section id="mixtape-section" className="relative w-full py-28 px-4 sm:px-8 flex flex-col items-center justify-center z-10 select-none">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#171717]/5 border border-[#171717]/10 text-[#8E1624] text-[11px] font-sans uppercase tracking-[0.28em] mb-3.5">
          <Disc className="w-3.5 h-3.5" />
          <span>Anthology • Chapter III</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#171717] tracking-wide mb-3">
          The Soundtracks of Us
        </h2>
        <p className="font-editorial text-base sm:text-xl text-[#71717A] italic leading-relaxed">
          Every chapter of our story carries a melody. Press play to let the music accompany you through our favorite nights.
        </p>
      </div>

      {/* Bespoke Tactile Cassette Keepsake */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-[#171717] border border-[#303030] rounded-xl p-6 sm:p-8 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.55)] overflow-hidden">
        
        {/* Vintage Cotton Paper Tape Label */}
        <div className="relative bg-[#F9F8F5] text-[#171717] rounded-sm p-4 sm:p-5 mb-5 shadow-sm border border-[#F2EFEB]">
          {/* Crimson Hairline Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#8E1624]" />

          <div className="flex items-center justify-between border-b border-[#171717]/10 pb-2 mb-2 text-xs">
            <span className="font-sans text-[9px] uppercase font-semibold tracking-[0.26em] text-[#8E1624]">
              Archival Cassette • Side A
            </span>
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#71717A]">
              Tape {trackNum} / {totalTracks}
            </span>
          </div>

          <div className="text-center py-1">
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#171717] tracking-tight">
              {currentTrack.title}
            </h3>
            <p className="font-editorial italic text-xs sm:text-sm text-[#71717A] mt-0.5">
              "{currentTrack.subtitle}"
            </p>
          </div>
        </div>

        {/* Clear Cassette Middle Window with Spinning Tape Spools */}
        <div className="relative w-full h-28 sm:h-32 bg-[#09090A] rounded-lg border border-[#303030]/90 p-3 flex items-center justify-between px-6 sm:px-12 shadow-inner overflow-hidden">
          
          {/* Left Reel with Dynamic Tape Roll */}
          <div className="relative flex items-center justify-center">
            {/* Magnetic Tape Pack (Dark Brown/Black) */}
            <div
              className="rounded-full bg-[#1b1716] flex items-center justify-center transition-all duration-300 border border-[#303030]/60"
              style={{ width: `${leftTapeRadius * 2}px`, height: `${leftTapeRadius * 2}px` }}
            >
              {/* Spinning Spool Hub */}
              <div
                className={`w-12 h-12 rounded-full border-2 border-white/20 bg-[#26262a] flex items-center justify-center ${
                  isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
                }`}
              >
                {/* 6-Tooth Hub Teeth */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute w-2.5 h-[1px] bg-white/40" />
                  <div className="absolute w-2.5 h-[1px] bg-white/40 rotate-60" />
                  <div className="absolute w-2.5 h-[1px] bg-white/40 -rotate-60" />
                  <div className="w-4 h-4 rounded-full bg-[#09090A] border border-white/10" />
                </div>
              </div>
            </div>
          </div>

          {/* Magnetic Tape Bridge & Minimal Harmonic Spectrum */}
          <div className="flex-1 px-3 flex flex-col items-center justify-center gap-2">
            {/* Minimal Harmonic Bars */}
            <div className="flex items-end justify-center gap-1.5 h-6 w-full">
              {frequencyData.map((bar, i) => (
                <div
                  key={i}
                  className="w-[2px] bg-[#8E1624] rounded-full transition-all duration-100"
                  style={{
                    height: isPlaying ? `${Math.max(25, bar * 100)}%` : '20%',
                    opacity: isPlaying ? 0.9 : 0.35,
                  }}
                />
              ))}
            </div>
            <span className="font-sans text-[9px] uppercase tracking-[0.24em] text-[#8E1624]/90 font-medium">
              {currentTrack.mood}
            </span>
          </div>

          {/* Right Reel with Dynamic Tape Roll */}
          <div className="relative flex items-center justify-center">
            {/* Magnetic Tape Pack */}
            <div
              className="rounded-full bg-[#1b1716] flex items-center justify-center transition-all duration-300 border border-[#303030]/60"
              style={{ width: `${rightTapeRadius * 2}px`, height: `${rightTapeRadius * 2}px` }}
            >
              {/* Spinning Spool Hub */}
              <div
                className={`w-12 h-12 rounded-full border-2 border-white/20 bg-[#26262a] flex items-center justify-center ${
                  isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
                }`}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute w-2.5 h-[1px] bg-white/40" />
                  <div className="absolute w-2.5 h-[1px] bg-white/40 rotate-60" />
                  <div className="absolute w-2.5 h-[1px] bg-white/40 -rotate-60" />
                  <div className="w-4 h-4 rounded-full bg-[#09090A] border border-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tactile Scrubber Track */}
        <div
          onClick={handleScrubClick}
          role="slider"
          tabIndex={0}
          aria-label="Cassette scrub bar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-5 w-full h-3 flex items-center cursor-pointer group"
        >
          <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8E1624] rounded-full transition-all duration-100 group-hover:bg-[#A81E2E]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="mt-5 flex items-center justify-between text-xs">
          {/* Time & Track Meta */}
          <div className="text-left font-mono text-[11px] text-[#71717A] tracking-wider">
            <span>{currentTimeFormatted}</span>
            <span className="mx-1.5 text-white/20">/</span>
            <span>{totalDurationFormatted}</span>
          </div>

          {/* Transport Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevTrack}
              aria-label="Previous track"
              className="p-2.5 rounded-full text-[#71717A] hover:text-white hover:bg-white/5 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause tape' : 'Play tape'}
              className="w-11 h-11 rounded-full bg-[#8E1624] hover:bg-[#A81E2E] text-white flex items-center justify-center transition-all shadow-lg cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={nextTrack}
              aria-label="Next track"
              className="p-2.5 rounded-full text-[#71717A] hover:text-white hover:bg-white/5 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Audio Output Status */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute tape audio' : 'Mute tape audio'}
              className="flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-widest text-[#71717A] hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#8E1624]" />}
              <span>Stereo</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
