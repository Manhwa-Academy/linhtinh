# Implementation Tasks

## Task 1: Create Frame Standards Configuration
**Status**: completed
**Requirements**: Requirement 3
**Description**: Create configuration file defining standard dimensions and validation parameters for all frame types

**Subtasks**:
1. Create `backend/config/frameStandards.js`
2. Define FRAME_STANDARDS object with 2-slot, 4-slot, 6-slot specifications
3. Define VALIDATION_CONFIG with file size limits, tolerances, allowed formats
4. Export configuration for use in validators

**Acceptance Criteria**:
- Configuration includes dimensions for all 3 frame types (1080x1620, 1080x2160, 1080x2700)
- Validation config includes 5MB file size limit
- Allowed formats: PNG, JPEG, JPG, WebP, GIF
- Dimension tolerance: ±10%
- Safe zone margin: 5%

---

## Task 2: Implement Core Validation Module
**Status**: completed
**Requirements**: Requirement 1, 2, 4, 5, 6, 7, 8, 13, 14
**Description**: Create the main FrameValidator module with all validation functions

**Subtasks**:
1. Create `backend/validators/frameValidator.js`
2. Implement ValidationResult class
3. Implement validateFileFormat() function
4. Implement validateFileSize() function
5. Implement validateDimensions() with sharp library
6. Implement validatePhotoSlots() function
7. Implement validateSafeZone() function
8. Implement detectPhotoSlotOverlaps() function
9. Implement detectFrameType() function
10. Implement main validateFrameUpload() orchestrator

**Acceptance Criteria**:
- All validation functions return ValidationResult objects
- File format validation checks MIME type and extension
- File size validation rejects files over 5MB
- Dimension validation uses sharp to extract image dimensions
- Dimension validation checks ±10% tolerance
- Photo slot validation ensures all required properties present
- Safe zone validation checks 5% margin boundaries
- Overlap detection warns when slots overlap >2%
- Frame type detection works for 2/4/6 slot counts

---

## Task 3: Install Required Dependencies
**Status**: completed
**Requirements**: Requirement 14
**Description**: Install sharp and file-type libraries for image processing and validation

**Subtasks**:
1. Navigate to backend directory
2. Run `npm install sharp file-type`
3. Verify installation in package.json

**Acceptance Criteria**:
- sharp library installed (^0.33.0 or latest)
- file-type library installed (^19.0.0 or latest)
- Both libraries listed in backend/package.json dependencies

---

## Task 4: Update Frame Upload API Endpoint
**Status**: completed
**Requirements**: Requirement 9, 10
**Description**: Integrate validation module into POST /api/frames endpoint

**Subtasks**:
1. Import frameValidator in backend/server.js or backend/api/index.js
2. Add validation logic before frame storage in POST /api/frames
3. Return structured error response (400) on validation failure
4. Return structured success response (200) with metadata on success
5. Include warnings array in success response if present
6. Update PUT /api/frames/:id with same validation logic

**Acceptance Criteria**:
- Validation runs on all frame uploads
- Error response follows format: { error, validationErrors: [] }
- Success response includes file metadata (filename, url, size, dimensions, frameType)
- HTTP status 400 for validation failures
- HTTP status 200 for validation success
- Warnings included in response when present

---

## Task 5: Add Client-Side Pre-Validation
**Status**: completed
**Requirements**: Requirement 12, 15
**Description**: Implement real-time validation feedback in Admin Panel before upload

**Subtasks**:
1. Create `frontend/src/utils/frameValidation.js` with client-side validation functions
2. Add file size check (show error if >5MB)
3. Add format detection (show warning for JPEG, info for PNG)
4. Add safe zone visual check for photo slots
5. Update AdminPage.jsx to show validation feedback when file selected
6. Display file size in MB before upload
7. Show dimension info when available

**Acceptance Criteria**:
- File size displayed immediately after selection
- Error message shown for files >5MB
- Warning shown for JPEG format (no transparency)
- Info message shown for PNG format
- Photo slots outside safe zone highlighted in red
- Validation feedback updates in real-time

---

## Task 6: Enhance Photo Slot Editor with Safe Zone Overlay
**Status**: completed
**Requirements**: Requirement 7, 12
**Description**: Add visual safe zone boundaries to photo slot editor

**Subtasks**:
1. Create `frontend/src/components/SafeZoneOverlay.jsx` component
2. Render 5% margin boundaries as dashed lines or colored overlay
3. Integrate SafeZoneOverlay into PhotoSlotEditor in AdminPage.jsx
4. Highlight slots that extend outside safe zone in red
5. Add visual indicators for safe/unsafe slot positions

**Acceptance Criteria**:
- Safe zone boundaries visible as overlay on frame preview
- 5% margin clearly marked on all four edges
- Photo slots outside safe zone highlighted in red
- Photo slots inside safe zone shown normally
- Overlay updates when slots are moved

---

## Task 7: Create Frame Standards Documentation
**Status**: completed
**Requirements**: Requirement 11
**Description**: Write comprehensive user-facing documentation for frame standards

**Subtasks**:
1. Create `docs/frame-standards.md` file
2. Document standard dimensions for all frame types
3. Document file format requirements
4. Document file size limit (5MB)
5. Document safe zone guidelines with visual examples
6. Document photo slot structure schema
7. Provide examples of valid and invalid frame configurations
8. Include tips for transparent backgrounds

**Acceptance Criteria**:
- Documentation includes dimensions table for 2/4/6-slot frames
- File format and size requirements clearly stated
- Safe zone explained with 5% margin specification
- Photo slot schema documented (x, y, width, height, rotation)
- At least 2 examples of valid configurations
- At least 2 examples of invalid configurations
- Transparency guidance included

---

## Task 8: Add Unit Tests for Validation Module
**Status**: pending
**Requirements**: All validation requirements
**Description**: Write comprehensive unit tests for all validation functions

**Subtasks**:
1. Create `backend/validators/__tests__/frameValidator.test.js`
2. Write tests for validateFileFormat()
3. Write tests for validateFileSize()
4. Write tests for validateDimensions()
5. Write tests for validatePhotoSlots()
6. Write tests for validateSafeZone()
7. Write tests for detectPhotoSlotOverlaps()
8. Write tests for detectFrameType()
9. Create test fixtures (sample images with known dimensions)
10. Achieve >80% code coverage

**Acceptance Criteria**:
- All validation functions have unit tests
- Tests cover success and failure cases
- Tests verify exact error messages
- Tests use realistic test data
- All tests pass
- Code coverage >80%

---

## Task 9: Add Integration Tests for Frame Upload
**Status**: pending
**Requirements**: Requirement 9, 10
**Description**: Write end-to-end integration tests for frame upload API

**Subtasks**:
1. Create `backend/__tests__/frames.integration.test.js`
2. Test successful frame upload with valid data
3. Test rejection of oversized files (>5MB)
4. Test rejection of invalid file formats
5. Test rejection of invalid dimensions
6. Test rejection of missing photo slots
7. Test rejection of slots outside safe zone
8. Test warning generation for overlapping slots
9. Test validation response structure

**Acceptance Criteria**:
- Integration tests cover main upload scenarios
- Tests verify HTTP status codes
- Tests verify response structure
- Tests verify database state after upload
- All tests pass

---

## Task 10: Update Admin UI with Validation Feedback Display
**Status**: pending
**Requirements**: Requirement 12
**Description**: Enhance AdminPage UI to display validation results and warnings

**Subtasks**:
1. Add validation feedback section to frame upload form
2. Display real-time errors before upload
3. Display server validation errors after upload attempt
4. Display warnings in success toast or separate UI element
5. Add loading state during validation
6. Style validation messages (error=red, warning=yellow, info=blue)

**Acceptance Criteria**:
- Validation errors shown in red with clear messages
- Validation warnings shown in yellow
- Success messages shown in green
- Loading indicator during upload/validation
- Messages dismissible by user
- UI remains responsive during validation

---

## Task 11: Test with Real Frame Images
**Status**: pending
**Requirements**: All requirements
**Description**: Manual testing with realistic frame images and configurations

**Subtasks**:
1. Prepare test images for 2-slot, 4-slot, 6-slot frames
2. Test with images at exact standard dimensions
3. Test with images within ±10% tolerance
4. Test with images outside tolerance
5. Test with oversized files (>5MB)
6. Test with various file formats (PNG, JPEG, WebP)
7. Test with invalid photo slot configurations
8. Verify error messages are user-friendly
9. Verify safe zone validation works correctly
10. Document any issues found

**Acceptance Criteria**:
- All validation rules work as expected
- Error messages are clear and actionable
- No false positives or false negatives
- Performance is acceptable (<2s validation time)
- UI feedback is helpful

---

## Task 12: Deploy and Monitor
**Status**: pending
**Requirements**: All requirements
**Description**: Deploy validation system to production and monitor for issues

**Subtasks**:
1. Review all code changes
2. Run all tests in CI/CD pipeline
3. Deploy to staging environment
4. Perform smoke testing on staging
5. Deploy to production
6. Monitor error logs for validation failures
7. Monitor user feedback
8. Create runbook for common validation issues

**Acceptance Criteria**:
- All tests pass in CI/CD
- Staging deployment successful
- Production deployment successful
- No critical errors in first 24 hours
- User can successfully upload valid frames
- Invalid frames properly rejected
- Runbook documented
