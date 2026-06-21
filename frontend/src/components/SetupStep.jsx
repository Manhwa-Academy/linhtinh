import { Camera, ChevronDown } from 'lucide-react'
import { frameImageUrl } from '../config/api'
import { useTranslation } from '../i18n/useTranslation'
import '../styles/SetupStep.css'

function SetupStep({ 
  stripTypes, 
  frames, 
  filters, 
  selectedStripType, 
  selectedFrame, 
  selectedFilter,
  onSelectStripType,
  onSelectFrame,
  onSelectFilter,
  onContinue
}) {
  const { t } = useTranslation()
  // Filter out private frames for normal users - safely handle undefined
  const publicFrames = (frames || []).filter(frame => !frame.isPrivate)
  
  // Translate strip types
  const getStripTypeName = (type) => {
    return t.booth.stripTypes[type.id]?.name || type.name
  }
  
  const getStripTypeDescription = (type) => {
    return `${type.count} ${t.booth.setup.photos}`
  }
  
  // Translate filters
  const getFilterName = (filter) => {
    return t.booth.filters[filter.id]?.name || filter.name
  }
  
  // Generate preview based on selected options
  const renderPreview = () => {
    if (!selectedStripType) {
      return (
        <div className="preview-placeholder">
          <Camera size={40} strokeWidth={1} />
          <p>{t.booth.setup.selectStripPlaceholder}</p>
        </div>
      )
    }

    const slotCount = selectedStripType.count
    const isGridLayout = selectedStripType.layout === 'grid'
    
    // Check if frame has image
    const hasFrameImage = selectedFrame?.frameImage
    
    if (hasFrameImage) {
      // Frame with image - show only frame, hide slots
      return (
        <div className="preview-strip-with-image">
          <div className="preview-image-container">
            {/* Frame image only */}
            <img 
              src={frameImageUrl(selectedFrame.frameImage)} 
              alt={selectedFrame.name}
              className="preview-frame-img"
            />
          </div>
          <div className="preview-label">{selectedStripType.name}</div>
        </div>
      )
    }

    // Regular gradient frame
    const frameStyle = selectedFrame?.bgGradient 
      ? { background: selectedFrame.bgGradient }
      : { background: 'linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)' }

    return (
      <div className="preview-strip" style={frameStyle}>
        <div className="preview-slots-container ${isGridLayout ? 'grid-layout' : 'vertical-layout'}`}>
          {Array.from({ length: slotCount }).map((_, i) => (
            <div key={i} className="preview-slot">
              <Camera size={isGridLayout ? 18 : 20} strokeWidth={1.5} />
            </div>
          ))}
        </div>
        <div className="preview-label">{getStripTypeName(selectedStripType)}</div>
      </div>
    )
  }

  const canContinue = selectedStripType && selectedFrame && selectedFilter

  return (
    <div className="setup-step">
      <div className="setup-content">
        {/* Left: Options */}
        <div className="setup-options">
          <div className="option-section">
            <h3 className="section-title">{t.booth.setup.photoStrips}</h3>
            <div className="strips-grid">
              {stripTypes.map(type => (
                <div
                  key={type.id}
                  className={`strip-option ${selectedStripType?.id === type.id ? 'selected' : ''}`}
                  onClick={() => onSelectStripType(type)}
                >
                  <div className="strip-icon-mini">
                    {Array.from({ length: type.count }).map((_, i) => (
                      <div key={i} className="mini-slot" />
                    ))}
                  </div>
                  <div className="strip-info">
                    <h4>{getStripTypeName(type)}</h4>
                    <p>{getStripTypeDescription(type)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frame selector with icon */}
          <div className="option-section">
            <h3 className="section-title">{t.booth.setup.frame}</h3>
            <div className="custom-select-wrapper">
              <select 
                className="custom-select"
                value={selectedFrame?.id || ''}
                onChange={(e) => {
                  const frame = publicFrames.find(f => f.id === e.target.value)
                  onSelectFrame(frame)
                }}
              >
                <option value="">{t.booth.setup.selectFrame}</option>
                {publicFrames.map(frame => (
                  <option key={frame.id} value={frame.id}>
                    {frame.emoji ? `${frame.emoji} ` : ''}{frame.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" size={18} />
            </div>
            {selectedFrame && (
              <div className="selected-display">
                {selectedFrame.frameImage ? (
                  <img 
                    src={frameImageUrl(selectedFrame.frameImage)} 
                    alt={selectedFrame.name}
                    className="selected-frame-img"
                  />
                ) : (
                  <span className="selected-emoji">{selectedFrame.emoji}</span>
                )}
                <span className="selected-name">{selectedFrame.name}</span>
              </div>
            )}
          </div>

          {/* Filter selector with icon */}
          <div className="option-section">
            <h3 className="section-title">{t.booth.setup.filter}</h3>
            <div className="custom-select-wrapper">
              <select 
                className="custom-select"
                value={selectedFilter?.id || ''}
                onChange={(e) => {
                  const filter = filters.find(f => f.id === e.target.value)
                  onSelectFilter(filter)
                }}
              >
                <option value="">{t.booth.setup.selectFilter}</option>
                {filters.map(filter => (
                  <option key={filter.id} value={filter.id}>
                    {getFilterName(filter)}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" size={18} />
            </div>
            {selectedFilter && (
              <div className="selected-display">
                <div 
                  className="selected-color-dot" 
                  style={{ backgroundColor: selectedFilter.color }}
                />
                <span className="selected-name">{getFilterName(selectedFilter)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview only */}
        <div className="setup-preview">
          <h3 className="preview-title">{t.booth.setup.preview}</h3>
          {renderPreview()}
        </div>
      </div>

      <button 
        className="continue-btn" 
        onClick={onContinue}
        disabled={!canContinue}
      >
        {t.booth.setup.continue}
      </button>
    </div>
  )
}

export default SetupStep
