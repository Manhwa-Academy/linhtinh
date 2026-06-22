import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// New square slot configuration (1:1 ratio for selfie photos)
const NEW_PORTRAIT_SLOTS = [
  {
    x: 30,      // Center horizontally (30% from left)
    y: 6.5,     // Top slot
    width: 40,  // 40% width (square ratio: 40/21 ≈ 1.9:1)
    height: 21, // 21% height
    rotation: 0,
    label: 'Slot 1'
  },
  {
    x: 30,
    y: 28.5,    // Second slot
    width: 40,
    height: 21,
    rotation: 0,
    label: 'Slot 2'
  },
  {
    x: 30,
    y: 51.5,    // Third slot
    width: 40,
    height: 21,
    rotation: 0,
    label: 'Slot 3'
  },
  {
    x: 30,
    y: 74.5,    // Bottom slot
    width: 40,
    height: 21,
    rotation: 0,
    label: 'Slot 4'
  }
];

async function updateAllFrameSlots() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📐 UPDATE ALL FRAMES TO PORTRAIT SLOTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const framesJsonPath = path.join(__dirname, 'frames.json');
    
    // Read frames.json
    const framesData = JSON.parse(await fs.readFile(framesJsonPath, 'utf-8'));
    
    console.log(`📋 Found ${framesData.length} frames\n`);
    
    let updated = 0;
    
    // Update each frame
    framesData.forEach((frame, index) => {
      if (frame.photoSlots && frame.photoSlots.length === 4) {
        console.log(`✏️  Updating: ${frame.name}`);
        console.log(`   Old: ${frame.photoSlots[0].width}% × ${frame.photoSlots[0].height}% (landscape)`);
        
        // Update photoSlots with new portrait configuration
        frame.photoSlots = NEW_PORTRAIT_SLOTS.map((slot, i) => ({
          ...slot,
          label: frame.photoSlots[i]?.label || `Slot ${i + 1}`
        }));
        
        console.log(`   New: ${frame.photoSlots[0].width}% × ${frame.photoSlots[0].height}% (square)`);
        console.log('');
        updated++;
      } else if (frame.photoSlots) {
        console.log(`⏭️  Skipping: ${frame.name} (${frame.photoSlots.length} slots)`);
      }
    });
    
    // Save updated frames.json
    await fs.writeFile(
      framesJsonPath,
      JSON.stringify(framesData, null, 2),
      'utf-8'
    );
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY:');
    console.log(`   ✅ Updated: ${updated} frames`);
    console.log(`   📐 New slot size: 40% × 21% (square)`);
    console.log(`   📍 Centered horizontally (x=30%)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n✨ Done! Frames now use square slots for selfie photos.\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateAllFrameSlots();
