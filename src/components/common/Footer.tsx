import React from 'react';
import { Heart, Sparkles, ArrowUp } from 'lucide-react';

interface FooterProps {
  partner1: string;
  partner2: string;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ partner1, partner2, onScrollToTop }) => {
  return (
    <footer className="relative w-full py-20 px-4 border-t border-[#171717]/10 text-center z-10 bg-[#F9F8F5] select-none">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
        <div className="flex items-center gap-2.5 text-[#8E1624]">
          <Heart className="w-3.5 h-3.5 fill-[#8E1624] text-[#8E1624]" />
          <span className="font-serif text-2xl tracking-wide text-[#171717] font-light">
            {partner1} & {partner2}
          </span>
          <Heart className="w-3.5 h-3.5 fill-[#8E1624] text-[#8E1624]" />
        </div>

        <p className="font-editorial text-[#71717A] italic text-base sm:text-lg max-w-md leading-relaxed">
          "Whatever our souls are made of, yours and mine are the same."
        </p>

        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={onScrollToTop}
            aria-label="Return to beginning of anniversary story"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-white hover:bg-[#171717] text-[#171717] hover:text-[#F9F8F5] border border-[#171717]/15 transition-all duration-300 font-sans text-xs uppercase tracking-[0.24em] cursor-pointer shadow-sm hover:shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Return to Beginning</span>
          </button>
        </div>

        <div className="mt-6 flex items-center gap-1.5 text-[10px] font-sans text-[#71717A] tracking-[0.24em] uppercase font-medium">
          <Sparkles className="w-3 h-3 text-[#8E1624]" />
          <span>A Keepsake Anniversary Odyssey • Eternal Love</span>
        </div>
      </div>
    </footer>
  );
};
