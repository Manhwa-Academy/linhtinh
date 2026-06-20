/**
 * Automatically create and "upload" Team Korea frame
 * This creates a base64 data URL placeholder
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const framesPath = path.join(__dirname, 'frames.json');
const frames = JSON.parse(fs.readFileSync(framesPath, 'utf8'));

// Find Team Korea frame
const teamKoreaFrame = frames.find(f => f.name === 'Team Korea PNC 2026');

if (!teamKoreaFrame) {
  console.log('❌ Team Korea frame not found!');
  console.log('   Run: node add-team-korea-frame.js first');
  process.exit(1);
}

if (teamKoreaFrame.frameImage) {
  console.log('✅ Frame already has image!');
  console.log('   URL:', teamKoreaFrame.frameImage);
  console.log('\n💡 To update, open AdminPage and upload new PNG');
  process.exit(0);
}

// Create a placeholder message
const placeholderMessage = `
🇰🇷 TEAM KOREA FRAME - Manual Upload Required

Frame is ready in AdminPage but needs PNG image.

Quick Steps:
1. Open: frontend/public/create-team-korea-frame.html
2. Click "💾 Download PNG"
3. Go to AdminPage
4. Find "Team Korea PNC 2026 🇰🇷"
5. Click "✏️ Sửa"
6. Upload PNG
7. Click "💾 Lưu"

The frame is already configured with:
✅ 4 photo slots (GYUMIN, SEONGJANG, HEAVEN, HEATHER)
✅ Korean flag colors
✅ PNC 2026 theme
✅ RISE AGAIN slogan

Just upload the PNG and it's ready to use!
`;

console.log(placeholderMessage);

// Set a placeholder URL that will be visible in AdminPage
teamKoreaFrame.frameImage = "UPLOAD_REQUIRED";

// Save
fs.writeFileSync(framesPath, JSON.stringify(frames, null, 2));

console.log('✅ Frame marked for upload in AdminPage');
console.log('   ID:', teamKoreaFrame.id);
console.log('   Refresh AdminPage to see it!');
