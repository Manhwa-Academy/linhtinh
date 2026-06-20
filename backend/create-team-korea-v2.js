import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createTeamKoreaV2() {
  try {
    console.log('🇰🇷 Creating Team Korea V2 Frame - RISE AGAIN!');
    
    const svgPath = path.join(__dirname, 'team-korea-v2-frame.svg');
    const outputPath = path.join(__dirname, 'uploads', 'frames', 'team-korea-v2.png');
    
    await fs.mkdir(path.join(__dirname, 'uploads', 'frames'), { recursive: true });
    
    const svgBuffer = await fs.readFile(svgPath);
    
    await sharp(svgBuffer)
      .resize(1080, 2160)
      .png({ quality: 100, compressionLevel: 6 })
      .toFile(outputPath);
    
    console.log('✅ PNG created:', outputPath);
    
    const stats = await fs.stat(outputPath);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    
    console.log('\n✨ Frame Features:');
    console.log('   ⭐ Header: TEAM KOREA');
    console.log('   📅 Subtitle: PNC 2026');
    console.log('   🎨 Colors: Korean flag (Blue, Red, White)');
    console.log('   📸 Photo slots: 4 (transparent)');
    console.log('   🍗 Footer: RISE AGAIN');
    console.log('   📐 Size: 1080 × 2160px');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTeamKoreaV2();
