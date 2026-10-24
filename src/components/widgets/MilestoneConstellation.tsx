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
    <section id="constellation-section" className="relative w-full py-28 px-4 sm:px-8 z-10 overflow-hidden select-none">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#171717]/5 border border-[#171717]/10 text-[#8E1624] text-[11px] font-sans uppercase tracking-[0.28em] mb-3.5 font-medium">
          <Compass className="w-3.5 h-3.5" />
          <span>Anthology • Chapter V</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#171717] tracking-wide mb-3">
          The Constellation of Us
        </h2>
        <p className="font-editorial text-base sm:text-xl text-[#71717A] italic leading-relaxed">
          Every memory is a star in our celestial map. Tap any star along the path to trace our defining moments.
        </p>
      </div>

      {/* Interactive Constellation Map Container */}
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10">
        
        {/* SVG Constellation Chart (Celestial Night Sky Window) */}
        <div className="relative w-full lg:w-3/5 h-[320px] sm:h-[400px] bg-[#09090A] rounded-xl border border-[#303030] shadow-2xl p-4 overflow-hidden backdrop-blur-md">
          {/* Subtle starfield particles */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:24px_24px]" />

          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Connecting Constellation Polyline */}
            <polyline
              points={milestones.map((m) => `${m.coordinates.x},${m.coordinates.y}`).join(' ')}
              fill="none"
              stroke="#71717A"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              className="opacity-70"
            />

            {/* Render Constellation Star Nodes */}
            {milestones.map((m, idx) => {
              const isSelected = selectedMilestone.id === m.id;
              return (
                <g
                  key={m.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Milestone ${m.year}: ${m.title}`}
                  className="cursor-pointer focus:outline-none"
                  onClick={() => handleSelectStar(m, idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectStar(m, idx);
                    }
                  }}
                >
                  {/* Outer pulse circle when selected */}
                  {isSelected && (
                    <circle
                      cx={m.coordinates.x}
                      cy={m.coordinates.y}
                      r="4.5"
                      fill="none"
                      stroke="#8E1624"
                      strokeWidth="0.6"
                      className="animate-ping origin-center motion-reduce:hidden"
                    />
                  )}

                  {/* Core Star Node */}
                  <circle
                    cx={m.coordinates.x}
                    cy={m.coordinates.y}
                    r={isSelected ? '2.5' : '1.8'}
                    fill={isSelected ? '#FFFFFF' : '#8E1624'}
                    className="transition-all duration-300 hover:scale-150 drop-shadow-[0_0_6px_rgba(142,22,36,0.7)]"
                  />

                  {/* Label Text */}
                  <text
                    x={m.coordinates.x}
                    y={m.coordinates.y - 3.5}
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.65)'}
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
              role="button"
              tabIndex={0}
              aria-label="Discover Polaris Secret Star"
              className="cursor-pointer group focus:outline-none"
              onClick={() => {
                sound.playChime(880.0);
                onOpenSecretStar?.();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  sound.playChime(880.0);
                  onOpenSecretStar?.();
                }
              }}
            >
              <circle
                cx="86"
                cy="18"
                r="4"
                fill="none"
                stroke="#8E1624"
                strokeWidth="0.5"
                className="animate-ping origin-center opacity-70 motion-reduce:hidden"
              />
              <circle
                cx="86"
                cy="18"
                r="2.2"
                fill="#FFFFFF"
                className="transition-transform group-hover:scale-150 drop-shadow-[0_0_10px_rgba(142,22,36,0.9)]"
              />
              <text
                x="86"
                y="13"
                textAnchor="middle"
                fill="#8E1624"
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
            <Sparkles className="w-3 h-3 text-[#8E1624]" />
            <span>Interactive Celestial Orbit</span>
          </div>
        </div>

        {/* Selected Milestone Story Card (White-dominant luxury editorial card) */}
        <div className="w-full lg:w-2/5 bg-white border border-[#171717]/10 rounded-sm p-6 sm:p-8 shadow-[0_4px_24px_rgba(23,23,23,0.06)] transition-all duration-500">
          <div className="flex items-center justify-between border-b border-[#171717]/10 pb-3 mb-4">
            <span className="font-serif text-[#8E1624] text-xl font-medium flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#8E1624]" />
              {selectedMilestone.year}
            </span>
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#71717A] flex items-center gap-1 font-medium">
              <Calendar className="w-3 h-3 text-[#8E1624]" />
              {selectedMilestone.date}
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#171717] mb-3 leading-snug">
            {selectedMilestone.title}
          </h3>

          <p className="font-editorial text-base sm:text-lg text-[#71717A] italic leading-relaxed">
            "{selectedMilestone.description}"
          </p>

          {/* Step Selector Pills */}
          <div className="mt-8 pt-4 border-t border-[#171717]/10 flex items-center justify-between">
            <span className="text-[10px] font-sans text-[#71717A] uppercase tracking-widest font-medium">
              Step {milestones.findIndex((m) => m.id === selectedMilestone.id) + 1} of {milestones.length}
            </span>

            <div className="flex items-center gap-1.5">
              {milestones.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectStar(m, idx)}
                  aria-label={`Jump to ${m.year}: ${m.title}`}
                  className={`h-2 rounded-full transition-all cursor-pointer focus:outline-none ${
                    selectedMilestone.id === m.id
                      ? 'bg-[#8E1624] w-5'
                      : 'bg-[#F2EFEB] hover:bg-[#8E1624]/40 w-2'
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
