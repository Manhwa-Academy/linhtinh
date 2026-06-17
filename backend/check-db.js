import pg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pg

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function checkDB() {
  try {
    console.log('🔍 Kiểm tra database...\n')
    
    const result = await pool.query("SELECT data FROM app_data WHERE key = 'frames'")
    
    if (result.rows.length === 0) {
      console.log('❌ Không có dữ liệu frames trong database')
    } else {
      const frames = result.rows[0].data
      console.log(`✅ Tìm thấy ${frames.length} frames trong database:\n`)
      
      frames.forEach((frame, index) => {
        console.log(`${index + 1}. ${frame.name} (${frame.id})`)
        if (frame.frameImage) {
          console.log(`   📷 Frame image: ${frame.frameImage}`)
        }
        if (frame.photoSlots) {
          console.log(`   📐 Photo slots: ${frame.photoSlots.length} slots`)
          frame.photoSlots.forEach((slot, i) => {
            console.log(`      Slot ${i+1}: y=${slot.y}%, height=${slot.height}%`)
          })
        }
        console.log('')
      })
    }
    
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Lỗi:', error)
    await pool.end()
    process.exit(1)
  }
}

checkDB()
