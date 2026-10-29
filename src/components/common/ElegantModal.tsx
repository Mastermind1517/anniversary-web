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
      className="fixed inset-0 z-[999] bg-[#09090A]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all duration-300 select-none"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxWidth} bg-[#F9F8F5] text-[#171717] rounded-sm p-6 sm:p-8 shadow-[0_24px_50px_-12px_rgba(23,23,23,0.25)] border border-[#171717]/10 my-auto animate-modal-enter outline-none`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal dialog (Escape)"
          className="absolute top-4 right-4 p-1.5 rounded-full bg-black/5 hover:bg-[#8E1624] text-[#171717] hover:text-white transition-all cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8E1624]"
        >
          <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
        </button>

        {/* Archival Folio Header */}
        <div className="border-b border-[#171717]/10 pb-3.5 mb-5 pr-8">
          <div className="flex items-center gap-2 mb-1.5">
            {icon ? (
              <span className="text-[#8E1624]">{icon}</span>
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-[#8E1624]" />
            )}
            {subtitle && (
              <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#8E1624] font-medium">
                {subtitle}
              </span>
            )}
            {dateTag && (
              <span className="ml-auto font-mono text-[9px] text-[#71717A] uppercase tracking-wider">
                {dateTag}
              </span>
            )}
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#171717] tracking-tight leading-snug">
            {title}
          </h3>
        </div>

        {/* Body Content */}
        <div className="text-[#171717] leading-relaxed font-sans">{children}</div>

        {/* Footer info / Escape key shortcut */}
        <div className="mt-6 pt-3 border-t border-[#171717]/10 flex items-center justify-between text-[11px] text-[#71717A] font-sans">
          <span className="italic font-serif">A keepsake preserved across time</span>
          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider">
            Press <kbd className="px-1.5 py-0.5 rounded bg-black/5 text-[#171717] font-mono text-[10px] border border-black/10">Esc</kbd> to exit
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};
