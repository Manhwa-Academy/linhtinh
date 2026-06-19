/**
 * Client-side Frame Validation Utilities
 * Pre-upload validation to provide immediate feedback to users
 */

// Validation configuration (matching backend)
const VALIDATION_CONFIG = {
  maxFileSizeMB: 5,
  maxFileSizeBytes: 5 * 1024 * 1024,
  safeZoneMarginPercent: 5,
  allowedFormats: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
  recommendedFormats: {
    transparent: ['image/png', 'image/webp'],
    opaque: ['image/jpeg', 'image/jpg']
  }
}

const FRAME_STANDARDS = {
  2: { width: 1080, height: 1620, name: '2-slot' },
  4: { width: 1080, height: 2160, name: '4-slot' },
  6: { width: 1080, height: 2700, name: '6-slot' }
}

/**
 * Validate file size
 * @param {File} file - The file to validate
 * @returns {Object} { valid: boolean, error?: string, sizeMB: number }
 */
export function validateFileSize(file) {
  const sizeMB = file.size / (1024 * 1024)
  
  if (file.size > VALIDATION_CONFIG.maxFileSizeBytes) {
    return {
      valid: false,
      error: `File quá lớn: ${sizeMB.toFixed(2)}MB. Tối đa: ${VALIDATION_CONFIG.maxFileSizeMB}MB`,
      sizeMB: sizeMB.toFixed(2)
    }
  }
  
  return {
    valid: true,
    sizeMB: sizeMB.toFixed(2)
  }
}

/**
 * Validate file format
 * @param {File} file - The file to validate
 * @returns {Object} { valid: boolean, error?: string, warnings: string[] }
 */
export function validateFileFormat(file) {
  const warnings = []
  
  // Check if format is allowed
  if (!VALIDATION_CONFIG.allowedFormats.includes(file.type)) {
    return {
      valid: false,
      error: 'Định dạng file không hợp lệ. Chỉ chấp nhận PNG, JPEG, JPG, WebP, hoặc GIF',
      warnings
    }
  }
  
  // Add warnings for non-transparent formats
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    warnings.push('⚠️ JPEG không hỗ trợ nền trong suốt. Nên dùng PNG để có nền trong suốt')
  }
  
  // Add info for PNG
  if (file.type === 'image/png') {
    warnings.push('✅ PNG được phát hiện. Đảm bảo nền trong suốt để có kết quả tốt nhất')
  }
  
  return {
    valid: true,
    warnings
  }
}

/**
 * Extract image dimensions from file
 * @param {File} file - The image file
 * @returns {Promise<Object>} { width: number, height: number }
 */
export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        })
      }
      
      img.onerror = () => {
        reject(new Error('Không thể đọc kích thước ảnh'))
      }
      
      img.src = e.target.result
    }
    
    reader.onerror = () => {
      reject(new Error('Không thể đọc file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Validate frame dimensions against standard
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} slotCount - Number of photo slots (2, 4, or 6)
 * @returns {Object} { valid: boolean, error?: string, warnings: string[], expectedDimensions?: Object }
 */
export function validateDimensions(width, height, slotCount) {
  const warnings = []
  
  // Check if slot count is valid
  if (!FRAME_STANDARDS[slotCount]) {
    return {
      valid: false,
      error: `Số lượng ô ảnh không hợp lệ: ${slotCount}. Chỉ hỗ trợ 2, 4, hoặc 6 ô`,
      warnings
    }
  }
  
  const standard = FRAME_STANDARDS[slotCount]
  const tolerance = 0.1 // 10% tolerance
  
  const minWidth = standard.width * (1 - tolerance)
  const maxWidth = standard.width * (1 + tolerance)
  const minHeight = standard.height * (1 - tolerance)
  const maxHeight = standard.height * (1 + tolerance)
  
  // Check width tolerance
  if (width < minWidth || width > maxWidth) {
    return {
      valid: false,
      error: `Kích thước khung ${width}x${height} không khớp chuẩn cho ${slotCount}-slot. Cần: ${standard.width}x${standard.height} (±10%)`,
      warnings,
      expectedDimensions: {
        width: standard.width,
        height: standard.height,
        name: standard.name
      }
    }
  }
  
  // Check height tolerance
  if (height < minHeight || height > maxHeight) {
    return {
      valid: false,
      error: `Kích thước khung ${width}x${height} không khớp chuẩn cho ${slotCount}-slot. Cần: ${standard.width}x${standard.height} (±10%)`,
      warnings,
      expectedDimensions: {
        width: standard.width,
        height: standard.height,
        name: standard.name
      }
    }
  }
  
  // Check aspect ratio
  const actualRatio = width / height
  const expectedRatio = standard.width / standard.height
  const ratioDeviation = Math.abs((actualRatio - expectedRatio) / expectedRatio) * 100
  
  if (ratioDeviation > 5) {
    warnings.push(`⚠️ Tỷ lệ khung lệch ${ratioDeviation.toFixed(2)}% so với chuẩn`)
  }
  
  return {
    valid: true,
    warnings,
    expectedDimensions: {
      width: standard.width,
      height: standard.height,
      name: standard.name
    }
  }
}

/**
 * Validate photo slots are within safe zone
 * @param {Array} photoSlots - Array of photo slot objects
 * @returns {Object} { valid: boolean, errors: string[], warnings: string[], invalidSlots: number[] }
 */
export function validateSafeZone(photoSlots) {
  const errors = []
  const warnings = []
  const invalidSlots = []
  const SAFE_MARGIN = VALIDATION_CONFIG.safeZoneMarginPercent
  
  if (!photoSlots || photoSlots.length === 0) {
    return { valid: true, errors, warnings, invalidSlots }
  }
  
  photoSlots.forEach((slot, index) => {
    // Check if slot extends outside safe zone
    if (
      slot.x < SAFE_MARGIN ||
      slot.y < SAFE_MARGIN ||
      slot.x + slot.width > 100 - SAFE_MARGIN ||
      slot.y + slot.height > 100 - SAFE_MARGIN
    ) {
      errors.push(`Ô ảnh ${index + 1} nằm ngoài vùng an toàn. Vị trí: (${slot.x}, ${slot.y}), Kích thước: (${slot.width}, ${slot.height})`)
      invalidSlots.push(index)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    invalidSlots
  }
}

/**
 * Detect overlapping photo slots
 * @param {Array} photoSlots - Array of photo slot objects
 * @returns {Object} { hasOverlaps: boolean, warnings: string[], overlappingPairs: Array }
 */
export function detectOverlaps(photoSlots) {
  const warnings = []
  const overlappingPairs = []
  
  if (!photoSlots || photoSlots.length < 2) {
    return { hasOverlaps: false, warnings, overlappingPairs }
  }
  
  // Check all pairs
  for (let i = 0; i < photoSlots.length; i++) {
    for (let j = i + 1; j < photoSlots.length; j++) {
      const slot1 = photoSlots[i]
      const slot2 = photoSlots[j]
      
      // Calculate bounding boxes
      const box1 = {
        left: slot1.x,
        right: slot1.x + slot1.width,
        top: slot1.y,
        bottom: slot1.y + slot1.height
      }
      
      const box2 = {
        left: slot2.x,
        right: slot2.x + slot2.width,
        top: slot2.y,
        bottom: slot2.y + slot2.height
      }
      
      // Check for intersection
      const intersectWidth = Math.max(0, Math.min(box1.right, box2.right) - Math.max(box1.left, box2.left))
      const intersectHeight = Math.max(0, Math.min(box1.bottom, box2.bottom) - Math.max(box1.top, box2.top))
      const intersectArea = intersectWidth * intersectHeight
      
      if (intersectArea > 0) {
        const area1 = slot1.width * slot1.height
        const area2 = slot2.width * slot2.height
        const smallerArea = Math.min(area1, area2)
        const overlapPercent = (intersectArea / smallerArea) * 100
        
        if (overlapPercent > 2) {
          warnings.push(`⚠️ Ô ảnh ${i + 1} và ${j + 1} chồng lên nhau ${overlapPercent.toFixed(2)}%`)
          overlappingPairs.push([i, j])
        }
      }
    }
  }
  
  return {
    hasOverlaps: overlappingPairs.length > 0,
    warnings,
    overlappingPairs
  }
}

/**
 * Comprehensive client-side validation
 * @param {File} file - The frame image file
 * @param {Array} photoSlots - Array of photo slot objects
 * @returns {Promise<Object>} { valid: boolean, errors: string[], warnings: string[], dimensions?: Object }
 */
export async function validateFrame(file, photoSlots = []) {
  const errors = []
  const warnings = []
  
  try {
    // 1. Validate file size
    const sizeResult = validateFileSize(file)
    if (!sizeResult.valid) {
      errors.push(sizeResult.error)
      return { valid: false, errors, warnings }
    }
    
    // 2. Validate file format
    const formatResult = validateFileFormat(file)
    if (!formatResult.valid) {
      errors.push(formatResult.error)
      return { valid: false, errors, warnings }
    }
    warnings.push(...formatResult.warnings)
    
    // 3. Get and validate dimensions (if photoSlots provided)
    let dimensions = null
    if (photoSlots.length > 0) {
      try {
        dimensions = await getImageDimensions(file)
        
        const dimensionResult = validateDimensions(dimensions.width, dimensions.height, photoSlots.length)
        if (!dimensionResult.valid) {
          errors.push(dimensionResult.error)
        }
        warnings.push(...dimensionResult.warnings)
      } catch (error) {
        warnings.push('⚠️ Không thể kiểm tra kích thước ảnh')
      }
    }
    
    // 4. Validate safe zone
    const safeZoneResult = validateSafeZone(photoSlots)
    if (!safeZoneResult.valid) {
      errors.push(...safeZoneResult.errors)
    }
    warnings.push(...safeZoneResult.warnings)
    
    // 5. Detect overlaps
    const overlapResult = detectOverlaps(photoSlots)
    warnings.push(...overlapResult.warnings)
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      dimensions,
      invalidSlots: safeZoneResult.invalidSlots,
      overlappingPairs: overlapResult.overlappingPairs
    }
    
  } catch (error) {
    errors.push(`Lỗi validation: ${error.message}`)
    return { valid: false, errors, warnings }
  }
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "2.5 MB", "500 KB")
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get validation status badge color
 * @param {boolean} valid - Whether validation passed
 * @param {boolean} hasWarnings - Whether there are warnings
 * @returns {string} Color code for badge
 */
export function getValidationBadgeColor(valid, hasWarnings) {
  if (!valid) return '#ef4444' // Red for errors
  if (hasWarnings) return '#f59e0b' // Orange for warnings
  return '#10b981' // Green for success
}

export default {
  validateFileSize,
  validateFileFormat,
  getImageDimensions,
  validateDimensions,
  validateSafeZone,
  detectOverlaps,
  validateFrame,
  formatFileSize,
  getValidationBadgeColor,
  VALIDATION_CONFIG,
  FRAME_STANDARDS
}
