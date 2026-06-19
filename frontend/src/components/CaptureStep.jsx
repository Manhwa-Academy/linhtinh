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
  const [countdown, setCountdown] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const currentPhotoIndex = capturedPhotos.length
  const totalPhotos = stripType.count
  const allCaptured = capturedPhotos.length === totalPhotos

  const capture = useCallback(async () => {
    if (webcamRef.current && capturedPhotos.length < totalPhotos) {
      const imageSrc = webcamRef.current.getScreenshot()
      onPhotosChange([...capturedPhotos, imageSrc])
      
      // Auto continue countdown if more photos needed
      if (capturedPhotos.length + 1 < totalPhotos) {
        setTimeout(() => startCountdown(), 800)
      }
    }
  }, [capturedPhotos, totalPhotos, onPhotosChange])

  const startCountdown = () => {
    setIsCapturing(true)
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
        setIsCapturing(false)
      }
    }, 1000)
  }

  const handleCaptureClick = () => {
    if (!showCamera) {
      setShowCamera(true)
      setTimeout(() => startCountdown(), 500)
    } else if (!isCapturing) {
      startCountdown()
    }
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    const maxPhotos = totalPhotos - capturedPhotos.length
    
    if (maxPhotos <= 0) {
      alert(`Bạn đã có đủ ${totalPhotos} ảnh!`)
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
            {countdown && (
              <div className="countdown-overlay">
                <div className="countdown-number">{countdown}</div>
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
                  screenshotFormat="image/png"
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "user"
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
