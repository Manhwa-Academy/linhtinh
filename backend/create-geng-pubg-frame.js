/**
 * Create GENG PUBG Frame PNG
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createGengFrame() {
  console.log('🐯 Creating GENG PUBG Frame!');
  
  const svgPath = path.join(__dirname, 'geng-pubg-frame.svg');
  const pngPath = path.join(__dirname, 'uploads', 'frames', 'geng-pubg-2026.png');
  
  // Read SVG
  const svgBuffer = fs.readFileSync(svgPath);
  
  // Convert to PNG
  await sharp(svgBuffer)
    .png()
    .toFile(pngPath);
  
  const stats = fs.statSync(pngPath);
  const fileSizeKB = (stats.size / 1024).toFixed(2);
  
  console.log('✅ PNG created:', pngPath);
  console.log('📊 File size:', fileSizeKB, 'KB');
  console.log('\n✨ Frame Features:');
  console.log('   🐯 Header: GENG PUBG');
  console.log('   📅 Subtitle: 2026');
  console.log('   🎨 Colors: Gold & Black');
  console.log('   📸 Photo slots: 4 (transparent)');
  console.log('   🏆 Footer: ROAR TO WIN');
  console.log('   🎨 Size: 1080 × 2160px');
  console.log('   🐯 Tiger theme with stars and Korean flag');
}

createGengFrame().catch(console.error);
