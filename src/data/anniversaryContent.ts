import type { AnniversaryData } from '../types';

/**
 * =============================================================================
 * CENTRALIZED ANNIVERSARY CONTENT CONFIGURATION
 * =============================================================================
 * 
 * This file contains all personal content, texts, dates, photograph references,
 * audio tracks, and secrets for the anniversary website.
 * 
 * TO PERSONALIZE:
 * 1. Partner Details: Update `partner1`, `partner2`, `anniversaryDate`, and `envelopeMonogram`.
 * 2. Photographs: Place your images in `/public/photos/` and update `imageUrl` in `memories`.
 * 3. Audio Tracks: Place your MP3 files in `/public/audio/` and update `audioSrc` in `tracks`.
 * 4. Letters: Edit `openingLetter` and `finalLetter` with your personal vows and reflections.
 * 5. Secret Vault: Set your personal `passcode` (e.g. anniversary month and day).
 * =============================================================================
 */

export const anniversaryData: AnniversaryData = {
  // ---------------------------------------------------------------------------
  // 1. SITE METADATA & BROWSER HEAD
  // ---------------------------------------------------------------------------
  siteMetadata: {
    browserTitle: "Our Story — A Cinematic Anniversary Keepsake",
    metaDescription: "An intimate cinematic anniversary love letter, archival photographs, and constellation of cherished memories.",
    themeColor: "#F9F8F5",
  },

  // ---------------------------------------------------------------------------
  // 2. PARTNERS & CORE ANNIVERSARY MILESTONES
  // ---------------------------------------------------------------------------
  partner1: "Krishangi",
  partner2: "Parthib",
  anniversaryDate: "2025-10-25T18:00:00", // Drives the precision elapsed chronometer
  tagline: "One Year of Holding Eternity in Our Hands",
  envelopeMonogram: "K & P", // Inscribed on the 3D wax seal

  // ---------------------------------------------------------------------------
  // 3. OPENING SCENE & ENVELOPE INVITATION
  // ---------------------------------------------------------------------------
  invitation: {
    badgeText: "An Intimate Anniversary Retrospective",
    scrollPrompt: "Scroll to Unfold",
    tapSealPrompt: "(or tap the wax seal)",
    unfoldedHint: "Scroll down to explore our story ↓",
  },

  openingLetter: {
    salutation: "Moromor Shona,",
    lines: [
      "Ek kahini jitu likha nasile, jikhon ami, etiya, protipol, likhi asu.",
      "Ek good morning or pora i hate you tumar logot nuxu loi ek dhuniya kahini",
      "Protitu muhurto jen tumar logotei ximito, xaiye xoday tumar buliyei ajio asu kalio asu aro xoday asu",
      "Promise Promise Promise, Pinky Promise"
    ],
    closing: "Always yours,",
    signature: "Jaan",
  },

  // ---------------------------------------------------------------------------
  // 4. PROLOGUE & LITERARY MOTIF
  // ---------------------------------------------------------------------------
  prologueQuote: "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  prologueAuthor: "Maya Angelou",

  // ---------------------------------------------------------------------------
  // 5. MEMORY PHOTOGRAPHS & REVERSE HANDWRITTEN NOTES
  // Place your photos in /public/photos/ (e.g. /photos/photo1.jpg)
  // ---------------------------------------------------------------------------
  memories: [
    {
      id: "mem-1",
      title: "The Rainy Café in Autumn",
      date: "October 24, 2022",
      dateTag: "Chapter I • 2022",
      location: "Rue Saint-Louis",
      imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85",
      caption: "Where two steaming mugs of cinnamon latte turned into five hours of conversations we never wanted to end.",
      handwrittenNote: "You had a drop of rain caught on your eyelashes, and I knew right then that ordinary life had just changed forever.",
      rotation: -3.5,
      aspectRatio: 'portrait',
      size: 'featured',
      direction: 'left',
      parallaxSpeed: 0.12,
      tapeStyle: 'kraft',
      stampText: 'PARIS • 24.10.22',
    },
    {
      id: "mem-2",
      title: "Sunset Over the Golden Bluffs",
      date: "June 14, 2023",
      dateTag: "Chapter II • 2023",
      location: "Pacific Coastline",
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1000&q=85",
      caption: "Wind in our hair, the smell of salt and cedar, watching the Pacific swallow the sun.",
      handwrittenNote: "We promised to watch 10,000 more sunsets side-by-side. Here's to sunset number 482.",
      rotation: 2.2,
      aspectRatio: 'landscape',
      size: 'hero',
      direction: 'right',
      parallaxSpeed: -0.15,
      tapeStyle: 'vellum',
      stampText: 'COASTAL AIR MAIL',
    },
    {
      id: "mem-3",
      title: "Midnight Kitchen Dances",
      date: "November 08, 2023",
      dateTag: "Chapter III • 2023",
      location: "Our First Little Apartment",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=85",
      caption: "Barefoot on cold tiles, burning garlic bread, swaying to a playlist made for two.",
      handwrittenNote: "No spotlight, no audience, just the refrigerator humming while you spun me into your arms.",
      rotation: -1.8,
      aspectRatio: 'square',
      size: 'standard',
      direction: 'left',
      parallaxSpeed: 0.18,
      tapeStyle: 'kraft',
      stampText: '00:42 AM • HOME',
    },
    {
      id: "mem-4",
      title: "The Hidden Bookshop in the Mist",
      date: "February 14, 2024",
      dateTag: "Chapter IV • 2024",
      location: "Old Town Cobblestones",
      imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=85",
      caption: "Dusty paperbacks, old leather armchairs, and whispered quotes in the poetry aisle.",
      handwrittenNote: "You slipped a dried lavender sprig into chapter seven of my favorite book. I still keep it by my bedside.",
      rotation: 2.8,
      aspectRatio: 'portrait',
      size: 'standard',
      direction: 'top',
      parallaxSpeed: -0.08,
      tapeStyle: 'vellum',
      stampText: 'EX LIBRIS • ARCHIVE',
    },
    {
      id: "mem-5",
      title: "Underneath the Starry Pine Canopy",
      date: "August 19, 2024",
      dateTag: "Chapter V • 2024",
      location: "Whispering Ridge",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85",
      caption: "A crackling bonfire, wool blankets, and shooting stars tracing promises across the night.",
      handwrittenNote: "We counted eleven falling stars, and every single one of my wishes was just for you.",
      rotation: -2.4,
      aspectRatio: 'landscape',
      size: 'featured',
      direction: 'right',
      parallaxSpeed: 0.16,
      tapeStyle: 'vellum',
      stampText: 'STELLAR ELEVATION',
    },
    {
      id: "mem-6",
      title: "The Stolen Vespa Ride at Dawn",
      date: "May 03, 2025",
      dateTag: "Chapter VI • 2025",
      location: "Riviera Cliffs",
      imageUrl: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=85",
      caption: "Rushing past olive groves before the world woke up, your arms wrapped tight around my waist.",
      handwrittenNote: "Cold wind on our cheeks and pure joy in our chests. We felt completely infinite.",
      rotation: 1.6,
      aspectRatio: 'landscape',
      size: 'compact',
      direction: 'left',
      parallaxSpeed: -0.14,
      tapeStyle: 'kraft',
      stampText: 'RIVIERA EXPRESS',
    },
    {
      id: "mem-7",
      title: "The Glasshouse Sanctuary",
      date: "January 11, 2026",
      dateTag: "Chapter VII • 2026",
      location: "Botanical Glasshouse",
      imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=900&q=85",
      caption: "Surrounded by emerald palms while outside was frozen white. Our own warm sanctuary.",
      handwrittenNote: "You held my hand and said, 'Wherever we are together, spring never really leaves us.'",
      rotation: -1.9,
      aspectRatio: 'portrait',
      size: 'standard',
      direction: 'bottom',
      parallaxSpeed: 0.1,
      tapeStyle: 'kraft',
      stampText: 'SANCTUARY • WINTER',
    },
    {
      id: "mem-8",
      title: "Today & All Our Tomorrows",
      date: "October 24, 2026",
      dateTag: "Chapter VIII • Eternity",
      location: "Here & Everywhere With You",
      imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85",
      caption: "Every morning waking up beside you is my favorite chapter yet.",
      handwrittenNote: "I would choose you in every lifetime, in every parallel world, across all iterations of time.",
      rotation: 0.8,
      aspectRatio: 'landscape',
      size: 'hero',
      direction: 'bottom',
      parallaxSpeed: 0.05,
      tapeStyle: 'vellum',
      stampText: 'PERPETUAL SEAL',
    },
  ],

  // ---------------------------------------------------------------------------
  // 6. LOVE NOTES JAR
  // ---------------------------------------------------------------------------
  loveNotes: [
    {
      id: 1,
      teaser: "Your morning smile",
      content: "The sleepy, tender way your face softens right as you open your eyes and find me next to you.",
      category: "Quiet Moments",
    },
    {
      id: 2,
      teaser: "The way you hold my hand",
      content: "Firm, warm, and instinctively tracing the back of my fingers when you know I'm feeling anxious.",
      category: "Touch",
    },
    {
      id: 3,
      teaser: "Your infectious laugh",
      content: "The uninhibited, crinkled-eye laugh that completely derails whatever serious conversation we were having.",
      category: "Joy",
    },
    {
      id: 4,
      teaser: "Our tea rituals",
      content: "How you always brew the second cup just slightly hotter because you know I let mine sit too long.",
      category: "Tenderness",
    },
    {
      id: 5,
      teaser: "Your quiet brilliance",
      content: "Watching you completely immersed in something you are passionate about, eyes sparkling with discovery.",
      category: "Admiration",
    },
    {
      id: 6,
      teaser: "Shared silences",
      content: "How we can spend three hours in the same room reading different books without saying a word, yet feeling closer than ever.",
      category: "Comfort",
    },
    {
      id: 7,
      teaser: "Dancing when no one is watching",
      content: "The silly kitchen pirouettes and improvised songs you sing to make a mundane Tuesday feel like a festival.",
      category: "Playfulness",
    },
    {
      id: 8,
      teaser: "Your fierce kindness",
      content: "The unhesitating empathy you show strangers, animals, and the people you love. You make the world gentler.",
      category: "Heart",
    },
    {
      id: 9,
      teaser: "Our inside jokes",
      content: "A single raised eyebrow across a crowded dinner table that speaks paragraphs only the two of us understand.",
      category: "Connection",
    },
    {
      id: 10,
      teaser: "Road trip playlists",
      content: "Singing off-key at the top of our lungs with the windows down on empty highway stretches at dusk.",
      category: "Adventure",
    },
    {
      id: 11,
      teaser: "How you believe in me",
      content: "When self-doubt creeps in, you remind me who I am with so much unwavering conviction that I believe it too.",
      category: "Strength",
    },
    {
      id: 12,
      teaser: "Simply being home",
      content: "No matter where our luggage is dropped, home has never been an address for me. Home has always been you.",
      category: "Devotion",
    },
  ],

  // ---------------------------------------------------------------------------
  // 7. CELESTIAL MILESTONE CONSTELLATION
  // ---------------------------------------------------------------------------
  milestones: [
    {
      id: "mile-1",
      year: "2022",
      date: "October 24",
      title: "The Spark That Lit the Sky",
      description: "Our eyes met across the library tables. What began as borrowed notes became the beginning of our world.",
      coordinates: { x: 15, y: 35 },
    },
    {
      id: "mile-2",
      year: "2023",
      date: "May 12",
      title: "The First 'I Love You'",
      description: "Whispered on a rain-drenched bench under the cherry blossoms as the streetlights flickered on.",
      coordinates: { x: 32, y: 65 },
    },
    {
      id: "mile-3",
      year: "2023",
      date: "November 04",
      title: "Keys to Our Sanctuary",
      description: "Unpacking mismatched boxes, sleeping on a mattress on the floor, celebrating with takeaway noodles.",
      coordinates: { x: 50, y: 25 },
    },
    {
      id: "mile-4",
      year: "2024",
      date: "July 22",
      title: "The Grand Road Trip",
      description: "Three weeks across mountain passes, camping under Orion, learning the true rhythm of our companionship.",
      coordinates: { x: 68, y: 70 },
    },
    {
      id: "mile-5",
      year: "2025",
      date: "October 24",
      title: "Three Years of Grace",
      description: "Weathering storms and rejoicing in quiet victories, our love deepening into unshakable bedrock.",
      coordinates: { x: 82, y: 38 },
    },
    {
      id: "mile-6",
      year: "2026 & Beyond",
      date: "Today & Forever",
      title: "The Unwritten Constellation",
      description: "Standing on the threshold of all that is yet to come, hand in hand, ready for every new horizon.",
      coordinates: { x: 92, y: 60 },
    },
  ],

  // ---------------------------------------------------------------------------
  // 8. SOUNDTRACKS & WEB AUDIO SYNTHESIZER
  // Place your audio files in /public/audio/ (e.g. /audio/our-song.mp3).
  // If an audio file is not supplied, the procedural synthesizer automatically
  // generates warm ambient chords tuned to chordRootFreq!
  // ---------------------------------------------------------------------------
  tracks: [
    {
      id: "tr-1",
      title: "Nocturne in C Minor",
      subtitle: "The Rain on the Skylight",
      duration: "3:42",
      mood: "Intimate & Reflective",
      chordRootFreq: 261.63, // C4
      audioSrc: "/audio/track1_nocturne.mp3",
    },
    {
      id: "tr-2",
      title: "Golden Hour Waltz",
      subtitle: "Our First Kitchen Dance",
      duration: "4:15",
      mood: "Warm & Nostalgic",
      chordRootFreq: 293.66, // D4
      audioSrc: "/audio/track2_golden_hour.mp3",
    },
    {
      id: "tr-3",
      title: "Starlight Reverie",
      subtitle: "Whispering Ridge at 2am",
      duration: "3:58",
      mood: "Ethereal & Celestial",
      chordRootFreq: 329.63, // E4
      audioSrc: "/audio/track3_starlight.mp3",
    },
    {
      id: "tr-4",
      title: "Promised Horizon",
      subtitle: "Vows Written in the Wind",
      duration: "4:30",
      mood: "Deeply Romantic",
      chordRootFreq: 349.23, // F4
      audioSrc: "/audio/track4_horizon.mp3",
    },
  ],

  // ---------------------------------------------------------------------------
  // 9. OPTIONAL VOICE NOTES & MEMOS
  // ---------------------------------------------------------------------------
  voiceNotes: [
    {
      id: "vn-1",
      title: "Whispered Under the Porch Rain",
      date: "October 24, 2023",
      duration: "0:45",
      audioSrc: "/audio/voice_note_1.mp3",
      transcript: "I just wanted to record this so you can hear how the rain sounds right now against the roof. I am sitting here thinking about how grateful I am that you exist in my life...",
    },
  ],

  // ---------------------------------------------------------------------------
  // 10. DISCOVERABLE EASTER EGGS & ARCHIVAL SECRETS
  // ---------------------------------------------------------------------------
  hiddenMessages: [
    {
      id: "msg-seal",
      source: "wax-seal",
      title: "The Monogram Inscription",
      subtitle: "Archival Seal • K & P",
      content: "Embossed in deep crimson wax: 'K & P' signifies two separate wandering spirits who discovered that their favorite destination was simply each other.",
      dateTag: "October 25, 2025",
    },
    {
      id: "msg-compass",
      source: "floating-compass",
      title: "The Whispered Keepsake",
      subtitle: "A Secret From My Heart",
      content: "Did you know that on our very first road trip, when you fell asleep with your head against the car window, I turned off the radio just so I could listen to the quiet, peaceful rhythm of your breathing?",
      dateTag: "Summer 2023",
    },
    {
      id: "msg-star",
      source: "starlit-secret",
      title: "Polaris of My Life",
      subtitle: "Celestial Map Discovery",
      content: "Ancient voyagers navigated dark seas using the North Star because it never wavered from its true station. In four years of unpredictable currents, you have been my steady, brilliant light.",
      dateTag: "August 19, 2024",
    },
    {
      id: "msg-curator",
      source: "polaroid-footnote",
      title: "Archival Curator's Footnote",
      subtitle: "Between the Shutter Clicks",
      content: "The greatest memories were never the perfectly framed photographs, but the blurry, laughing seconds right before and right after the shutter clicked. The unscripted joy is where our true love lives.",
      dateTag: "Permanent Archive",
    },
  ],

  // ---------------------------------------------------------------------------
  // 11. GRAND CLIMAX: THE ETERNAL VOW PARCHMENT LETTER
  // ---------------------------------------------------------------------------
  finalLetter: {
    greeting: "To My Dearest Love,",
    paragraphs: [
      "If you had told me four years ago that a single glance across a quiet room could realign the trajectory of my entire life, I would have thought you were speaking poetry. But with you, poetry became our daily reality.",
      "We have lived through seasons of brilliant sunlight and seasons of quiet, gentle storms. Through every joy, every late-night conversation, every early morning when the world was asleep and only we were awake, you have been my anchor, my sweetest comfort, and my greatest adventure.",
      "Thank you for loving me not just when it is easy, but especially when life feels heavy. Thank you for your patience, your boundless grace, your hilarious sense of humor, and the profound safety I feel wrapped in your arms.",
      "Four years together is only the prologue to the epic story we are writing. As long as I have breath, my heart belongs to you, wholly and without hesitation.",
    ],
    closing: "Forever and always yours,",
    signature: "Jaan",
  },

  // ---------------------------------------------------------------------------
  // 12. SECRET GETAWAY VAULT (PASSCODE PROTECTED)
  // ---------------------------------------------------------------------------
  secretVault: {
    passcode: "1025", // Enter your anniversary month & day (e.g. MMDD)
    hint: "The four digits of our anniversary date (MM/DD)",
    destination: "Lake Como, Villa Bellissima",
    date: "November 15 – 22, 2026",
    secretMessage: "Surprise! Pack your bags for the weekend of November 15th. We're going to that cozy cabin by the lake you saved on Pinterest six months ago. Fireplace, hot chocolate, mountain air, and just the two of us. I love you beyond words!",
  },
};
