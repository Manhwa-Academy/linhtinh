# Requirements Document

## Introduction

This feature adds comprehensive validation and standardization for frame strip uploads in the photo booth application. Currently, users can upload frame images without validation, leading to inconsistent dimensions, oversized files, incorrect formats, and missing photo slot definitions that cause rendering errors. This system will enforce standards for 2-slot, 4-slot, and 6-slot frame strips including file format validation, dimension requirements, safe zone guidelines, file size limits, and automatic photo slot validation.

## Glossary

- **Frame_Strip**: A PNG image with transparent background overlaid on photo strips to create decorative borders
- **Photo_Slot**: A rectangular region within a Frame_Strip where user photos are positioned
- **Validation_System**: The backend module that validates frame uploads against standards
- **Admin_Panel**: The React frontend interface for uploading and managing Frame_Strips
- **Safe_Zone**: The transparent area within a Frame_Strip where Photo_Slots must be positioned
- **Aspect_Ratio**: The proportional relationship between width and height of an image
- **File_Size_Limit**: The maximum allowed file size for Frame_Strip uploads (5MB)
- **Standard_Dimension**: The required pixel dimensions for 2-slot (1080x1620), 4-slot (1080x2160), and 6-slot (1080x2700) frames
- **Frame_Type**: The category of frame based on number of Photo_Slots (2-slot, 4-slot, or 6-slot)
- **Upload_Response**: The JSON response returned after Frame_Strip validation and upload

## Requirements

### Requirement 1: File Format Validation

**User Story:** As a system administrator, I want to enforce valid image formats for frame uploads, so that only compatible images are accepted.

#### Acceptance Criteria

1. WHEN a frame upload is submitted, THE Validation_System SHALL check that the file format is PNG, JPEG, JPG, WebP, or GIF
2. IF the file format is not in the allowed list, THEN THE Validation_System SHALL reject the upload with error message "Invalid file format. Only PNG, JPEG, JPG, WebP, or GIF are allowed"
3. THE Validation_System SHALL verify the file MIME type matches the file extension
4. IF the MIME type does not match the extension, THEN THE Validation_System SHALL reject the upload with error message "File type mismatch detected"

### Requirement 2: File Size Validation

**User Story:** As a system administrator, I want to limit frame upload file sizes, so that storage and performance are not impacted by oversized files.

#### Acceptance Criteria

1. WHEN a frame upload is submitted, THE Validation_System SHALL check that the file size is less than or equal to 5MB
2. IF the file size exceeds 5MB, THEN THE Validation_System SHALL reject the upload with error message "File size exceeds 5MB limit. Current size: {size}MB"
3. THE Validation_System SHALL calculate file size from the buffer before storage
4. THE Upload_Response SHALL include the validated file size in bytes

### Requirement 3: Standard Frame Dimensions

**User Story:** As a frame designer, I want clear dimension standards for each frame type, so that frames render consistently across all devices.

#### Acceptance Criteria

1. THE Validation_System SHALL define Standard_Dimension for 2-slot frames as 1080x1620 pixels
2. THE Validation_System SHALL define Standard_Dimension for 4-slot frames as 1080x2160 pixels
3. THE Validation_System SHALL define Standard_Dimension for 6-slot frames as 1080x2700 pixels
4. WHEN a frame upload is submitted with Photo_Slots, THE Validation_System SHALL determine Frame_Type from the number of Photo_Slots
5. THE Validation_System SHALL allow dimension tolerance of ±10% from Standard_Dimension

### Requirement 4: Dimension Validation

**User Story:** As a system administrator, I want to validate uploaded frame dimensions, so that frames match the required standards for their type.

#### Acceptance Criteria

1. WHEN a frame upload is submitted with Photo_Slots, THE Validation_System SHALL extract image dimensions from the file buffer
2. THE Validation_System SHALL determine expected Standard_Dimension based on the number of Photo_Slots
3. IF the image dimensions differ from Standard_Dimension by more than 10%, THEN THE Validation_System SHALL reject the upload with error message "Frame dimensions {actual_width}x{actual_height} do not match standard for {slot_count}-slot frame. Expected: {expected_width}x{expected_height} (±10%)"
4. IF the Aspect_Ratio differs from the standard aspect ratio by more than 5%, THEN THE Validation_System SHALL issue a warning message "Aspect ratio deviation detected: {deviation}%"

### Requirement 5: Photo Slot Requirement

**User Story:** As a developer, I want to ensure all frame uploads include photo slot definitions, so that photos render correctly within frames.

#### Acceptance Criteria

1. WHEN a frame upload is submitted with a frameImage, THE Validation_System SHALL check that photoSlots array is provided
2. IF photoSlots array is missing or empty, THEN THE Validation_System SHALL reject the upload with error message "Frame with image must include photoSlots definition"
3. THE Validation_System SHALL validate that photoSlots is an array
4. THE Validation_System SHALL validate that photoSlots contains at least 1 element

### Requirement 6: Photo Slot Structure Validation

**User Story:** As a developer, I want to validate photo slot structure, so that each slot has valid positioning and sizing data.

#### Acceptance Criteria

1. WHEN validating photoSlots, THE Validation_System SHALL check that each Photo_Slot contains x, y, width, height, and rotation properties
2. IF any required property is missing, THEN THE Validation_System SHALL reject the upload with error message "Photo slot {index} missing required property: {property}"
3. THE Validation_System SHALL validate that x, y, width, and height are numbers between 0 and 100
4. THE Validation_System SHALL validate that rotation is a number between -360 and 360
5. IF any numeric value is out of range, THEN THE Validation_System SHALL reject the upload with error message "Photo slot {index} has invalid {property} value: {value}. Must be between {min} and {max}"

### Requirement 7: Safe Zone Validation

**User Story:** As a frame designer, I want to ensure photo slots stay within safe boundaries, so that photos are not obscured by frame decorations.

#### Acceptance Criteria

1. WHEN validating photoSlots, THE Validation_System SHALL calculate the Safe_Zone boundaries as 5% margin from frame edges
2. THE Validation_System SHALL check that each Photo_Slot x position is greater than or equal to 5
3. THE Validation_System SHALL check that each Photo_Slot y position is greater than or equal to 5
4. THE Validation_System SHALL check that (x + width) is less than or equal to 95
5. THE Validation_System SHALL check that (y + height) is less than or equal to 95
6. IF any Photo_Slot extends outside Safe_Zone boundaries, THEN THE Validation_System SHALL reject the upload with error message "Photo slot {index} extends outside safe zone. Position: ({x}, {y}), Size: ({width}, {height})"

### Requirement 8: Photo Slot Overlap Detection

**User Story:** As a frame designer, I want to detect overlapping photo slots, so that photos do not render on top of each other.

#### Acceptance Criteria

1. WHEN validating photoSlots, THE Validation_System SHALL check for overlaps between all Photo_Slot pairs
2. THE Validation_System SHALL calculate overlap using bounding box intersection
3. IF two Photo_Slots overlap by more than 2%, THEN THE Validation_System SHALL issue a warning message "Photo slots {index1} and {index2} overlap by {percentage}%"
4. THE Validation_System SHALL include overlap warnings in the Upload_Response

### Requirement 9: Validation Error Response

**User Story:** As a frontend developer, I want structured error responses from validation, so that I can display helpful messages to users.

#### Acceptance Criteria

1. WHEN validation fails, THE Validation_System SHALL return HTTP status 400
2. THE Upload_Response SHALL include an error property with a descriptive error message
3. THE Upload_Response SHALL include a validationErrors array containing all validation failures
4. WHEN multiple validation errors exist, THE Upload_Response SHALL include all errors in the validationErrors array
5. THE Upload_Response SHALL follow the format: `{ "error": "Validation failed", "validationErrors": ["error1", "error2"] }`

### Requirement 10: Validation Success Response

**User Story:** As a frontend developer, I want structured success responses after validation, so that I can confirm upload completion and display frame details.

#### Acceptance Criteria

1. WHEN validation succeeds, THE Validation_System SHALL return HTTP status 200
2. THE Upload_Response SHALL include success property set to true
3. THE Upload_Response SHALL include a message property with value "Frame upload validated successfully"
4. THE Upload_Response SHALL include a file object containing filename, url, path, size, dimensions, and frameType properties
5. IF validation warnings exist, THE Upload_Response SHALL include a warnings array containing warning messages

### Requirement 11: Standards Documentation

**User Story:** As a frame designer, I want clear documentation of frame standards, so that I can create compliant frames before uploading.

#### Acceptance Criteria

1. THE system SHALL provide a standards documentation file at `/docs/frame-standards.md`
2. THE documentation SHALL include Standard_Dimension specifications for all Frame_Types
3. THE documentation SHALL include file format requirements
4. THE documentation SHALL include File_Size_Limit specification
5. THE documentation SHALL include Safe_Zone guidelines with visual examples
6. THE documentation SHALL include Photo_Slot structure schema
7. THE documentation SHALL include examples of valid and invalid frame configurations

### Requirement 12: Admin Panel Validation Feedback

**User Story:** As an administrator, I want real-time validation feedback in the upload form, so that I can correct errors before submitting.

#### Acceptance Criteria

1. WHEN a frame image file is selected in Admin_Panel, THE frontend SHALL display file size before upload
2. IF the file size exceeds File_Size_Limit, THEN THE Admin_Panel SHALL display an error message "File too large: {size}MB. Maximum: 5MB"
3. WHEN Photo_Slots are defined, THE Admin_Panel SHALL display a preview showing Photo_Slot positions overlaid on the frame image
4. THE Admin_Panel SHALL highlight Photo_Slots that extend outside Safe_Zone boundaries in red
5. THE Admin_Panel SHALL display dimension information showing actual dimensions and expected Standard_Dimension

### Requirement 13: Automatic Frame Type Detection

**User Story:** As an administrator, I want automatic frame type detection, so that I do not need to manually specify the frame category.

#### Acceptance Criteria

1. WHEN Photo_Slots are defined, THE Validation_System SHALL automatically determine Frame_Type based on slot count
2. IF photoSlots.length equals 2, THE Validation_System SHALL set Frame_Type to "2-slot"
3. IF photoSlots.length equals 4, THE Validation_System SHALL set Frame_Type to "4-slot"
4. IF photoSlots.length equals 6, THE Validation_System SHALL set Frame_Type to "6-slot"
5. IF photoSlots.length does not equal 2, 4, or 6, THEN THE Validation_System SHALL reject the upload with error message "Invalid number of photo slots: {count}. Supported: 2, 4, or 6 slots"

### Requirement 14: Image Dimension Extraction

**User Story:** As a developer, I want automatic dimension extraction from uploaded images, so that validation can proceed without manual input.

#### Acceptance Criteria

1. WHEN a frame image is uploaded, THE Validation_System SHALL extract width and height from the image buffer using the sharp library
2. THE Validation_System SHALL extract dimensions before performing dimension validation
3. IF dimension extraction fails, THEN THE Validation_System SHALL reject the upload with error message "Failed to read image dimensions. File may be corrupted"
4. THE Upload_Response SHALL include extracted dimensions in the file object

### Requirement 15: Transparent Background Recommendation

**User Story:** As an administrator, I want guidance on transparent backgrounds, so that frames render correctly over photos.

#### Acceptance Criteria

1. WHEN a PNG file is uploaded, THE Admin_Panel SHALL display an informational message "PNG format detected. Ensure background is transparent for best results"
2. WHEN a JPEG or JPG file is uploaded, THE Admin_Panel SHALL display a warning message "JPEG format does not support transparency. Consider using PNG for transparent backgrounds"
3. THE standards documentation SHALL include a section explaining transparent background requirements
4. THE standards documentation SHALL include examples showing transparent vs opaque backgrounds
