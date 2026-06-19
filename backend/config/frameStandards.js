/**
 * Frame Strip Standards Configuration
 * Defines standard dimensions, validation parameters, and constraints for frame uploads
 */

const FRAME_STANDARDS = {
  '2-slot': {
    width: 1080,
    height: 1620,
    aspectRatio: 0.6667,
    slotCount: 2,
    description: '2-slot vertical strip (portrait orientation)'
  },
  '4-slot': {
    width: 1080,
    height: 2160,
    aspectRatio: 0.5,
    slotCount: 4,
    description: '4-slot vertical strip (standard photo booth)'
  },
  '6-slot': {
    width: 1080,
    height: 2700,
    aspectRatio: 0.4,
    slotCount: 6,
    description: '6-slot vertical strip (extended layout)'
  }
}

const VALIDATION_CONFIG = {
  // File size limits
  maxFileSizeMB: 5,
  maxFileSizeBytes: 5 * 1024 * 1024, // 5MB in bytes
  
  // Dimension tolerances
  dimensionTolerancePercent: 10, // ±10% tolerance for width and height
  aspectRatioTolerancePercent: 5, // ±5% tolerance for aspect ratio
  
  // Safe zone configuration
  safeZoneMarginPercent: 5, // 5% margin from frame edges
  
  // Photo slot validation
  maxOverlapPercent: 2, // Maximum allowed overlap between photo slots (warning threshold)
  
  // Allowed file formats
  allowedFormats: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
  allowedExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
  
  // MIME type mappings for validation
  mimeTypeMap: {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif'
  },
  
  // Recommended formats for best quality
  recommendedFormats: {
    transparent: ['image/png', 'image/webp'], // Formats supporting transparency
    opaque: ['image/jpeg', 'image/jpg'] // Formats without transparency
  }
}

/**
 * Get standard dimensions for a specific frame type
 * @param {string} frameType - '2-slot', '4-slot', or '6-slot'
 * @returns {Object|null} Standard dimensions or null if invalid type
 */
function getStandardDimensions(frameType) {
  return FRAME_STANDARDS[frameType] || null
}

/**
 * Get frame type from slot count
 * @param {number} slotCount - Number of photo slots
 * @returns {string|null} Frame type or null if invalid count
 */
function getFrameTypeFromSlotCount(slotCount) {
  const frameType = Object.keys(FRAME_STANDARDS).find(
    type => FRAME_STANDARDS[type].slotCount === slotCount
  )
  return frameType || null
}

/**
 * Check if slot count is valid
 * @param {number} slotCount - Number of photo slots
 * @returns {boolean} True if valid (2, 4, or 6)
 */
function isValidSlotCount(slotCount) {
  return [2, 4, 6].includes(slotCount)
}

/**
 * Get all supported slot counts
 * @returns {number[]} Array of supported slot counts [2, 4, 6]
 */
function getSupportedSlotCounts() {
  return [2, 4, 6]
}

/**
 * Calculate dimension tolerance range
 * @param {number} standardValue - Standard width or height
 * @returns {Object} { min, max } tolerance range
 */
function getDimensionToleranceRange(standardValue) {
  const tolerance = standardValue * (VALIDATION_CONFIG.dimensionTolerancePercent / 100)
  return {
    min: standardValue - tolerance,
    max: standardValue + tolerance,
    tolerance
  }
}

/**
 * Check if file format is allowed
 * @param {string} mimeType - File MIME type
 * @returns {boolean} True if format is allowed
 */
function isAllowedFormat(mimeType) {
  return VALIDATION_CONFIG.allowedFormats.includes(mimeType)
}

/**
 * Check if file extension is allowed
 * @param {string} extension - File extension (with dot, e.g., '.png')
 * @returns {boolean} True if extension is allowed
 */
function isAllowedExtension(extension) {
  return VALIDATION_CONFIG.allowedExtensions.includes(extension.toLowerCase())
}

/**
 * Get expected MIME type for file extension
 * @param {string} extension - File extension (with dot, e.g., '.png')
 * @returns {string|null} Expected MIME type or null if unknown
 */
function getExpectedMimeType(extension) {
  return VALIDATION_CONFIG.mimeTypeMap[extension.toLowerCase()] || null
}

export {
  FRAME_STANDARDS,
  VALIDATION_CONFIG,
  getStandardDimensions,
  getFrameTypeFromSlotCount,
  isValidSlotCount,
  getSupportedSlotCounts,
  getDimensionToleranceRange,
  isAllowedFormat,
  isAllowedExtension,
  getExpectedMimeType
}
