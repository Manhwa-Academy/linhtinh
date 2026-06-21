import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://linhtinh-9snn.vercel.app';

async function uploadCandyFrame() {
  try {
    console.log('🍬 Uploading Candy PnC Korea Frame...');
    
    // Path to your frame image (you'll need to save the image first)
    const framePath = path.join(__dirname, 'uploads', 'frames', 'candy-pnc-korea-2026.png');
    
    // Check if file exists
    if (!fs.existsSync(framePath)) {
      console.error('❌ Frame image not found at:', framePath);
      console.log('📝 Please save your frame image as: candy-pnc-korea-2026.png');
      console.log('   in the backend/uploads/frames/ folder');
      return;
    }
    
    // Frame data - matching DNS PUBG slot configuration
    const frameData = {
      id: `candy-pnc-korea-2026-${Date.now()}`,
      name: 'Candy PnC Korea 2026',
      description: 'Sweet Candy Style - PnC Korea Team 2026',
      emoji: '🍭',
      color: '#EC4899',
      bgGradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 50%, #FBCFE8 100%)',
      photoSlots: [
        {
          x: 10,
          y: 6.9,
          width: 80,
          height: 21.3,
          rotation: 0,
          label: 'GYUMIN 🍭'
        },
        {
          x: 10,
          y: 29.6,
          width: 80,
          height: 21.3,
          rotation: 0,
          label: 'HEAVEN 🌟'
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
    
    console.log('📋 Frame configuration:');
    console.log(JSON.stringify(frameData, null, 2));
    
    // Create FormData
    const formData = new FormData();
    
    // Append frame data as JSON string
    formData.append('frameData', JSON.stringify(frameData));
    
    // Append frame image file
    formData.append('frameImage', fs.createReadStream(framePath));
    
    // Upload to API
    console.log('\n📤 Uploading to API...');
    const response = await fetch(`${API_URL}/api/frames`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('\n✅ SUCCESS! Frame uploaded!');
      console.log('🎉 Frame ID:', result.frame.id);
      console.log('📸 Frame name:', result.frame.name);
      console.log('\n🚀 You can now use this frame in the app!');
      console.log('💡 Refresh the booth page to see the new frame.');
    } else {
      console.error('\n❌ Upload failed:', result.error || result.message);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run the upload
uploadCandyFrame();
