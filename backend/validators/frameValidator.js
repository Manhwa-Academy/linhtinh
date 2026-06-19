/**
 * Frame Validator Module
 * Comprehensive validation for frame strip uploads including file format, size, dimensions, and photo slots
 */

const path = require('path')
const sharp = require('sharp')
const {
  VALIDATION_CONFIG,
  getStandardDimensions,
  getFrameTypeFromSlotCount,
  isValidSlotCount,
  getSupportedSlotCounts,
  getDimensionToleranceRange,
  isAllowedFormat,
  isAllowedExtension,
  getExpectedMimeType
} = require('../config/frameStandards')

/**
 * Validation Result class
 * Stores validation status, errors, warnings, and metadata
 */
class ValidationResult {
  constructor() {
    this.valid = true
    this.errors = []
    this.warnings = []
    this.metadata = {}
  }

  addError(message) {
    this.valid = false
    this.errors.push(message)
  }

  addWarning(message) {
    this.warnings.push(message)
  }

  addMetadata(key, value) {
    this.metadata[key] = value
  }

  hasErrors() {
    return this.errors.length > 0
  }

  hasWarnings() {
    return this.warnings.length > 0
  }
}

/**
 * Main validation orchestrator
 * Runs all validation checks in sequence
 * @param {Object} frameData - Frame upload data
 * @param {string} frameData.filename - Original filename
 * @param {string} frameData.mimeType - File MIME type
 * @param {Array} frameData.photoSlots - Array of photo slot definitions
 * @param {Buffer} imageBuffer - Image file buffer
 * @returns {Promise<ValidationResult>} Validation result with errors, warnings, and metadata
 */
async function validateFrameUpload(frameData, imageBuffer) {
  const result = new ValidationResult()

  try {
    // 1. Validate file format (fast check first)
    const formatResult = await validateFileFormat(frameData.filename, frameData.mimeType, imageBuffer)
    if (formatResult.hasErrors()) {
      result.errors.push(...formatResult.errors)
      return result // Stop early if format is invalid
    }
    result.warnings.push(...formatResult.warnings)
    Object.assign(result.metadata, formatResult.metadata)

    // 2. Validate file size (fast check)
    const sizeResult = validateFileSize(imageBuffer)
    if (sizeResult.hasErrors()) {
      result.errors.push(...sizeResult.errors)
      return result // Stop early if file too large
    }
    Object.assign(result.metadata, sizeResult.metadata)

    // 3. Validate photo slots requirement (if frame image exists)
    const slotsRequirementResult = validatePhotoSlotsRequirement(frameData.photoSlots)
    if (slotsRequirementResult.hasErrors()) {
      result.errors.push(...slotsRequirementResult.errors)
      return result // Stop early if slots missing
    }

    // 4. Validate photo slot structure
    const slotsStructureResult = validatePhotoSlotsStructure(frameData.photoSlots)
    if (slotsStructureResult.hasErrors()) {
      result.errors.push(...slotsStructureResult.errors)
      return result // Stop early if slot structure invalid
    }

    // 5. Validate dimensions (requires image processing)
    const dimensionsResult = await validateDimensions(imageBuffer, frameData.photoSlots?.length || 0)
    if (dimensionsResult.hasErrors()) {
      result.errors.push(...dimensionsResult.errors)
    }
    result.warnings.push(...dimensionsResult.warnings)
    Object.assign(result.metadata, dimensionsResult.metadata)

    // 6. Validate safe zone (only if previous validations passed)
    if (!result.hasErrors() && frameData.photoSlots && frameData.photoSlots.length > 0) {
      const safeZoneResult = validateSafeZone(frameData.photoSlots)
      if (safeZoneResult.hasErrors()) {
        result.errors.push(...safeZoneResult.errors)
      }
    }

    // 7. Detect overlapping slots (warning only)
    if (!result.hasErrors() && frameData.photoSlots && frameData.photoSlots.length > 1) {
      const overlapResult = detectPhotoSlotOverlaps(frameData.photoSlots)
      result.warnings.push(...overlapResult.warnings)
    }

  } catch (error) {
    result.addError(`Validation failed: ${error.message}`)
  }

  return result
}

/**
 * Validate file format and MIME type
 * @param {string} filename - Original filename
 * @param {string} mimeType - File MIME type
 * @param {Buffer} buffer - Image file buffer
 * @returns {Promise<ValidationResult>} Validation result
 */
async function validateFileFormat(filename, mimeType, buffer) {
  const result = new ValidationResult()

  // Extract extension (case-insensitive)
  const ext = path.extname(filename).toLowerCase()

  // Check if extension is allowed
  if (!isAllowedExtension(ext)) {
    result.addError('Invalid file format. Only PNG, JPEG, JPG, WebP, or GIF are allowed')
    return result
  }

  // Check if MIME type is allowed
  if (!isAllowedFormat(mimeType)) {
    result.addError('Invalid file format. Only PNG, JPEG, JPG, WebP, or GIF are allowed')
    return result
  }

  // Verify MIME type matches extension
  const expectedMime = getExpectedMimeType(ext)
  if (expectedMime && mimeType !== expectedMime) {
    result.addError('File type mismatch detected')
    return result
  }

  // Add format metadata
  result.addMetadata('format', ext)
  result.addMetadata('mimeType', mimeType)

  // Add recommendations for transparency
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    result.addWarning('JPEG format does not support transparency. Consider using PNG for transparent backgrounds')
  }

  return result
}

/**
 * Validate file size
 * @param {Buffer} buffer - Image file buffer
 * @returns {ValidationResult} Validation result
 */
function validateFileSize(buffer) {
  const result = new ValidationResult()

  const fileSizeBytes = buffer.length
  const fileSizeMB = fileSizeBytes / (1024 * 1024)

  result.addMetadata('fileSizeBytes', fileSizeBytes)
  result.addMetadata('fileSizeMB', fileSizeMB.toFixed(2))

  // Check if file size exceeds limit
  if (fileSizeBytes > VALIDATION_CONFIG.maxFileSizeBytes) {
    result.addError(`File size exceeds 5MB limit. Current size: ${fileSizeMB.toFixed(2)}MB`)
  }

  return result
}

/**
 * Extract and validate image dimensions
 * @param {Buffer} buffer - Image file buffer
 * @param {number} slotCount - Number of photo slots
 * @returns {Promise<ValidationResult>} Validation result
 */
async function validateDimensions(buffer, slotCount) {
  const result = new ValidationResult()

  try {
    // Extract dimensions using sharp
    const metadata = await sharp(buffer).metadata()
    const { width, height } = metadata

    result.addMetadata('width', width)
    result.addMetadata('height', height)
    result.addMetadata('dimensions', { width, height })

    // If no slots defined, skip dimension validation
    if (!slotCount || slotCount === 0) {
      return result
    }

    // Check if slot count is valid
    if (!isValidSlotCount(slotCount)) {
      result.addError(
        `Invalid number of photo slots: ${slotCount}. Supported: ${getSupportedSlotCounts().join(', ')} slots`
      )
      return result
    }

    // Get frame type and standard dimensions
    const frameType = getFrameTypeFromSlotCount(slotCount)
    if (!frameType) {
      result.addError(
        `Invalid number of photo slots: ${slotCount}. Supported: ${getSupportedSlotCounts().join(', ')} slots`
      )
      return result
    }

    const standard = getStandardDimensions(frameType)
    result.addMetadata('frameType', frameType)
    result.addMetadata('expectedDimensions', { width: standard.width, height: standard.height })

    // Calculate tolerances
    const widthToleranceRange = getDimensionToleranceRange(standard.width)
    const heightToleranceRange = getDimensionToleranceRange(standard.height)

    // Check width tolerance
    if (width < widthToleranceRange.min || width > widthToleranceRange.max) {
      result.addError(
        `Frame dimensions ${width}x${height} do not match standard for ${slotCount}-slot frame. ` +
          `Expected: ${standard.width}x${standard.height} (±10%)`
      )
    }

    // Check height tolerance
    if (height < heightToleranceRange.min || height > heightToleranceRange.max) {
      result.addError(
        `Frame dimensions ${width}x${height} do not match standard for ${slotCount}-slot frame. ` +
          `Expected: ${standard.width}x${standard.height} (±10%)`
      )
    }

    // Check aspect ratio
    const actualRatio = width / height
    const expectedRatio = standard.aspectRatio
    const ratioDeviation = Math.abs((actualRatio - expectedRatio) / expectedRatio) * 100

    if (ratioDeviation > VALIDATION_CONFIG.aspectRatioTolerancePercent) {
      result.addWarning(`Aspect ratio deviation detected: ${ratioDeviation.toFixed(2)}%`)
    }
  } catch (error) {
    result.addError('Failed to read image dimensions. File may be corrupted')
  }

  return result
}

/**
 * Validate photo slots requirement
 * @param {Array} photoSlots - Array of photo slot definitions
 * @returns {ValidationResult} Validation result
 */
function validatePhotoSlotsRequirement(photoSlots) {
  const result = new ValidationResult()

  // Check if photoSlots is provided and not null/undefined
  if (!photoSlots || photoSlots === null || photoSlots === undefined) {
    result.addError('Frame with image must include photoSlots definition')
    return result
  }

  // Check if photoSlots is an array
  if (!Array.isArray(photoSlots)) {
    result.addError('Frame with image must include photoSlots definition')
    return result
  }

  // Check if photoSlots has at least 1 element
  if (photoSlots.length === 0) {
    result.addError('Frame with image must include photoSlots definition')
    return result
  }

  return result
}

/**
 * Validate photo slot structure
 * @param {Array} photoSlots - Array of photo slot definitions
 * @returns {ValidationResult} Validation result
 */
function validatePhotoSlotsStructure(photoSlots) {
  const result = new ValidationResult()

  if (!photoSlots || photoSlots.length === 0) {
    return result // Skip if no slots
  }

  photoSlots.forEach((slot, index) => {
    // Check required properties exist
    const requiredProps = ['x', 'y', 'width', 'height', 'rotation']
    for (const prop of requiredProps) {
      if (!(prop in slot)) {
        result.addError(`Photo slot ${index + 1} missing required property: ${prop}`)
        continue
      }

      // Validate numeric types
      if (typeof slot[prop] !== 'number') {
        result.addError(`Photo slot ${index + 1} property ${prop} must be a number`)
        continue
      }

      // Validate ranges
      if (prop !== 'rotation') {
        // x, y, width, height must be between 0 and 100
        if (slot[prop] < 0 || slot[prop] > 100) {
          result.addError(
            `Photo slot ${index + 1} has invalid ${prop} value: ${slot[prop]}. Must be between 0 and 100`
          )
        }
      } else {
        // rotation must be between -360 and 360
        if (slot[prop] < -360 || slot[prop] > 360) {
          result.addError(
            `Photo slot ${index + 1} has invalid ${prop} value: ${slot[prop]}. Must be between -360 and 360`
          )
        }
      }
    }
  })

  return result
}

/**
 * Validate photo slots are within safe zone
 * @param {Array} photoSlots - Array of photo slot definitions
 * @returns {ValidationResult} Validation result
 */
function validateSafeZone(photoSlots) {
  const result = new ValidationResult()
  const SAFE_MARGIN = VALIDATION_CONFIG.safeZoneMarginPercent

  photoSlots.forEach((slot, index) => {
    // Check if slot extends outside safe zone boundaries
    if (
      slot.x < SAFE_MARGIN ||
      slot.y < SAFE_MARGIN ||
      slot.x + slot.width > 100 - SAFE_MARGIN ||
      slot.y + slot.height > 100 - SAFE_MARGIN
    ) {
      result.addError(
        `Photo slot ${index + 1} extends outside safe zone. ` +
          `Position: (${slot.x}, ${slot.y}), Size: (${slot.width}, ${slot.height})`
      )
    }
  })

  return result
}

/**
 * Detect overlapping photo slots
 * @param {Array} photoSlots - Array of photo slot definitions
 * @returns {ValidationResult} Validation result
 */
function detectPhotoSlotOverlaps(photoSlots) {
  const result = new ValidationResult()

  // Check all pairs of slots for overlap
  for (let i = 0; i < photoSlots.length; i++) {
    for (let j = i + 1; j < photoSlots.length; j++) {
      const slot1 = photoSlots[i]
      const slot2 = photoSlots[j]

      // Calculate bounding boxes (ignoring rotation for simplicity)
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
        // Calculate overlap percentage relative to smaller slot
        const area1 = slot1.width * slot1.height
        const area2 = slot2.width * slot2.height
        const smallerArea = Math.min(area1, area2)
        const overlapPercent = (intersectArea / smallerArea) * 100

        if (overlapPercent > VALIDATION_CONFIG.maxOverlapPercent) {
          result.addWarning(`Photo slots ${i + 1} and ${j + 1} overlap by ${overlapPercent.toFixed(2)}%`)
        }
      }
    }
  }

  return result
}

/**
 * Automatically detect frame type from slot count
 * @param {number} slotCount - Number of photo slots
 * @returns {string|null} Frame type ('2-slot', '4-slot', '6-slot') or null if invalid
 */
function detectFrameType(slotCount) {
  return getFrameTypeFromSlotCount(slotCount)
}

module.exports = {
  ValidationResult,
  validateFrameUpload,
  validateFileFormat,
  validateFileSize,
  validateDimensions,
  validatePhotoSlotsRequirement,
  validatePhotoSlotsStructure,
  validateSafeZone,
  detectPhotoSlotOverlaps,
  detectFrameType
}
