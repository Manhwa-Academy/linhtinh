import { put } from '@vercel/blob'
import path from 'path'

// Tắt body parser mặc định của Vercel để đọc raw body
export const config = {
  api: {
    bodyParser: false,
  },
}

/**
 * Parse multipart/form-data thủ công và trả về buffer + metadata của file
 */
async function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || ''
    const boundaryMatch = contentType.match(/boundary=(.+)/)
    if (!boundaryMatch) {
      return reject(new Error('Không tìm thấy boundary trong multipart'))
    }
    const boundary = '--' + boundaryMatch[1]

    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('error', reject)
    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks)
        const bodyStr = body.toString('binary')

        // Tìm phần chứa file
        const parts = bodyStr.split(boundary)
        for (const part of parts) {
          if (!part.includes('filename=')) continue

          // Lấy header và content của part
          const headerEnd = part.indexOf('\r\n\r\n')
          if (headerEnd === -1) continue

          const header = part.substring(0, headerEnd)
          // Bỏ trailing --\r\n ở cuối
          const rawContent = part.substring(headerEnd + 4)
          const content = rawContent.substring(0, rawContent.lastIndexOf('\r\n'))

          // Parse tên file và mimetype
          const filenameMatch = header.match(/filename="([^"]+)"/)
          const mimeMatch = header.match(/Content-Type: ([^\r\n]+)/)

          const filename = filenameMatch ? filenameMatch[1] : 'upload'
          const mimetype = mimeMatch ? mimeMatch[1].trim() : 'application/octet-stream'
          const buffer = Buffer.from(content, 'binary')

          return resolve({ filename, mimetype, buffer, size: buffer.length })
        }
        reject(new Error('Không tìm thấy file trong request'))
      } catch (e) {
        reject(e)
      }
    })
  })
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { filename, mimetype, buffer, size } = await parseMultipart(req)

    // Validate file type
    const allowed = /\.(jpeg|jpg|png|webp|gif)$/i
    if (!allowed.test(filename) && !mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Chỉ chấp nhận file ảnh (jpeg, jpg, png, webp, gif)' })
    }

    // Validate file size (5MB)
    if (size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File quá lớn (tối đa 5MB)' })
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(filename) || '.png'
    const blobName = `frames/frame-${uniqueSuffix}${ext}`

    console.log('[Upload Frame] Uploading to Vercel Blob:', blobName)
    const blob = await put(blobName, buffer, {
      access: 'public',
      contentType: mimetype,
    })

    console.log('[Upload Frame] Success:', blob.url)
    return res.status(200).json({
      success: true,
      message: 'Upload frame image thành công',
      file: {
        filename: blobName,
        url: blob.url,
        path: blob.url,
        size,
      },
    })
  } catch (error) {
    console.error('[Upload Frame] Error:', error)
    return res.status(500).json({
      error: 'Lỗi khi upload frame image: ' + error.message,
    })
  }
}
