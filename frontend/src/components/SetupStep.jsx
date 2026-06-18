import { Camera } from 'lucide-react'
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
  // Generate preview based on selected options
  const renderPreview = () => {
    if (!selectedStripType) {
      return (
        <div className="preview-placeholder">
          <Camera size={64} strokeWidth={1} />
          <p>Select a strip type to see preview</p>
        </div>
      )
    }

    const slotCount = selectedStripType.count
    const frameStyle = selectedFrame?.bgGradient 
      ? { background: selectedFrame.bgGradient }
      : { background: 'linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)' }

    return (
      <div className="preview-strip" style={frameStyle}>
        {Array.from({ length: slotCount }).map((_, i) => (
          <div key={i} className="preview-slot">
            <Camera size={32} strokeWidth={1.5} />
          </div>
        ))}
        <div className="preview-label">{selectedStripType.name}</div>
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
            <h3 className="section-title">Photo Strips</h3>
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
                    <h4>{type.name}</h4>
                    <p>{type.count} photos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="option-section">
            <h3 className="section-title">Frames</h3>
            <div className="frames-grid-compact">
              {frames.map(frame => (
                <div
                  key={frame.id}
                  className={`frame-option ${selectedFrame?.id === frame.id ? 'selected' : ''}`}
                  onClick={() => onSelectFrame(frame)}
                  style={{ background: frame.bgGradient || frame.color }}
                >
                  {frame.emoji && <span className="frame-emoji-mini">{frame.emoji}</span>}
                  {frame.frameImage && (
                    <img 
                      src={frame.frameImage} 
                      alt={frame.name}
                      className="frame-img-mini"
                    />
                  )}
                  <span className="frame-name-mini">{frame.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="option-section">
            <h3 className="section-title">Filters</h3>
            <div className="filters-grid-compact">
              {filters.map(filter => (
                <div
                  key={filter.id}
                  className={`filter-option ${selectedFilter?.id === filter.id ? 'selected' : ''}`}
                  onClick={() => onSelectFilter(filter)}
                >
                  <div className="filter-preview" style={{ backgroundColor: filter.color }}>
                    {filter.name[0]}
                  </div>
                  <span className="filter-name-mini">{filter.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="setup-preview">
          <h3 className="preview-title">Preview</h3>
          {renderPreview()}
          
          {selectedFilter && (
            <div className="selected-filter-badge">
              Filter: {selectedFilter.name}
            </div>
          )}
        </div>
      </div>

      <button 
        className="continue-btn" 
        onClick={onContinue}
        disabled={!canContinue}
      >
        Continue →
      </button>
    </div>
  )
}

export default SetupStep
