import React, { useState } from 'react';
import type { MilestoneItem } from '../../types';
import { sound } from '../audio/SoundEngine';
import { Compass, Sparkles, Calendar, Star } from 'lucide-react';

interface MilestoneConstellationProps {
  milestones: MilestoneItem[];
  onOpenSecretStar?: () => void;
}

export const MilestoneConstellation: React.FC<MilestoneConstellationProps> = ({
  milestones,
  onOpenSecretStar,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneItem>(milestones[0]);

  const handleSelectStar = (m: MilestoneItem, index: number) => {
    const freqs = [392.0, 440.0, 523.25, 587.33, 659.25, 783.99];
    sound.playChime(freqs[index % freqs.length]);
    setSelectedMilestone(m);
  };

  return (
    <section id="constellation-section" className="relative w-full py-24 px-4 sm:px-8 z-10 overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-xs font-sans uppercase tracking-widest mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Chapter V</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#fbf8f2] tracking-wide mb-3">
          The Constellation of Us
        </h2>
        <p className="font-editorial text-lg sm:text-xl text-neutral-300 italic">
          Every memory is a star in our celestial map. Tap any star along the path to trace our defining moments.
        </p>
      </div>

      {/* Interactive Constellation Map Container */}
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10">
        
        {/* SVG Constellation Chart */}
        <div className="relative w-full lg:w-3/5 h-[320px] sm:h-[400px] bg-[#120a14]/80 rounded-2xl border border-[#d4af37]/30 shadow-2xl p-4 overflow-hidden backdrop-blur-md">
          {/* Subtle starfield particles */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />

          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Connecting Constellation Polyline */}
            <polyline
              points={milestones.map((m) => `${m.coordinates.x},${m.coordinates.y}`).join(' ')}
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              className="opacity-60"
            />

            {/* Render Constellation Star Nodes */}
            {milestones.map((m, idx) => {
              const isSelected = selectedMilestone.id === m.id;
              return (
                <g key={m.id} className="cursor-pointer" onClick={() => handleSelectStar(m, idx)}>
                  {/* Outer pulse circle when selected */}
                  {isSelected && (
                    <circle
                      cx={m.coordinates.x}
                      cy={m.coordinates.y}
                      r="4.5"
                      fill="none"
                      stroke="#d4af37"
                      strokeWidth="0.6"
                      className="animate-ping origin-center"
                    />
                  )}

                  {/* Core Star Node */}
                  <circle
                    cx={m.coordinates.x}
                    cy={m.coordinates.y}
                    r={isSelected ? '2.5' : '1.8'}
                    fill={isSelected ? '#f5e4a8' : '#d4af37'}
                    className="transition-all duration-300 hover:scale-150 drop-shadow-[0_0_8px_#d4af37]"
                  />

                  {/* Label Text */}
                  <text
                    x={m.coordinates.x}
                    y={m.coordinates.y - 3.5}
                    textAnchor="middle"
                    fill={isSelected ? '#f5e4a8' : 'rgba(251,248,242,0.6)'}
                    fontSize="3"
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                    fontWeight={isSelected ? '600' : '400'}
                  >
                    {m.year}
                  </text>
                </g>
              );
            })}

            {/* Secret Polaris Discovery Star Node */}
            <g
              className="cursor-pointer group"
              onClick={() => {
                sound.playChime(880.0);
                onOpenSecretStar?.();
              }}
            >
              <circle
                cx="86"
                cy="18"
                r="4"
                fill="none"
                stroke="#d4af37"
                strokeWidth="0.5"
                className="animate-ping origin-center opacity-70"
              />
              <circle
                cx="86"
                cy="18"
                r="2.2"
                fill="#f5e4a8"
                className="transition-transform group-hover:scale-150 drop-shadow-[0_0_10px_#d4af37]"
              />
              <text
                x="86"
                y="13"
                textAnchor="middle"
                fill="#d4af37"
                fontSize="2.8"
                fontFamily="'Plus Jakarta Sans', sans-serif"
                fontWeight="700"
              >
                ★ Polaris
              </text>
            </g>
          </svg>

          {/* Bottom Coordinates Legend */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[10px] font-sans tracking-widest uppercase text-neutral-400">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            <span>Interactive Celestial Orbit</span>
          </div>
        </div>

        {/* Selected Milestone Story Card */}
        <div className="w-full lg:w-2/5 bg-[#1a111c] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md transition-all duration-500">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <span className="font-serif text-[#d4af37] text-xl font-medium flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#d4af37]" />
              {selectedMilestone.year}
            </span>
            <span className="font-sans text-xs uppercase tracking-widest text-neutral-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#8b1e2b]" />
              {selectedMilestone.date}
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#fbf8f2] mb-3 leading-snug">
            {selectedMilestone.title}
          </h3>

          <p className="font-editorial text-lg text-neutral-300 italic leading-relaxed">
            "{selectedMilestone.description}"
          </p>

          {/* Step Selector Pills */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-sans text-neutral-400 uppercase tracking-wider">
              Step {milestones.findIndex((m) => m.id === selectedMilestone.id) + 1} of {milestones.length}
            </span>

            <div className="flex items-center gap-1.5">
              {milestones.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectStar(m, idx)}
                  aria-label={`Jump to ${m.year}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    selectedMilestone.id === m.id
                      ? 'bg-[#d4af37] w-6'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
