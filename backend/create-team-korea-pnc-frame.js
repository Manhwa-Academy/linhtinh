/**
 * Create Team Korea PNC Frame PNG
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createKoreaPNCFrame() {
  console.log('🇰🇷 Creating Team Korea PNC Frame!');
  
  const svgPath = path.join(__dirname, 'team-korea-pnc-frame.svg');
  const pngPath = path.join(__dirname, 'uploads', 'frames', 'team-korea-pnc-2026.png');
  
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
  console.log('   ⭐ Header: TEAM KOREA');
  console.log('   📅 Subtitle: PNC 2026');
  console.log('   🎨 Colors: Korean flag (Blue, Red, White)');
  console.log('   📸 Photo slots: 4 (transparent)');
  console.log('   🏆 Footer: RISE AGAIN');
  console.log('   🎨 Size: 1080 × 2160px');
  console.log('   🇰🇷 Players: GYUMIN, SEONGJANG, HEAVEN, HEATHER');
}

createKoreaPNCFrame().catch(console.error);
