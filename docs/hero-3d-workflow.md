# Hero 3D Asset Workflow

This document describes how to create, optimize, and integrate custom 3D assets for the InnoviaBurst hero section.

## Overview

The hero section supports:
1. **Procedural 3D** (default): A programmatic "Automation Core" visualization built with Three.js
2. **Custom GLB Model**: A Meshy-generated or custom 3D model in GLB format

## Current Implementation

By default, the hero displays a procedural 3D scene featuring:
- A central cube/core representing the automation engine
- Orbiting nodes connected by torus rings representing workflows
- Brand colors: cyan (`hsl(192, 85%, 50%)`), deep blue (`hsl(210, 70%, 45%)`), orange (`hsl(24, 95%, 53%)`)
- Subtle floating animation (respects `prefers-reduced-motion`)

## Creating a Custom GLB Model with Meshy

### 1. Generate with Meshy

1. Go to [Meshy.ai](https://www.meshy.ai)
2. Use the **Text to 3D** or **Image to 3D** feature
3. Recommended prompts for InnoviaBurst branding:
   - "Minimalist tech cube with orbiting spheres, clean enterprise style, cyan and blue gradient, subtle glow"
   - "Abstract automation workflow, connected nodes, modern tech aesthetic, blue and orange accents"
   - "Futuristic data core, floating particles, premium tech visualization"
4. Export settings:
   - Format: **GLB** (recommended for web)
   - Quality: High
   - Include materials/textures

### 2. Alternative: Luma Genie / TripoSR

- **Luma Genie**: Good for concept exploration
- **TripoSR**: Best when starting from a single reference image

## Optimizing with gltfpack

### Prerequisites

Install gltfpack:
```bash
npm install -g gltfpack
# or download from https://github.com/zeux/meshoptimizer/releases
```

### Optimization Command

```bash
# Basic optimization (recommended)
gltfpack -i input.glb -o public/3d/hero-automation.glb -tc

# Aggressive optimization (smaller file, may reduce quality)
gltfpack -i input.glb -o public/3d/hero-automation.glb -tc -si 0.5 -sa

# With texture compression (requires basis_universal)
gltfpack -i input.glb -o public/3d/hero-automation.glb -tc -tb
```

### gltfpack Options

| Flag | Description |
|------|-------------|
| `-tc` | Texture compression (KTX2) |
| `-tb` | Basis Universal compression |
| `-si <ratio>` | Simplify meshes (0.0-1.0) |
| `-sa` | Aggressive simplification |
| `-noq` | Disable quantization |
| `-cc` | Produce compressed gltf |

### Target Metrics

| Metric | Target | Maximum |
|--------|--------|---------|
| File size | < 500KB | 1MB |
| Triangles | < 10K | 50K |
| Textures | 1K max | 2K |
| Materials | < 5 | 10 |

## Adding to the Project

1. Place the optimized GLB at: `public/3d/hero-automation.glb`
2. The component automatically detects and loads custom GLB models
3. Test on multiple devices and network conditions

## Performance Considerations

### Lazy Loading
- The 3D canvas is lazy-loaded only when visible (IntersectionObserver)
- A fallback timer loads after 3 seconds regardless of visibility
- Loading timeout: 8 seconds before showing static fallback

### WebGL Fallback
- WebGL availability is checked before attempting to load
- If WebGL is unavailable, a static SVG poster is displayed

### Reduced Motion
- All animations respect `prefers-reduced-motion`
- When enabled, the model displays statically

## File Structure

```
public/
  3d/
    hero-automation.glb    # Main GLB model (when using custom)
    hero-poster.webp       # Static fallback image (optional)

src/components/sections/
  Hero3DVisual.tsx         # Wrapper with lazy loading & fallbacks
  Hero3DCanvas.tsx         # Three.js canvas with scene
  HeroSection.tsx          # Main hero component
```

## Testing Checklist

- [ ] Hard refresh: Hero text/CTAs appear before 3D loads
- [ ] Throttled network: Fallback appears if 3D is slow (> 8s)
- [ ] WebGL disabled: Static SVG poster shown
- [ ] `prefers-reduced-motion`: Animation disabled
- [ ] Mobile: No overflow, correct sizing
- [ ] Desktop: Smooth 60fps animation
- [ ] Lighthouse: No significant perf regression

## Troubleshooting

### Model not loading
1. Check browser console for errors
2. Verify file exists at `/3d/hero-automation.glb`
3. Ensure GLB is valid (test in [gltf-viewer.donmccurdy.com](https://gltf-viewer.donmccurdy.com))

### Poor performance
1. Reduce triangle count with `gltfpack -si 0.5`
2. Compress textures with `-tc` flag
3. Check for excessive materials/draw calls

### Visual issues
1. Verify lighting in the scene
2. Check material metalness/roughness values
3. Ensure model scale is appropriate (default scale: 1.5)

## npm Script (Optional)

Add to package.json if needed:

```json
{
  "scripts": {
    "optimize:hero3d": "gltfpack -i assets/raw/hero-model.glb -o public/3d/hero-automation.glb -tc"
  }
}
```
