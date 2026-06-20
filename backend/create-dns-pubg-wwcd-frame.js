import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createDnsPubgWwcdFrame() {
  try {
    console.log('🎮 Creating DNS PUBG WWCD Frame...');
    
    const svgPath = path.join(__dirname, 'dns-pubg-wwcd-frame.svg');
    const outputPath = path.join(__dirname, 'uploads', 'frames', 'dns-pubg-wwcd-2026.png');
    
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
    
    // Frame data for frames.json
    const frameData = {
      id: 'dns-pubg-wwcd-2026',
      name: 'DNS PUBG WWCD 2026',
      description: 'PUBG 2026 - WWCD Theme with DNS Team - Winner Winner Chicken Dinner',
      emoji: '🏆',
      color: '#0EA5E9',
      bgGradient: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 50%, #7DD3FC 100%)',
      frameImage: 'http://localhost:3001/uploads/frames/dns-pubg-wwcd-2026.png',
      photoSlots: [
        {
          x: 10,
          y: 6.9,
          width: 80,
          height: 21.3,
          rotation: 0,
          label: 'GYUMIN'
        },
        {
          x: 10,
          y: 29.6,
          width: 80,
          height: 21.3,
          rotation: 0,
          label: 'HEAVEN'
        },
        {
          x: 10,
          y: 51.9,
          width: 80,
          height: 21.3,
          rotation: 0,
          label: 'DIEL'
        },
        {
          x: 10,
          y: 74.1,
          width: 80,
          height: 21.3,
          rotation: 0,
          label: 'REX'
        }
      ]
    };
    
    console.log('\n📋 Frame Data (add to frames.json):');
    console.log(JSON.stringify(frameData, null, 2));
    
    console.log('\n✨ Done! Now you can:');
    console.log('1. Upload this frame via Admin page');
    console.log('2. Or manually add the JSON data above to frames.json');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createDnsPubgWwcdFrame();
