import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Tạo thư mục uploads nếu chưa có
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

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

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server đang chạy' })
})

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`)
  console.log(`📁 Thư mục uploads: ${uploadsDir}`)
})
