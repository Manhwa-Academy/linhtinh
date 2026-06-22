import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkFrameSizes() {
  const framesDir = path.join(__dirname, 'uploads', 'frames');
  const files = await fs.readdir(framesDir);
  const pngFiles = files.filter(f => f.endsWith('.png'));
  
  console.log('📐 FRAME SIZES CHECK:\n');
  console.log('Expected: 1652x4920px\n');
  
  for (const file of pngFiles) {
    const filePath = path.join(framesDir, file);
    const metadata = await sharp(filePath).metadata();
    const match = metadata.width === 1652 && metadata.height === 4920;
    const icon = match ? '✅' : '❌';
    console.log(`${icon} ${file}: ${metadata.width}x${metadata.height}px`);
  }
}

checkFrameSizes();
