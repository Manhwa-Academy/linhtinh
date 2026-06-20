import { useState, useRef, useEffect } from 'react'
import { Download, Type, Square, Circle, Image as ImageIcon, Trash2, Plus, Save } from 'lucide-react'

/**
 * FrameDesigner Component
 * Visual frame designer with canvas - Design frames directly in browser
 */
function FrameDesigner({ onSave, initialData = null }) {
  const canvasRef = useRef(null)
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)
  
  // Frame settings
  const [frameConfig, setFrameConfig] = useState({
    slotCount: initialData?.slotCount || 4,
    width: 1080,
    height: 2160,
    bgColor: initialData?.bgColor || '#FFE4E9',
    bgGradient: initialData?.bgGradient || '',
    name: initialData?.name || 'My Frame'
  })
  
  // Preset templates
  const presets = [
    { name: 'Pink Gradient', color: '#FFE4E9', emoji: '🌸' },
    { name: 'Blue Sky', color: '#E0F2FE', emoji: '☁️' },
    { name: 'Mint Fresh', color: '#D1FAE5', emoji: '🌿' },
    { name: 'Lavender', color: '#E9D5FF', emoji: '💜' },
    { name: 'Sunset', color: '#FED7AA', emoji: '🌅' },
    { name: 'Cherry', color: '#FECACA', emoji: '🍒' }
  ]
  
  // Apply preset
  const applyPreset = (preset) => {
    setFrameConfig(prev => ({ ...prev, bgColor: preset.color, name: preset.name }))
  }
  
  // Design elements
  const [elements, setElements] = useState([])
  const [photoSlots, setPhotoSlots] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [tool, setTool] = useState('select') // select, text, rect, circle, image
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  // Initialize canvas
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    
    setCanvas(c)
    const context = c.getContext('2d')
    setCtx(context)
    
    // Set canvas size based on slot count
    const heights = { 2: 1620, 4: 2160, 6: 2700 }
    c.width = 1080
    c.height = heights[frameConfig.slotCount]
    
    // Generate initial photo slots
    generatePhotoSlots(frameConfig.slotCount)
  }, [])
  
  // Update canvas size when slot count changes
  const updateCanvasSize = (slotCount) => {
    const heights = { 2: 1620, 4: 2160, 6: 2700 }
    const newHeight = heights[slotCount]
    
    setFrameConfig(prev => ({ ...prev, height: newHeight, slotCount }))
    
    if (canvas) {
      canvas.width = 1080
      canvas.height = newHeight
      redraw()
    }
    
    // Auto-generate photo slots
    generatePhotoSlots(slotCount)
  }
  
  // Auto-generate photo slots
  const generatePhotoSlots = (count) => {
    const margin = 5 // 5%
    const slotWidth = 90
    const slotHeight = Math.floor((100 - margin * 2 - (count - 1) * margin) / count)
    
    const slots = Array.from({ length: count }, (_, i) => ({
      x: margin,
      y: margin + i * (slotHeight + margin),
      width: slotWidth,
      height: slotHeight,
      rotation: 0
    }))
    
    setPhotoSlots(slots)
  }
  
  // Redraw canvas
  const redraw = () => {
    if (!canvas || !ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw background
    if (frameConfig.bgGradient) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      // Parse gradient string (simplified)
      gradient.addColorStop(0, frameConfig.bgColor)
      gradient.addColorStop(1, adjustColor(frameConfig.bgColor, -20))
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = frameConfig.bgColor
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw photo slots (preview with sample pattern)
    photoSlots.forEach((slot, index) => {
      const x = (slot.x / 100) * canvas.width
      const y = (slot.y / 100) * canvas.height
      const w = (slot.width / 100) * canvas.width
      const h = (slot.height / 100) * canvas.height
      
      // Checkerboard pattern
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(x, y, w, h)
      
      // Border
      ctx.strokeStyle = '#667eea'
      ctx.lineWidth = 4
      ctx.strokeRect(x, y, w, h)
      
      // Label
      ctx.fillStyle = '#667eea'
      ctx.font = 'bold 40px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`PHOTO ${index + 1}`, x + w / 2, y + h / 2)
    })
    
    // Draw elements
    elements.forEach((element, index) => {
      if (element.type === 'text') {
        ctx.fillStyle = element.color || '#333'
        ctx.font = `${element.fontSize || 60}px ${element.fontFamily || 'Arial'}`
        ctx.textAlign = element.align || 'center'
        ctx.fillText(element.text, element.x, element.y)
      } else if (element.type === 'rect') {
        ctx.fillStyle = element.fill || '#ffffff'
        ctx.fillRect(element.x, element.y, element.width, element.height)
        if (element.stroke) {
          ctx.strokeStyle = element.stroke
          ctx.lineWidth = element.strokeWidth || 2
          ctx.strokeRect(element.x, element.y, element.width, element.height)
        }
      } else if (element.type === 'circle') {
        ctx.beginPath()
        ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2)
        ctx.fillStyle = element.fill || '#ffffff'
        ctx.fill()
        if (element.stroke) {
          ctx.strokeStyle = element.stroke
          ctx.lineWidth = element.strokeWidth || 2
          ctx.stroke()
        }
      }
      
      // Highlight selected element
      if (index === selectedElement) {
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 3
        ctx.setLineDash([10, 5])
        if (element.type === 'text') {
          ctx.strokeRect(element.x - 20, element.y - 40, 200, 60)
        } else if (element.type === 'rect') {
          ctx.strokeRect(element.x - 5, element.y - 5, element.width + 10, element.height + 10)
        } else if (element.type === 'circle') {
          ctx.beginPath()
          ctx.arc(element.x, element.y, element.radius + 5, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.setLineDash([])
      }
    })
  }
  
  // Redraw when anything changes
  useEffect(() => {
    redraw()
  }, [elements, photoSlots, frameConfig, selectedElement, canvas, ctx])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete key
      if (e.key === 'Delete' && selectedElement !== null) {
        deleteSelected()
      }
      // Escape key - deselect
      if (e.key === 'Escape') {
        setSelectedElement(null)
      }
      // Arrow keys - move element
      if (selectedElement !== null && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const element = elements[selectedElement]
        if (!element) return
        
        const step = e.shiftKey ? 10 : 1
        const updates = {}
        if (e.key === 'ArrowLeft') updates.x = element.x - step
        if (e.key === 'ArrowRight') updates.x = element.x + step
        if (e.key === 'ArrowUp') updates.y = element.y - step
        if (e.key === 'ArrowDown') updates.y = element.y + step
        
        updateElement(updates)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedElement, elements])
  
  // Add text element
  const addText = () => {
    const newElement = {
      type: 'text',
      text: 'Your Text',
      x: canvas.width / 2,
      y: 100,
      fontSize: 60,
      color: '#333',
      fontFamily: 'Arial',
      align: 'center'
    }
    setElements([...elements, newElement])
    setSelectedElement(elements.length)
  }
  
  // Add rectangle
  const addRect = () => {
    const newElement = {
      type: 'rect',
      x: canvas.width / 2 - 150,
      y: canvas.height - 200,
      width: 300,
      height: 100,
      fill: '#ffffff',
      stroke: '#667eea',
      strokeWidth: 3
    }
    setElements([...elements, newElement])
    setSelectedElement(elements.length)
  }
  
  // Add circle decoration
  const addCircle = () => {
    const newElement = {
      type: 'circle',
      x: 100,
      y: 100,
      radius: 60,
      fill: 'rgba(255, 255, 255, 0.5)',
      stroke: '#667eea',
      strokeWidth: 2
    }
    setElements([...elements, newElement])
    setSelectedElement(elements.length)
  }
  
  // Delete selected element
  const deleteSelected = () => {
    if (selectedElement !== null) {
      setElements(elements.filter((_, i) => i !== selectedElement))
      setSelectedElement(null)
    }
  }
  
  // Update selected element
  const updateElement = (updates) => {
    if (selectedElement !== null) {
      const newElements = [...elements]
      newElements[selectedElement] = { ...newElements[selectedElement], ...updates }
      setElements(newElements)
    }
  }
  
  // Handle canvas click to select elements
  const handleCanvasClick = (e) => {
    if (!canvas || isDragging) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    
    // Check if clicked on any element (reverse order to prioritize top elements)
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i]
      let isHit = false
      
      if (element.type === 'text') {
        // Simple bounding box check for text
        isHit = Math.abs(x - element.x) < 100 && Math.abs(y - element.y) < 40
      } else if (element.type === 'rect') {
        isHit = x >= element.x && x <= element.x + element.width &&
                y >= element.y && y <= element.y + element.height
      } else if (element.type === 'circle') {
        const dx = x - element.x
        const dy = y - element.y
        isHit = Math.sqrt(dx * dx + dy * dy) <= element.radius
      }
      
      if (isHit) {
        setSelectedElement(i)
        return
      }
    }
    
    // Clicked on empty area - deselect
    setSelectedElement(null)
  }
  
  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (!canvas || selectedElement === null) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    
    const element = elements[selectedElement]
    if (!element) return
    
    // Check if mouse is on selected element
    let isOnElement = false
    if (element.type === 'text') {
      isOnElement = Math.abs(x - element.x) < 100 && Math.abs(y - element.y) < 40
    } else if (element.type === 'rect') {
      isOnElement = x >= element.x && x <= element.x + element.width &&
                    y >= element.y && y <= element.y + element.height
    } else if (element.type === 'circle') {
      const dx = x - element.x
      const dy = y - element.y
      isOnElement = Math.sqrt(dx * dx + dy * dy) <= element.radius
    }
    
    if (isOnElement) {
      setIsDragging(true)
      setDragStart({ x: x - element.x, y: y - element.y })
    }
  }
  
  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!canvas || !isDragging || selectedElement === null) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    
    updateElement({ 
      x: x - dragStart.x, 
      y: y - dragStart.y 
    })
  }
  
  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  // Export as PNG
  const exportPNG = () => {
    if (!canvas) return
    
    const link = document.createElement('a')
    link.download = `${frameConfig.name.replace(/\s+/g, '-')}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  
  // Save frame (callback to parent)
  const handleSave = () => {
    if (!canvas) return
    
    const dataUrl = canvas.toDataURL('image/png')
    
    if (onSave) {
      onSave({
        name: frameConfig.name,
        imageDataUrl: dataUrl,
        photoSlots: photoSlots,
        config: frameConfig
      })
    }
  }
  
  // Helper: Adjust color brightness
  const adjustColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.min(255, Math.max(0, (num >> 16) + amt))
    const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt))
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt))
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
  }
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎨 Frame Designer</h2>
        <p style={styles.subtitle}>Thiết kế frame trực tiếp trong trình duyệt</p>
        <div style={{
          background: '#fef3c7',
          padding: '12px',
          borderRadius: '8px',
          marginTop: '12px',
          fontSize: '0.9rem',
          color: '#78350f',
          border: '2px solid #fbbf24'
        }}>
          💡 <strong>Hướng dẫn:</strong> Chọn số ô ảnh → Thay đổi màu nền → Thêm text/hình → Click vào phần tử để chỉnh sửa → Lưu
          <br/>
          ⌨️ <strong>Shortcuts:</strong> Delete = Xóa | Esc = Bỏ chọn | ← ↑ → ↓ = Di chuyển | Shift + ← ↑ → ↓ = Di chuyển nhanh
        </div>
      </div>
      
      <div style={styles.content}>
        {/* Left Panel - Tools & Settings */}
        <div style={styles.leftPanel}>
          {/* Frame Settings */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>⚙️ Cài đặt Frame</h3>
            
            <div style={styles.formGroup}>
              <label>Tên frame:</label>
              <input
                type="text"
                value={frameConfig.name}
                onChange={(e) => setFrameConfig({ ...frameConfig, name: e.target.value })}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Số ô ảnh:</label>
              <select
                value={frameConfig.slotCount}
                onChange={(e) => updateCanvasSize(parseInt(e.target.value))}
                style={styles.select}
              >
                <option value="2">2 ô (1080×1620)</option>
                <option value="4">4 ô (1080×2160) ⭐</option>
                <option value="6">6 ô (1080×2700)</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label>Màu nền:</label>
              <input
                type="color"
                value={frameConfig.bgColor}
                onChange={(e) => setFrameConfig({ ...frameConfig, bgColor: e.target.value })}
                style={styles.colorInput}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Preset nhanh:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                {presets.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(preset)}
                    style={{
                      padding: '8px',
                      background: preset.color,
                      border: frameConfig.bgColor === preset.color ? '3px solid #667eea' : '2px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {preset.emoji} {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tools */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🛠️ Công cụ</h3>
            <div style={styles.toolButtons}>
              <button onClick={addText} style={styles.toolBtn}>
                <Type size={20} /> Text
              </button>
              <button onClick={addRect} style={styles.toolBtn}>
                <Square size={20} /> Hình chữ nhật
              </button>
              <button onClick={addCircle} style={styles.toolBtn}>
                <Circle size={20} /> Hình tròn
              </button>
            </div>
          </div>
          
          {/* Element Properties */}
          {selectedElement !== null && elements[selectedElement] ? (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>✏️ Chỉnh sửa</h3>
              
              {/* Common properties - position */}
              <div style={styles.formGroup}>
                <label>Vị trí X:</label>
                <input
                  type="number"
                  value={Math.round(elements[selectedElement].x)}
                  onChange={(e) => updateElement({ x: parseInt(e.target.value) || 0 })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Vị trí Y:</label>
                <input
                  type="number"
                  value={Math.round(elements[selectedElement].y)}
                  onChange={(e) => updateElement({ y: parseInt(e.target.value) || 0 })}
                  style={styles.input}
                />
              </div>
              
              {elements[selectedElement].type === 'text' && (
                <>
                  <div style={styles.formGroup}>
                    <label>Text:</label>
                    <input
                      type="text"
                      value={elements[selectedElement].text}
                      onChange={(e) => updateElement({ text: e.target.value })}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Font size:</label>
                    <input
                      type="number"
                      value={elements[selectedElement].fontSize}
                      onChange={(e) => updateElement({ fontSize: parseInt(e.target.value) })}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Màu:</label>
                    <input
                      type="color"
                      value={elements[selectedElement].color}
                      onChange={(e) => updateElement({ color: e.target.value })}
                      style={styles.colorInput}
                    />
                  </div>
                </>
              )}
              
              {elements[selectedElement].type === 'rect' && (
                <>
                  <div style={styles.formGroup}>
                    <label>Rộng:</label>
                    <input
                      type="number"
                      value={elements[selectedElement].width}
                      onChange={(e) => updateElement({ width: parseInt(e.target.value) || 10 })}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Cao:</label>
                    <input
                      type="number"
                      value={elements[selectedElement].height}
                      onChange={(e) => updateElement({ height: parseInt(e.target.value) || 10 })}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Màu nền:</label>
                    <input
                      type="color"
                      value={elements[selectedElement].fill}
                      onChange={(e) => updateElement({ fill: e.target.value })}
                      style={styles.colorInput}
                    />
                  </div>
                </>
              )}
              
              {elements[selectedElement].type === 'circle' && (
                <>
                  <div style={styles.formGroup}>
                    <label>Bán kính:</label>
                    <input
                      type="number"
                      value={elements[selectedElement].radius}
                      onChange={(e) => updateElement({ radius: parseInt(e.target.value) || 10 })}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Màu nền:</label>
                    <input
                      type="color"
                      value={elements[selectedElement].fill.replace(/rgba?\([^)]+\)/, '#ffffff')}
                      onChange={(e) => updateElement({ fill: e.target.value })}
                      style={styles.colorInput}
                    />
                  </div>
                </>
              )}
              
              <button onClick={deleteSelected} style={styles.deleteBtn}>
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          ) : elements.length > 0 ? (
            <div style={{...styles.section, textAlign: 'center', color: '#94a3b8'}}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👆</div>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Click vào một phần tử<br/>trên canvas để chỉnh sửa
              </p>
            </div>
          ) : null}
          
          {/* Actions */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💾 Lưu & Export</h3>
            <button onClick={exportPNG} style={styles.actionBtn}>
              <Download size={18} /> Download PNG
            </button>
            <button onClick={handleSave} style={{ ...styles.actionBtn, background: '#10b981' }}>
              <Save size={18} /> Lưu vào Admin
            </button>
          </div>
        </div>
        
        {/* Right Panel - Canvas */}
        <div style={styles.rightPanel}>
          <div style={styles.canvasContainer}>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{...styles.canvas, cursor: isDragging ? 'grabbing' : (selectedElement !== null ? 'grab' : 'default')}}
            />
          </div>
          <div style={styles.canvasInfo}>
            📐 {frameConfig.width} × {frameConfig.height} px
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  },
  header: {
    marginBottom: '25px',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '20px'
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '1.8rem'
  },
  subtitle: {
    margin: '5px 0 0 0',
    color: '#666',
    fontSize: '0.95rem'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '30px'
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  section: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px'
  },
  sectionTitle: {
    margin: '0 0 15px 0',
    fontSize: '1.1rem',
    color: '#333'
  },
  formGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    marginTop: '5px'
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    marginTop: '5px'
  },
  colorInput: {
    width: '100%',
    height: '50px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    marginTop: '5px',
    cursor: 'pointer'
  },
  toolButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px'
  },
  toolBtn: {
    padding: '12px',
    background: 'white',
    border: '2px solid #667eea',
    borderRadius: '8px',
    color: '#667eea',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    transition: 'all 0.3s'
  },
  deleteBtn: {
    width: '100%',
    padding: '10px',
    background: '#ef4444',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center'
  },
  actionBtn: {
    width: '100%',
    padding: '12px',
    background: '#667eea',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '10px',
    transition: 'all 0.3s'
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  canvasContainer: {
    background: '#f1f5f9',
    padding: '20px',
    borderRadius: '10px',
    overflow: 'auto',
    maxHeight: '80vh'
  },
  canvas: {
    border: '2px solid #cbd5e1',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '400px',
    height: 'auto',
    display: 'block'
  },
  canvasInfo: {
    marginTop: '15px',
    padding: '10px 20px',
    background: '#e0e7ff',
    borderRadius: '8px',
    color: '#4338ca',
    fontWeight: '600'
  }
}

export default FrameDesigner
