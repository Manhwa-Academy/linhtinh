import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read frames.json
const framesFilePath = path.join(__dirname, 'frames.json')
const framesDir = path.join(__dirname, 'uploads', 'frames')

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://meomiry-backend.vercel.app'

async function uploadFrame(frame) {
  try {
    console.log(`\n📤 Uploading: ${frame.name}`)
    
    // Check if frame has image
    if (!frame.frameImage || frame.frameImage === 'UPLOAD_REQUIRED') {
      console.log(`⏭️  Skipping: No image`)
      return { success: false, skipped: true }
    }
    
    // Get image file path
    const imageName = frame.frameImage.split('/').pop()
    const imagePath = path.join(framesDir, imageName)
    
    if (!fs.existsSync(imagePath)) {
      console.log(`❌ Image not found: ${imagePath}`)
      return { success: false, error: 'Image file not found' }
    }
    
    // Read image and convert to base64
    const imageBuffer = fs.readFileSync(imagePath)
    const imageSize = (imageBuffer.length / 1024).toFixed(2)
    console.log(`📊 Image size: ${imageSize} KB`)
    
    const base64 = imageBuffer.toString('base64')
    const ext = path.extname(imageName).toLowerCase()
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif'
    }
    const mimeType = mimeTypes[ext] || 'image/png'
    const dataUrl = `data:${mimeType};base64,${base64}`
    
    console.log(`🚀 Uploading to: ${PRODUCTION_URL}/api/upload-frame`)
    
    // Upload to production
    const response = await fetch(`${PRODUCTION_URL}/api/upload-frame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        file: dataUrl,
        fileName: imageName,
        frameData: {
          id: frame.id,
          name: frame.name,
          description: frame.description,
          emoji: frame.emoji,
          color: frame.color,
          bgGradient: frame.bgGradient,
          photoSlots: frame.photoSlots
        }
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log(`❌ Upload failed: ${response.status}`)
      console.log(`Error: ${errorText}`)
      return { success: false, error: errorText }
    }
    
    const result = await response.json()
    console.log(`✅ Upload successful!`)
    console.log(`📎 URL: ${result.url || result.file?.url}`)
    
    return { success: true, result }
    
  } catch (err) {
    console.log(`❌ Error: ${err.message}`)
    return { success: false, error: err.message }
  }
}

async function main() {
  console.log('🎨 Frame Upload CLI')
  console.log('=' .repeat(50))
  console.log(`📡 Production URL: ${PRODUCTION_URL}`)
  console.log('')
  
  // Read frames
  const frames = JSON.parse(fs.readFileSync(framesFilePath, 'utf8'))
  console.log(`📋 Found ${frames.length} frames in frames.json`)
  
  // Filter frames with images
  const framesWithImages = frames.filter(f => f.frameImage && f.frameImage !== 'UPLOAD_REQUIRED')
  console.log(`📤 ${framesWithImages.length} frames have images`)
  console.log('')
  
  // Upload each frame
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0
  
  for (const frame of framesWithImages) {
    const result = await uploadFrame(frame)
    
    if (result.skipped) {
      skippedCount++
    } else if (result.success) {
      successCount++
    } else {
      errorCount++
    }
    
    // Wait 2 seconds between uploads
    if (framesWithImages.indexOf(frame) < framesWithImages.length - 1) {
      console.log(`⏳ Waiting 2 seconds...`)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  console.log('')
  console.log('=' .repeat(50))
  console.log('🎉 Upload Complete!')
  console.log(`✅ Success: ${successCount} frames`)
  console.log(`❌ Failed: ${errorCount} frames`)
  console.log(`⏭️  Skipped: ${skippedCount} frames`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
