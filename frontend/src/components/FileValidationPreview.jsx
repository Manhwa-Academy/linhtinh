import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, AlertTriangle, Image as ImageIcon } from 'lucide-react'
import { validateFrame, formatFileSize } from '../utils/frameValidation'

/**
 * FileValidationPreview Component
 * Shows real-time validation feedback for frame image uploads
 */
function FileValidationPreview({ file, photoSlots = [], onValidationChange }) {
  const [validation, setValidation] = useState(null)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (!file) {
      setValidation(null)
      return
    }

    const runValidation = async () => {
      setIsValidating(true)
      try {
        const result = await validateFrame(file, photoSlots)
        setValidation(result)
        
        // Notify parent component of validation result
        if (onValidationChange) {
          onValidationChange(result)
        }
      } catch (error) {
        console.error('Validation error:', error)
        setValidation({
          valid: false,
          errors: ['Lỗi khi kiểm tra file: ' + error.message],
          warnings: []
        })
      } finally {
        setIsValidating(false)
      }
    }

    runValidation()
  }, [file, photoSlots, onValidationChange])

  if (!file) return null

  if (isValidating) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <span style={styles.loadingText}>Đang kiểm tra file...</span>
        </div>
      </div>
    )
  }

  if (!validation) return null

  const hasErrors = validation.errors && validation.errors.length > 0
  const hasWarnings = validation.warnings && validation.warnings.length > 0

  return (
    <div style={styles.container}>
      {/* File Info */}
      <div style={styles.fileInfo}>
        <ImageIcon size={20} style={styles.fileIcon} />
        <div style={styles.fileDetails}>
          <div style={styles.fileName}>{file.name}</div>
          <div style={styles.fileSize}>{formatFileSize(file.size)}</div>
        </div>
        {validation.valid && !hasWarnings && (
          <CheckCircle size={24} style={styles.successIcon} />
        )}
        {validation.valid && hasWarnings && (
          <AlertTriangle size={24} style={styles.warningIcon} />
        )}
        {!validation.valid && (
          <AlertCircle size={24} style={styles.errorIcon} />
        )}
      </div>

      {/* Dimensions Info */}
      {validation.dimensions && (
        <div style={styles.dimensionsInfo}>
          <span style={styles.dimensionsLabel}>Kích thước:</span>
          <span style={styles.dimensionsValue}>
            {validation.dimensions.width} × {validation.dimensions.height} px
          </span>
        </div>
      )}

      {/* Errors */}
      {hasErrors && (
        <div style={styles.errorsContainer}>
          {validation.errors.map((error, index) => (
            <div key={index} style={styles.errorItem}>
              <AlertCircle size={16} style={styles.errorItemIcon} />
              <span style={styles.errorText}>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Warnings */}
      {hasWarnings && (
        <div style={styles.warningsContainer}>
          {validation.warnings.map((warning, index) => (
            <div key={index} style={styles.warningItem}>
              <AlertTriangle size={16} style={styles.warningItemIcon} />
              <span style={styles.warningText}>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Success Message */}
      {validation.valid && !hasWarnings && (
        <div style={styles.successContainer}>
          <CheckCircle size={16} style={styles.successItemIcon} />
          <span style={styles.successText}>File hợp lệ và sẵn sàng upload!</span>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    marginTop: '12px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#64748b'
  },
  
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #e2e8f0',
    borderTop: '2px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  
  loadingText: {
    fontSize: '0.9rem'
  },
  
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  
  fileIcon: {
    color: '#64748b',
    flexShrink: 0
  },
  
  fileDetails: {
    flex: 1,
    minWidth: 0
  },
  
  fileName: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#1e293b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  
  fileSize: {
    fontSize: '0.85rem',
    color: '#64748b',
    marginTop: '2px'
  },
  
  successIcon: {
    color: '#10b981',
    flexShrink: 0
  },
  
  warningIcon: {
    color: '#f59e0b',
    flexShrink: 0
  },
  
  errorIcon: {
    color: '#ef4444',
    flexShrink: 0
  },
  
  dimensionsInfo: {
    display: 'flex',
    gap: '8px',
    fontSize: '0.9rem',
    marginBottom: '12px',
    padding: '8px',
    background: 'white',
    borderRadius: '6px'
  },
  
  dimensionsLabel: {
    color: '#64748b',
    fontWeight: '500'
  },
  
  dimensionsValue: {
    color: '#1e293b',
    fontWeight: '600'
  },
  
  errorsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  
  errorItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '10px',
    background: '#fee2e2',
    borderRadius: '6px',
    border: '1px solid #fecaca'
  },
  
  errorItemIcon: {
    color: '#ef4444',
    flexShrink: 0,
    marginTop: '2px'
  },
  
  errorText: {
    fontSize: '0.875rem',
    color: '#991b1b',
    flex: 1
  },
  
  warningsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px'
  },
  
  warningItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '10px',
    background: '#fef3c7',
    borderRadius: '6px',
    border: '1px solid #fde68a'
  },
  
  warningItemIcon: {
    color: '#f59e0b',
    flexShrink: 0,
    marginTop: '2px'
  },
  
  warningText: {
    fontSize: '0.875rem',
    color: '#78350f',
    flex: 1
  },
  
  successContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    background: '#d1fae5',
    borderRadius: '6px',
    border: '1px solid #a7f3d0'
  },
  
  successItemIcon: {
    color: '#10b981',
    flexShrink: 0
  },
  
  successText: {
    fontSize: '0.875rem',
    color: '#065f46',
    fontWeight: '500'
  }
}

// Add CSS animation for spinner
const styleSheet = document.createElement('style')
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
document.head.appendChild(styleSheet)

export default FileValidationPreview
