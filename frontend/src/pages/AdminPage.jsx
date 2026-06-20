import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, LogOut, Upload, Image, Palette } from 'lucide-react'
import { API_URL, frameImageUrl } from '../config/api'
import FallingParticles from '../components/FallingParticles'
import FileValidationPreview from '../components/FileValidationPreview'
import SafeZoneOverlay from '../components/SafeZoneOverlay'
import FrameDesigner from '../components/FrameDesigner'
import '../styles/AdminPage.css'

function AdminPage() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  // Compress image before upload - support up to 4MB
  const compressImage = async (file, maxSizeMB = 4) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement('img')
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          // Calculate new dimensions to keep under maxSizeMB
          const maxDimension = 2000 // Max width or height
          if (width > height && width > maxDimension) {
            height = (height / width) * maxDimension
            width = maxDimension
          } else if (height > maxDimension) {
            width = (width / height) * maxDimension
            height = maxDimension
          }
          
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          
          // Try different quality levels to get under maxSizeMB
          let quality = 0.9
          const tryCompress = () => {
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'))
                return
              }
              
              console.log('[Compress] Original:', (file.size / 1024 / 1024).toFixed(2), 'MB → Compressed:', (blob.size / 1024 / 1024).toFixed(2), 'MB at quality', quality)
              
              if (blob.size > maxSizeMB * 1024 * 1024 && quality > 0.4) {
                quality -= 0.1
                tryCompress()
              } else {
                const compressedFile = new File([blob], file.name, {
                  type: file.type || 'image/png',
                  lastModified: Date.now()
                })
                resolve(compressedFile)
              }
            }, file.type || 'image/png', quality)
          }
          
          tryCompress()
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target.result
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  // Upload qua backend /api/upload-frame → UploadThing
  const uploadFrameImageWithTimeout = async (file, photoSlots = []) => {
    console.log('[Upload] Bắt đầu upload file:', file.name, file.size, file.type)
    console.log('[Upload] API URL:', API_URL)
    console.log('[Upload] Photo slots:', photoSlots)

    // Compress image if over 4MB
    let fileToUpload = file
    if (file.size > 4 * 1024 * 1024) {
      console.log('[Upload] File lớn hơn 4MB, đang compress...')
      try {
        fileToUpload = await compressImage(file, 4)
      } catch (err) {
        console.error('[Upload] Lỗi compress:', err)
        showToast('Lỗi khi nén ảnh: ' + err.message, 'error')
        throw err
      }
    }

    // Đọc file thành base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        const base64Data = result.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(fileToUpload)
    })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s timeout

    try {
      const response = await fetch(`${API_URL}/api/upload-frame`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64,
          fileName: fileToUpload.name,
          mimeType: fileToUpload.type,
          fileSize: fileToUpload.size,
          photoSlots: photoSlots  // Add photoSlots for validation
        }),
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        // Show validation errors if present
        if (err.validationErrors && err.validationErrors.length > 0) {
          throw new Error(err.validationErrors.join('; '))
        }
        throw new Error(err.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log('[Upload] Response:', data)
      
      // Show warnings if present
      if (data.warnings && data.warnings.length > 0) {
        data.warnings.forEach(warning => {
          showToast(warning, 'warning')
        })
      }
      
      const fileUrl = data?.file?.url || data?.file?.path
      if (!fileUrl) throw new Error('Không lấy được URL file sau upload')

      const url = fileUrl.startsWith('http') ? fileUrl : `${API_URL}${fileUrl}`
      console.log('[Upload] Upload thành công, URL:', url)
      return url
    } catch (err) {
      clearTimeout(timeoutId)
      console.error('[Upload] Lỗi upload:', err)
      if (err.name === 'AbortError') throw new Error('Upload timeout (60s)')
      throw err
    }
  }
  const [frames, setFrames] = useState([])
  const [editingFrame, setEditingFrame] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editMode, setEditMode] = useState('add') // 'add' or 'edit'
  const [editingFrameId, setEditingFrameId] = useState(null) // Store frame ID when editing
  const [newFrame, setNewFrame] = useState({
    name: '',
    description: '',
    emoji: '',
    color: '#FFE4E9',
    bgGradient: '',
    frameImage: null, // File object
    frameImagePreview: null, // URL for preview
    photoSlots: [] // Array of photo slot positions
  })

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [isProcessing, setIsProcessing] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [editingSlotsFrameId, setEditingSlotsFrameId] = useState(null)
  const [showSlotsEditor, setShowSlotsEditor] = useState(false)
  const [showFrameDesigner, setShowFrameDesigner] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
  }

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      loadFrames()
    }
  }, [])

  // Load frames from backend
  const loadFrames = async () => {
    try {
      const response = await fetch(`${API_URL}/api/frames`)
      if (response.ok) {
        const data = await response.json()
        setFrames(data.frames)
      }
    } catch (error) {
      console.error('Error loading frames:', error)
    }
  }

  // Login
  const handleLogin = (e) => {
    e.preventDefault()
    // Simple password check - replace with real authentication
    if (password === 'kaito') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
      loadFrames()
    } else {
      showToast('Sai mật khẩu!', 'error')
    }
  }

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuthenticated')
    setPassword('')
  }

  // Add new frame or update existing frame
  const handleSaveFrame = async () => {
    try {
      // Validate required fields - only name is required
      if (!newFrame.name) {
        showToast('Vui lòng điền tên frame!', 'error')
        return
      }

      setIsProcessing(true)

      // Upload frame image if new file
      let frameImageUrl = null
      if (newFrame.frameImage && newFrame.frameImage instanceof File) {
        try {
          frameImageUrl = await uploadFrameImageWithTimeout(newFrame.frameImage, newFrame.photoSlots)
        } catch (error) {
          console.error('Upload error:', error)
          setIsProcessing(false)
          showToast('Lỗi khi upload ảnh frame: ' + error.message, 'error')
          return
        }
      } else if (newFrame.frameImagePreview && !newFrame.frameImage) {
        // Keep existing image URL when editing
        frameImageUrl = newFrame.frameImagePreview
      }

      // Auto-generate gradient if not provided
      const frameData = {
        name: newFrame.name,
        description: newFrame.description || '',
        emoji: newFrame.emoji || '',
        color: newFrame.color,
        bgGradient: newFrame.bgGradient || `linear-gradient(135deg, ${newFrame.color} 0%, ${adjustColor(newFrame.color, 20)} 100%)`,
        frameImage: frameImageUrl,
        photoSlots: newFrame.photoSlots || []
      }

      if (editMode === 'edit' && editingFrameId) {
        // UPDATE existing frame
        const response = await fetch(`${API_URL}/api/frames/${editingFrameId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(frameData)
        })

        if (response.ok) {
          const data = await response.json()
          setFrames(frames.map(f => f.id === editingFrameId ? data.frame : f))
          showToast('Cập nhật frame thành công!', 'success')
        } else {
          const error = await response.json()
          showToast('Lỗi: ' + error.error, 'error')
        }
      } else {
        // ADD new frame
        const response = await fetch(`${API_URL}/api/frames`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(frameData)
        })

        if (response.ok) {
          const data = await response.json()
          setFrames([...frames, data.frame])
          showToast('Thêm frame thành công!', 'success')
        } else {
          const error = await response.json()
          showToast('Lỗi: ' + error.error, 'error')
        }
      }

      // Reset form
      setIsAddingNew(false)
      setEditMode('add')
      setEditingFrameId(null)
      setShowSlotsEditor(false)
      setNewFrame({ name: '', description: '', emoji: '', color: '#FFE4E9', bgGradient: '', frameImage: null, frameImagePreview: null, photoSlots: [] })
      
    } catch (error) {
      console.error('Error saving frame:', error)
      showToast('Lỗi khi lưu frame: ' + error.message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Keep old functions for compatibility (will be removed later)
  const handleAddFrame = handleSaveFrame

  // Update frame
  const handleUpdateFrame = async (frameId) => {
    try {
      setIsProcessing(true)
      // Upload frame image mới nếu có file thay đổi
      let frameImageUrl = editingFrame.frameImage
      if (editingFrame.frameImage && editingFrame.frameImage instanceof File) {
        try {
          frameImageUrl = await uploadFrameImageWithTimeout(editingFrame.frameImage, editingFrame.photoSlots)
        } catch (error) {
          console.error('Upload error:', error)
          setIsProcessing(false)
          showToast('Lỗi khi upload ảnh frame: ' + error.message, 'error')
          return
        }
      }

      const frameData = {
        ...editingFrame,
        frameImage: frameImageUrl
      }

      const response = await fetch(`${API_URL}/api/frames/${frameId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(frameData)
      })

      if (response.ok) {
        const data = await response.json()
        setFrames(frames.map(f => f.id === frameId ? data.frame : f))
        setEditingFrame(null)
        showToast('Cập nhật frame thành công!', 'success')
      }
    } catch (error) {
      console.error('Error updating frame:', error)
      showToast('Lỗi khi cập nhật frame!', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Delete frame
  const handleDeleteFrame = async (frameId) => {
    try {
      setIsProcessing(true)
      setDeleteConfirmId(null)
      const response = await fetch(`${API_URL}/api/frames/${frameId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFrames(frames.filter(f => f.id !== frameId))
        showToast('Xóa frame thành công!', 'success')
      }
    } catch (error) {
      console.error('Error deleting frame:', error)
      showToast('Lỗi khi xóa frame!', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Fix slots for a specific frame
  const handleFixSlots = async (frameId) => {
    try {
      setIsProcessing(true)
      const response = await fetch(`${API_URL}/api/frames/${frameId}/fix-slots`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        setFrames(frames.map(f => f.id === frameId ? data.frame : f))
        showToast('Đã thêm slots mặc định! Bạn có thể điều chỉnh trong code nếu cần.', 'success')
      } else {
        const error = await response.json()
        showToast(error.error || 'Lỗi khi fix slots!', 'error')
      }
    } catch (error) {
      console.error('Error fixing slots:', error)
      showToast('Lỗi khi fix slots!', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Helper: Handle file upload
  const handleFileChange = (e, isEditing = false) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chọn file ảnh!', 'error')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File quá lớn! Vui lòng chọn ảnh dưới 5MB', 'error')
        return
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)

      if (isEditing) {
        setEditingFrame({ ...editingFrame, frameImage: file, frameImagePreview: previewUrl })
      } else {
        setNewFrame({ ...newFrame, frameImage: file, frameImagePreview: previewUrl })
      }
    }
  }

  // Helper: Adjust color brightness
  const adjustColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1)
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        {/* Falling particles */}
        <FallingParticles count={25} />

        <div className="admin-login-container">
          <div className="admin-login-card">
            <h1>🔐 Admin Login</h1>
            <p>Nhập mật khẩu để quản lý frames</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                autoFocus
              />
              <button type="submit" className="admin-login-btn">
                Đăng nhập
              </button>
            </form>
            <button onClick={() => navigate('/')} className="back-to-home">
              <ArrowLeft size={18} /> Về trang chủ
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <>
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: toast.type === 'error' ? '#ef4444' : toast.type === 'warning' ? '#f59e0b' : '#10b981',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
        }}>
          {toast.message}
        </div>
      )}

      {isProcessing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255,255,255,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9998,
          cursor: 'wait'
        }}>
          <div style={{
            background: 'white',
            padding: '15px 30px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontWeight: 'bold',
            color: '#FF6B9D'
          }}>
            Đang xử lý...
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9997
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            maxWidth: '300px'
          }}>
            <h3 style={{ marginTop: 0, color: '#ef4444' }}>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa frame này không? Hành động này không thể hoàn tác.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button 
                onClick={() => handleDeleteFrame(deleteConfirmId)}
                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Frame Designer Modal */}
      {showFrameDesigner && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px',
          overflow: 'auto'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '1400px',
            width: '100%',
            maxHeight: '95vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowFrameDesigner(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                zIndex: 10
              }}
            >
              ×
            </button>
            
            <FrameDesigner
              onSave={async (designData) => {
                try {
                  // Convert data URL to blob
                  const response = await fetch(designData.imageDataUrl)
                  const blob = await response.blob()
                  
                  // Create File object
                  const file = new File([blob], `${designData.name}.png`, { type: 'image/png' })
                  
                  // Upload frame
                  setIsProcessing(true)
                  const frameImageUrl = await uploadFrameImageWithTimeout(file, designData.photoSlots)
                  
                  // Create frame
                  const frameData = {
                    name: designData.name,
                    description: 'Designed in Frame Designer',
                    emoji: '🎨',
                    color: designData.config.bgColor,
                    bgGradient: designData.config.bgGradient || `linear-gradient(135deg, ${designData.config.bgColor} 0%, ${designData.config.bgColor} 100%)`,
                    frameImage: frameImageUrl,
                    photoSlots: designData.photoSlots
                  }
                  
                  const saveResponse = await fetch(`${API_URL}/api/frames`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(frameData)
                  })
                  
                  if (saveResponse.ok) {
                    const data = await saveResponse.json()
                    setFrames([...frames, data.frame])
                    showToast('Frame đã được lưu thành công!', 'success')
                    setShowFrameDesigner(false)
                  } else {
                    throw new Error('Failed to save frame')
                  }
                } catch (error) {
                  console.error('Save error:', error)
                  showToast('Lỗi khi lưu frame: ' + error.message, 'error')
                } finally {
                  setIsProcessing(false)
                }
              }}
            />
          </div>
        </div>
      )}

      <div className="admin-page">
        {/* Falling particles */}
        <FallingParticles count={25} />
        
        <header className="admin-header">
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowLeft size={18} /> Trang chủ
        </button>
        <h1>🎨 Frame Management</h1>
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={18} /> Đăng xuất
        </button>
      </header>

      <div className="admin-container">
        <div className="admin-actions">
          <button onClick={() => {
            setEditMode('add')
            setEditingFrameId(null)
            setShowSlotsEditor(false)
            setNewFrame({ name: '', description: '', emoji: '', color: '#FFE4E9', bgGradient: '', frameImage: null, frameImagePreview: null, photoSlots: [] })
            setIsAddingNew(true)
          }} className="add-frame-btn">
            <Plus size={20} /> Thêm Frame Mới
          </button>
          
          <button onClick={() => setShowFrameDesigner(true)} className="add-frame-btn" style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            marginLeft: '15px'
          }}>
            <Palette size={20} /> 🎨 Thiết kế Frame
          </button>
        </div>

        {/* Add/Edit Frame Form */}
        {isAddingNew && (
          <div className="frame-form-card">
            <h3>{editMode === 'edit' ? '✏️ Chỉnh sửa Frame' : '➕ Thêm Frame Mới'}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Tên Frame: *</label>
                <input
                  type="text"
                  value={newFrame.name}
                  onChange={(e) => setNewFrame({ ...newFrame, name: e.target.value })}
                  placeholder="VD: PGC 2025"
                />
              </div>
              <div className="form-group">
                <label>Emoji (tùy chọn):</label>
                <input
                  type="text"
                  value={newFrame.emoji}
                  onChange={(e) => setNewFrame({ ...newFrame, emoji: e.target.value })}
                  placeholder="VD: 🌸"
                  maxLength="2"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Mô tả (tùy chọn):</label>
              <input
                type="text"
                value={newFrame.description}
                onChange={(e) => setNewFrame({ ...newFrame, description: e.target.value })}
                placeholder="VD: Cherry blossoms & nature"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Màu nền:</label>
                <input
                  type="color"
                  value={newFrame.color}
                  onChange={(e) => setNewFrame({ ...newFrame, color: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Gradient (tùy chọn):</label>
                <input
                  type="text"
                  value={newFrame.bgGradient}
                  onChange={(e) => setNewFrame({ ...newFrame, bgGradient: e.target.value })}
                  placeholder="Auto-generate nếu để trống"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>
                <Upload size={18} /> Upload Frame Image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, false)}
                className="file-input"
              />
              
              {/* Real-time validation feedback */}
              {newFrame.frameImage && (
                <FileValidationPreview 
                  file={newFrame.frameImage} 
                  photoSlots={newFrame.photoSlots}
                  onValidationChange={(result) => {
                    // Can use this to disable upload button if validation fails
                    console.log('Validation result:', result)
                  }}
                />
              )}
              
              {newFrame.frameImagePreview && (
                <div className="file-preview-container">
                  <div className="file-info">
                    <Image size={16} /> {newFrame.frameImage?.name || 'Frame image'}
                  </div>
                  <div className="image-preview-box">
                    <img 
                      src={newFrame.frameImagePreview} 
                      alt="Frame preview" 
                      className="frame-preview-image"
                    />
                  </div>
                </div>
              )}
              <small className="form-hint">
                💡 Upload ảnh frame overlay (PNG/JPG/WebP). Nếu dùng PNG với nền trong suốt sẽ đẹp hơn!
                <br/>
                🎨 <strong>Cần template?</strong> <a href="/frame-template-generator.html" target="_blank" style={{ color: '#667eea', textDecoration: 'underline' }}>Tạo frame chuẩn ngay!</a> | 
                <a href="/HUONG_DAN_UPLOAD_FRAME.md" target="_blank" style={{ color: '#667eea', marginLeft: '10px' }}>📋 Xem hướng dẫn</a>
              </small>
            </div>
            
            {newFrame.frameImagePreview && (
              <div className="form-group">
                <label>Số ô ảnh trong frame:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newFrame.photoSlots.length || 0}
                  onChange={(e) => {
                    const count = parseInt(e.target.value) || 0
                    // Auto-generate evenly spaced slots
                    const slots = Array.from({ length: count }, (_, i) => ({
                      x: 10, // 10% from left
                      y: (100 / (count + 1)) * (i + 1) - 10, // Evenly distributed vertically
                      width: 80, // 80% width
                      height: (80 / count), // Divide height evenly
                      rotation: 0
                    }))
                    setNewFrame({ ...newFrame, photoSlots: slots })
                  }}
                  placeholder="VD: 4"
                />
                <small className="form-hint">
                  💡 Nhập số ô ảnh (VD: 4 ô). Vị trí sẽ được tự động phân bố đều.
                </small>
                {newFrame.photoSlots.length > 0 && (
                  <>
                    <div className="slots-info">
                      ✅ {newFrame.photoSlots.length} ô ảnh đã được tạo tự động
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowSlotsEditor(!showSlotsEditor)} 
                      className="edit-slots-btn"
                    >
                      {showSlotsEditor ? '🔼 Ẩn Editor' : '🔧 Chỉnh sửa vị trí & kích thước'}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Photo Slots Editor */}
            {newFrame.frameImagePreview && showSlotsEditor && newFrame.photoSlots.length > 0 && (
              <div className="slots-editor">
                <h3>📐 Editor: Điều chỉnh vị trí ô ảnh</h3>
                <div className="slots-editor-layout">
                  {/* Preview */}
                  <div className="slots-preview-container">
                    <div className="slots-preview-frame">
                      {/* Safe Zone Overlay */}
                      <SafeZoneOverlay />
                      
                      {/* Sample photos in slots */}
                      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                        {newFrame.photoSlots.map((slot, index) => (
                          <div
                            key={`photo-${index}`}
                            style={{
                              position: 'absolute',
                              left: `${slot.x}%`,
                              top: `${slot.y}%`,
                              width: `${slot.width}%`,
                              height: `${slot.height}%`,
                              overflow: 'hidden',
                              background: `linear-gradient(135deg, ${
                                index === 0 ? '#FF6B9D, #C94C73' :
                                index === 1 ? '#43E97B, #38C96B' :
                                index === 2 ? '#667EEA, #5568D3' :
                                '#FFA500, #FF8C00'
                              })`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px solid rgba(255,255,255,0.8)',
                              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
                            }}
                          >
                            <span style={{
                              fontSize: '3rem',
                              fontWeight: 'bold',
                              color: 'rgba(255,255,255,0.9)',
                              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}>
                              {index + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Frame overlay on top */}
                      <img 
                        src={newFrame.frameImagePreview} 
                        alt="Frame" 
                        className="slots-preview-image"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
                      />
                      
                      {/* Debug overlay boxes */}
                      {newFrame.photoSlots.map((slot, index) => (
                        <div
                          key={`debug-${index}`}
                          className="slots-preview-box"
                          style={{
                            left: `${slot.x}%`,
                            top: `${slot.y}%`,
                            width: `${slot.width}%`,
                            height: `${slot.height}%`,
                            transform: `rotate(${slot.rotation}deg)`,
                            background: 'transparent',
                            zIndex: 2
                          }}
                        >
                          <span className="slot-number" style={{
                            background: 'rgba(0,0,0,0.7)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.85rem'
                          }}>
                            Ô {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                      💡 Các màu gradient là ảnh mẫu. Điều chỉnh để khớp với ô đen trong frame.
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="slots-controls">
                    {newFrame.photoSlots.map((slot, index) => (
                      <div key={index} className="slot-control-group">
                        <h4>📷 Ô ảnh {index + 1}</h4>
                        <div className="slot-control-row">
                          <label>X (trái):</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={slot.x}
                            onChange={(e) => {
                              const updated = [...newFrame.photoSlots]
                              updated[index].x = parseInt(e.target.value)
                              setNewFrame({ ...newFrame, photoSlots: updated })
                            }}
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={slot.x}
                            onChange={(e) => {
                              const updated = [...newFrame.photoSlots]
                              updated[index].x = parseInt(e.target.value) || 0
                              setNewFrame({ ...newFrame, photoSlots: updated })
                            }}
                            className="slot-number-input"
                          />
                          <span>%</span>
                        </div>
                        <div className="slot-control-row">
                          <label>Y (trên):</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={slot.y}
                            onChange={(e) => {
                              const updated = [...newFrame.photoSlots]
                              updated[index].y = parseInt(e.target.value)
                              setNewFrame({ ...newFrame, photoSlots: updated })
                            }}
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={slot.y}
                            onChange={(e) => {
                              const updated = [...newFrame.photoSlots]
                              updated[index].y = parseInt(e.target.value) || 0
                              setNewFrame({ ...newFrame, photoSlots: updated })
                            }}
                            className="slot-number-input"
                          />
                          <span>%</span>
                        </div>
                        <div className="slot-control-row">
                          <label>Rộng:</label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={slot.width}
                            onChange={(e) => {
                              const updated = [...newFrame.photoSlots]
                              updated[index].width = parseInt(e.target.value)
                              setNewFrame({ ...newFrame, photoSlots: updated })
                            }}
                          />
                          <input
                            type="number"
                            min="10"
                            max="100"
                            value={slot.width}
                            onChange={(e) => {
                              const updated = [...newFrame.photoSlots]
                              updated[index].width = parseInt(e.target.value) || 10
                              setNewFrame({ ...newFrame, photoSlots: updated })
                            }}
                            className="slot-number-input"
                          />
                          <span>%</span>
                        </div>
                        <div className="slot-control-row">
                          <label>Cao:</label>
                          <input
                            type="range"
                            min="5"
                            max="100"
                            value={slot.height}
                            onChange={(e) => {
                              const updated = [...newFrame.photoSlots]
                              updated[index].height = parseInt(e.target.value)
                              setNewFrame({ ...newFrame, photoSlots: updated })
                            }}
                          />
                          <input
                            type="number"
                            min="5"
                            max="100"
                            value={slot.height}
                            onChange={(e) => {
                              const updated = [...newFrame.photoSlots]
                              updated[index].height = parseInt(e.target.value) || 5
                              setNewFrame({ ...newFrame, photoSlots: updated })
                            }}
                            className="slot-number-input"
                          />
                          <span>%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="form-actions">
              <button onClick={handleAddFrame} className="save-btn">
                <Save size={18} /> Lưu
              </button>
              <button onClick={() => {
                setIsAddingNew(false)
                setEditMode('add')
                setEditingFrameId(null)
                setShowSlotsEditor(false)
                setNewFrame({ name: '', description: '', emoji: '', color: '#FFE4E9', bgGradient: '', frameImage: null, frameImagePreview: null, photoSlots: [] })
              }} className="cancel-btn">
                <X size={18} /> Hủy
              </button>
            </div>
          </div>
        )}

        {/* Frames Grid */}
        <div className="frames-list">
          {/* Info Banner - Frame Standards */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '25px',
            borderRadius: '15px',
            marginBottom: '20px',
            color: 'white',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ fontSize: '3rem' }}>📋</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem' }}>
                  Quy định Frame Strip - Đọc trước khi upload
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
                    <strong>📐 Kích thước chuẩn:</strong>
                    <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                      2-slot: 1080×1620<br/>
                      4-slot: 1080×2160 ⭐<br/>
                      6-slot: 1080×2700
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
                    <strong>📁 Format:</strong>
                    <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                      ✅ PNG (trong suốt)<br/>
                      ⚠️ JPEG (không trong suốt)<br/>
                      💾 Max: 5MB
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
                    <strong>🎯 Safe Zone:</strong>
                    <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                      Photo slots phải<br/>
                      cách mép ≥ 5%<br/>
                      để tránh bị cắt
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a 
                    href="/frame-template-generator.html" 
                    target="_blank"
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      background: 'white',
                      color: '#667eea',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '0.95rem'
                    }}
                  >
                    🎨 Tạo Frame Template
                  </a>
                  <a 
                    href="/frame-resources.html" 
                    target="_blank"
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      border: '2px solid white'
                    }}
                  >
                    📚 Xem tất cả tài liệu
                  </a>
                  <a 
                    href="/HUONG_DAN_UPLOAD_FRAME.md" 
                    target="_blank"
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      border: '2px solid white'
                    }}
                  >
                    📖 Hướng dẫn chi tiết
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ fontSize: '2rem' }}>💡</div>
              <div style={{ flex: 1 }}>
                <strong style={{ color: '#78350f', fontSize: '1.1rem' }}>Tips nhanh:</strong>
                <ul style={{ margin: '10px 0 0 20px', color: '#78350f', lineHeight: '1.8', fontSize: '0.9rem' }}>
                  <li>Dùng <strong>Template Generator</strong> để tạo frame đúng chuẩn ngay</li>
                  <li>Luôn export PNG với <strong>nền trong suốt</strong></li>
                  <li>Frame có ảnh phải có <strong>photo slots</strong>, nếu không ảnh sẽ không hiển thị</li>
                  <li>Hệ thống sẽ <strong>tự động kiểm tra</strong> khi upload và báo lỗi nếu sai quy định</li>
                </ul>
              </div>
            </div>
          </div>

          <h2>Danh sách Frames ({frames.length})</h2>
          <div className="frames-grid-admin">
            {frames.map((frame) => (
              <div key={frame.id} className="frame-card-admin">
                {editingFrame?.id === frame.id ? (
                  // Edit Mode
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editingFrame.name}
                      onChange={(e) => setEditingFrame({ ...editingFrame, name: e.target.value })}
                      className="edit-input"
                    />
                    <input
                      type="text"
                      value={editingFrame.emoji}
                      onChange={(e) => setEditingFrame({ ...editingFrame, emoji: e.target.value })}
                      className="edit-input"
                      maxLength="2"
                    />
                    <input
                      type="text"
                      value={editingFrame.description}
                      onChange={(e) => setEditingFrame({ ...editingFrame, description: e.target.value })}
                      className="edit-input"
                    />
                    <input
                      type="color"
                      value={editingFrame.color}
                      onChange={(e) => setEditingFrame({ ...editingFrame, color: e.target.value })}
                    />
                    <div className="edit-actions">
                      <button onClick={() => handleUpdateFrame(frame.id)} className="save-btn-sm">
                        <Save size={16} />
                      </button>
                      <button onClick={() => setEditingFrame(null)} className="cancel-btn-sm">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="frame-preview-admin" style={{ background: frame.bgGradient || frame.color }}>
                      {frame.emoji && frame.emoji !== '🖼️' && (
                        <div className="frame-emoji-large">{frame.emoji}</div>
                      )}
                      <h3>{frame.name}</h3>
                      {frame.description && <p>{frame.description}</p>}
                      {frame.frameImage && (
                        <>
                          <div className="frame-image-preview-admin">
                            <img 
                              src={frameImageUrl(frame.frameImage)}
                              alt={frame.name}
                              className="admin-frame-img"
                            />
                          </div>
                          <div className="frame-has-overlay" style={{ 
                            background: '#d1fae5', 
                            color: '#065f46', 
                            padding: '8px', 
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            <Image size={16} /> Has frame overlay
                          </div>
                          {(!frame.photoSlots || frame.photoSlots.length === 0) && (
                            <div style={{ 
                              background: '#fef3c7', 
                              border: '2px solid #f59e0b',
                              color: '#78350f', 
                              padding: '12px', 
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              marginTop: '8px'
                            }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                ⚠️ Chưa có Photo Slots
                              </div>
                              <div style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
                                Frame có ảnh nhưng chưa định nghĩa vị trí ô ảnh. 
                                Ảnh sẽ không hiển thị đúng!
                              </div>
                              <button 
                                onClick={() => handleFixSlots(frame.id)} 
                                className="fix-slots-btn" 
                                disabled={isProcessing}
                                style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                              >
                                🔧 Tự động thêm slots
                              </button>
                            </div>
                          )}
                          {frame.photoSlots && frame.photoSlots.length > 0 && (
                            <div style={{
                              background: '#e0f2fe',
                              color: '#075985',
                              padding: '8px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              marginTop: '8px'
                            }}>
                              ✅ {frame.photoSlots.length} photo slots đã định nghĩa
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="frame-actions">
                      <button onClick={() => {
                        // Load frame data into newFrame form
                        setNewFrame({
                          name: frame.name,
                          description: frame.description || '',
                          emoji: frame.emoji || '',
                          color: frame.color || '#FFE4E9',
                          bgGradient: frame.bgGradient || '',
                          frameImage: null,
                          frameImagePreview: frame.frameImage ? frameImageUrl(frame.frameImage) : null,
                          photoSlots: frame.photoSlots || []
                        })
                        setEditMode('edit')
                        setEditingFrameId(frame.id)
                        setIsAddingNew(true)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }} className="edit-btn">
                        <Edit2 size={16} /> Sửa
                      </button>
                      {frame.frameImage && (!frame.photoSlots || frame.photoSlots.length === 0) && (
                        <button onClick={() => handleFixSlots(frame.id)} className="fix-slots-btn" disabled={isProcessing}>
                          🔧 Fix Slots
                        </button>
                      )}
                      <button onClick={() => setDeleteConfirmId(frame.id)} className="delete-btn">
                        <Trash2 size={16} /> Xóa
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default AdminPage
