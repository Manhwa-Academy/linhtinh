import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import pg from 'pg'
import { put } from '@vercel/blob'

const { Pool } = pg

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: ['https://meomiry.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Tạo thư mục uploads nếu chưa có
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Tạo thư mục frames nếu chưa có
const framesDir = path.join(__dirname, 'uploads', 'frames')
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true })
}

// Tạo file frames.json nếu chưa có
const framesFilePath = path.join(__dirname, 'frames.json')
if (!fs.existsSync(framesFilePath)) {
  const defaultFrames = [
    { 
      id: 'spring', 
      name: 'Spring', 
      description: 'Cherry blossoms & nature', 
      emoji: '🌸', 
      color: '#FFE4E9', 
      bgGradient: 'linear-gradient(135deg, #FFE4E9 0%, #FFF0F5 100%)' 
    },
    { 
      id: 'summer', 
      name: 'Summer', 
      description: 'Bright & sunny', 
      emoji: '☀️', 
      color: '#FFF4CC', 
      bgGradient: 'linear-gradient(135deg, #FFF4CC 0%, #FFFACD 100%)' 
    },
    { 
      id: 'autumn', 
      name: 'Autumn', 
      description: 'Warm & cozy', 
      emoji: '🍂', 
      color: '#FFE5CC', 
      bgGradient: 'linear-gradient(135deg, #FFE5CC 0%, #FFDAB9 100%)' 
    },
    { 
      id: 'winter', 
      name: 'Winter', 
      description: 'Cool & serene', 
      emoji: '❄️', 
      color: '#E0F2FE', 
      bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)' 
    }
  ]
  fs.writeFileSync(framesFilePath, JSON.stringify(defaultFrames, null, 2))
}

// Database setup
let pool = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })
}

// Helper functions for frames
const readFrames = async () => {
  if (pool) {
    try {
      const res = await pool.query("SELECT data FROM app_data WHERE key = 'frames'")
      if (res.rows.length > 0) {
        return res.rows[0].data
      }
      return []
    } catch (error) {
      console.error('DB Error reading frames:', error)
      return []
    }
  } else {
    try {
      const data = fs.readFileSync(framesFilePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }
}

const writeFrames = async (frames) => {
  if (pool) {
    try {
      await pool.query(
        "INSERT INTO app_data (key, data) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET data = $2",
        ['frames', JSON.stringify(frames)]
      )
    } catch (error) {
      console.error('DB Error writing frames:', error)
    }
  } else {
    fs.writeFileSync(framesFilePath, JSON.stringify(frames, null, 2))
  }
}

// Initialize database
const initDb = async () => {
  if (pool) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_data (
          key VARCHAR(50) PRIMARY KEY,
          data JSONB NOT NULL
        )
      `)
      // Migrate from JSON to DB if DB is empty
      const res = await pool.query("SELECT * FROM app_data WHERE key = 'frames'")
      if (res.rows.length === 0) {
        let localFrames = []
        try {
          if (fs.existsSync(framesFilePath)) {
            localFrames = JSON.parse(fs.readFileSync(framesFilePath, 'utf8'))
          }
        } catch (e) {}
        
        if (localFrames.length > 0) {
          await writeFrames(localFrames)
          console.log('Migrated frames.json to NeonDB')
        }
      }
      console.log('NeonDB initialized successfully')
    } catch (error) {
      console.error('Error initializing database:', error)
    }
  }
}

initDb()

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, webp)'))
  }
})

// Multer for frame images — dùng memoryStorage để hoạt động cả local lẫn Vercel
const uploadFrame = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for frames
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (mimetype && extname) return cb(null, true)
    cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, webp, gif) cho frame'))
  }
})

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server đang chạy' })
})

// Seed default frames (chỉ dùng 1 lần để init DB)
app.post('/api/seed-frames', async (req, res) => {
  try {
    const defaultFrames = [
      { 
        id: 'spring', 
        name: 'Spring', 
        description: 'Cherry blossoms & nature', 
        emoji: '🌸', 
        color: '#FFE4E9', 
        bgGradient: 'linear-gradient(135deg, #FFE4E9 0%, #FFF0F5 100%)' 
      },
      { 
        id: 'summer', 
        name: 'Summer', 
        description: 'Bright & sunny', 
        emoji: '☀️', 
        color: '#FFF4CC', 
        bgGradient: 'linear-gradient(135deg, #FFF4CC 0%, #FFFACD 100%)' 
      },
      { 
        id: 'autumn', 
        name: 'Autumn', 
        description: 'Warm & cozy', 
        emoji: '🍂', 
        color: '#FFE5CC', 
        bgGradient: 'linear-gradient(135deg, #FFE5CC 0%, #FFDAB9 100%)' 
      },
      { 
        id: 'winter', 
        name: 'Winter', 
        description: 'Cool & serene', 
        emoji: '❄️', 
        color: '#E0F2FE', 
        bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)' 
      }
    ]
    
    const existingFrames = await readFrames()
    const allFrames = [...defaultFrames, ...existingFrames]
    
    // Remove duplicates by id
    const uniqueFrames = allFrames.filter((frame, index, self) =>
      index === self.findIndex((f) => f.id === frame.id)
    )
    
    await writeFrames(uniqueFrames)
    res.json({ success: true, message: 'Đã seed frames mặc định', frames: uniqueFrames })
  } catch (error) {
    console.error('Error seeding frames:', error)
    res.status(500).json({ error: 'Lỗi khi seed frames' })
  }
})

// Fix photoSlots cho tất cả frames có frameImage
app.post('/api/fix-frame-slots', async (req, res) => {
  try {
    const frames = await readFrames()
    
    // Chuẩn photoSlots mới (full width, không thừa đen)
    const standardSlots = [
      { x: 0, y: 0, width: 100, height: 22, rotation: 0 },
      { x: 0, y: 24, width: 100, height: 22, rotation: 0 },
      { x: 0, y: 47, width: 100, height: 22, rotation: 0 },
      { x: 0, y: 69, width: 100, height: 22, rotation: 0 }
    ]
    
    // Update tất cả frames có frameImage
    const updatedFrames = frames.map(frame => {
      if (frame.frameImage) {
        return { ...frame, photoSlots: standardSlots }
      }
      return frame
    })
    
    await writeFrames(updatedFrames)
    res.json({ success: true, message: 'Đã fix slots cho tất cả frames', frames: updatedFrames })
  } catch (error) {
    console.error('Error fixing frame slots:', error)
    res.status(500).json({ error: 'Lỗi khi fix slots' })
  }
})

// ============== FRAMES API ==============

// Get all frames
app.get('/api/frames', async (req, res) => {
  try {
    const frames = await readFrames()
    res.json({ success: true, frames })
  } catch (error) {
    console.error('Error reading frames:', error)
    res.status(500).json({ error: 'Lỗi khi đọc frames' })
  }
})

// Get single frame
app.get('/api/frames/:id', async (req, res) => {
  try {
    const frames = await readFrames()
    const frame = frames.find(f => f.id === req.params.id)
    
    if (!frame) {
      return res.status(404).json({ error: 'Không tìm thấy frame' })
    }
    
    res.json({ success: true, frame })
  } catch (error) {
    console.error('Error reading frame:', error)
    res.status(500).json({ error: 'Lỗi khi đọc frame' })
  }
})

// Add new frame
app.post('/api/frames', async (req, res) => {
  try {
    const { name, description, emoji, color, bgGradient, frameImage, photoSlots } = req.body
    
    if (!name) {
      return res.status(400).json({ error: 'Thiếu tên frame' })
    }
    
    const frames = await readFrames()
    const newFrame = {
      id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name,
      description: description || '',
      emoji: emoji || '', // Empty string instead of default
      color: color || '#FFE4E9',
      bgGradient: bgGradient || `linear-gradient(135deg, ${color} 0%, ${color} 100%)`,
      frameImage: frameImage || null, // URL to frame overlay image
      photoSlots: photoSlots || [] // Array of {x, y, width, height, rotation} for each photo position
    }
    
    frames.push(newFrame)
    await writeFrames(frames)
    
    res.json({ success: true, message: 'Thêm frame thành công', frame: newFrame })
  } catch (error) {
    console.error('Error adding frame:', error)
    res.status(500).json({ error: 'Lỗi khi thêm frame' })
  }
})

// Upload frame image — Local: lưu vào uploads/frames/, Production: UploadThing
app.post('/api/upload-frame', async (req, res) => {
  try {
    const { fileData, fileName, mimeType, fileSize } = req.body

    if (!fileData || !fileName) {
      return res.status(400).json({ error: 'Thiếu dữ liệu file (fileData, fileName)' })
    }

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (mimeType && !allowedMimes.includes(mimeType)) {
      return res.status(400).json({ error: 'Chỉ chấp nhận file ảnh (jpeg, jpg, png, webp, gif)' })
    }

    // Validate file size (5MB)
    if (fileSize && fileSize > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File quá lớn (tối đa 5MB)' })
    }

    // Decode base64 thành buffer
    const buffer = Buffer.from(fileData, 'base64')
    
    // LOCAL: Lưu vào thư mục uploads/frames/
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Upload Frame] Saving to local disk:', fileName)
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const ext = path.extname(fileName)
      const localFileName = 'frame-' + uniqueSuffix + ext
      const localFilePath = path.join(framesDir, localFileName)
      
      fs.writeFileSync(localFilePath, buffer)
      
      const fileUrl = `http://localhost:${PORT}/uploads/frames/${localFileName}`
      
      console.log('[Upload Frame] Local URL:', fileUrl)
      
      return res.json({
        success: true,
        message: 'Upload frame image thành công (local)',
        file: {
          filename: localFileName,
          url: fileUrl,
          path: `/uploads/frames/${localFileName}`,
          size: buffer.length
        }
      })
    }
    
    // PRODUCTION: Upload to UploadThing
    console.log('[Upload Frame] Uploading to UploadThing:', fileName)
    
    // Import UTApi
    const { utapi } = await import('./uploadthing.js')
    
    // Create File object from buffer
    const file = new File([buffer], fileName, { type: mimeType || 'image/png' })
    
    // Upload to UploadThing
    const uploadResult = await utapi.uploadFiles(file)
    
    console.log('[Upload Frame] UploadThing result:', JSON.stringify(uploadResult))
    
    if (!uploadResult || !uploadResult.data) {
      throw new Error('Upload failed: No data returned from UploadThing')
    }

    const fileUrl = uploadResult.data.url
    
    if (!fileUrl) {
      throw new Error('Upload failed: No URL in response')
    }

    console.log('[Upload Frame] UploadThing URL:', fileUrl)

    res.json({
      success: true,
      message: 'Upload frame image thành công',
      file: {
        filename: fileName,
        url: fileUrl,
        path: fileUrl,
        key: uploadResult.data.key,
        size: uploadResult.data.size || buffer.length
      }
    })
  } catch (error) {
    console.error('Lỗi upload frame:', error)
    console.error('Error stack:', error.stack)
    res.status(500).json({ error: 'Lỗi khi upload frame image: ' + error.message })
  }
})

// Update frame
app.put('/api/frames/:id', async (req, res) => {
  try {
    const { name, description, emoji, color, bgGradient, frameImage, photoSlots } = req.body
    const frames = await readFrames()
    const frameIndex = frames.findIndex(f => f.id === req.params.id)
    
    if (frameIndex === -1) {
      return res.status(404).json({ error: 'Không tìm thấy frame' })
    }
    
    frames[frameIndex] = {
      ...frames[frameIndex],
      name: name || frames[frameIndex].name,
      description: description !== undefined ? description : frames[frameIndex].description,
      emoji: emoji !== undefined ? emoji : frames[frameIndex].emoji,
      color: color || frames[frameIndex].color,
      bgGradient: bgGradient || frames[frameIndex].bgGradient,
      frameImage: frameImage !== undefined ? frameImage : frames[frameIndex].frameImage,
      photoSlots: photoSlots !== undefined ? photoSlots : frames[frameIndex].photoSlots || []
    }
    
    await writeFrames(frames)
    
    res.json({ success: true, message: 'Cập nhật frame thành công', frame: frames[frameIndex] })
  } catch (error) {
    console.error('Error updating frame:', error)
    res.status(500).json({ error: 'Lỗi khi cập nhật frame' })
  }
})

// Delete frame
app.delete('/api/frames/:id', async (req, res) => {
  try {
    const frames = await readFrames()
    const frameToDelete = frames.find(f => f.id === req.params.id)
    
    if (!frameToDelete) {
      return res.status(404).json({ error: 'Không tìm thấy frame' })
    }
    
    // Xóa file ảnh local nếu có (lưu trong uploads/frames)
    if (frameToDelete.frameImage) {
      try {
        // Lấy tên file từ URL (vd: http://localhost:3001/uploads/frames/frame-xxx.png)
        const urlParts = frameToDelete.frameImage.split('/uploads/frames/')
        if (urlParts.length > 1) {
          const localFilePath = path.join(framesDir, urlParts[1])
          if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
            console.log('[Delete Frame] Đã xóa file local:', localFilePath)
          }
        }
      } catch (fileErr) {
        console.warn('[Delete Frame] Không thể xóa file local:', fileErr.message)
        // Không dừng lại - tiếp tục xóa record
      }
    }
    
    const filteredFrames = frames.filter(f => f.id !== req.params.id)
    await writeFrames(filteredFrames)
    
    res.json({ success: true, message: 'Xóa frame thành công' })
  } catch (error) {
    console.error('Error deleting frame:', error)
    res.status(500).json({ error: 'Lỗi khi xóa frame' })
  }
})

// ============== END FRAMES API ==============

// Upload ảnh
app.post('/api/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' })
    }

    const filePath = req.file.path
    const fileName = req.file.filename

    res.json({
      success: true,
      message: 'Upload ảnh thành công',
      file: {
        filename: fileName,
        path: `/uploads/${fileName}`,
        size: req.file.size
      }
    })
  } catch (error) {
    console.error('Lỗi upload:', error)
    res.status(500).json({ error: 'Lỗi khi upload ảnh' })
  }
})

// Áp dụng filter cho ảnh
app.post('/api/apply-filter', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' })
    }

    const { filter } = req.body
    const filePath = req.file.path
    const outputPath = path.join(uploadsDir, 'filtered-' + req.file.filename)

    let image = sharp(filePath)

    // Áp dụng filter
    switch (filter) {
      case 'grayscale':
        image = image.grayscale()
        break
      case 'sepia':
        image = image.tint({ r: 112, g: 66, b: 20 })
        break
      case 'blur':
        image = image.blur(5)
        break
      case 'sharpen':
        image = image.sharpen()
        break
      case 'brightness':
        image = image.modulate({ brightness: 1.3 })
        break
      case 'contrast':
        image = image.modulate({ brightness: 1.1 }).normalize()
        break
      default:
        // Không áp dụng filter
        break
    }

    await image.toFile(outputPath)

    // Xóa file gốc
    fs.unlinkSync(filePath)

    res.json({
      success: true,
      message: 'Áp dụng filter thành công',
      file: {
        filename: 'filtered-' + req.file.filename,
        path: `/uploads/filtered-${req.file.filename}`
      }
    })
  } catch (error) {
    console.error('Lỗi apply filter:', error)
    res.status(500).json({ error: 'Lỗi khi áp dụng filter' })
  }
})

// Tạo photo strip
app.post('/api/create-strip', express.json(), async (req, res) => {
  try {
    const { photos } = req.body // Array of base64 images

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ error: 'Cần ít nhất 1 ảnh để tạo strip' })
    }

    // Xử lý và lưu strip (optional - có thể làm ở frontend)
    res.json({
      success: true,
      message: 'Photo strip được xử lý'
    })
  } catch (error) {
    console.error('Lỗi create strip:', error)
    res.status(500).json({ error: 'Lỗi khi tạo photo strip' })
  }
})

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Có lỗi xảy ra trên server',
    message: err.message 
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Không tìm thấy endpoint' })
})

// Start server (only in local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`)
    console.log(`📁 Thư mục uploads: ${uploadsDir}`)
  })
}

// Export for Vercel serverless
export default app
