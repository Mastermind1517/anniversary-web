# Audio & Soundtracks Directory (`/public/audio/`)

Place your custom audio files, background tracks, and personal voice memos here.

## Recommended File Naming
- `track1_nocturne.mp3`
- `track2_golden_hour.mp3`
- `track3_starlight.mp3`
- `track4_horizon.mp3`
- `voice_note_1.mp3`

## How to Link in `src/data/anniversaryContent.ts`
In [`src/data/anniversaryContent.ts`](file:///C:/Users/dilip/code/ANNI/src/data/anniversaryContent.ts), update the `audioSrc` property:

```typescript
tracks: [
  {
    id: "tr-1",
    title: "Our Song",
    subtitle: "Under the Stars",
    duration: "3:42",
    chordRootFreq: 261.63, // Root harmonic frequency
    audioSrc: "/audio/our_song.mp3", // Local file in public/audio/
  },
  // ...
]
```

## Built-In Procedural Audio Fallback
If you haven't uploaded an audio file yet, the built-in Web Audio synthesizer automatically generates an organic, romantic ambient harmonic soundscape tuned to each song's chord frequency (`chordRootFreq`). The site will never crash, stall, or remain silent.
