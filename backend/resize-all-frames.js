import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OLD_SIZE = { width: 1080, height: 2160 };
const NEW_SIZE = { width: 1652, height: 4920 };

async function resizeAllFrames() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📐 RESIZE ALL FRAMES TO 1652x4920px');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const framesDir = path.join(__dirname, 'uploads', 'frames');
    const backupDir = path.join(__dirname, 'uploads', 'frames_backup_1080x2160');
    
    // Create backup directory
    await fs.mkdir(backupDir, { recursive: true });
    console.log('✅ Backup directory created:', backupDir);
    
    // Get all PNG files
    const files = await fs.readdir(framesDir);
    const pngFiles = files.filter(f => f.endsWith('.png'));
    
    console.log(`\n📋 Found ${pngFiles.length} PNG frames to resize:\n`);
    
    let resized = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const file of pngFiles) {
      const srcPath = path.join(framesDir, file);
      const backupPath = path.join(backupDir, file);
      
      try {
        // Get current image info
        const metadata = await sharp(srcPath).metadata();
        
        console.log(`📸 ${file}`);
        console.log(`   Current: ${metadata.width}x${metadata.height}px`);
        
        // Skip if already correct size
        if (metadata.width === NEW_SIZE.width && metadata.height === NEW_SIZE.height) {
          console.log('   ⏭️  Already correct size, skipping\n');
          skipped++;
          continue;
        }
        
        // Backup original
        await fs.copyFile(srcPath, backupPath);
        console.log('   💾 Backed up to:', path.basename(backupPath));
        
        // Resize image
        await sharp(srcPath)
          .resize(NEW_SIZE.width, NEW_SIZE.height, {
            fit: 'fill', // Stretch to exact dimensions
            kernel: 'lanczos3' // High quality
          })
          .png({ quality: 100, compressionLevel: 6 })
          .toFile(srcPath + '.tmp');
        
        // Replace original with resized
        await fs.rename(srcPath + '.tmp', srcPath);
        
        console.log(`   ✅ Resized to: ${NEW_SIZE.width}x${NEW_SIZE.height}px\n`);
        resized++;
        
      } catch (error) {
        console.error(`   ❌ Error processing ${file}:`, error.message, '\n');
        errors++;
      }
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY:');
    console.log(`   ✅ Resized: ${resized} frames`);
    console.log(`   ⏭️  Skipped: ${skipped} frames (already correct size)`);
    console.log(`   ❌ Errors: ${errors} frames`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (resized > 0) {
      console.log('\n💡 NEXT STEPS:');
      console.log('   1. All frames have been resized to 1652x4920px');
      console.log('   2. Original frames backed up to:', backupDir);
      console.log('   3. If frames use photoSlots, you may need to adjust slot positions');
      console.log('   4. Deploy changes to see new size in action\n');
    }
    
    console.log('✨ Done!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

resizeAllFrames();
