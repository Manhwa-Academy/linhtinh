import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQUARE slot configuration (width = height for square photos)
const NEW_PORTRAIT_SLOTS = [
  {
    x: 39.5,    // Center horizontally: (100 - 21) / 2 = 39.5
    y: 6.5,     // Top slot
    width: 21,  // SQUARE: 21% width = 21% height
    height: 21,
    rotation: 0,
    label: 'Slot 1'
  },
  {
    x: 39.5,
    y: 28.5,    // Second slot
    width: 21,
    height: 21,
    rotation: 0,
    label: 'Slot 2'
  },
  {
    x: 39.5,
    y: 51.5,    // Third slot
    width: 21,
    height: 21,
    rotation: 0,
    label: 'Slot 3'
  },
  {
    x: 39.5,
    y: 74.5,    // Bottom slot
    width: 21,
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
        
        console.log(`   New: ${frame.photoSlots[0].width}% × ${frame.photoSlots[0].height}% (SQUARE)`);
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
    console.log(`   📐 New slot size: 21% × 21% (SQUARE 1:1)`);
    console.log(`   📍 Centered: x=39.5%`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n✨ Done! Frames now use SQUARE slots matching square photos.\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateAllFrameSlots();
