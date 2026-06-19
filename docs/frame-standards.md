# Frame Strip Standards & Upload Guidelines

## 📋 Overview

This document provides comprehensive guidelines for creating and uploading frame strips for the photo booth application. Following these standards ensures your frames render correctly across all devices and photo configurations.

## 📐 Standard Frame Dimensions

### Dimension Table

| Frame Type | Width (px) | Height (px) | Aspect Ratio | Photo Slots | Use Case |
|------------|-----------|-------------|--------------|-------------|----------|
| **2-slot** | 1080 | 1620 | 2:3 (0.667) | 2 | Portrait orientation, minimal layout |
| **4-slot** | 1080 | 2160 | 1:2 (0.5) | 4 | Standard photo booth strip |
| **6-slot** | 1080 | 2700 | 2:5 (0.4) | 6 | Extended layout, maximum photos |

### Dimension Tolerance

- **Allowed tolerance**: ±10% for both width and height
- **Aspect ratio tolerance**: ±5% from standard ratio

#### Examples:

✅ **Valid 4-slot dimensions:**
- 1080 x 2160 (exact)
- 1000 x 2000 (within ±10%)
- 1150 x 2300 (within ±10%)

❌ **Invalid 4-slot dimensions:**
- 900 x 1800 (exceeds -10% tolerance)
- 1300 x 2600 (exceeds +10% tolerance)
- 1080 x 1080 (wrong aspect ratio)

## 📁 File Format Requirements

### Allowed Formats

| Format | Extension | MIME Type | Transparency Support | Recommended |
|--------|-----------|-----------|---------------------|-------------|
| **PNG** | `.png` | `image/png` | ✅ Yes | ✅ **Best choice** |
| **WebP** | `.webp` | `image/webp` | ✅ Yes | ✅ Good alternative |
| **JPEG** | `.jpg`, `.jpeg` | `image/jpeg` | ❌ No | ⚠️ Not recommended |
| **GIF** | `.gif` | `image/gif` | ✅ Yes | ⚠️ Limited support |

### Format Recommendations

- **Best choice**: PNG with transparent background
  - Full transparency support
  - No compression artifacts
  - Wide compatibility

- **Good alternative**: WebP with transparency
  - Smaller file sizes
  - Good quality
  - Modern format

- **Not recommended**: JPEG
  - No transparency support
  - Compression artifacts
  - Opaque background will cover photos

## 💾 File Size Limit

- **Maximum file size**: 5MB (5,242,880 bytes)
- Files exceeding this limit will be rejected
- Tip: Use PNG compression tools to reduce file size without losing quality

### File Size Optimization Tips

1. **Use PNG-8** instead of PNG-24 when possible (fewer colors = smaller file)
2. **Optimize with tools** like TinyPNG, ImageOptim, or Squoosh
3. **Remove metadata** (EXIF data, color profiles) to reduce size
4. **Consider WebP** format for better compression with quality

## 🎯 Safe Zone Guidelines

### What is the Safe Zone?

The **safe zone** is the area where photo slots should be positioned to avoid being obscured by frame decorations or edge artifacts.

### Safe Zone Specifications

- **Margin**: 5% from all edges
- **Safe area**: 90% width × 90% height (center region)

### Visual Diagram

```
┌─────────────────────────────────────────┐
│ ← 5% margin                             │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │                                 │    │
│  │     SAFE ZONE                   │    │
│  │     (90% × 90%)                 │    │
│  │                                 │    │
│  │     Photo slots should be       │    │
│  │     positioned here             │    │
│  │                                 │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                        5% margin →  │
└─────────────────────────────────────────┘
```

### Safe Zone Rules

✅ **DO:**
- Position photo slots with at least 5% margin from edges
- Keep all photo content within the safe zone
- Test frames at different screen sizes

❌ **DON'T:**
- Place photo slots at the very edge (0% margin)
- Extend photo slots beyond 95% in any direction
- Ignore safe zone warnings during upload

## 📷 Photo Slot Structure

### Required Properties

Each photo slot must include the following properties:

```javascript
{
  x: number,        // X position (0-100% from left)
  y: number,        // Y position (0-100% from top)
  width: number,    // Width (0-100% of frame width)
  height: number,   // Height (0-100% of frame height)
  rotation: number  // Rotation in degrees (-360 to 360)
}
```

### Property Ranges

| Property | Type | Min | Max | Unit | Description |
|----------|------|-----|-----|------|-------------|
| `x` | Number | 0 | 100 | % | Distance from left edge |
| `y` | Number | 0 | 100 | % | Distance from top edge |
| `width` | Number | 0 | 100 | % | Slot width |
| `height` | Number | 0 | 100 | % | Slot height |
| `rotation` | Number | -360 | 360 | degrees | Clockwise rotation |

### Photo Slot Examples

#### ✅ Valid 4-Slot Configuration

```json
[
  {
    "x": 10,
    "y": 5,
    "width": 80,
    "height": 20,
    "rotation": 0
  },
  {
    "x": 10,
    "y": 28,
    "width": 80,
    "height": 20,
    "rotation": 0
  },
  {
    "x": 10,
    "y": 51,
    "width": 80,
    "height": 20,
    "rotation": 0
  },
  {
    "x": 10,
    "y": 74,
    "width": 80,
    "height": 20,
    "rotation": 0
  }
]
```

**Why valid:**
- All slots within safe zone (5% margin)
- No overlaps
- Evenly distributed vertically
- Standard layout for 4-slot frame

#### ❌ Invalid Configuration: Outside Safe Zone

```json
[
  {
    "x": 0,        // ❌ Starts at edge (violates 5% margin)
    "y": 0,        // ❌ Starts at edge
    "width": 100,  // ❌ Extends to edge
    "height": 25,
    "rotation": 0
  }
]
```

**Why invalid:**
- x and y start at 0 (need to be ≥5)
- width of 100% means x + width = 100 (needs to be ≤95)

#### ❌ Invalid Configuration: Missing Properties

```json
[
  {
    "x": 10,
    "y": 10,
    "width": 80
    // ❌ Missing height and rotation
  }
]
```

**Why invalid:**
- Missing required `height` property
- Missing required `rotation` property

#### ❌ Invalid Configuration: Overlapping Slots

```json
[
  {
    "x": 10,
    "y": 10,
    "width": 80,
    "height": 30,  // Ends at y=40
    "rotation": 0
  },
  {
    "x": 10,
    "y": 25,      // ❌ Starts before previous slot ends
    "width": 80,
    "height": 30,
    "rotation": 0
  }
]
```

**Why invalid:**
- Slots overlap by more than 2% (warning threshold)
- Photos will render on top of each other

### Slot Overlap Rules

- **Maximum overlap**: 2% (relative to smaller slot area)
- Overlaps >2% will generate **warnings** (not errors)
- Best practice: Avoid all overlaps for clean layout

## 🎨 Transparent Background Guidelines

### Why Transparency Matters

Frame strips should have **transparent backgrounds** to overlay correctly on top of photo content.

### Creating Transparent Frames

1. **Use design tools with transparency support:**
   - Adobe Photoshop
   - GIMP (free)
   - Figma
   - Canva (Pro)

2. **Export settings:**
   - Format: PNG-24 or PNG-32
   - Background: Transparent (not white)
   - Color mode: RGB with alpha channel

3. **Verification:**
   - Open in image viewer with checkerboard pattern
   - Transparent areas should show checkerboard

### Visual Example

```
❌ OPAQUE BACKGROUND (JPEG)          ✅ TRANSPARENT BACKGROUND (PNG)
┌─────────────────────────┐          ┌─────────────────────────┐
│████████████████████     │          │░░░░░░░░░░░░░░░░░░░     │
│█ [WHITE BACKGROUND] █   │          │░ [TRANSPARENT]  ░       │
│█                    █   │          │░                ░       │
│█  ┌──────────────┐  █   │          │░  ┌──────────────┐  ░  │
│█  │ Photo Slot 1 │  █   │          │░  │ Photo Slot 1 │  ░  │
│█  └──────────────┘  █   │          │░  └──────────────┘  ░  │
│█                    █   │          │░                ░       │
│████████████████████     │          │░░░░░░░░░░░░░░░░░░░     │
└─────────────────────────┘          └─────────────────────────┘
Photos hidden by white bg            Photos visible through
                                      transparent areas
```

## 📝 Upload Process

### Step-by-Step Guide

1. **Prepare your frame image:**
   - Follow dimension standards
   - Use PNG format with transparency
   - Optimize file size (<5MB)

2. **Define photo slots:**
   - Specify number of slots (2, 4, or 6)
   - Position within safe zone
   - Avoid overlaps

3. **Upload through admin panel:**
   - Select frame image file
   - Set number of photo slots
   - Review auto-generated slot positions
   - Adjust if needed using visual editor

4. **Validation feedback:**
   - Green ✅ = All validations passed
   - Yellow ⚠️ = Warnings (frame will work, but consider fixing)
   - Red ❌ = Errors (frame rejected, must fix)

### Common Validation Errors

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "File size exceeds 5MB limit" | Image file too large | Compress image or reduce dimensions |
| "Invalid file format" | Wrong file type | Convert to PNG, JPEG, WebP, or GIF |
| "Frame dimensions do not match standard" | Wrong dimensions | Resize to standard dimensions ±10% |
| "Photo slot X extends outside safe zone" | Slot too close to edge | Move slot away from edges (≥5% margin) |
| "Frame with image must include photoSlots" | No slots defined | Add photo slot definitions |
| "Photo slot X missing required property" | Incomplete slot data | Add all required properties (x, y, width, height, rotation) |

### Common Validation Warnings

| Warning Message | Cause | Recommendation |
|----------------|-------|---------------|
| "JPEG format does not support transparency" | Using JPEG format | Switch to PNG for transparent background |
| "Aspect ratio deviation detected" | Aspect ratio >5% off standard | Adjust dimensions to match standard ratio |
| "Photo slots X and Y overlap" | Slots positioned too close | Adjust positions to eliminate overlap |

## ✅ Validation Checklist

Before uploading, verify:

- [ ] Frame dimensions match standard (±10% tolerance)
- [ ] File format is PNG with transparent background
- [ ] File size is under 5MB
- [ ] Photo slots defined (2, 4, or 6 slots)
- [ ] All slots have required properties (x, y, width, height, rotation)
- [ ] All slots within safe zone (5% margin from edges)
- [ ] No overlapping slots (>2%)
- [ ] Tested frame preview with sample photos

## 🔧 Troubleshooting

### Issue: "File too large"

**Causes:**
- High resolution image
- Uncompressed PNG
- Embedded metadata

**Solutions:**
1. Use online compression tools (TinyPNG, Squoosh)
2. Remove EXIF metadata
3. Convert to WebP format
4. Reduce image dimensions while maintaining aspect ratio

### Issue: "Dimensions do not match standard"

**Causes:**
- Wrong aspect ratio
- Image resized incorrectly
- Using custom dimensions

**Solutions:**
1. Check which frame type you want (2/4/6-slot)
2. Resize to exact standard dimensions
3. Or resize to within ±10% tolerance
4. Maintain aspect ratio when resizing

### Issue: "Photo slot extends outside safe zone"

**Causes:**
- Slot positioned at edge (x or y < 5%)
- Slot extends too far (x+width or y+height > 95%)

**Solutions:**
1. Adjust x position to be ≥5
2. Adjust y position to be ≥5
3. Ensure x + width ≤95
4. Ensure y + height ≤95
5. Use visual editor to preview safe zone boundaries

### Issue: "Transparent background not working"

**Causes:**
- Using JPEG format
- PNG exported without alpha channel
- White background instead of transparency

**Solutions:**
1. Export as PNG-24 or PNG-32 (not PNG-8)
2. Enable alpha channel in export settings
3. Verify transparency in image editor (checkerboard pattern)
4. Don't use JPEG format

## 📞 Support

For additional help:
- Review existing frames in admin panel for examples
- Use the visual slot editor for positioning guidance
- Check validation feedback messages during upload
- Contact support if issues persist

## 📚 Additional Resources

- **Design Templates**: Coming soon
- **Example Frames**: Available in admin panel
- **Video Tutorials**: Coming soon

---

**Last Updated**: 2026-06-19  
**Version**: 1.0.0
