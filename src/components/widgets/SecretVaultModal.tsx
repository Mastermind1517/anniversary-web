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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md bg-white border border-[#F2EFEB] rounded-2xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl ${
          errorShake ? 'animate-shake' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close vault"
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#71717A] hover:text-[#171717] hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isUnlocked ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#8E1624]/10 border border-[#8E1624]/30 text-[#8E1624] mx-auto flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-2xl text-[#171717] mb-2">
              The Keepsake Secret Vault
            </h3>
            <p className="font-editorial text-sm text-[#71717A] italic mb-6">
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
                  className="w-full text-center text-2xl tracking-widest px-4 py-3 rounded-xl bg-black/5 border border-black/15 text-[#171717] placeholder:text-[#71717A] focus:outline-none focus:border-[#8E1624] focus:ring-1 focus:ring-[#8E1624]"
                  autoFocus
                />
                <span className="font-sans text-[11px] text-[#71717A] mt-2 block">
                  Hint: {hint}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#8E1624] hover:bg-[#A81E2E] text-white font-sans text-xs uppercase tracking-widest font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Secret</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-[#8E1624]/10 border border-[#8E1624]/30 text-[#8E1624] mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase text-[#8E1624] mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#8E1624] text-[#8E1624]" />
              <span>Vault Unlocked</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#171717] mb-4">
              Your Anniversary Surprise
            </h3>

            <div className="p-6 rounded-xl bg-[#F9F8F5] border border-[#F2EFEB] my-4 text-left">
              <p className="font-handwriting text-2xl text-[#171717] leading-relaxed">
                "{secretMessage}"
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-2 px-6 py-2 rounded-full bg-black/5 hover:bg-black/10 text-[#171717] font-sans text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close Keepsake
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
