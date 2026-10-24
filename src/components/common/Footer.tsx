import React from 'react';
import { Heart, Sparkles, ArrowUp } from 'lucide-react';

interface FooterProps {
  partner1: string;
  partner2: string;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ partner1, partner2, onScrollToTop }) => {
  return (
    <footer className="relative w-full py-16 px-4 border-t border-[#F2EFEB] text-center z-10 bg-[#F9F8F5]/90 backdrop-blur-md">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-[#8E1624]">
          <Heart className="w-4 h-4 fill-[#8E1624] text-[#8E1624]" />
          <span className="font-serif text-xl tracking-widest text-[#171717]">
            {partner1} & {partner2}
          </span>
          <Heart className="w-4 h-4 fill-[#8E1624] text-[#8E1624]" />
        </div>

        <p className="font-editorial text-[#71717A] italic text-lg max-w-md">
          "Whatever our souls are made of, yours and mine are the same."
        </p>

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={onScrollToTop}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white hover:bg-[#F2EFEB] text-[#171717] hover:text-[#8E1624] border border-[#F2EFEB] transition-all font-sans text-xs uppercase tracking-wider cursor-pointer shadow-sm hover:shadow"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Return to Beginning</span>
          </button>
        </div>

        <div className="mt-6 flex items-center gap-1.5 text-[11px] font-sans text-[#71717A] tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-[#8E1624]" />
          <span>A Keepsake Anniversary Odyssey • Eternal Love</span>
        </div>
      </div>
    </footer>
  );
};
