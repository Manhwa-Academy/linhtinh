import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, LogOut, Upload, Image } from 'lucide-react'
import { API_URL, frameImageUrl } from '../config/api'
import '../styles/AdminPage.css'

function AdminPage() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  // Upload trực tiếp lên backend /api/upload-frame
  const uploadFrameImageWithTimeout = async (file) => {
    console.log('[Upload] Bắt đầu upload file:', file.name, file.size, file.type)
    console.log('[Upload] API URL:', API_URL)

    const formData = new FormData()
    formData.append('frameImage', file)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(`${API_URL}/api/upload-frame`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      const fileUrl = data?.file?.url || data?.file?.path
      if (!fileUrl) throw new Error('Không lấy được URL file sau upload')

      // Nếu URL đã là http (Vercel Blob) thì dùng luôn, còn không thì build từ API_URL
      const url = fileUrl.startsWith('http') ? fileUrl : `${API_URL}${fileUrl}`
      console.log('[Upload] Upload thành công, URL:', url)
      return url
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') throw new Error('Upload timeout (30s)')
      throw err
    }
  }
  const [frames, setFrames] = useState([])
  const [editingFrame, setEditingFrame] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
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

  // Add new frame
  const handleAddFrame = async () => {
    try {
      // Validate required fields - only name is required
      if (!newFrame.name) {
        showToast('Vui lòng điền tên frame!', 'error')
        return
      }

      setIsProcessing(true)

      // Upload frame image trực tiếp qua backend nếu có file
      let frameImageUrl = null
      if (newFrame.frameImage && newFrame.frameImage instanceof File) {
        try {
          frameImageUrl = await uploadFrameImageWithTimeout(newFrame.frameImage)
        } catch (error) {
          console.error('Upload error:', error)
          setIsProcessing(false)
          showToast('Lỗi khi upload ảnh frame: ' + error.message, 'error')
          return
        }
      }

      // Auto-generate gradient if not provided
      const frameData = {
        name: newFrame.name,
        description: newFrame.description || '',
        emoji: newFrame.emoji || '', // Empty string instead of default emoji
        color: newFrame.color,
        bgGradient: newFrame.bgGradient || `linear-gradient(135deg, ${newFrame.color} 0%, ${adjustColor(newFrame.color, 20)} 100%)`,
        frameImage: frameImageUrl,
        photoSlots: newFrame.photoSlots || []
      }

      const response = await fetch(`${API_URL}/api/frames`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(frameData)
      })

      if (response.ok) {
        const data = await response.json()
        setFrames([...frames, data.frame])
        setIsAddingNew(false)
        setNewFrame({ name: '', description: '', emoji: '', color: '#FFE4E9', bgGradient: '', frameImage: null, frameImagePreview: null, photoSlots: [] })
        showToast('Thêm frame thành công!', 'success')
      } else {
        const error = await response.json()
        showToast('Lỗi: ' + error.error, 'error')
      }
    } catch (error) {
      console.error('Error adding frame:', error)
      showToast('Lỗi khi thêm frame: ' + error.message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Update frame
  const handleUpdateFrame = async (frameId) => {
    try {
      setIsProcessing(true)
      // Upload frame image mới nếu có file thay đổi
      let frameImageUrl = editingFrame.frameImage
      if (editingFrame.frameImage && editingFrame.frameImage instanceof File) {
        try {
          frameImageUrl = await uploadFrameImageWithTimeout(editingFrame.frameImage)
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
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
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

      <div className="admin-page">
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
          <button onClick={() => setIsAddingNew(true)} className="add-frame-btn">
            <Plus size={20} /> Thêm Frame Mới
          </button>
        </div>

        {/* Add New Frame Form */}
        {isAddingNew && (
          <div className="frame-form-card">
            <h3>Thêm Frame Mới</h3>
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
              {newFrame.frameImagePreview && (
                <div className="file-preview-container">
                  <div className="file-info">
                    <Image size={16} /> {newFrame.frameImage.name}
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
                  <div className="slots-info">
                    ✅ {newFrame.photoSlots.length} ô ảnh đã được tạo tự động
                  </div>
                )}
              </div>
            )}
            <div className="form-actions">
              <button onClick={handleAddFrame} className="save-btn">
                <Save size={18} /> Lưu
              </button>
              <button onClick={() => setIsAddingNew(false)} className="cancel-btn">
                <X size={18} /> Hủy
              </button>
            </div>
          </div>
        )}

        {/* Frames Grid */}
        <div className="frames-list">
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
                          <div className="frame-has-overlay">
                            <Image size={20} /> Has frame overlay
                          </div>
                        </>
                      )}
                    </div>
                    <div className="frame-actions">
                      <button onClick={() => setEditingFrame({ ...frame })} className="edit-btn">
                        <Edit2 size={16} /> Sửa
                      </button>
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
