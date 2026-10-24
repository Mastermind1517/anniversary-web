import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles } from 'lucide-react';
import { getLenis } from '../../hooks/useLenis';
import { sound } from '../audio/SoundEngine';

interface ElegantModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  dateTag?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

export const ElegantModal: React.FC<ElegantModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  dateTag,
  icon,
  children,
  maxWidth = 'max-w-lg',
}) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      const lenis = getLenis();
      if (lenis) {
        lenis.stop();
      }

      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Auto focus modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = prevOverflow;
        if (lenis) {
          lenis.start();
        }
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        sound.playPaperRustle();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleClose = () => {
    sound.playPaperRustle();
    onClose();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all duration-300"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxWidth} bg-[#F9F8F5] text-[#171717] rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(23,23,23,0.35)] border border-[#F2EFEB] my-auto animate-in fade-in zoom-in-95 duration-200 outline-none`}
      >
        {/* Top Archival Washi Tape */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#F2EFEB] border-y border-[#71717A]/30 shadow-sm backdrop-blur-sm pointer-events-none flex items-center justify-center -rotate-1">
          <span className="font-sans text-[8px] uppercase tracking-widest text-[#303030] font-bold">
            CONFIDENTIAL ARCHIVE
          </span>
        </div>

        {/* Vintage Charcoal Corner Brackets */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#303030]/25 pointer-events-none" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#303030]/25 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal dialog (Escape)"
          className="absolute top-4 right-4 p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-[#171717] hover:text-[#8E1624] transition-all cursor-pointer group"
        >
          <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
        </button>

        {/* Header Area */}
        <div className="border-b border-[#171717]/10 pb-4 mb-5">
          <div className="flex items-center gap-2 mb-1">
            {icon ? (
              <span className="text-[#8E1624]">{icon}</span>
            ) : (
              <Sparkles className="w-4 h-4 text-[#8E1624]" />
            )}
            {subtitle && (
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#8E1624] font-semibold">
                {subtitle}
              </span>
            )}
            {dateTag && (
              <span className="ml-auto font-mono text-[10px] text-[#71717A] uppercase tracking-wider">
                {dateTag}
              </span>
            )}
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#171717] tracking-tight">
            {title}
          </h3>
        </div>

        {/* Body Content */}
        <div className="text-[#171717] leading-relaxed font-sans">{children}</div>

        {/* Footer info / Escape key shortcut */}
        <div className="mt-6 pt-3 border-t border-[#171717]/10 flex items-center justify-between text-[11px] text-[#71717A] font-sans">
          <span className="italic font-serif">A keepsake preserved forever</span>
          <span className="hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-black/5 text-[#171717] font-mono text-[10px] border border-black/10">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};
