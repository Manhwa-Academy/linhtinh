/**
 * Add Team Korea frame to database
 * This script adds the frame metadata - you need to upload the PNG manually
 * 
 * Run: node add-team-korea-frame.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load frames.json
const framesPath = path.join(__dirname, 'frames.json');
let framesData = [];

if (fs.existsSync(framesPath)) {
  try {
    const data = fs.readFileSync(framesPath, 'utf8');
    framesData = JSON.parse(data);
    if (!Array.isArray(framesData)) {
      framesData = [];
    }
  } catch (error) {
    console.log('⚠️  Could not read frames.json, creating new array');
    framesData = [];
  }
} else {
  console.log('📝 frames.json not found, creating new one');
}

// Team Korea frame data
const teamKoreaFrame = {
  id: `frame_${Date.now()}`,
  name: 'Team Korea PNC 2026',
  emoji: '🇰🇷',
  description: 'PUBG Nations Cup 2026 - Korean Team: GYUMIN 🦝, SEONGJANG 🔥, HEAVEN 😇, HEATHER ⭐',
  color: '#F0F4FF',
  bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F0F4FF 25%, #FFFFFF 50%, #FFF0F0 75%, #FFFFFF 100%)',
  frameImage: null, // Will be set after manual upload
  photoSlots: [
    {
      x: 8.33,
      y: 11.57,
      width: 83.33,
      height: 20.83,
      rotation: 0,
      label: 'GYUMIN 🦝'
    },
    {
      x: 8.33,
      y: 33.8,
      width: 83.33,
      height: 20.83,
      rotation: 0,
      label: 'SEONGJANG 🔥'
    },
    {
      x: 8.33,
      y: 56.02,
      width: 83.33,
      height: 20.83,
      rotation: 0,
      label: 'HEAVEN 😇'
    },
    {
      x: 8.33,
      y: 78.24,
      width: 83.33,
      height: 20.83,
      rotation: 0,
      label: 'HEATHER ⭐'
    }
  ],
  createdAt: new Date().toISOString()
};

// Check if frame already exists
const existingFrame = framesData.find(f => f.name === teamKoreaFrame.name);
if (existingFrame) {
  console.log('⚠️  Frame "Team Korea PNC 2026" already exists!');
  console.log('   ID:', existingFrame.id);
  console.log('   You can update it in AdminPage');
  process.exit(0);
}

// Add frame
framesData.push(teamKoreaFrame);

// Save
fs.writeFileSync(framesPath, JSON.stringify(framesData, null, 2));

console.log('✅ Frame added successfully!');
console.log('   ID:', teamKoreaFrame.id);
console.log('   Name:', teamKoreaFrame.name);
console.log('   Photo slots:', teamKoreaFrame.photoSlots.length);
console.log('\n📝 Next steps:');
console.log('   1. Open: frontend/public/create-team-korea-frame.html');
console.log('   2. Click "💾 Download PNG"');
console.log('   3. Go to AdminPage');
console.log('   4. Find "Team Korea PNC 2026" frame');
console.log('   5. Click "✏️ Sửa"');
console.log('   6. Upload the PNG file');
console.log('   7. Click "💾 Lưu"');
console.log('\n🚀 Done! Frame will appear in the list!');

export { teamKoreaFrame };
