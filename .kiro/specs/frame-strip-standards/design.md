# Design Document: Frame Strip Standards and Validation System

## Overview

This document outlines the technical design for implementing comprehensive validation and standardization for frame strip uploads in the photo booth application. The system will enforce standards for file formats, dimensions, safe zones, and photo slot definitions.

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Panel (React)                      │
│  - File upload UI with real-time validation feedback        │
│  - Photo slot visual editor with safe zone overlay          │
│  - Dimension and format validation display                  │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP POST /api/frames
                        │ (multipart/json with validation)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API (Express.js)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Frame Upload Handler (server.js)                    │   │
│  │  - Receive frame data + image file                   │   │
│  │  - Invoke FrameValidator                             │   │
│  │  - Store validated frame to database                 │   │
│  └───────────────────┬──────────────────────────────────┘   │
│                      │                                       │
│  ┌───────────────────▼──────────────────────────────────┐   │
│  │  FrameValidator Module (NEW)                         │   │
│  │  - validateFileFormat()                              │   │
│  │  - validateFileSize()                                │   │
│  │  - validateDimensions()                              │   │
│  │  - validatePhotoSlots()                              │   │
│  │  - validateSafeZone()                                │   │
│  │  - detectFrameType()                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Documentation                               │
│  - frame-standards.md: User-facing guidelines               │
│  - Visual examples and safe zone diagrams                   │
└─────────────────────────────────────────────────────────────┘
```

## Data Models

### Frame Standard Configuration

```javascript
// backend/config/frameStandards.js
const FRAME_STANDARDS = {
  '2-slot': {
    width: 1080,
    height: 1620,
    aspectRatio: 0.6667,
    slotCount: 2
  },
  '4-slot': {
    width: 1080,
    height: 2160,
    aspectRatio: 0.5,
    slotCount: 4
  },
  '6-slot': {
    width: 1080,
    height: 2700,
    aspectRatio: 0.4,
    slotCount: 6
  }
}

const VALIDATION_CONFIG = {
  maxFileSizeMB: 5,
  maxFileSizeBytes: 5 * 1024 * 1024,
  dimensionTolerancePercent: 10,
  aspectRatioTolerancePercent: 5,
  safeZoneMarginPercent: 5,
  maxOverlapPercent: 2,
  allowedFormats: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
  allowedExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.gif']
}
```

### Validation Response Schema

```typescript
// Success Response
interface ValidationSuccessResponse {
  success: true
  message: "Frame upload validated successfully"
  file: {
    filename: string
    url: string
    path: string
    size: number  // bytes
    dimensions: {
      width: number
      height: number
    }
    frameType: '2-slot' | '4-slot' | '6-slot'
  }
  warnings?: string[]  // Optional warnings array
}

// Error Response
interface ValidationErrorResponse {
  error: "Validation failed"
  validationErrors: string[]  // Array of specific error messages
}
```

## Module Design

### 1. FrameValidator Module

**Location**: `backend/validators/frameValidator.js`

#### Core Functions

```javascript
/**
 * Main validation orchestrator
 * @param {Object} frameData - Frame upload data
 * @param {Buffer} imageBuffer - Image file buffer
 * @returns {Promise<ValidationResult>}
 */
async function validateFrameUpload(frameData, imageBuffer)

/**
 * Validate file format and MIME type
 * @param {string} filename
 * @param {string} mimeType
 * @param {Buffer} buffer
 * @returns {ValidationResult}
 */
function validateFileFormat(filename, mimeType, buffer)

/**
 * Validate file size
 * @param {Buffer} buffer
 * @returns {ValidationResult}
 */
function validateFileSize(buffer)

/**
 * Extract and validate image dimensions
 * @param {Buffer} buffer
 * @param {number} slotCount
 * @returns {Promise<ValidationResult>}
 */
async function validateDimensions(buffer, slotCount)

/**
 * Validate photo slots structure and requirements
 * @param {Array} photoSlots
 * @param {boolean} hasFrameImage
 * @returns {ValidationResult}
 */
function validatePhotoSlots(photoSlots, hasFrameImage)

/**
 * Validate photo slots are within safe zone
 * @param {Array} photoSlots
 * @returns {ValidationResult}
 */
function validateSafeZone(photoSlots)

/**
 * Detect overlapping photo slots
 * @param {Array} photoSlots
 * @returns {ValidationResult}
 */
function detectPhotoSlotOverlaps(photoSlots)

/**
 * Automatically detect frame type from slot count
 * @param {number} slotCount
 * @returns {string} frameType
 */
function detectFrameType(slotCount)
```

#### Validation Result Structure

```javascript
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
}
```

### 2. Admin Panel Enhancements

**Location**: `frontend/src/pages/AdminPage.jsx`

#### New Components

```javascript
/**
 * Real-time file validation component
 * Shows file size, format, and dimension info before upload
 */
function FileValidationPreview({ file, photoSlots })

/**
 * Photo slot editor with safe zone overlay
 * Visual editor for positioning photo slots
 */
function PhotoSlotEditor({ frameImage, photoSlots, onChange })

/**
 * Safe zone visualization overlay
 * Shows 5% margin boundaries on frame preview
 */
function SafeZoneOverlay({ dimensions })
```

#### Validation Flow

```javascript
// Client-side pre-validation (before upload)
const validateClientSide = (file, photoSlots) => {
  const errors = []
  const warnings = []
  
  // File size check
  if (file.size > 5 * 1024 * 1024) {
    errors.push(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: 5MB`)
  }
  
  // Format check
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    warnings.push('JPEG format does not support transparency. Consider using PNG for transparent backgrounds')
  } else if (file.type === 'image/png') {
    // Info message
    console.info('PNG format detected. Ensure background is transparent for best results')
  }
  
  // Safe zone check (if slots defined)
  if (photoSlots && photoSlots.length > 0) {
    photoSlots.forEach((slot, index) => {
      if (slot.x < 5 || slot.y < 5 || (slot.x + slot.width) > 95 || (slot.y + slot.height) > 95) {
        warnings.push(`Photo slot ${index + 1} extends outside safe zone`)
      }
    })
  }
  
  return { errors, warnings }
}
```

### 3. API Endpoint Updates

**Location**: `backend/server.js`

#### POST /api/frames (Enhanced)

```javascript
app.post('/api/frames', upload.single('frameImage'), async (req, res) => {
  try {
    const { name, description, emoji, color, bgGradient, photoSlots } = req.body
    
    let frameImageUrl = null
    let validationResult = null
    
    // If frame image is uploaded, validate it
    if (req.file) {
      const frameValidator = require('./validators/frameValidator')
      
      validationResult = await frameValidator.validateFrameUpload({
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        photoSlots: JSON.parse(photoSlots || '[]')
      }, req.file.buffer)
      
      // If validation fails, return errors
      if (!validationResult.valid) {
        return res.status(400).json({
          error: 'Validation failed',
          validationErrors: validationResult.errors
        })
      }
      
      // Upload to storage (UploadThing or local)
      frameImageUrl = await uploadToStorage(req.file)
    }
    
    // Save frame to database
    const frame = await saveFrame({
      name,
      description,
      emoji,
      color,
      bgGradient,
      frameImage: frameImageUrl,
      photoSlots: JSON.parse(photoSlots || '[]'),
      frameType: validationResult?.metadata?.frameType
    })
    
    // Return success response with warnings if any
    res.status(200).json({
      success: true,
      message: 'Frame upload validated successfully',
      frame,
      warnings: validationResult?.warnings
    })
    
  } catch (error) {
    console.error('Frame upload error:', error)
    res.status(500).json({ error: error.message })
  }
})
```

#### PUT /api/frames/:id (Enhanced)

Similar validation logic as POST, but updates existing frame.

## Implementation Details

### File Format Validation

```javascript
// backend/validators/frameValidator.js

const fileType = require('file-type')
const path = require('path')

async function validateFileFormat(filename, mimeType, buffer) {
  const result = new ValidationResult()
  
  // Extract extension
  const ext = path.extname(filename).toLowerCase()
  
  // Check extension is allowed
  if (!VALIDATION_CONFIG.allowedExtensions.includes(ext)) {
    result.addError(`Invalid file format. Only PNG, JPEG, JPG, WebP, or GIF are allowed`)
    return result
  }
  
  // Verify MIME type matches extension
  const detectedType = await fileType.fromBuffer(buffer)
  
  if (!detectedType) {
    result.addError('File type mismatch detected')
    return result
  }
  
  const expectedMimes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif'
  }
  
  if (detectedType.mime !== expectedMimes[ext] && detectedType.mime !== mimeType) {
    result.addError('File type mismatch detected')
  }
  
  return result
}
```

### Dimension Validation

```javascript
const sharp = require('sharp')

async function validateDimensions(buffer, slotCount) {
  const result = new ValidationResult()
  
  try {
    // Extract dimensions using sharp
    const metadata = await sharp(buffer).metadata()
    const { width, height } = metadata
    
    result.addMetadata('dimensions', { width, height })
    
    // Determine expected dimensions based on slot count
    const frameType = detectFrameType(slotCount)
    if (!frameType) {
      result.addError(`Invalid number of photo slots: ${slotCount}. Supported: 2, 4, or 6 slots`)
      return result
    }
    
    const standard = FRAME_STANDARDS[frameType]
    const toleranceW = standard.width * (VALIDATION_CONFIG.dimensionTolerancePercent / 100)
    const toleranceH = standard.height * (VALIDATION_CONFIG.dimensionTolerancePercent / 100)
    
    // Check width tolerance
    if (Math.abs(width - standard.width) > toleranceW) {
      result.addError(
        `Frame dimensions ${width}x${height} do not match standard for ${slotCount}-slot frame. ` +
        `Expected: ${standard.width}x${standard.height} (±10%)`
      )
    }
    
    // Check height tolerance
    if (Math.abs(height - standard.height) > toleranceH) {
      result.addError(
        `Frame dimensions ${width}x${height} do not match standard for ${slotCount}-slot frame. ` +
        `Expected: ${standard.width}x${standard.height} (±10%)`
      )
    }
    
    // Check aspect ratio
    const actualRatio = width / height
    const expectedRatio = standard.aspectRatio
    const ratioDeviation = Math.abs(actualRatio - expectedRatio) / expectedRatio * 100
    
    if (ratioDeviation > VALIDATION_CONFIG.aspectRatioTolerancePercent) {
      result.addWarning(`Aspect ratio deviation detected: ${ratioDeviation.toFixed(2)}%`)
    }
    
    result.addMetadata('frameType', frameType)
    
  } catch (error) {
    result.addError('Failed to read image dimensions. File may be corrupted')
  }
  
  return result
}
```

### Safe Zone Validation

```javascript
function validateSafeZone(photoSlots) {
  const result = new ValidationResult()
  const SAFE_MARGIN = VALIDATION_CONFIG.safeZoneMarginPercent
  
  photoSlots.forEach((slot, index) => {
    // Check boundaries
    if (slot.x < SAFE_MARGIN ||
        slot.y < SAFE_MARGIN ||
        (slot.x + slot.width) > (100 - SAFE_MARGIN) ||
        (slot.y + slot.height) > (100 - SAFE_MARGIN)) {
      
      result.addError(
        `Photo slot ${index + 1} extends outside safe zone. ` +
        `Position: (${slot.x}, ${slot.y}), Size: (${slot.width}, ${slot.height})`
      )
    }
  })
  
  return result
}
```

## Testing Strategy

### Unit Tests

```javascript
// backend/validators/__tests__/frameValidator.test.js

describe('FrameValidator', () => {
  describe('validateFileFormat', () => {
    test('should accept valid PNG file', async () => {
      // Test implementation
    })
    
    test('should reject invalid file extension', async () => {
      // Test implementation
    })
    
    test('should detect MIME type mismatch', async () => {
      // Test implementation
    })
  })
  
  describe('validateDimensions', () => {
    test('should accept dimensions within tolerance', async () => {
      // Test implementation
    })
    
    test('should reject dimensions outside tolerance', async () => {
      // Test implementation
    })
  })
  
  describe('validateSafeZone', () => {
    test('should accept slots within safe zone', () => {
      // Test implementation
    })
    
    test('should reject slots outside safe zone', () => {
      // Test implementation
    })
  })
})
```

### Integration Tests

```javascript
// backend/__tests__/frames.integration.test.js

describe('POST /api/frames', () => {
  test('should upload valid frame successfully', async () => {
    // Test implementation
  })
  
  test('should reject oversized file', async () => {
    // Test implementation
  })
  
  test('should reject frame with invalid dimensions', async () => {
    // Test implementation
  })
})
```

## Dependencies

### New Dependencies

```json
{
  "sharp": "^0.33.0",
  "file-type": "^19.0.0"
}
```

### Existing Dependencies
- express
- multer (for file upload)
- uploadthing (for cloud storage)

## File Structure

```
backend/
├── config/
│   └── frameStandards.js          (NEW)
├── validators/
│   ├── frameValidator.js          (NEW)
│   └── __tests__/
│       └── frameValidator.test.js (NEW)
├── server.js                      (MODIFIED)
└── api/
    └── index.js                   (MODIFIED)

frontend/
├── src/
│   ├── pages/
│   │   └── AdminPage.jsx          (MODIFIED)
│   ├── components/
│   │   ├── FileValidationPreview.jsx    (NEW)
│   │   ├── PhotoSlotEditor.jsx          (MODIFIED)
│   │   └── SafeZoneOverlay.jsx          (NEW)
│   └── utils/
│       └── frameValidation.js     (NEW)

docs/
└── frame-standards.md             (NEW)
```

## Security Considerations

1. **File Size Limits**: Enforce 5MB limit to prevent DoS attacks via large file uploads
2. **MIME Type Verification**: Use `file-type` library to verify actual file content matches declared MIME type
3. **Buffer Validation**: Validate image buffer before processing with sharp to prevent malformed image exploits
4. **Input Sanitization**: Sanitize all user inputs (frame name, description) before storage
5. **Error Messages**: Don't expose internal system details in error messages

## Performance Considerations

1. **Image Processing**: Use sharp (libvips-based) for fast image dimension extraction
2. **Validation Pipeline**: Run validations in order of computational cost (format → size → dimensions → slots)
3. **Early Termination**: Stop validation on first critical error to save processing time
4. **Caching**: Consider caching frame standards configuration in memory

## Deployment Notes

1. **Install Dependencies**: Run `npm install sharp file-type` in backend directory
2. **Database Migration**: No schema changes required if using JSON storage for photoSlots
3. **Backward Compatibility**: Existing frames without validation metadata will continue to work
4. **Documentation**: Deploy `frame-standards.md` to accessible location for users

## Future Enhancements

1. **Auto-correction**: Automatically resize images to match standard dimensions
2. **Slot Templates**: Pre-defined slot templates for common layouts
3. **Batch Validation**: Validate multiple frames at once
4. **Visual Validation Tool**: Browser-based tool to test frame + photo combinations before upload
