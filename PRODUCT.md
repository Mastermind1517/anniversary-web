# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience: **Krishangi** & **Parthib**.
- Krishangi: The recipient experiencing an intimate, cinematic anniversary gift and love letter.
- Parthib: The curator presenting their shared journey, memories, and vows.
- Context: A private, deeply personal digital celebration of their 1-year anniversary, viewed on personal mobile devices and desktop.

## Product Purpose

A private, bespoke cinematic anniversary retrospective and interactive keepsake celebrating the 1-year milestone of Krishangi and Parthib (anniversary date: October 25, 2025). The product exists to immortalize their first year together through literary storytelling, tactile interactions, and shared memories. Success means delivering an emotionally resonant, intimate experience that feels like opening a handcrafted heirloom letterbox.

## Positioning

An artisanal digital keepsake designed specifically for two people, distinctly apart from generic greeting cards or public anniversary templates. It anchors intimacy through cultural resonance (Assamese and English prose), physical skeumorphs (wax-sealed envelope, cassette mixtape, polaroid gallery with flip notes, celestial constellation, and a passcode-locked secret vault), and immersive sensory design.

## Operating Context

- Deployed as a private web application (hosted on Vercel at `anni-jet-ten.vercel.app`).
- Viewed in quiet, personal moments across mobile touchscreens and desktop viewports.
- Accompanied by ambient sound and music (headphones or personal speakers), featuring a procedural ambient synthesizer fallback when custom audio files are absent.

## Capabilities and Constraints

- **Envelope Stage**: Interactive 3D unfolding envelope with embossed wax seal ("K & P") and personalized opening letter ("Moromor Shona", signed "Jaan").
- **Precision Chronometer**: Live ticking counter displaying exact elapsed years, months, days, hours, minutes, and seconds since October 25, 2025.
- **Archival Memory Gallery**: 8-plate polaroid showcase with tactile flip-to-reverse handwritten notes and a shared-layout lightbox.
- **Cassette Tape Player**: Interactive skeuomorphic cassette deck with dual-spool spinning animation, track selection, and procedural audio engine.
- **Origami Love Notes Jar**: Interactive drawer of 12 discoverable folded notes categorized by sentiment.
- **Celestial Constellation**: Interactive SVG star map connecting significant relationship milestones, with an easter egg secret star (Polaris).
- **Final Vow & Secret Vault**: Climax letter with tactile press-and-hold vow sealing, leading to a passcode-guarded vault (`1025`) revealing an anniversary getaway.
- **Technical Constraints**: Built with React 19, TypeScript, Vite, Tailwind CSS v4, GSAP (ScrollTrigger), and Lenis smooth scrolling. Static web bundle with zero backend dependencies.

## Brand Commitments

- **Names & Monogram**: Krishangi & Parthib, monogram "K & P".
- **Anniversary Milestone**: 1 Year ("One Year of Holding Eternity in Our Hands"), October 25, 2025.
- **Voice & Tone**: Tender, poetic, timeless, reverent, blending intimate Assamese and English.
- **Visual Identity**: Warm archival parchment (`#F9F8F5`), deep romantic burgundy (`#8E1624`), charcoal editorial ink (`#171717`), tactile paper grain, and gold accents (`#C5A880`).

## Evidence on Hand

- Confirmed Assamese opening letter and signature ("Jaan") in `src/data/anniversaryContent.ts`.
- Confirmed anniversary milestone date (`2025-10-25T18:00:00`) and vault passcode (`1025`).
- Incumbent visual design and interactive components fully implemented across 8 sequential scenes.
- **Pending Personal Evidence**: Real personal photographs (currently Unsplash placeholders in `/public/photos/`), personal audio recordings (currently procedural chords in `/public/audio/`), custom milestone dates/stories, and the final vow letter text.

## Product Principles

1. **Intimacy Over Novelty**: Every interaction—unfolding a letter, flipping a photograph, spinning a cassette, unlocking the vault—serves emotional depth, not technical spectacle.
2. **Tactile Heirloom Metaphor**: Digital surfaces honor physical materials—parchment paper grain, crimson wax seals, analog tape spools, and handwritten ink.
3. **Authenticity in Shared Lore**: Every date, name, and phrase must reflect their genuine relationship history; placeholder remnants must be systematically eliminated.
4. **Uncompromising Craft & Fluidity**: 60fps smooth scrolling, natural touch ergonomics, zero layout shift, and graceful adaptation between mobile and desktop viewports.
