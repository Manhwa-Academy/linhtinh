import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use production API
const API_URL = 'https://linhtinh-9snn.vercel.app';

async function uploadCandyPncFrame() {
  try {
    console.log('🍭 Starting Candy PnC Korea 2026 Frame Upload...\n');
    
    // Frame image path
    const framePath = path.join(__dirname, 'uploads', 'frames', 'candy-pnc-korea-2026.png');
    
    // Check if frame image exists
    if (!fs.existsSync(framePath)) {
      console.error('❌ Error: Frame image not found at:', framePath);
      console.log('\n📝 Please save the frame image as:');
      console.log('   backend/uploads/frames/candy-pnc-korea-2026.png');
      return;
    }
    
    console.log('✅ Frame image found:', framePath);
    
    // Frame data with same slot configuration as DNS PUBG
    const frameData = {
      name: 'Candy PnC Korea 2026',
      description: 'Sweet Candy Gaming Style - PnC Korea Team 2026',
      emoji: '🍭',
      color: '#EC4899',
      bgGradient: 'linear-gradient(135deg, #FF0844 0%, #FF6B9D 25%, #A855F7 50%, #3B82F6 75%, #0EA5E9 100%)',
      photoSlots: [
        {
          x: 10,
          y: 6.9,
          width: 80,
          height: 21.3,
          rotation: 0,
          label: 'GYUMIN 🦝'
        },
        {
          x: 10,
          y: 29.6,
          width: 80,
          height: 21.3,
          rotation: 0,
          label: 'HI HEAVEN 😇'
        },
        {
          x: 10,
          y: 54.6,
          width: 80,
          height: 21.3,
          rotation: 0,
          label: 'HEATHER 🌸'
        },
        {
          x: 10,
          y: 79.6,
          width: 80,
          height: 21.3,
          rotation: 0,
          label: 'SEONG JANG 💫'
        }
      ],
      isPrivate: false
    };
    
    console.log('\n📋 Frame Configuration:');
    console.log('   Name:', frameData.name);
    console.log('   Description:', frameData.description);
    console.log('   Emoji:', frameData.emoji);
    console.log('   Photo Slots:', frameData.photoSlots.length);
    console.log('   Public/Private:', frameData.isPrivate ? 'Private' : 'Public');
    
    // Create form data
    const formData = new FormData();
    formData.append('frameData', JSON.stringify(frameData));
    formData.append('frameImage', fs.createReadStream(framePath), {
      filename: 'candy-pnc-korea-2026.png',
      contentType: 'image/png'
    });
    
    console.log('\n📤 Uploading to production API...');
    console.log('   API URL:', API_URL);
    
    // Upload to API
    const response = await fetch(`${API_URL}/api/frames`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('\n✅ SUCCESS! Frame uploaded successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎉 Frame Details:');
      console.log('   ID:', result.frame.id);
      console.log('   Name:', result.frame.name);
      console.log('   Image URL:', result.frame.frameImage);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🚀 Frame is now live on:');
      console.log('   https://meomiry.vercel.app/booth');
      console.log('\n💡 Users may need to refresh (Ctrl+Shift+R) to see the new frame.');
    } else {
      console.error('\n❌ Upload failed!');
      console.error('   Status:', response.status);
      console.error('   Error:', result.error || result.message);
      if (result.details) {
        console.error('   Details:', result.details);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error('   Message:', error.message);
    if (error.stack) {
      console.error('   Stack:', error.stack);
    }
  }
}

// Run the upload
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🍭 CANDY PNC KOREA 2026 FRAME UPLOADER');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
uploadCandyPncFrame();
