import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pg

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function migrateFrames() {
  try {
    console.log('🔄 Bắt đầu migrate frames từ JSON vào database...')
    
    // Đọc frames.json
    const framesFilePath = path.join(__dirname, 'frames.json')
    const framesData = fs.readFileSync(framesFilePath, 'utf8')
    const frames = JSON.parse(framesData)
    
    console.log(`📦 Tìm thấy ${frames.length} frames trong file JSON`)
    
    // Tạo bảng nếu chưa có
    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_data (
        key VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `)
    
    // Lưu vào database
    await pool.query(
      "INSERT INTO app_data (key, data) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET data = $2",
      ['frames', JSON.stringify(frames)]
    )
    
    console.log('✅ Migrate thành công!')
    console.log('📋 Frames đã được import vào database')
    
    // Verify
    const result = await pool.query("SELECT data FROM app_data WHERE key = 'frames'")
    const savedFrames = result.rows[0]?.data || []
    console.log(`✔️  Xác nhận: ${savedFrames.length} frames trong database`)
    
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Lỗi khi migrate:', error)
    await pool.end()
    process.exit(1)
  }
}

migrateFrames()
