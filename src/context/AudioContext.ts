import { createContext, useContext } from 'react';
import type { MixtapeTrack } from '../types';

export interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  currentTrackIndex: number;
  currentTrack: MixtapeTrack;
  tracks: MixtapeTrack[];
  progress: number; // 0 to 100
  currentTimeFormatted: string;
  totalDurationFormatted: string;
  togglePlay: () => void;
  toggleMute: () => void;
  playTrack: (index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (percent: number) => void;
  frequencyData: number[]; // 5-bar normalized energy levels (0 to 1)
}

export const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
