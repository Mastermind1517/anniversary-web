import React from 'react';
import { Heart, Sparkles, ArrowUp } from 'lucide-react';

interface FooterProps {
  partner1: string;
  partner2: string;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ partner1, partner2, onScrollToTop }) => {
  return (
    <footer className="relative w-full py-16 px-4 border-t border-white/10 text-center z-10 bg-[#0a080d]/80 backdrop-blur-md">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-[#d4af37]">
          <Heart className="w-4 h-4 fill-[#8b1e2b] text-[#8b1e2b]" />
          <span className="font-serif text-lg tracking-widest text-[#fbf8f2]">
            {partner1} & {partner2}
          </span>
          <Heart className="w-4 h-4 fill-[#8b1e2b] text-[#8b1e2b]" />
        </div>

        <p className="font-editorial text-neutral-400 italic text-base">
          "Whatever our souls are made of, yours and mine are the same."
        </p>

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={onScrollToTop}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-[#d4af37] border border-white/10 transition-colors font-sans text-xs uppercase tracking-wider cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Return to Beginning</span>
          </button>
        </div>

        <div className="mt-6 flex items-center gap-1 text-[11px] font-sans text-neutral-500 tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span>A Keepsake Anniversary Odyssey • Eternal Love</span>
        </div>
      </div>
    </footer>
  );
};
