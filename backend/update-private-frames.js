/**
 * Update specific frames to be private via Production API
 * Run this script to set isPrivate=true for DNS PUBG, GENG PUBG, DNS PUBG WWCD frames
 */

const PRODUCTION_URL = 'https://noriframeverse.vercel.app';

// Frame IDs that should be private
const PRIVATE_FRAME_IDS = [
  'dns-pubg-2026-1781926346767',
  'geng-pubg-2026-roar',
  'dns-pubg-wwcd-2026'
];

async function updatePrivateFrames() {
  console.log('🔐 Setting frames to private...\n');
  
  try {
    // Fetch all frames first
    console.log('📥 Fetching frames from production...');
    console.log(`   URL: ${PRODUCTION_URL}/api/frames\n`);
    
    const response = await fetch(`${PRODUCTION_URL}/api/frames`);
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text.substring(0, 200)}`);
    }
    
    const data = await response.json();
    const frames = data.frames || [];
    
    console.log(`✅ Found ${frames.length} total frames\n`);
    
    // Update each private frame
    for (const frameId of PRIVATE_FRAME_IDS) {
      const frame = frames.find(f => f.id === frameId);
      
      if (!frame) {
        console.log(`⚠️  Frame "${frameId}" not found - skipping`);
        continue;
      }
      
      console.log(`🔄 Updating "${frame.name}" (${frameId})...`);
      
      // Update frame with isPrivate: true
      const updateResponse = await fetch(`${PRODUCTION_URL}/api/frames/${frameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...frame,
          isPrivate: true
        })
      });
      
      if (updateResponse.ok) {
        console.log(`   ✅ Successfully set to private\n`);
      } else {
        const error = await updateResponse.text();
        console.log(`   ❌ Update failed: ${error.substring(0, 200)}\n`);
      }
      
      // Wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('🎉 Done! Private frames updated:');
    console.log('   - DNS PUBG 2026');
    console.log('   - GENG PUBG 2026');
    console.log('   - DNS PUBG WWCD 2026');
    console.log('\n💡 Users will need to hard refresh (Ctrl+Shift+R) to see the changes');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Possible solutions:');
    console.error('   1. Wait for Vercel deployment to complete (check: https://vercel.com/dashboard)');
    console.error('   2. Use admin panel to manually set frames to private');
    console.error('   3. Check if backend API is deployed correctly');
    process.exit(1);
  }
}

updatePrivateFrames();
