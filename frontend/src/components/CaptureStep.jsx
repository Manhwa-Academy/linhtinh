import { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Camera, Upload, RotateCcw, X } from 'lucide-react'
import { frameImageUrl } from '../config/api'
import '../styles/CaptureStep.css'

function CaptureStep({
  stripType,
  frame,
  filter,
  capturedPhotos,
  onPhotosChange,
  onContinue,
  onBack
}) {
  const webcamRef = useRef(null)
  const fileInputRef = useRef(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)

  const currentPhotoIndex = capturedPhotos.length
  const totalPhotos = stripType.count
  const allCaptured = capturedPhotos.length === totalPhotos

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const video = webcamRef.current.video
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        const videoWidth = video.videoWidth || 1920
        const videoHeight = video.videoHeight || 1080
        
        // Calculate square crop (center crop)
        const size = Math.min(videoWidth, videoHeight)
        const offsetX = (videoWidth - size) / 2
        const offsetY = (videoHeight - size) / 2
        
        // Create square canvas
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        
        const ctx = canvas.getContext('2d', { 
          alpha: false,
          willReadFrequently: false
        })
        
        if (ctx) {
          // Enable high quality rendering
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          
          // Draw cropped video frame (center square crop)
          ctx.drawImage(
            video,
            offsetX, offsetY, size, size,  // Source: center square from video
            0, 0, size, size                // Destination: full canvas
          )
          
          // Apply beauty filter (smooth skin, remove blemishes)
          applyBeautyFilter(ctx, size, size)
          
          // Get high-quality JPEG
          const imageSrc = canvas.toDataURL('image/jpeg', 0.95)
          
          if (imageSrc && imageSrc.length > 100) {
            setIsCapturing(true)
            onPhotosChange(prev => {
              const newPhotos = [...prev, imageSrc]
              return newPhotos
            })
            
            // Brief flash effect then ready for next photo
            setTimeout(() => {
              setIsCapturing(false)
            }, 300)
          }
        }
      }
    }
  }, [onPhotosChange])

  // Beauty filter: smooth skin, remove blemishes, and enhance photo
  const applyBeautyFilter = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // Step 1: Aggressive skin smoothing
    const tempData = new Uint8ClampedArray(data)
    const radius = 5 // Increased blur radius for stronger smoothing
    
    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        const idx = (y * width + x) * 4
        
        let r = 0, g = 0, b = 0, count = 0
        
        // Gaussian-like weighted blur
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance <= radius) {
              const weight = Math.exp(-(distance * distance) / (2 * radius))
              const newIdx = ((y + dy) * width + (x + dx)) * 4
              r += tempData[newIdx] * weight
              g += tempData[newIdx + 1] * weight
              b += tempData[newIdx + 2] * weight
              count += weight
            }
          }
        }
        
        // Strong blend (70% smooth, 30% original) for heavy blemish removal
        const blurR = r / count
        const blurG = g / count
        const blurB = b / count
        
        data[idx] = Math.floor(tempData[idx] * 0.3 + blurR * 0.7)
        data[idx + 1] = Math.floor(tempData[idx + 1] * 0.3 + blurG * 0.7)
        data[idx + 2] = Math.floor(tempData[idx + 2] * 0.3 + blurB * 0.7)
      }
    }
    
    // Step 2: Sharpen edges to maintain detail
    const sharpenData = new Uint8ClampedArray(data)
    const sharpenKernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ]
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4
        let r = 0, g = 0, b = 0
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const kidx = sharpenKernel[(ky + 1) * 3 + (kx + 1)]
            const pixelIdx = ((y + ky) * width + (x + kx)) * 4
            r += sharpenData[pixelIdx] * kidx
            g += sharpenData[pixelIdx + 1] * kidx
            b += sharpenData[pixelIdx + 2] * kidx
          }
        }
        
        data[idx] = Math.max(0, Math.min(255, r))
        data[idx + 1] = Math.max(0, Math.min(255, g))
        data[idx + 2] = Math.max(0, Math.min(255, b))
      }
    }
    
    // Step 3: Brightness and contrast enhancement
    const contrast = 1.15 // Increase contrast
    const brightness = 5  // Slight brightness boost
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, (data[i] - 128) * contrast + 128 + brightness))
      data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] - 128) * contrast + 128 + brightness))
      data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] - 128) * contrast + 128 + brightness))
    }
    
    ctx.putImageData(imageData, 0, 0)
  }

  const handleCaptureClick = () => {
    if (!showCamera) {
      setShowCamera(true)
      // Small delay to let camera initialize
      setTimeout(() => {
        setIsCapturing(false)
      }, 500)
    } else if (!isCapturing) {
      // Instant capture - no countdown
      capture()
    }
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    const maxPhotos = totalPhotos - capturedPhotos.length
    
    if (maxPhotos <= 0) {
      alert(`You already have ${totalPhotos} photos!`)
      return
    }
    
    const filesToProcess = files.slice(0, maxPhotos)
    
    let newPhotos = [...capturedPhotos]
    
    // Process each file
    for (const file of filesToProcess) {
      const reader = new FileReader()
      const imageSrc = await new Promise((resolve) => {
        reader.onload = (event) => resolve(event.target.result)
        reader.readAsDataURL(file)
      })
      
      newPhotos.push(imageSrc)
    }
    
    onPhotosChange(newPhotos)
    e.target.value = ''
  }

  const removePhoto = (index) => {
    const newPhotos = capturedPhotos.filter((_, i) => i !== index)
    onPhotosChange(newPhotos)
  }

  const retakeAll = () => {
    onPhotosChange([])
    setShowCamera(false)
  }

  return (
    <div className="capture-step">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      <div className="capture-layout">
        {/* Left side - Camera/Preview */}
        <div className="capture-main">
          <h2 className="capture-counter">
            Photo {Math.min(currentPhotoIndex + 1, totalPhotos)} of {totalPhotos}
          </h2>

          <div className="camera-container">
            {isCapturing && (
              <div className="countdown-overlay">
                <div className="capture-flash">📸</div>
              </div>
            )}

            {allCaptured && (
              <div className="all-captured-message">
                <div className="success-icon">✨</div>
                <h3>All photos captured!</h3>
              </div>
            )}

            {showCamera && !allCaptured ? (
              <div className="webcam-wrapper" style={{ filter: filter?.value }}>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.95}
                  videoConstraints={{
                    width: { min: 1280, ideal: 1920, max: 3840 },
                    height: { min: 720, ideal: 1080, max: 2160 },
                    aspectRatio: { ideal: 16/9 },
                    facingMode: "user",
                    frameRate: { ideal: 30 }
                  }}
                  className="webcam"
                />
              </div>
            ) : !allCaptured ? (
              <div className="camera-placeholder">
                <Camera size={80} strokeWidth={1.5} />
                <p>Ready to capture memories?</p>
              </div>
            ) : (
              <div className="preview-last-photo" style={{ filter: filter?.value }}>
                <img 
                  src={capturedPhotos[capturedPhotos.length - 1]} 
                  alt="Last captured"
                />
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="camera-controls">
            <button 
              className="control-btn-icon"
              onClick={() => fileInputRef.current?.click()}
              title="Upload photos"
            >
              <Upload size={24} />
            </button>

            <button 
              className={`capture-btn ${isCapturing ? 'capturing' : ''}`}
              onClick={handleCaptureClick}
              disabled={allCaptured || isCapturing}
            >
              <div className="capture-btn-inner">
                <Camera size={28} />
              </div>
            </button>

            <button 
              className="control-btn-icon"
              onClick={retakeAll}
              title="Retake all"
              disabled={capturedPhotos.length === 0}
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        {/* Right side - Captured photos sidebar */}
        <div className="captured-sidebar">
          <h3 className="sidebar-title">CAPTURED</h3>
          <div className="captured-grid">
            {capturedPhotos.map((photo, index) => (
              <div key={index} className="captured-thumb">
                <img 
                  src={photo} 
                  alt={`Captured ${index + 1}`}
                  style={{ filter: filter?.value }}
                />
                <button 
                  className="remove-photo-btn"
                  onClick={() => removePhoto(index)}
                  title="Remove"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: totalPhotos - capturedPhotos.length }).map((_, i) => (
              <div key={`empty-${i}`} className="empty-thumb">
                <Camera size={24} strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="capture-actions">
        <button className="back-btn-capture" onClick={onBack}>
          ← Back
        </button>
        
        {allCaptured && (
          <button className="continue-btn-capture" onClick={onContinue}>
            Edit Photos →
          </button>
        )}
      </div>
    </div>
  )
}

export default CaptureStep
