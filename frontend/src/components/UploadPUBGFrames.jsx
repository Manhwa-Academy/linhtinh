import { useState, useRef, useEffect } from 'react'
import { Upload } from 'lucide-react'
import { API_URL } from '../config/api'

const COLORS = {
  korea: { blue: '#0047A0', red: '#CD2E3A', gold: '#FFD700', white: '#FFFFFF', black: '#000000' },
  dns: { blue: '#00a8ff', darkBlue: '#0066cc', lightBlue: '#4fc3f7', white: '#FFFFFF', black: '#000000' },
  geng: { gold: '#FFD700', darkGold: '#FFA500', black: '#000000', white: '#FFFFFF', yellow: '#FFED4E' }
}

function createGradient(ctx, x0, y0, x1, y1, colors) {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1)
  colors.forEach((color, i) => {
    gradient.addColorStop(i / (colors.length - 1), color)
  })
  return gradient
}

function drawTeamKorea(canvas) {
  const ctx = canvas.getContext('2d')
  const C = COLORS.korea

  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Vertical text
  ctx.save()
  ctx.translate(50, canvas.height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.font = 'bold 55px Arial'
  ctx.strokeStyle = C.black
  ctx.lineWidth = 5
  ctx.strokeText('RISE AGAIN', 0, 0)
  ctx.fillStyle = C.gold
  ctx.fillText('RISE AGAIN', 0, 0)
  ctx.restore()
  
  ctx.save()
  ctx.translate(canvas.width - 50, canvas.height / 2)
  ctx.rotate(Math.PI / 2)
  ctx.font = 'bold 55px Arial'
  ctx.strokeStyle = C.black
  ctx.lineWidth = 5
  ctx.strokeText('PNC 2026', 0, 0)
  ctx.fillStyle = C.blue
  ctx.fillText('PNC 2026', 0, 0)
  ctx.restore()

  ctx.strokeStyle = C.blue
  ctx.lineWidth = 18
  ctx.strokeRect(9, 9, canvas.width - 18, canvas.height - 18)

  const headerGrad = createGradient(ctx, 0, 0, canvas.width, 110, [C.blue, C.red, C.blue])
  ctx.fillStyle = headerGrad
  ctx.fillRect(0, 0, canvas.width, 110)

  ctx.font = 'bold 75px Arial'
  ctx.textAlign = 'center'
  ctx.strokeStyle = C.black
  ctx.lineWidth = 7
  ctx.strokeText('TEAM KOREA 🇰🇷', canvas.width / 2, 60)
  ctx.fillStyle = C.white
  ctx.fillText('TEAM KOREA 🇰🇷', canvas.width / 2, 60)

  const slots = [
    { y: 125, color: C.blue },
    { y: 645, color: C.red },
    { y: 1165, color: C.blue },
    { y: 1685, color: C.red }
  ]

  const slotWidth = 940
  const slotHeight = 505
  const startX = (canvas.width - slotWidth) / 2

  slots.forEach((slot) => {
    ctx.strokeStyle = slot.color
    ctx.lineWidth = 5
    ctx.strokeRect(startX, slot.y, slotWidth, slotHeight)

    const cs = 20
    ctx.fillStyle = C.gold
    ctx.fillRect(startX - 2, slot.y - 2, cs, 2)
    ctx.fillRect(startX - 2, slot.y - 2, 2, cs)
    ctx.fillRect(startX + slotWidth - cs + 2, slot.y - 2, cs, 2)
    ctx.fillRect(startX + slotWidth, slot.y - 2, 2, cs)
    ctx.fillRect(startX - 2, slot.y + slotHeight, cs, 2)
    ctx.fillRect(startX - 2, slot.y + slotHeight - cs + 2, 2, cs)
    ctx.fillRect(startX + slotWidth - cs + 2, slot.y + slotHeight, cs, 2)
    ctx.fillRect(startX + slotWidth, slot.y + slotHeight - cs + 2, 2, cs)
  })

  ctx.font = '50px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('🏆', 80, 60)
  ctx.fillText('🏆', canvas.width - 80, 60)
}

function drawDNS(canvas) {
  const ctx = canvas.getContext('2d')
  const C = COLORS.dns

  const bgGrad = createGradient(ctx, 0, 0, 0, canvas.height,
    [C.white, C.lightBlue, C.white, C.lightBlue, C.white])
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = C.blue
  ctx.lineWidth = 18
  ctx.strokeRect(9, 9, canvas.width - 18, canvas.height - 18)

  const headerGrad = createGradient(ctx, 0, 0, canvas.width, 120,
    [C.darkBlue, C.blue, C.darkBlue])
  ctx.fillStyle = headerGrad
  ctx.fillRect(0, 0, canvas.width, 120)

  ctx.font = 'bold 70px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.strokeStyle = C.black
  ctx.lineWidth = 9
  ctx.strokeText('DNS PUBG 2026', canvas.width / 2, 65)
  ctx.fillStyle = C.white
  ctx.fillText('DNS PUBG 2026', canvas.width / 2, 65)

  ctx.font = '50px Arial'
  ctx.fillText('🎮', 70, 65)
  ctx.fillText('🔫', canvas.width - 70, 65)

  const slotWidth = 860
  const slotHeight = 490
  const startX = (canvas.width - slotWidth) / 2
  const startY = 140
  const gap = 15

  for (let i = 0; i < 4; i++) {
    const y = startY + i * (slotHeight + gap)
    ctx.strokeStyle = i % 2 === 0 ? C.blue : C.darkBlue
    ctx.lineWidth = 6
    ctx.strokeRect(startX, y, slotWidth, slotHeight)
  }
}

function drawGENG(canvas) {
  const ctx = canvas.getContext('2d')
  const C = COLORS.geng

  ctx.fillStyle = C.black
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const edgeGrad = ctx.createRadialGradient(0, 0, 100, 0, 0, 800)
  edgeGrad.addColorStop(0, 'rgba(255, 215, 0, 0.15)')
  edgeGrad.addColorStop(1, 'rgba(255, 215, 0, 0)')
  ctx.fillStyle = edgeGrad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = C.gold
  ctx.lineWidth = 18
  ctx.strokeRect(9, 9, canvas.width - 18, canvas.height - 18)

  ctx.strokeStyle = C.black
  ctx.lineWidth = 8
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

  const headerGrad = createGradient(ctx, 0, 0, canvas.width, 130,
    [C.darkGold, C.gold, C.darkGold])
  ctx.fillStyle = headerGrad
  ctx.fillRect(0, 0, canvas.width, 130)

  ctx.font = 'bold 80px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.strokeStyle = C.black
  ctx.lineWidth = 10
  ctx.strokeText('GENG PUBG 2026', canvas.width / 2, 70)
  ctx.fillStyle = C.white
  ctx.fillText('GENG PUBG 2026', canvas.width / 2, 70)

  ctx.font = '55px Arial'
  ctx.fillText('🏆', 80, 70)
  ctx.fillText('⭐', canvas.width - 80, 70)

  const slotWidth = 940
  const slotHeight = 505
  const startX = (canvas.width - slotWidth) / 2
  const startY = 150
  const gap = 10

  for (let i = 0; i < 4; i++) {
    const y = startY + i * (slotHeight + gap)
    ctx.strokeStyle = i % 2 === 0 ? C.gold : C.darkGold
    ctx.lineWidth = 6
    ctx.strokeRect(startX, y, slotWidth, slotHeight)
  }

  ctx.font = '55px Arial'
  ctx.textAlign = 'center'
  ctx.fillStyle = C.gold
  ctx.fillText('🐯', 55, 250)
  ctx.fillText('⚡', canvas.width - 55, 350)
  ctx.fillText('🐯', 55, 1050)
  ctx.fillText('⚡', canvas.width - 55, 1150)
  ctx.fillText('🐯', 55, 1850)
  ctx.fillText('⚡', canvas.width - 55, 1950)
}

export default function UploadPUBGFrames({ onClose }) {
  const [status, setStatus] = useState('ready')
  const [progress, setProgress] = useState({ korea: 'waiting', dns: 'waiting', geng: 'waiting' })
  const [existingFrames, setExistingFrames] = useState({ korea: false, dns: false, geng: false })
  const [loading, setLoading] = useState(true)
  const canvasRefs = {
    korea: useRef(null),
    dns: useRef(null),
    geng: useRef(null)
  }

  useEffect(() => {
    // Check which frames already exist
    const checkExistingFrames = async () => {
      try {
        const response = await fetch(`${API_URL}/api/frames`)
        if (response.ok) {
          const data = await response.json()
          console.log('📦 API response:', data)
          
          // Handle both array and object with frames property
          const frames = Array.isArray(data) ? data : (data.frames || [])
          console.log('📦 Frames array:', frames)
          
          // Check by name
          const frameNames = frames.map(f => f.name?.toLowerCase() || '')
          console.log('📝 Frame names:', frameNames)
          
          const koreaExists = frameNames.some(name => name.includes('team korea') || name.includes('korea pnc'))
          const dnsExists = frameNames.some(name => name.includes('dns pubg'))
          const gengExists = frameNames.some(name => name.includes('geng pubg'))
          
          console.log('✅ Existing frames check:', { koreaExists, dnsExists, gengExists })
          
          setExistingFrames({
            korea: koreaExists,
            dns: dnsExists,
            geng: gengExists
          })
          
          setProgress({
            korea: koreaExists ? 'exists' : 'waiting',
            dns: dnsExists ? 'exists' : 'waiting',
            geng: gengExists ? 'exists' : 'waiting'
          })
        }
      } catch (error) {
        console.error('Error checking existing frames:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkExistingFrames()
    
    // Draw previews
    if (canvasRefs.korea.current) drawTeamKorea(canvasRefs.korea.current)
    if (canvasRefs.dns.current) drawDNS(canvasRefs.dns.current)
    if (canvasRefs.geng.current) drawGENG(canvasRefs.geng.current)
  }, [])

  const uploadFrame = async (canvas, frameData, frameKey) => {
    try {
      setProgress(prev => ({ ...prev, [frameKey]: 'uploading' }))

      const dataUrl = canvas.toDataURL('image/png')
      const base64 = dataUrl.split(',')[1]

      const uploadRes = await fetch(`${API_URL}/api/upload-frame`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64,
          fileName: frameData.fileName,
          mimeType: 'image/png',
          photoSlots: frameData.photoSlots
        })
      })

      if (!uploadRes.ok) throw new Error('Upload failed')
      const uploadData = await uploadRes.json()
      const fileUrl = uploadData?.file?.url || uploadData?.file?.path

      const createRes = await fetch(`${API_URL}/api/frames`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...frameData.metadata,
          frameImage: fileUrl.startsWith('http') ? fileUrl : `${API_URL}${fileUrl}`,
          photoSlots: frameData.photoSlots.map((slot, i) => ({
            ...slot,
            label: frameData.labels[i]
          }))
        })
      })

      if (!createRes.ok) {
        const errorText = await createRes.text()
        throw new Error(`Create failed: ${errorText}`)
      }

      setProgress(prev => ({ ...prev, [frameKey]: 'success' }))
      return true
    } catch (error) {
      console.error(`Error uploading ${frameKey}:`, error)
      setProgress(prev => ({ ...prev, [frameKey]: `error: ${error.message}` }))
      return false
    }
  }

  const handleUpload = async () => {
    setStatus('uploading')

    // Upload only frames that don't exist
    if (!existingFrames.korea) {
      await uploadFrame(canvasRefs.korea.current, {
      fileName: 'team-korea-pnc-2026.png',
      photoSlots: [
        { x: 6.5, y: 5.8, width: 87, height: 23.4, rotation: 0 },
        { x: 6.5, y: 29.9, width: 87, height: 23.4, rotation: 0 },
        { x: 6.5, y: 53.9, width: 87, height: 23.4, rotation: 0 },
        { x: 6.5, y: 78, width: 87, height: 23.4, rotation: 0 }
      ],
      labels: ["GYUMIN 🦝", "SEONGJANG 🔥", "HEAVEN 😇", "HEATHER ⭐"],
      metadata: {
        id: 'frame_team_korea_pnc_2026',
        name: 'Team Korea PNC 2026',
        emoji: '🇰🇷',
        description: 'PUBG Nations Cup 2026 - Korean Team',
        color: '#F0F4FF',
        bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F0F4FF 25%, #FFFFFF 50%, #FFF0F0 75%, #FFFFFF 100%)'
      }
    }, 'korea')
    }

    // DNS
    if (!existingFrames.dns) {
      await uploadFrame(canvasRefs.dns.current, {
      fileName: 'dns-pubg-2026.png',
      photoSlots: [
        { x: 10, y: 6.5, width: 79.6, height: 22.7, rotation: 0 },
        { x: 10, y: 30, width: 79.6, height: 22.7, rotation: 0 },
        { x: 10, y: 53.5, width: 79.6, height: 22.7, rotation: 0 },
        { x: 10, y: 77, width: 79.6, height: 22.7, rotation: 0 }
      ],
      labels: ["GYUMIN 🦝", "HEAVEN 😇", "DIEL 🐶", "REX 🦖"],
      metadata: {
        id: 'frame_dns_pubg_2026',
        name: 'DNS PUBG 2026',
        emoji: '🎮',
        description: 'PUBG 2026 - Erangel Theme',
        color: '#E3F2FD',
        bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #E3F2FD 50%, #FFFFFF 100%)'
      }
    }, 'dns')
    }

    // GENG
    if (!existingFrames.geng) {
      await uploadFrame(canvasRefs.geng.current, {
      fileName: 'geng-pubg-2026.png',
      photoSlots: [
        { x: 6.5, y: 6.9, width: 87, height: 23.4, rotation: 0 },
        { x: 6.5, y: 30.2, width: 87, height: 23.4, rotation: 0 },
        { x: 6.5, y: 53.5, width: 87, height: 23.4, rotation: 0 },
        { x: 6.5, y: 76.8, width: 87, height: 23.4, rotation: 0 }
      ],
      labels: ["SEOUL 🪖", "BEAN 📦", "DIYY 🎯", "SALUTE ⚡"],
      metadata: {
        id: 'frame_geng_pubg_2026',
        name: 'GENG PUBG 2026',
        emoji: '⚡',
        description: 'PUBG 2026 - GENG Team',
        color: '#FFF9E6',
        bgGradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
      }
    }, 'geng')
    }

    setStatus('complete')
  }

  const getStatusIcon = (status) => {
    if (status === 'exists') return '✅ Already exists'
    if (status === 'waiting') return '⏳ Waiting'
    if (status === 'uploading') return '📤 Uploading...'
    if (status === 'success') return '✅ Success'
    if (status.startsWith('error')) return '❌ ' + status
    return status
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        color: 'white'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          🎮 Upload PUBG Frames to Production
        </h2>

        {status === 'ready' && (
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            {loading ? (
              <p>🔍 Checking existing frames...</p>
            ) : (
              <>
                <p>Ready to upload PUBG frames:</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {!existingFrames.korea && <li>🇰🇷 Team Korea PNC 2026</li>}
                  {!existingFrames.dns && <li>🎮 DNS PUBG 2026</li>}
                  {!existingFrames.geng && <li>⚡ GENG PUBG 2026</li>}
                  {existingFrames.korea && existingFrames.dns && existingFrames.geng && (
                    <li style={{ color: '#4ade80' }}>✅ All frames already exist!</li>
                  )}
                </ul>
                {(!existingFrames.korea || !existingFrames.dns || !existingFrames.geng) && (
                  <button
                    onClick={handleUpload}
                    style={{
                      background: '#4ade80',
                      color: 'black',
                      border: 'none',
                      padding: '15px 40px',
                      fontSize: '18px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      marginTop: '20px'
                    }}
                  >
                    <Upload size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Upload Missing Frames
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {status === 'complete' && (
          <div style={{ textAlign: 'center', marginBottom: '20px', background: 'rgba(74, 222, 128, 0.2)', padding: '20px', borderRadius: '12px' }}>
            <h3>🎉 Upload Complete!</h3>
            <p>Refresh the page to see new frames</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#4ade80',
                color: 'black',
                border: 'none',
                padding: '12px 30px',
                fontSize: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              Refresh Now
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
          {!existingFrames.korea && (
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px' }}>
              <h4>🇰🇷 Team Korea</h4>
              <canvas ref={canvasRefs.korea} width="1080" height="2160" style={{ width: '100%', borderRadius: '8px' }} />
              <p style={{ textAlign: 'center', marginTop: '10px' }}>
                {getStatusIcon(progress.korea)}
              </p>
            </div>
          )}
          {!existingFrames.dns && (
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px' }}>
              <h4>🎮 DNS PUBG</h4>
              <canvas ref={canvasRefs.dns} width="1080" height="2160" style={{ width: '100%', borderRadius: '8px' }} />
              <p style={{ textAlign: 'center', marginTop: '10px' }}>
                {getStatusIcon(progress.dns)}
              </p>
            </div>
          )}
          {!existingFrames.geng && (
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px' }}>
              <h4>⚡ GENG PUBG</h4>
              <canvas ref={canvasRefs.geng} width="1080" height="2160" style={{ width: '100%', borderRadius: '8px' }} />
              <p style={{ textAlign: 'center', marginTop: '10px' }}>
                {getStatusIcon(progress.geng)}
              </p>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              fontSize: '16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
