import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateTeamKoreaFrame() {
  try {
    console.log('🇰🇷 Updating Team Korea Frame...');
    
    const svgPath = path.join(__dirname, 'team-korea-frame.svg');
    const outputPath = path.join(__dirname, 'uploads', 'frames', 'team-korea-2026.png');
    
    // Ensure uploads/frames directory exists
    await fs.mkdir(path.join(__dirname, 'uploads', 'frames'), { recursive: true });
    
    // Read SVG
    const svgBuffer = await fs.readFile(svgPath);
    
    // Convert to PNG with sharp
    await sharp(svgBuffer)
      .resize(1080, 2160)
      .png({ quality: 100, compressionLevel: 6 })
      .toFile(outputPath);
    
    console.log('✅ PNG created:', outputPath);
    
    // Get file stats
    const stats = await fs.stat(outputPath);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    
    console.log('\n✨ Done! Team Korea frame updated successfully!');
    console.log('   - Changed: KR 🇰🇷 → 2026');
    console.log('   - Size: 1080 × 2160px');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateTeamKoreaFrame();
