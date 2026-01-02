/**
 * Generate optimized WebP variants of the hero image for responsive loading.
 * Also generates an optimized PNG fallback for browsers without WebP support.
 * 
 * Usage: node scripts/generate-hero-images.mjs
 * 
 * Generates:
 *   - heroIMG-480.webp  (480px wide, mobile)
 *   - heroIMG-768.webp  (768px wide, tablet)
 *   - heroIMG-1024.webp (1024px wide, desktop)
 *   - heroIMG-1920.webp (1920px wide, retina/large screens)
 *   - heroIMG-fallback.png (1920px wide, optimized PNG for legacy browsers)
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ASSETS_DIR = join(__dirname, '..', 'src', 'assets');
const SOURCE_IMAGE = join(ASSETS_DIR, 'heroIMG.png');

const SIZES = [
  { width: 480, suffix: '-480' },
  { width: 768, suffix: '-768' },
  { width: 1024, suffix: '-1024' },
  { width: 1920, suffix: '-1920' },
];

async function generateImages() {
  console.log('🖼️  Generating optimized hero images...\n');

  if (!existsSync(SOURCE_IMAGE)) {
    console.error(`❌ Source image not found: ${SOURCE_IMAGE}`);
    process.exit(1);
  }

  const metadata = await sharp(SOURCE_IMAGE).metadata();
  console.log(`📐 Source: ${metadata.width}x${metadata.height} (${metadata.format})\n`);

  for (const size of SIZES) {
    const outputPath = join(ASSETS_DIR, `heroIMG${size.suffix}.webp`);
    
    try {
      const result = await sharp(SOURCE_IMAGE)
        .resize(size.width, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: 85,
          effort: 6, // Higher = better compression, slower
        })
        .toFile(outputPath);

      const savings = metadata.width > size.width 
        ? `(${Math.round((1 - result.size / (metadata.width * metadata.height * 4 / (metadata.width / size.width) ** 2)) * 100)}% smaller)`
        : '';
      
      console.log(`✅ ${size.width}px → heroIMG${size.suffix}.webp (${Math.round(result.size / 1024)}KB) ${savings}`);
    } catch (err) {
      console.error(`❌ Failed to generate ${size.width}px version:`, err.message);
    }
  }

  // Generate optimized PNG fallback (for browsers without WebP support)
  console.log('\n📦 Generating optimized PNG fallback...');
  try {
    const pngResult = await sharp(SOURCE_IMAGE)
      .resize(1920, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .png({
        compressionLevel: 9,
        palette: false,
      })
      .toFile(join(ASSETS_DIR, 'heroIMG-fallback.png'));
    
    console.log(`✅ PNG fallback → heroIMG-fallback.png (${Math.round(pngResult.size / 1024)}KB)`);
  } catch (err) {
    console.error('❌ Failed to generate PNG fallback:', err.message);
  }

  console.log('\n🎉 Done! HeroVisual.tsx now uses optimized images.');
}

generateImages().catch(console.error);
