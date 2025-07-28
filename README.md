# Live Droplets - Interactive Rainforest Experience

An immersive single-page web experience featuring a draggable water droplet that controls both visual and audio elements of a rainforest scene.

## Features

- **Interactive Droplet**: Drag the water droplet anywhere on the screen
- **Day/Night Transitions**: Vertical movement controls the blend between day and night scenes
  - Top = Daytime
  - Bottom = Nighttime
  - Middle = Twilight blend
- **Dynamic Soundscape**: Horizontal movement controls the rain intensity
  - Left = Light, gentle rain ambience
  - Right = Intense, heavy rain sounds
- **Smooth Transitions**: Eased blending for natural, magical feel
- **Touch Support**: Works on both desktop and mobile devices

## Current Status

The application is using **placeholder assets** for development:
- Video files: Sample videos from Google's common data storage
- Audio files: Sample audio tracks as placeholders

## Assets Needed

To complete the experience, you'll need:

1. **Day Video** (1080p, seamless loop)
   - Rainforest scene during daytime
   - Should match the framing of the night video

2. **Night Video** (1080p, seamless loop)
   - Same rainforest scene at nighttime
   - Must align perfectly with day video for smooth crossfade

3. **Light Rain Audio** (seamless loop)
   - Gentle rainforest ambience
   - Light rain sounds, bird calls, subtle nature sounds

4. **Intense Rain Audio** (seamless loop)
   - Heavy rain and storm sounds
   - Thunder optional but adds drama

## How to Add Your Assets

1. Place your video files in the `public` folder
2. Update the video `src` attributes in `app/components/RainforestExperience.tsx`
3. Update the audio `src` attributes in the same file

## Performance Optimization

The app is optimized for:
- Fast initial load with lazy media loading
- Smooth 60fps interactions
- Minimal CPU usage during idle states
- Efficient video crossfading using CSS opacity

## Deployment

Ready for deployment on Vercel:
```bash
npm run build
# Deploy to Vercel
```

## Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```
