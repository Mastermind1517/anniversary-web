import React, { useState, useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import { anniversaryData } from './data/anniversaryContent';
import type { HiddenMessage } from './types';
import { AudioProvider } from './context/AudioProvider';
import { AmbientCanvas } from './components/common/AmbientCanvas';
import { NoiseOverlay } from './components/common/NoiseOverlay';
import { CustomCursor } from './components/common/CustomCursor';
import { HeaderNav } from './components/common/HeaderNav';
import { EnvelopeStage } from './components/envelope/EnvelopeStage';
import { ChronometerCounter } from './components/widgets/ChronometerCounter';
import { PolaroidGallery } from './components/memories/PolaroidGallery';
import { CassettePlayer } from './components/widgets/CassettePlayer';
import { LoveNotesJar } from './components/widgets/LoveNotesJar';
import { MilestoneConstellation } from './components/widgets/MilestoneConstellation';
import { VowPressAndHold } from './components/widgets/VowPressAndHold';
import { CinematicAudioPlayer } from './components/audio/CinematicAudioPlayer';
import { FloatingMemoryWidget } from './components/widgets/FloatingMemoryWidget';
import { ElegantModal } from './components/common/ElegantModal';
import { Footer } from './components/common/Footer';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const lenisRef = useLenis();
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [activeSecretMessage, setActiveSecretMessage] = useState<HiddenMessage | null>(null);

  // Synchronize dynamic site metadata and browser title
  useEffect(() => {
    if (anniversaryData.siteMetadata?.browserTitle) {
      document.title = anniversaryData.siteMetadata.browserTitle;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && anniversaryData.siteMetadata?.metaDescription) {
      metaDesc.setAttribute('content', anniversaryData.siteMetadata.metaDescription);
    }
  }, []);

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { offset: -40, duration: 1.5 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleScrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Find secret message helper
  const getSecretMessage = (id: string): HiddenMessage | undefined => {
    return anniversaryData.hiddenMessages.find((m) => m.id === id);
  };

  const handleOpenMonogramSecret = () => {
    const msg = getSecretMessage('msg-seal');
    if (msg) setActiveSecretMessage(msg);
  };

  const handleOpenFootnoteSecret = () => {
    const msg = getSecretMessage('msg-curator');
    if (msg) setActiveSecretMessage(msg);
  };

  const handleOpenStarSecret = () => {
    const msg = getSecretMessage('msg-star');
    if (msg) setActiveSecretMessage(msg);
  };

  return (
    <AudioProvider tracks={anniversaryData.tracks}>
      <div className="relative min-h-screen bg-[#0d0b0f] text-[#fbf8f2] selection:bg-[#d4af37]/30 selection:text-[#fbf8f2]">
        {/* Ambient Canvas & Visual Overlays */}
        <AmbientCanvas />
        <NoiseOverlay />
        <CustomCursor />

        {/* Floating Header Navigation */}
        <HeaderNav
          monogram={anniversaryData.envelopeMonogram}
          isEnvelopeOpen={isEnvelopeOpen}
          onScrollTo={handleScrollTo}
          onOpenMonogramSecret={handleOpenMonogramSecret}
        />

        {/* Main Content Odyssey */}
        <main className="relative z-10 flex flex-col items-center w-full">
          {/* Scene 1 & 2: The Atelier & The 3D Unfolding Envelope */}
          <EnvelopeStage
            monogram={anniversaryData.envelopeMonogram}
            tagline={anniversaryData.tagline}
            partner1={anniversaryData.partner1}
            partner2={anniversaryData.partner2}
            anniversaryDate={anniversaryData.anniversaryDate}
            isOpen={isEnvelopeOpen}
            onOpenComplete={() => setIsEnvelopeOpen(true)}
            openingLetter={anniversaryData.openingLetter}
            invitation={anniversaryData.invitation}
          />

          {/* Scene 3: The Prologue & Precision Chronometer */}
          <ChronometerCounter
            startDate={anniversaryData.anniversaryDate}
            partner1={anniversaryData.partner1}
            partner2={anniversaryData.partner2}
            quote={anniversaryData.prologueQuote}
            quoteAuthor={anniversaryData.prologueAuthor}
          />

          {/* Scene 4: The Polaroid & Memory Chronicle with Curator Footnote */}
          <PolaroidGallery
            memories={anniversaryData.memories}
            onOpenFootnote={handleOpenFootnoteSecret}
          />

          {/* Scene 5: Skeuomorphic Mixtape Player */}
          <CassettePlayer tracks={anniversaryData.tracks} />

          {/* Scene 6: Origami Love Notes Jar */}
          <LoveNotesJar notes={anniversaryData.loveNotes} />

          {/* Scene 7: Celestial Milestone Constellation with Secret Polaris Star */}
          <MilestoneConstellation
            milestones={anniversaryData.milestones}
            onOpenSecretStar={handleOpenStarSecret}
          />

          {/* Scene 8: The Grand Climax Vow & Epilogue */}
          <VowPressAndHold
            partner1={anniversaryData.partner1}
            partner2={anniversaryData.partner2}
            letter={anniversaryData.finalLetter}
            secretVault={anniversaryData.secretVault}
            onReplay={handleScrollToTop}
          />
        </main>

        {/* Compact Cinematic Audio Player Pill & Drawer */}
        <CinematicAudioPlayer />

        {/* Floating Keepsake Companion Widget */}
        <FloatingMemoryWidget
          hiddenMessages={anniversaryData.hiddenMessages}
          anniversaryDate={anniversaryData.anniversaryDate}
          onScrollTo={handleScrollTo}
          onOpenMessageModal={(msg) => setActiveSecretMessage(msg)}
        />

        {/* Discoverable Secret Archival Message Modal */}
        <ElegantModal
          isOpen={activeSecretMessage !== null}
          onClose={() => setActiveSecretMessage(null)}
          title={activeSecretMessage?.title || ''}
          subtitle={activeSecretMessage?.subtitle}
          dateTag={activeSecretMessage?.dateTag}
          icon={<Sparkles className="w-5 h-5 text-[#d4af37]" />}
        >
          <div className="py-2">
            <p className="font-handwriting text-2xl sm:text-3xl text-[#231b14] leading-relaxed my-3 px-1 sm:px-2">
              "{activeSecretMessage?.content}"
            </p>
          </div>
        </ElegantModal>

        {/* Footer */}
        <Footer
          partner1={anniversaryData.partner1}
          partner2={anniversaryData.partner2}
          onScrollToTop={handleScrollToTop}
        />
      </div>
    </AudioProvider>
  );
};

export default App;
