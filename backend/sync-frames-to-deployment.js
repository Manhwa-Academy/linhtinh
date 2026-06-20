/**
 * Sync local frames to deployment
 * Upload missing frame images to Vercel deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL || 'https://meomiy.vercel.app';
const FRAMES_JSON_PATH = path.join(__dirname, 'frames.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'frames');

async function syncFrames() {
  console.log('🔄 Starting frame sync to deployment...');
  console.log('📍 Deployment URL:', DEPLOYMENT_URL);
  
  // Read local frames.json
  const framesData = JSON.parse(fs.readFileSync(FRAMES_JSON_PATH, 'utf8'));
  console.log(`📋 Found ${framesData.length} frames in local frames.json`);
  
  // Fetch current frames from deployment
  let deploymentFrames = [];
  try {
    const response = await fetch(`${DEPLOYMENT_URL}/api/frames`);
    deploymentFrames = await response.json();
    console.log(`🌐 Found ${deploymentFrames.length} frames on deployment`);
  } catch (err) {
    console.warn('⚠️  Could not fetch deployment frames:', err.message);
  }
  
  // Find frames that need uploading
  const framesToSync = framesData.filter(frame => {
    // Skip default frames without image
    if (!frame.frameImage || frame.frameImage === 'UPLOAD_REQUIRED') {
      return false;
    }
    
    // Check if frame exists on deployment
    const existsOnDeployment = deploymentFrames.some(df => df.id === frame.id);
    if (existsOnDeployment) {
      console.log(`✅ Frame "${frame.name}" already exists on deployment`);
      return false;
    }
    
    return true;
  });
  
  console.log(`\n📤 Need to upload ${framesToSync.length} frames:\n`);
  framesToSync.forEach(f => console.log(`   - ${f.name} (${f.id})`));
  
  if (framesToSync.length === 0) {
    console.log('\n✨ All frames are already synced!');
    return;
  }
  
  // Upload each frame
  for (const frame of framesToSync) {
    console.log(`\n📤 Uploading "${frame.name}"...`);
    
    try {
      // Find local image file
      const imageName = frame.frameImage.split('/').pop();
      const localImagePath = path.join(UPLOADS_DIR, imageName);
      
      if (!fs.existsSync(localImagePath)) {
        console.error(`❌ Image file not found: ${localImagePath}`);
        continue;
      }
      
      // Read image as buffer
      const imageBuffer = fs.readFileSync(localImagePath);
      const imageSize = (imageBuffer.length / 1024).toFixed(2);
      console.log(`   📊 Image size: ${imageSize} KB`);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', imageBuffer, {
        filename: imageName,
        contentType: 'image/png'
      });
      formData.append('frameData', JSON.stringify({
        id: frame.id,
        name: frame.name,
        description: frame.description,
        emoji: frame.emoji,
        color: frame.color,
        bgGradient: frame.bgGradient,
        photoSlots: frame.photoSlots
      }));
      
      // Upload to deployment
      const uploadResponse = await fetch(`${DEPLOYMENT_URL}/api/upload-frame`, {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders()
      });
      
      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        console.log(`   ✅ Successfully uploaded: ${result.url}`);
      } else {
        const error = await uploadResponse.text();
        console.error(`   ❌ Upload failed:`, error);
      }
      
    } catch (err) {
      console.error(`   ❌ Error uploading "${frame.name}":`, err.message);
    }
    
    // Wait a bit between uploads
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 Sync complete!');
}

// Run sync
syncFrames().catch(console.error);
