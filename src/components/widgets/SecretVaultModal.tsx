import React, { useState } from 'react';
import { sound } from '../audio/SoundEngine';
import { Lock, Unlock, X, Sparkles, Heart } from 'lucide-react';

interface SecretVaultModalProps {
  passcode: string;
  hint: string;
  secretMessage: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SecretVaultModal: React.FC<SecretVaultModalProps> = ({
  passcode,
  hint,
  secretMessage,
  isOpen,
  onClose,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim() === passcode) {
      sound.playChime(783.99); // G5 chime
      setIsUnlocked(true);
    } else {
      sound.playTapeClick();
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md bg-[#18111b] border border-[#d4af37]/40 rounded-2xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl ${
          errorShake ? 'animate-shake' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close vault"
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isUnlocked ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#8b1e2b]/20 border border-[#8b1e2b]/50 text-[#d4af37] mx-auto flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-2xl text-[#fbf8f2] mb-2">
              The Keepsake Secret Vault
            </h3>
            <p className="font-editorial text-sm text-neutral-300 italic mb-6">
              A private surprise is locked inside.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Enter 4-digit date"
                  className="w-full text-center text-2xl tracking-widest px-4 py-3 rounded-xl bg-white/5 border border-[#d4af37]/30 text-[#fbf8f2] placeholder:text-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                  autoFocus
                />
                <span className="font-sans text-[11px] text-neutral-400 mt-2 block">
                  Hint: {hint}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#8b1e2b] hover:bg-[#a62435] text-white font-sans text-xs uppercase tracking-widest font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Secret</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase text-[#d4af37] mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#8b1e2b] text-[#8b1e2b]" />
              <span>Vault Unlocked</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#fbf8f2] mb-4">
              Your Anniversary Surprise
            </h3>

            <div className="p-6 rounded-xl bg-[#241725] border border-[#d4af37]/30 my-4 text-left">
              <p className="font-editorial text-lg text-neutral-200 leading-relaxed italic">
                "{secretMessage}"
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-2 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close Keepsake
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
