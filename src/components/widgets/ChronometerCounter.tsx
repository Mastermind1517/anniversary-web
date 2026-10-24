import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ChronometerCounterProps {
  startDate: string;
  partner1: string;
  partner2: string;
  quote: string;
  quoteAuthor: string;
}

interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalYears: string;
}

export const ChronometerCounter: React.FC<ChronometerCounterProps> = ({
  startDate,
  partner1,
  partner2,
  quote,
  quoteAuthor,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [elapsed, setElapsed] = useState<TimeElapsed>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalYears: '0.00',
  });

  useEffect(() => {
    const start = new Date(startDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      const totalYears = (diff / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2);

      setElapsed({ days, hours, minutes, seconds, totalYears });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  // Smooth narrative entry scroll transition with reduced-motion respect
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(sectionRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        sectionRef.current,
        { opacity: 0.2, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 88%',
            end: 'top 55%',
            scrub: 0.6,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full py-28 px-4 flex flex-col items-center justify-center text-center z-10 transition-opacity select-none"
    >
      {/* Decorative Editorial Crimson Arch Line */}
      <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#8E1624]/60 to-transparent mb-10" />

      {/* Quote Capsule */}
      <div className="max-w-2xl mx-auto mb-16">
        <p className="font-editorial text-2xl sm:text-3xl text-[#171717] italic leading-relaxed mb-4">
          "{quote}"
        </p>
        <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#71717A] font-medium">
          — {quoteAuthor}
        </span>
      </div>

      {/* Chronometer Box */}
      <div className="relative p-8 sm:p-10 rounded-sm bg-[#FFFFFF] border border-[#171717]/10 shadow-[0_12px_40px_rgba(23,23,23,0.05)] max-w-3xl w-full">
        <div className="flex items-center justify-center gap-2 text-[#8E1624] text-[10px] font-sans tracking-[0.26em] uppercase mb-8 font-medium">
          <Clock className="w-3.5 h-3.5 animate-spin [animation-duration:16s] motion-reduce:animate-none" />
          <span>Every Breath Together</span>
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="p-4 sm:p-5 rounded-sm bg-[#F9F8F5] border border-[#171717]/8">
            <span className="font-serif text-3xl sm:text-5xl font-light text-[#171717] block leading-none">
              {elapsed.days.toLocaleString()}
            </span>
            <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-[#71717A] mt-2 block font-medium">
              Days
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-sm bg-[#F9F8F5] border border-[#171717]/8">
            <span className="font-serif text-3xl sm:text-5xl font-light text-[#171717] block leading-none">
              {String(elapsed.hours).padStart(2, '0')}
            </span>
            <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-[#71717A] mt-2 block font-medium">
              Hours
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-sm bg-[#F9F8F5] border border-[#171717]/8">
            <span className="font-serif text-3xl sm:text-5xl font-light text-[#171717] block leading-none">
              {String(elapsed.minutes).padStart(2, '0')}
            </span>
            <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-[#71717A] mt-2 block font-medium">
              Minutes
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-sm bg-[#F9F8F5] border border-[#171717]/8">
            <span className="font-serif text-3xl sm:text-5xl font-light text-[#8E1624] block leading-none">
              {String(elapsed.seconds).padStart(2, '0')}
            </span>
            <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-[#71717A] mt-2 block font-medium">
              Seconds
            </span>
          </div>
        </div>

        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-2 text-sm font-editorial italic text-[#71717A]">
          <Heart className="w-3.5 h-3.5 fill-[#8E1624] text-[#8E1624]" />
          <span>
            {partner1} & {partner2} • {elapsed.totalYears} magnificent years of loving each other
          </span>
        </div>
      </div>
    </section>
  );
};
