import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:3001';

async function downloadAndUpload() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🍭 CANDY PNC KOREA 2026 FRAME UPLOADER');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Google Drive direct download URL
    const fileId = '1ASUT-nxf53WFpYnS_RkJRR-POTigkbPy';
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    const framePath = path.join(__dirname, 'uploads', 'frames', 'candy-pnc-korea-2026.png');
    
    // Download image from Google Drive
    console.log('📥 Downloading frame from Google Drive...');
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }
    
    // Save to file
    await pipeline(
      response.body,
      fs.createWriteStream(framePath)
    );
    
    console.log('✅ Frame downloaded successfully!');
    console.log('   Saved to:', framePath);
    
    // Get file size
    const stats = fs.statSync(framePath);
    console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB\n`);
    
    // Frame configuration
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
    
    console.log('📋 Frame Configuration:');
    console.log('   Name:', frameData.name);
    console.log('   Description:', frameData.description);
    console.log('   Slots:', frameData.photoSlots.length);
    console.log('   Status:', frameData.isPrivate ? 'Private' : 'Public');
    
    // Create FormData
    const formData = new FormData();
    formData.append('frameData', JSON.stringify(frameData));
    formData.append('frameImage', fs.createReadStream(framePath), {
      filename: 'candy-pnc-korea-2026.png',
      contentType: 'image/png'
    });
    
    console.log('\n📤 Uploading to production API...');
    console.log('   URL:', API_URL);
    
    // Upload to API
    const uploadResponse = await fetch(`${API_URL}/api/frames`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    const result = await uploadResponse.json();
    
    if (uploadResponse.ok) {
      console.log('\n✅ SUCCESS! Frame uploaded!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎉 Frame Details:');
      console.log('   ID:', result.frame.id);
      console.log('   Name:', result.frame.name);
      console.log('   Image:', result.frame.frameImage);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🚀 Frame is now live at:');
      console.log('   https://meomiry.vercel.app/booth');
      console.log('\n💡 Refresh the page to see the new frame!');
    } else {
      console.error('\n❌ Upload failed!');
      console.error('   Status:', uploadResponse.status);
      console.error('   Error:', result.error || result.message);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  }
}

downloadAndUpload();
