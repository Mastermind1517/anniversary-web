# Photographs Directory (`/public/photos/`)

Place your personal high-resolution photographs here.

## Recommended File Naming
Use descriptive, clean filenames:
- `photo1_portrait.jpg` (or `.webp` / `.png`)
- `photo2_landscape.jpg`
- `photo3_square.jpg`
- `photo4_portrait.jpg`
- `photo5_landscape.jpg`
- `photo6_landscape.jpg`
- `photo7_portrait.jpg`
- `photo8_hero.jpg`

## How to Link in `src/data/anniversaryContent.ts`
In [`src/data/anniversaryContent.ts`](file:///C:/Users/dilip/code/ANNI/src/data/anniversaryContent.ts), update the `imageUrl` property of each memory item:

```typescript
{
  id: "mem-1",
  title: "The Rainy Café in Autumn",
  imageUrl: "/photos/photo1_portrait.jpg", // Local file in public/photos/
  // ...
}
```

## Best Practices
1. **Aspect Ratios**:
   - `portrait`: ~3:4 or 4:5 ratio (e.g. 1200 × 1600 px)
   - `landscape`: ~4:3 or 16:9 ratio (e.g. 1600 × 1200 px)
   - `square`: 1:1 ratio (e.g. 1200 × 1200 px)
2. **File Size**:
   - For fast load times, compress images to under 400KB using tools like Squoosh, TinyPNG, or WebP format.
3. **Graceful Fallback**:
   - If a photo file is not yet uploaded or fails to load, the gallery displays an archival textured keepsake placeholder so the layout never breaks.
