import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export const CinematicAudioPlayer: React.FC = () => {
  const {
    isPlaying,
    isMuted,
    currentTrack,
    currentTrackIndex,
    tracks,
    progress,
    currentTimeFormatted,
    totalDurationFormatted,
    togglePlay,
    toggleMute,
    playTrack,
    nextTrack,
    prevTrack,
    seekTo,
    frequencyData,
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    seekTo(pct);
  };

  const trackNum = String(currentTrackIndex + 1).padStart(2, '0');
  const totalTracks = String(tracks.length).padStart(2, '0');

  return (
    <aside
      aria-label="Cinematic Sound Player"
      className="fixed bottom-5 left-4 sm:left-6 z-40 max-w-[94vw] sm:max-w-md transition-all duration-300 select-none"
    >
      {/* EXPANDED DELUXE DRAWER */}
      {isExpanded && (
        <div className="mb-2.5 bg-[#171717]/98 backdrop-blur-xl border border-[#303030] rounded-xl p-5 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.65)] animate-in fade-in slide-in-from-bottom-2 duration-200 text-[#F9F8F5]">
          {/* Top Bar: Archival Tag & Track Index */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#303030]/80">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full bg-[#8E1624] ${isPlaying ? 'animate-pulse' : 'opacity-40'}`} />
              <span className="font-sans text-[9px] uppercase tracking-[0.26em] text-[#8E1624] font-medium">
                Anthology Soundtrack
              </span>
            </div>
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#71717A]">
              Track {trackNum} / {totalTracks}
            </span>
          </div>

          {/* Track Title & Mood */}
          <div className="mb-4">
            <h4 className="font-serif text-xl sm:text-2xl font-light text-white leading-tight">
              {currentTrack.title}
            </h4>
            <p className="font-editorial italic text-xs sm:text-sm text-[#71717A] mt-0.5">
              "{currentTrack.subtitle}"
            </p>
            <span className="inline-block mt-1 font-sans text-[9px] uppercase tracking-widest text-[#8E1624]/90">
              {currentTrack.mood}
            </span>
          </div>

          {/* Interactive Progress Scrubber */}
          <div className="space-y-1.5 mb-4">
            <div
              onClick={handleProgressBarClick}
              role="slider"
              tabIndex={0}
              aria-label="Soundtrack scrub bar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="relative w-full h-3 flex items-center cursor-pointer group"
            >
              <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8E1624] rounded-full transition-all duration-100 group-hover:bg-[#A81E2E]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#71717A] tracking-wider">
              <span>{currentTimeFormatted}</span>
              <span>{totalDurationFormatted}</span>
            </div>
          </div>

          {/* Primary Playback Controls */}
          <div className="flex items-center justify-between pt-1">
            {/* Prev Track */}
            <button
              onClick={prevTrack}
              aria-label="Previous soundtrack"
              className="p-2.5 rounded-full text-[#71717A] hover:text-white hover:bg-white/5 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play / Pause Primary Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              className="px-5 py-2.5 rounded-full bg-[#8E1624] hover:bg-[#A81E2E] text-white shadow-lg flex items-center gap-2 text-xs font-sans font-medium transition-all cursor-pointer border border-[#4F0D15] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="tracking-wider uppercase text-[10px]">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span className="tracking-wider uppercase text-[10px]">Play</span>
                </>
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={nextTrack}
              aria-label="Next soundtrack"
              className="p-2.5 rounded-full text-[#71717A] hover:text-white hover:bg-white/5 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute music' : 'Mute music'}
              className="p-2.5 rounded-full text-[#71717A] hover:text-white hover:bg-white/5 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-[#71717A]" /> : <Volume2 className="w-4 h-4 text-[#8E1624]" />}
            </button>
          </div>

          {/* Track Selection Drawer */}
          <div className="mt-4 pt-3 border-t border-[#303030]/80 flex gap-2 overflow-x-auto pb-1">
            {tracks.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => playTrack(idx)}
                className={`px-3 py-1.5 rounded-sm text-[10px] font-sans tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border focus:outline-none ${
                  idx === currentTrackIndex
                    ? 'bg-[#8E1624]/20 border-[#8E1624] text-white font-medium'
                    : 'bg-white/5 border-white/10 text-[#71717A] hover:text-white hover:border-white/20'
                }`}
              >
                0{idx + 1} • {t.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* COMPACT FLOATING PILL */}
      <div className="bg-[#171717]/95 backdrop-blur-md border border-[#303030] hover:border-[#8E1624]/50 rounded-full px-4 py-2 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] flex items-center gap-3.5 transition-all duration-300">
        {/* Equalizer Visualizer Bars */}
        <div
          className="flex items-end gap-[3px] h-4 w-5 px-0.5 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          title="Click to toggle music drawer"
        >
          {frequencyData.map((bar, i) => (
            <div
              key={i}
              className="w-[2px] bg-[#8E1624] rounded-full transition-all duration-75"
              style={{
                height: isPlaying ? `${Math.max(20, bar * 100)}%` : '25%',
                opacity: isPlaying ? 0.9 : 0.35,
              }}
            />
          ))}
        </div>

        {/* Track Title Snippet */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-left flex flex-col justify-center max-w-[130px] sm:max-w-[170px] cursor-pointer focus:outline-none"
          aria-label="Toggle player drawer"
        >
          <span className="font-serif text-xs sm:text-sm text-white truncate block">
            {currentTrack.title}
          </span>
          <span className="text-[9px] font-sans text-[#71717A] uppercase tracking-wider truncate block">
            {isPlaying ? 'Playing • Intimate Melody' : 'Paused'}
          </span>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          className="p-2 rounded-full bg-white/10 hover:bg-[#8E1624] text-white transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

        {/* Expand/Collapse Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse player' : 'Expand player'}
          className="p-1 rounded-full text-[#71717A] hover:text-white transition-colors cursor-pointer focus:outline-none"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
