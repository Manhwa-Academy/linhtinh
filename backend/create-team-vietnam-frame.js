/**
 * Create Team Vietnam Frame PNG
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createVietnamFrame() {
  console.log('🇻🇳 Creating Team Vietnam Frame!');
  
  const svgPath = path.join(__dirname, 'team-vietnam-frame.svg');
  const pngPath = path.join(__dirname, 'uploads', 'frames', 'team-vietnam-2026.png');
  
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
  console.log('   ⭐ Header: TEAM VIETNAM');
  console.log('   📅 Subtitle: PNC 2026');
  console.log('   🎨 Colors: Red & Gold (Vietnam flag)');
  console.log('   📸 Photo slots: 4 (transparent)');
  console.log('   🐉 Footer: RISE OF THE DRAGON');
  console.log('   🎨 Size: 1080 × 2160px');
  console.log('   🇻🇳 Players: TANVUU, HIMASS, DELWYN, SOLOLZY');
}

createVietnamFrame().catch(console.error);
