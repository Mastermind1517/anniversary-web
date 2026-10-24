export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  caption: string;
  handwrittenNote: string;
  rotation: number;
  aspectRatio?: 'portrait' | 'landscape' | 'square' | 'panoramic';
  size?: 'hero' | 'featured' | 'standard' | 'compact';
  direction?: 'left' | 'right' | 'top' | 'bottom';
  parallaxSpeed?: number;
  tapeStyle?: 'gold' | 'kraft' | 'vellum' | 'stamp';
  stampText?: string;
  dateTag?: string;
}

export interface LoveNote {
  id: number;
  teaser: string;
  content: string;
  category: string;
}

export interface MilestoneItem {
  id: string;
  year: string;
  date: string;
  title: string;
  description: string;
  coordinates: { x: number; y: number }; // Percentage positions in SVG constellation
}

export interface HiddenMessage {
  id: string;
  source: 'wax-seal' | 'floating-compass' | 'starlit-secret' | 'polaroid-footnote';
  title: string;
  subtitle?: string;
  content: string;
  icon?: string;
  dateTag?: string;
}

export interface MixtapeTrack {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  mood: string;
  chordRootFreq: number; // For Web Audio procedural romantic synth
  audioSrc?: string; // Optional local audio asset path (e.g. "/audio/our-song.mp3")
}

export interface VoiceNote {
  id: string;
  title: string;
  date: string;
  duration: string;
  audioSrc: string;
  transcript?: string;
}

export interface SiteMetadata {
  browserTitle: string;
  metaDescription: string;
  ogImage?: string;
  canonicalUrl?: string;
  themeColor?: string;
}

export interface OpeningInvitation {
  badgeText?: string;
  scrollPrompt?: string;
  tapSealPrompt?: string;
  unfoldedHint?: string;
}

export interface OpeningLetter {
  salutation?: string;
  lines: string[];
  closing?: string;
  signature?: string;
}

export interface FinalLetter {
  greeting: string;
  paragraphs: string[];
  closing: string;
  signature: string;
}

export interface SecretVault {
  passcode: string; // e.g. "1024" (MMDD or special year)
  hint: string;
  destination?: string;
  date?: string;
  secretMessage: string;
}

export interface AnniversaryData {
  // Metadata & Head
  siteMetadata: SiteMetadata;

  // Partner Identity & Core Dates
  partner1: string;
  partner2: string;
  anniversaryDate: string; // ISO date string e.g. "2022-10-24T18:00:00"
  tagline: string;
  envelopeMonogram: string;

  // Opening Scene Configuration
  invitation?: OpeningInvitation;
  openingLetter?: OpeningLetter;

  // Prologue
  prologueQuote: string;
  prologueAuthor: string;

  // Interactive Collections
  memories: MemoryItem[];
  loveNotes: LoveNote[];
  milestones: MilestoneItem[];
  tracks: MixtapeTrack[];
  voiceNotes?: VoiceNote[];
  hiddenMessages: HiddenMessage[];

  // Epilogue & Climax
  finalLetter: FinalLetter;
  secretVault: SecretVault;
}
