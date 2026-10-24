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
    const pct = (clickX / rect.width) * 100;
    seekTo(pct);
  };

  return (
    <aside
      aria-label="Cinematic Music Player"
      className="fixed bottom-5 left-4 sm:left-6 z-40 max-w-[92vw] sm:max-w-md transition-all duration-300"
    >
      {/* EXPANDED DELUXE DRAWER */}
      {isExpanded && (
        <div className="mb-2 bg-[#171717]/95 backdrop-blur-xl border border-[#303030] rounded-2xl p-4 sm:p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 text-white">
          {/* Top Bar: Track Meta & Collapse */}
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8E1624] animate-pulse" />
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#8E1624]">
                Track {currentTrackIndex + 1} of {tracks.length}
              </span>
            </div>
            <span className="text-[10px] font-sans text-neutral-400 italic">
              {currentTrack.mood}
            </span>
          </div>

          {/* Track Title */}
          <div className="mb-3">
            <h4 className="font-serif text-lg font-medium text-white leading-tight">
              {currentTrack.title}
            </h4>
            <p className="font-editorial text-xs text-neutral-300 italic mt-0.5">
              {currentTrack.subtitle}
            </p>
          </div>

          {/* Interactive Progress Scrubber */}
          <div className="space-y-1 mb-3">
            <div
              onClick={handleProgressBarClick}
              role="slider"
              tabIndex={0}
              aria-label="Track progress"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="relative w-full h-2 bg-white/10 rounded-full cursor-pointer overflow-hidden group py-1"
            >
              <div
                className="h-full bg-gradient-to-r from-[#4F0D15] via-[#8E1624] to-[#A81E2E] rounded-full transition-all duration-100 group-hover:brightness-110"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>{currentTimeFormatted}</span>
              <span>{totalDurationFormatted}</span>
            </div>
          </div>

          {/* Playback Controls & Track Switchers */}
          <div className="flex items-center justify-between pt-1">
            {/* Prev Track */}
            <button
              onClick={prevTrack}
              aria-label="Previous soundtrack"
              className="p-2 rounded-full text-neutral-300 hover:text-[#8E1624] hover:bg-white/5 transition-all cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play / Pause Primary Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              className="px-4 py-2 rounded-full bg-[#8E1624] hover:bg-[#A81E2E] text-white hover:brightness-110 shadow-lg flex items-center gap-2 text-xs font-sans font-medium transition-all cursor-pointer border border-[#4F0D15]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>Play</span>
                </>
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={nextTrack}
              aria-label="Next soundtrack"
              className="p-2 rounded-full text-neutral-300 hover:text-[#8E1624] hover:bg-white/5 transition-all cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute music' : 'Mute music'}
              className="p-2 rounded-full text-neutral-300 hover:text-[#8E1624] hover:bg-white/5 transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-[#8E1624]" />}
            </button>
          </div>

          {/* Track selection pill drawer */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex gap-1.5 overflow-x-auto pb-1">
            {tracks.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => playTrack(idx)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-sans whitespace-nowrap transition-all cursor-pointer border ${
                  idx === currentTrackIndex
                    ? 'bg-[#8E1624]/20 border-[#8E1624] text-white'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* COMPACT FLOATING PILL */}
      <div className="bg-[#171717]/90 backdrop-blur-md border border-[#303030] hover:border-[#8E1624]/50 rounded-full px-3.5 py-2 shadow-2xl flex items-center gap-3 transition-all duration-300">
        {/* Equalizer Visualizer Bars */}
        <div
          className="flex items-end gap-[3px] h-4 w-5 px-0.5 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          title="Click to toggle music drawer"
        >
          {frequencyData.map((bar, i) => (
            <div
              key={i}
              className="w-[3px] bg-[#8E1624] rounded-full transition-all duration-75"
              style={{
                height: isPlaying ? `${Math.max(20, bar * 100)}%` : '25%',
                opacity: isPlaying ? 0.9 : 0.4,
              }}
            />
          ))}
        </div>

        {/* Track Title snippet */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-left flex flex-col justify-center max-w-[120px] sm:max-w-[160px] cursor-pointer"
          aria-label="Toggle player drawer"
        >
          <span className="font-serif text-xs text-white truncate block">
            {currentTrack.title}
          </span>
          <span className="text-[9px] font-sans text-[#8E1624] truncate block">
            {isPlaying ? 'Playing • Web Audio' : 'Paused'}
          </span>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          className="p-1.5 rounded-full bg-white/10 hover:bg-[#8E1624] text-white transition-all cursor-pointer"
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
          className="p-1 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
