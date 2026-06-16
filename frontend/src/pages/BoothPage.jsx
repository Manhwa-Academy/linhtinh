import { useState, useRef, useCallback, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Webcam from 'react-webcam'
import html2canvas from 'html2canvas'
import { 
  Camera, Upload, Sparkles, ArrowLeft, ArrowRight, 
  Download, RotateCcw, Heart, Star, Gift, Flower2,
  Cat, Sun, Moon, Cloud, Music, Crown, Gem, Smile,
  Snowflake, Flame, Zap, Droplet, Circle, Square, Triangle,
  Hexagon, Shield, Bookmark, Flag, MapPin, Anchor, Compass,
  Rocket, Gamepad2, Palette, Bell, Coffee, Plane, Bike, Car,
  Umbrella, Trophy, Key, Glasses
} from 'lucide-react'
import '../styles/BoothPage.css'

const stripTypes = [
  { id: 'solo', name: 'Solo Shot', description: 'One perfect moment', count: 1, icon: Camera },
  { id: 'triple', name: 'Triple Fun', description: 'Three memories in a row', count: 3, icon: Camera },
  { id: 'classic', name: 'Classic Strip', description: 'The iconic four photo strip', count: 4, icon: Camera }
]

const filters = [
  { id: 'y2k', name: 'Y2K', description: 'Glittery & futuristic', value: 'contrast(1.2) saturate(1.5) hue-rotate(330deg)', color: '#B2F5EA', icon: Sparkles },
  { id: 'vintage', name: 'Vintage', description: 'Warm & nostalgic', value: 'sepia(40%) contrast(1.1)', color: '#FEF08A', icon: Sparkles },
  { id: 'hellokitty', name: 'Hello Kitty', description: 'Sweet & dreamy', value: 'saturate(1.3) brightness(1.1) hue-rotate(320deg)', color: '#FBC2EB', icon: Sparkles },
  { id: 'bw', name: 'B&W', description: 'Timeless classic', value: 'grayscale(100%) contrast(1.2)', color: '#E2E8F0', icon: Sparkles }
]

const stickerIconsMap = {
  Heart, Star, Sparkles, Sun, Moon, Cloud, Snowflake, Flame, Zap, Droplet, 
  Circle, Square, Triangle, Hexagon, Shield, Bookmark, Flag, MapPin, Anchor, Compass,
  Cat, Gift, Flower2, Music, Crown, Gem, Smile, Rocket, Gamepad2, Palette, 
  Bell, Coffee, Camera, Plane, Bike, Car, Umbrella, Trophy, Key, Glasses
}

const stickerCategories = {
  shapes: [
    { id: 's1', type: 'icon', name: 'Heart', props: { color: '#FF6B9D', fill: '#FF6B9D' } },
    { id: 's2', type: 'icon', name: 'Star', props: { color: '#FBBF24', fill: '#FBBF24' } },
    { id: 's3', type: 'icon', name: 'Sparkles', props: { color: '#FCD34D', fill: 'none' } },
    { id: 's4', type: 'icon', name: 'Sun', props: { color: '#F59E0B', fill: '#FCD34D' } },
    { id: 's5', type: 'icon', name: 'Moon', props: { color: '#6366F1', fill: '#C7D2FE' } },
    { id: 's6', type: 'icon', name: 'Cloud', props: { color: '#60A5FA', fill: '#DBEAFE' } },
    { id: 's7', type: 'icon', name: 'Snowflake', props: { color: '#3B82F6', fill: '#93C5FD' } },
    { id: 's8', type: 'icon', name: 'Flame', props: { color: '#EF4444', fill: '#FCA5A5' } },
    { id: 's9', type: 'icon', name: 'Zap', props: { color: '#EAB308', fill: '#FEF08A' } },
    { id: 's10', type: 'icon', name: 'Droplet', props: { color: '#06B6D4', fill: '#67E8F9' } },
    { id: 's11', type: 'icon', name: 'Circle', props: { color: '#8B5CF6', fill: '#C4B5FD' } },
    { id: 's12', type: 'icon', name: 'Square', props: { color: '#10B981', fill: '#6EE7B7' } },
    { id: 's13', type: 'icon', name: 'Triangle', props: { color: '#F43F5E', fill: '#FDA4AF' } },
    { id: 's14', type: 'icon', name: 'Hexagon', props: { color: '#D946EF', fill: '#F0ABFC' } },
    { id: 's15', type: 'icon', name: 'Shield', props: { color: '#64748B', fill: '#CBD5E1' } },
    { id: 's16', type: 'icon', name: 'Bookmark', props: { color: '#EAB308', fill: '#FDE047' } },
    { id: 's17', type: 'icon', name: 'Flag', props: { color: '#EF4444', fill: '#FCA5A5' } },
    { id: 's18', type: 'icon', name: 'MapPin', props: { color: '#EF4444', fill: '#FCA5A5' } },
    { id: 's19', type: 'icon', name: 'Anchor', props: { color: '#3B82F6', fill: '#93C5FD' } },
    { id: 's20', type: 'icon', name: 'Compass', props: { color: '#8B5CF6', fill: '#C4B5FD' } },
  ],
  cute: [
    { id: 'c1', type: 'icon', name: 'Cat', props: { color: '#D97706', fill: '#FBBF24' } },
    { id: 'c2', type: 'icon', name: 'Gift', props: { color: '#EF4444', fill: '#FCA5A5' } },
    { id: 'c3', type: 'icon', name: 'Flower2', props: { color: '#EC4899', fill: '#FBCFE8' } },
    { id: 'c4', type: 'icon', name: 'Music', props: { color: '#8B5CF6', fill: '#DDD6FE' } },
    { id: 'c5', type: 'icon', name: 'Crown', props: { color: '#F59E0B', fill: '#FDE68A' } },
    { id: 'c6', type: 'icon', name: 'Gem', props: { color: '#3B82F6', fill: '#BFDBFE' } },
    { id: 'c7', type: 'icon', name: 'Smile', props: { color: '#F59E0B', fill: '#FDE68A' } },
    { id: 'c8', type: 'icon', name: 'Rocket', props: { color: '#EF4444', fill: '#FCA5A5' } },
    { id: 'c9', type: 'icon', name: 'Gamepad2', props: { color: '#8B5CF6', fill: '#C4B5FD' } },
    { id: 'c10', type: 'icon', name: 'Palette', props: { color: '#10B981', fill: '#6EE7B7' } },
    { id: 'c11', type: 'icon', name: 'Bell', props: { color: '#EAB308', fill: '#FEF08A' } },
    { id: 'c12', type: 'icon', name: 'Coffee', props: { color: '#8B5CF6', fill: '#C4B5FD' } },
    { id: 'c13', type: 'icon', name: 'Camera', props: { color: '#64748B', fill: '#CBD5E1' } },
    { id: 'c14', type: 'icon', name: 'Plane', props: { color: '#3B82F6', fill: '#93C5FD' } },
    { id: 'c15', type: 'icon', name: 'Bike', props: { color: '#F43F5E', fill: '#FDA4AF' } },
    { id: 'c16', type: 'icon', name: 'Car', props: { color: '#10B981', fill: '#6EE7B7' } },
    { id: 'c17', type: 'icon', name: 'Umbrella', props: { color: '#EC4899', fill: '#FBCFE8' } },
    { id: 'c18', type: 'icon', name: 'Trophy', props: { color: '#EAB308', fill: '#FDE047' } },
    { id: 'c19', type: 'icon', name: 'Key', props: { color: '#D946EF', fill: '#F0ABFC' } },
    { id: 'c20', type: 'icon', name: 'Glasses', props: { color: '#3B82F6', fill: '#93C5FD' } },
  ],
  text: [
    { id: 't1', type: 'text', text: 'OMG!' },
    { id: 't2', type: 'text', text: 'Cute!' },
    { id: 't3', type: 'text', text: 'You!' },
    { id: 't4', type: 'text', text: 'LOL' },
    { id: 't5', type: 'text', text: 'BFF' },
    { id: 't6', type: 'text', text: 'Smile!' },
    { id: 't7', type: 'text', text: 'Besties' },
    { id: 't8', type: 'text', text: 'Love' },
    { id: 't9', type: 'text', text: 'Cool' },
    { id: 't10', type: 'text', text: 'Fun' },
    { id: 't11', type: 'text', text: 'Sweet!' },
    { id: 't12', type: 'text', text: 'XOXO' },
    { id: 't13', type: 'text', text: 'Vibe' },
    { id: 't14', type: 'text', text: '100%' },
    { id: 't15', type: 'text', text: 'Mood' },
    { id: 't16', type: 'text', text: 'Dope' },
    { id: 't17', type: 'text', text: 'Slay' },
    { id: 't18', type: 'text', text: 'Epic' },
    { id: 't19', type: 'text', text: 'Lit' },
    { id: 't20', type: 'text', text: 'Yasss' },
  ]
}

const categoryIcons = {
  shapes: Star,
  cute: Cat,
  text: Flower2
}

const renderStickerContent = (stickerItem, size = 48) => {
  if (stickerItem.type === 'icon') {
    const IconCmp = stickerIconsMap[stickerItem.name]
    return <IconCmp size={size} {...stickerItem.props} />
  }
  return stickerItem.text
}

function BoothPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const webcamRef = useRef(null)
  const photoStripRef = useRef(null)
  const canvasRef = useRef(null)
  
  // Get current step from URL, default to 1
  const currentStep = parseInt(searchParams.get('step') || '1', 10)
  
  // Multi-step workflow states
  const [selectedStripType, setSelectedStripType] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [selectedStickers, setSelectedStickers] = useState([])
  const [stickerCategory, setStickerCategory] = useState('shapes')
  const [countdown, setCountdown] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [showFilterPicker, setShowFilterPicker] = useState(false)
  const [draggingSticker, setDraggingSticker] = useState(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0) // Ảnh đang được chọn để edit
  const fileInputRef = useRef(null)

  // Update URL when step changes
  const setCurrentStep = (step) => {
    setSearchParams({ step: step.toString() })
  }

  // Navigation
  const goToNextStep = () => {
    if (currentStep < 5) {
      if (currentStep === 3 && capturedPhotos.length === 0) {
        alert('Vui lòng chụp hoặc tải ảnh lên!')
        return
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToHome = () => {
    navigate('/')
  }

  const startOver = () => {
    setCurrentStep(1)
    setSelectedStripType(null)
    setSelectedFilter(null)
    setCapturedPhotos([])
    setSelectedStickers([])
    setShowCamera(false)
    setCountdown(null)
  }

  // Step 1: Select strip type
  const selectStripType = (type) => {
    setSelectedStripType(type)
  }

  // Step 2: Select filter
  const selectFilter = (filter) => {
    setSelectedFilter(filter)
  }

  // Step 3: Capture photos
  const startCamera = () => {
    setShowCamera(true)
    if (capturedPhotos.length < selectedStripType.count) {
      startCountdown()
    }
  }

  const capture = useCallback(() => {
    if (webcamRef.current && capturedPhotos.length < selectedStripType.count) {
      const imageSrc = webcamRef.current.getScreenshot()
      const newPhotos = [...capturedPhotos, imageSrc]
      setCapturedPhotos(newPhotos)
      
      if (newPhotos.length < selectedStripType.count) {
        startCountdown()
      } else {
        setShowCamera(false)
      }
    }
  }, [capturedPhotos, selectedStripType])

  const startCountdown = () => {
    let count = 3
    setCountdown(count)
    
    const interval = setInterval(() => {
      count--
      if (count > 0) {
        setCountdown(count)
      } else {
        setCountdown(null)
        clearInterval(interval)
        capture()
      }
    }, 1000)
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const maxPhotos = selectedStripType.count - capturedPhotos.length
    
    if (maxPhotos <= 0) {
      alert(`Bạn đã có đủ ${selectedStripType.count} ảnh!`)
      return
    }
    
    const filesToProcess = files.slice(0, maxPhotos)
    
    filesToProcess.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCapturedPhotos(prev => {
          if (prev.length < selectedStripType.count) {
            return [...prev, event.target.result]
          }
          return prev
        })
      }
      reader.readAsDataURL(file)
    })
    
    // Reset input để có thể upload lại
    e.target.value = ''
  }

  // Step 4: Add stickers
  const addSticker = (stickerItem) => {
    const newSticker = {
      id: Date.now() + Math.random(), // Ensure unique ID
      item: stickerItem,
      x: 10, // Position as percentage from left
      y: 10, // Position as percentage from top
      photoIndex: selectedPhotoIndex // Add to currently selected photo
    }
    setSelectedStickers([...selectedStickers, newSticker])
  }

  const removeSticker = (stickerId) => {
    setSelectedStickers(selectedStickers.filter(s => s.id !== stickerId))
  }

  const updateStickerPosition = (stickerId, x, y) => {
    setSelectedStickers(selectedStickers.map(sticker =>
      sticker.id === stickerId ? { ...sticker, x, y } : sticker
    ))
  }

  const handleStickerDragStart = (e, stickerId) => {
    setDraggingSticker(stickerId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleStickerDrag = (e, stickerId, containerRect) => {
    if (e.clientX === 0 && e.clientY === 0) return // Ignore final drag event
    
    // Convert pixel position to percentage
    const xPercent = Math.max(0, Math.min(((e.clientX - containerRect.left) / containerRect.width) * 100, 90))
    const yPercent = Math.max(0, Math.min(((e.clientY - containerRect.top) / containerRect.height) * 100, 90))
    
    updateStickerPosition(stickerId, xPercent, yPercent)
  }

  const handleStickerDragEnd = () => {
    setDraggingSticker(null)
  }

  // Assign sticker to specific photo when dropped
  const handleStickerDropOnPhoto = (stickerId, photoIndex) => {
    setSelectedStickers(selectedStickers.map(sticker =>
      sticker.id === stickerId ? { ...sticker, photoIndex } : sticker
    ))
  }

  // Step 5: Download - Download each photo separately
  const downloadAllPhotos = async () => {
    for (let photoIndex = 0; photoIndex < capturedPhotos.length; photoIndex++) {
      await downloadSinglePhoto(photoIndex)
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const downloadSinglePhoto = async (photoIndex) => {
    const photoElement = document.getElementById(`final-photo-${photoIndex}`)
    if (photoElement) {
      const canvas = await html2canvas(photoElement, {
        backgroundColor: null,
        scale: 2
      })
      const link = document.createElement('a')
      link.download = `meomiry-${selectedStripType.id}-photo-${photoIndex + 1}-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <div className="booth-page">
      <header className="booth-header">
        {currentStep === 1 ? (
          <Link to="/" className="back-button">
            <ArrowLeft size={18} /> Home
          </Link>
        ) : (
          <button onClick={goToPrevStep} className="back-button">
            <ArrowLeft size={18} /> Back
          </button>
        )}
        <h2 className="booth-logo">🌸 Meomiry</h2>
        
        {/* Progress Steps */}
        <div className="progress-steps">
          {['Strip', 'Filter', 'Capture', 'Decorate', 'Done!'].map((step, index) => (
            <div 
              key={index} 
              className={`step ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}
              onClick={() => {
                if (index + 1 <= currentStep) {
                  setCurrentStep(index + 1)
                }
              }}
              style={{ cursor: index + 1 <= currentStep ? 'pointer' : 'default' }}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="booth-container">
        {/* STEP 1: Choose Strip Type */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2 className="step-title">Choose Your Strip</h2>
            <p className="step-subtitle">How many photos do you want?</p>
            
            <div className="strip-types-grid">
              {stripTypes.map(type => {
                const IconComponent = type.icon
                return (
                  <div
                    key={type.id}
                    className={`strip-type-card ${selectedStripType?.id === type.id ? 'selected' : ''}`}
                    onClick={() => selectStripType(type)}
                  >
                    <div className="strip-icon">
                      {Array.from({ length: type.count }).map((_, i) => (
                        <span key={i} className="photo-placeholder">
                          <IconComponent size={24} strokeWidth={2} />
                        </span>
                      ))}
                    </div>
                    <h3>{type.name}</h3>
                    <p>{type.description}</p>
                  </div>
                )
              })}
            </div>

            <button 
              className="next-button" 
              onClick={goToNextStep}
              disabled={!selectedStripType}
            >
              Next <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: Pick Filter */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2 className="step-title">Pick a Filter</h2>
            <p className="step-subtitle">Set the vibe for your photos</p>
            
            <div className="filters-grid-new">
              {filters.map(filter => {
                const IconComponent = filter.icon
                return (
                  <div
                    key={filter.id}
                    className={`filter-card ${selectedFilter?.id === filter.id ? 'selected' : ''}`}
                    onClick={() => selectFilter(filter)}
                    style={{ backgroundColor: filter.color }}
                  >
                    <div className="filter-icon">
                      <IconComponent size={36} strokeWidth={2} />
                    </div>
                    <h3>{filter.name}</h3>
                    <p>{filter.description}</p>
                  </div>
                )
              })}
            </div>

            <div className="step-buttons">
              <button className="back-button-step" onClick={goToPrevStep}>
                <ArrowLeft size={18} /> Back
              </button>
              <button 
                className="next-button" 
                onClick={goToNextStep}
                disabled={!selectedFilter}
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Capture Photos */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2 className="step-title">Capture Your Moments</h2>
            <p className="step-subtitle">
              {capturedPhotos.length > 0 
                ? `${capturedPhotos.length}/${selectedStripType.count} photos captured`
                : `Need ${selectedStripType.count} photo${selectedStripType.count > 1 ? 's' : ''}`
              }
            </p>

            {/* Hidden file input - dùng chung cho tất cả */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />

            <div className="capture-area">
              {countdown && (
                <div className="countdown-overlay">
                  <div className="countdown-number">{countdown}</div>
                </div>
              )}

              {showCamera && capturedPhotos.length < selectedStripType.count ? (
                <div className="webcam-wrapper" style={{ filter: selectedFilter.value }}>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/png"
                    videoConstraints={{
                      width: 640,
                      height: 480,
                      facingMode: "user"
                    }}
                    className="webcam"
                  />
                </div>
              ) : capturedPhotos.length === 0 ? (
                <div className="capture-placeholder">
                  <div className="camera-icon">
                    <Camera size={64} strokeWidth={1.5} />
                  </div>
                  <p>Start camera or upload photos</p>
                  <div className="capture-buttons">
                    <button className="control-btn" onClick={startCamera}>
                      <Camera size={20} /> Start Camera
                    </button>
                    <button className="control-btn" onClick={() => fileInputRef.current?.click()}>
                      <Upload size={20} /> Upload ({selectedStripType.count} photos)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="captured-preview">
                  {capturedPhotos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Captured ${index + 1}`}
                      style={{ filter: selectedFilter.value }}
                      className="preview-photo"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="step-buttons">
              <button className="back-button-step" onClick={goToPrevStep}>
                <ArrowLeft size={18} /> Back
              </button>
              
              {/* Nút Add More khi chưa đủ ảnh */}
              {capturedPhotos.length > 0 && capturedPhotos.length < selectedStripType.count && (
                <button className="control-btn add-more-btn" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={20} /> Add More ({selectedStripType.count - capturedPhotos.length} left)
                </button>
              )}
              
              {/* Nút Next khi đã đủ ảnh */}
              {capturedPhotos.length === selectedStripType.count && (
                <button className="next-button" onClick={goToNextStep}>
                  Add Stickers <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Add Stickers */}
        {currentStep === 4 && (
          <div className="step-content">
            <div className="step-header-with-filter">
              <div>
                <h2 className="step-title">Add Cute Stickers</h2>
                <p className="step-subtitle">Click stickers to add them to your photos</p>
              </div>
              
              {/* Filter selector button */}
              <div className="current-filter-display">
                <button 
                  className="filter-change-btn"
                  onClick={() => setShowFilterPicker(!showFilterPicker)}
                >
                  <Sparkles size={18} className="filter-icon-small" />
                  <span className="filter-name">{selectedFilter.name}</span>
                  <span className="dropdown-icon">{showFilterPicker ? '▲' : '▼'}</span>
                </button>
                
                {/* Filter picker dropdown */}
                {showFilterPicker && (
                  <div className="filter-picker-dropdown">
                    <h4>Choose Filter</h4>
                    <div className="mini-filters-grid">
                      {filters.map(filter => {
                        const IconComponent = filter.icon
                        return (
                          <button
                            key={filter.id}
                            className={`mini-filter-card ${selectedFilter.id === filter.id ? 'selected' : ''}`}
                            onClick={() => {
                              selectFilter(filter)
                              setShowFilterPicker(false)
                            }}
                            style={{ backgroundColor: filter.color }}
                          >
                            <IconComponent size={28} className="mini-filter-icon" />
                            <span className="mini-filter-name">{filter.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sticker-editor">
              {/* Photo thumbnails selector */}
              <div className="photo-thumbnails">
                {capturedPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedPhotoIndex === index ? 'selected' : ''}`}
                    onClick={() => setSelectedPhotoIndex(index)}
                  >
                    <img src={photo} alt={`Thumbnail ${index + 1}`} style={{ filter: selectedFilter.value }} />
                    <span className="thumbnail-badge">{selectedStickers.filter(s => s.photoIndex === index).length}</span>
                  </div>
                ))}
              </div>

              {/* Preview ảnh đang được chọn với stickers */}
              <div className="selected-photo-preview">
                <div className="photo-item-with-stickers" id={`photo-container-edit`}>
                  <img
                    src={capturedPhotos[selectedPhotoIndex]}
                    alt={`Photo ${selectedPhotoIndex + 1}`}
                    style={{ filter: selectedFilter.value }}
                    className="photo-base"
                  />
                  {/* Hiển thị stickers chỉ cho ảnh đang chọn */}
                  <div className="stickers-on-photo">
                    {selectedStickers
                      .filter(sticker => sticker.photoIndex === selectedPhotoIndex)
                      .map((sticker) => {
                        const isTextBubble = sticker.item.type === 'text'
                        return (
                          <span
                            key={sticker.id}
                            className={`sticker-on-photo ${isTextBubble ? 'text-bubble-on-photo' : 'emoji-on-photo'} ${draggingSticker === sticker.id ? 'dragging' : ''}`}
                            style={{
                              left: `${sticker.x}%`,
                              top: `${sticker.y}%`,
                              position: 'absolute'
                            }}
                            draggable
                            onDragStart={(e) => handleStickerDragStart(e, sticker.id)}
                            onDrag={(e) => {
                              const container = document.getElementById(`photo-container-edit`)
                              if (container) {
                                handleStickerDrag(e, sticker.id, container.getBoundingClientRect())
                              }
                            }}
                            onDragEnd={() => {
                              handleStickerDragEnd()
                              handleStickerDropOnPhoto(sticker.id, selectedPhotoIndex)
                            }}
                            onDoubleClick={() => removeSticker(sticker.id)}
                            title="Drag to move, double-click to remove"
                          >
                            {renderStickerContent(sticker.item, 48)}
                          </span>
                        )
                      })}
                  </div>
                </div>
                
                {selectedStickers.filter(s => s.photoIndex === selectedPhotoIndex).length > 0 && (
                  <p className="sticker-hint">💡 Drag stickers to move, double-click to remove</p>
                )}
              </div>

              {/* Sticker Picker */}
              <div className="sticker-picker">
                <h3 className="picker-title">Choose Stickers</h3>
                <div className="sticker-categories">
                  {Object.keys(stickerCategories).map(category => {
                    const IconComponent = categoryIcons[category]
                    return (
                      <button
                        key={category}
                        className={`category-btn ${stickerCategory === category ? 'active' : ''}`}
                        onClick={() => setStickerCategory(category)}
                      >
                        <IconComponent size={18} />
                        {' '}
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    )
                  })}
                </div>
                <div className="stickers-grid">
                  {stickerCategories[stickerCategory].map((stickerItem, index) => {
                    const isTextBubble = stickerItem.type === 'text'
                    return (
                      <button
                        key={index}
                        className={`sticker-btn ${isTextBubble ? 'text-bubble' : ''}`}
                        onClick={() => addSticker(stickerItem)}
                        title="Click to add"
                      >
                        {renderStickerContent(stickerItem, 32)}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="step-buttons">
              <button className="back-button-step" onClick={goToPrevStep}>
                <ArrowLeft size={18} /> Back
              </button>
              <button className="next-button create-btn" onClick={goToNextStep}>
                Create Strip <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Done - Download */}
        {currentStep === 5 && (
          <div className="step-content">
            <h2 className="step-title">Your Photo Strip</h2>
            <p className="step-subtitle">Looking amazing! Save your creation</p>

            <div className="final-result" ref={photoStripRef}>
              <div className="strip-header-final">
                <h3>🌸 Meomiry</h3>
              </div>
              <div className={`final-photos final-photos-${selectedStripType.count}`}>
                {capturedPhotos.map((photo, index) => (
                  <div key={index} className="final-photo" id={`final-photo-${index}`}>
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      style={{ filter: selectedFilter.value }}
                    />
                    {/* Stickers overlay with positions - chỉ hiển thị stickers của ảnh này */}
                    <div className="final-stickers-layer">
                      {selectedStickers
                        .filter(sticker => sticker.photoIndex === index)
                        .map((sticker) => {
                          const isTextBubble = sticker.item.type === 'text'
                          return (
                            <div 
                              key={sticker.id}
                              className={`final-sticker ${isTextBubble ? 'final-text-bubble' : 'final-emoji'}`}
                              style={{
                                position: 'absolute',
                                left: `${sticker.x}%`,
                                top: `${sticker.y}%`
                              }}
                            >
                              {renderStickerContent(sticker.item, 48)}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="strip-footer-final">
                <p>{new Date().toLocaleDateString('vi-VN')}</p>
              </div>
            </div>

            <div className="step-buttons">
              <button className="control-btn start-over-btn" onClick={startOver}>
                <RotateCcw size={20} /> Tạo Lại
              </button>
              <button className="control-btn download-btn-final" onClick={downloadAllPhotos}>
                <Download size={20} /> Tải Xuống
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BoothPage
