import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

async function uploadDnsPubgFrame() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🎮 Auto-uploading DNS PUBG Frame to database...\n');

    // Frame data
    const frameData = {
      id: 'dns-pubg-2026-final',
      name: 'DNS PUBG 2026',
      description: 'PUBG Erangel Theme - DNS Team',
      emoji: '🎮',
      color: '#3B82F6',
      bgGradient: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #1E3A8A 100%)',
      frameImage: 'http://localhost:3001/uploads/frames/dns-pubg-2026.png',
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
          label: 'HEAVEN 😇'
        },
        {
          x: 10,
          y: 54.6,
          width: 80,
          height: 21.3,
          rotation: 0,
          label: 'DIEL 🐶'
        },
        {
          x: 10,
          y: 79.6,
          width: 80,
          height: 21.3,
          rotation: 0,
          label: 'REX 🦖'
        }
      ]
    };

    // Check if frame already exists
    const checkQuery = 'SELECT id FROM frames WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [frameData.id]);

    if (checkResult.rows.length > 0) {
      // Update existing frame
      const updateQuery = `
        UPDATE frames 
        SET name = $2, description = $3, emoji = $4, color = $5, 
            bg_gradient = $6, frame_image = $7, photo_slots = $8, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await pool.query(updateQuery, [
        frameData.id,
        frameData.name,
        frameData.description,
        frameData.emoji,
        frameData.color,
        frameData.bgGradient,
        frameData.frameImage,
        JSON.stringify(frameData.photoSlots)
      ]);

      console.log('✅ Frame UPDATED in database!');
      console.log('📋 Frame ID:', result.rows[0].id);
      console.log('🎨 Frame Name:', result.rows[0].name);
    } else {
      // Insert new frame
      const insertQuery = `
        INSERT INTO frames (id, name, description, emoji, color, bg_gradient, frame_image, photo_slots)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const result = await pool.query(insertQuery, [
        frameData.id,
        frameData.name,
        frameData.description,
        frameData.emoji,
        frameData.color,
        frameData.bgGradient,
        frameData.frameImage,
        JSON.stringify(frameData.photoSlots)
      ]);

      console.log('✅ Frame INSERTED into database!');
      console.log('📋 Frame ID:', result.rows[0].id);
      console.log('🎨 Frame Name:', result.rows[0].name);
    }

    console.log('\n✨ Done! Frame is now available in the app!');
    console.log('🚀 You can now select "DNS PUBG 2026" frame in booth page.');

  } catch (error) {
    console.error('❌ Error uploading frame:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Database connection failed. Make sure:');
      console.log('   1. PostgreSQL is running');
      console.log('   2. DATABASE_URL is set correctly in .env file');
    } else if (error.code === '42P01') {
      console.log('\n💡 Table "frames" does not exist. Run migrations first.');
    }
  } finally {
    await pool.end();
  }
}

uploadDnsPubgFrame();
