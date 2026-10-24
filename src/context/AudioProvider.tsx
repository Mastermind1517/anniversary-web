import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { MixtapeTrack } from '../types';
import { sound } from '../components/audio/SoundEngine';
import { AudioContext } from './AudioContext';

interface AudioProviderProps {
  tracks: MixtapeTrack[];
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ tracks, children }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [frequencyData, setFrequencyData] = useState<number[]>([0.1, 0.1, 0.1, 0.1, 0.1]);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const visualizerTimerRef = useRef<number | null>(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Helper: parse duration "3:42" into total seconds
  const parseDuration = (durStr: string): number => {
    const parts = durStr.split(':').map((p) => parseInt(p, 10));
    if (parts.length === 2) {
      return (parts[0] || 0) * 60 + (parts[1] || 0);
    }
    return 180;
  };

  const totalSeconds = parseDuration(currentTrack.duration);

  // Format seconds to mm:ss
  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentTimeFormatted = formatTime(currentSeconds);
  const totalDurationFormatted = currentTrack.duration;

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (audioElementRef.current) {
      audioElementRef.current.muted = nextMuted;
    }
  }, []);

  // Play a specific track
  const playTrack = useCallback(
    (index: number) => {
      sound.playTapeClick();
      setCurrentTrackIndex(index);
      setCurrentSeconds(0);
      setProgress(0);

      const targetTrack = tracks[index];
      if (!targetTrack) return;

      // Update procedural sound harmonics
      sound.setAmbientHarmonics(targetTrack.chordRootFreq);
      sound.playChord(targetTrack.chordRootFreq);

      // Try local audio element if provided
      if (targetTrack.audioSrc) {
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio();
        }
        audioElementRef.current.src = targetTrack.audioSrc;
        audioElementRef.current.muted = isMuted;
        audioElementRef.current.play().catch(() => {
          // Gracefully fallback to procedural synth pad if audio asset is absent
          sound.startAmbientSoundscape();
        });
      } else {
        sound.startAmbientSoundscape();
      }

      setIsPlaying(true);
    },
    [isMuted, tracks]
  );

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    sound.playTapeClick();
    if (isPlaying) {
      setIsPlaying(false);
      sound.stopAmbientSoundscape();
      setFrequencyData([0.1, 0.1, 0.1, 0.1, 0.1]);
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      const targetTrack = tracks[currentTrackIndex];
      sound.playChord(targetTrack.chordRootFreq);

      if (targetTrack.audioSrc) {
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio(targetTrack.audioSrc);
        }
        audioElementRef.current.muted = isMuted;
        audioElementRef.current.play().catch(() => {
          sound.startAmbientSoundscape();
        });
      } else {
        sound.startAmbientSoundscape();
      }
    }
  }, [currentTrackIndex, isMuted, isPlaying, tracks]);

  // Next Track
  const nextTrack = useCallback(() => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    playTrack(nextIdx);
  }, [currentTrackIndex, playTrack, tracks.length]);

  // Previous Track
  const prevTrack = useCallback(() => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(prevIdx);
  }, [currentTrackIndex, playTrack, tracks.length]);

  // Seek To percentage
  const seekTo = useCallback(
    (percent: number) => {
      const clamped = Math.max(0, Math.min(100, percent));
      setProgress(clamped);
      const targetSec = Math.floor((clamped / 100) * totalSeconds);
      setCurrentSeconds(targetSec);
      if (audioElementRef.current && audioElementRef.current.duration) {
        audioElementRef.current.currentTime = (clamped / 100) * audioElementRef.current.duration;
      }
    },
    [totalSeconds]
  );

  // Synchronized Progress Clock & Loop
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = window.setInterval(() => {
        setCurrentSeconds((prev) => {
          const nextSec = prev + 1;
          const pct = (nextSec / totalSeconds) * 100;
          if (pct >= 100) {
            nextTrack();
            return 0;
          }
          setProgress(pct);
          return nextSec;
        });
      }, 1000);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, totalSeconds, nextTrack]);

  // Music Visualizer Equalizer Loop
  useEffect(() => {
    if (isPlaying) {
      visualizerTimerRef.current = window.setInterval(() => {
        const raw = sound.getFrequencyData();
        if (raw && raw.length >= 5) {
          // Extract 5 distinct frequency bands and normalize
          const bars = [
            Math.min(1, Math.max(0.18, raw[1] / 220 + 0.1 * Math.sin(Date.now() / 200))),
            Math.min(1, Math.max(0.25, raw[3] / 200 + 0.15 * Math.cos(Date.now() / 180))),
            Math.min(1, Math.max(0.35, raw[5] / 180 + 0.2 * Math.sin(Date.now() / 150))),
            Math.min(1, Math.max(0.2, raw[8] / 210 + 0.12 * Math.cos(Date.now() / 220))),
            Math.min(1, Math.max(0.15, raw[12] / 240 + 0.08 * Math.sin(Date.now() / 250))),
          ];
          setFrequencyData(bars);
        } else {
          // Fallback organic wave
          const t = Date.now() / 250;
          setFrequencyData([
            0.3 + 0.3 * Math.sin(t),
            0.4 + 0.4 * Math.cos(t * 1.3),
            0.6 + 0.35 * Math.sin(t * 0.8),
            0.4 + 0.3 * Math.cos(t * 1.5),
            0.25 + 0.25 * Math.sin(t * 1.8),
          ]);
        }
      }, 80);
    } else {
      if (visualizerTimerRef.current) clearInterval(visualizerTimerRef.current);
    }

    return () => {
      if (visualizerTimerRef.current) clearInterval(visualizerTimerRef.current);
    };
  }, [isPlaying]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        currentTrackIndex,
        currentTrack,
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
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
