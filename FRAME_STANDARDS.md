# 📐 QUY ĐỊNH CHUẨN VỀ KHUNG STRIP (FRAME STANDARDS)

## 🎯 Mục đích

Tài liệu này quy định các chuẩn kỹ thuật cho frame strip photobooth để đảm bảo:
- ✅ Ảnh người dùng hiển thị đúng vị trí trong khung
- ✅ Không bị cắt xén, méo ảnh, hoặc có vùng đen thừa
- ✅ Frame có thể tái sử dụng cho strip 2, 4, hoặc 6 ảnh
- ✅ Upload và hiển thị ổn định

---

## 📏 1. KỸ THUẬT VÀ KÍCH THƯỚC

### 1.1. Định dạng tệp
| Tiêu chí | Yêu cầu | Lý do |
|----------|---------|-------|
| **Format** | PNG (khuyến nghị) hoặc WebP | Hỗ trợ nền trong suốt |
| **Background** | Transparent (alpha channel) | Để ảnh người dùng hiển thị qua frame |
| **Color Mode** | RGB hoặc RGBA | RGBA cho transparency |
| **Bit Depth** | 24-bit (RGB) hoặc 32-bit (RGBA) | Đảm bảo chất lượng màu |

### 1.2. Kích thước chuẩn

#### Portrait Strip (Khuyến nghị cho photobooth)
```
Width:  1080px (cố định)
Height: 1920px (tỷ lệ 9:16)
Aspect Ratio: 9:16
Resolution: 72-300 DPI
```

#### Kích thước thay thế (tùy thiết bị)
- **Mobile-optimized**: 720 x 1280px (9:16)
- **High-res**: 2160 x 3840px (9:16)
- **Square**: 1080 x 1080px (1:1) - cho Instagram

⚠️ **LƯU Ý**: Luôn giữ tỷ lệ 9:16 để tương thích với thiết bị di động

### 1.3. Dung lượng tệp
| Loại | Giới hạn | Khuyến nghị |
|------|----------|-------------|
| **Maximum** | 5 MB | Hard limit - server sẽ reject |
| **Optimal** | 500 KB - 2 MB | Load nhanh, chất lượng tốt |
| **Minimum** | 100 KB | Tránh bị mờ/vỡ ảnh |

**Cách giảm dung lượng:**
- Dùng PNG-8 thay vì PNG-24 (nếu ít màu)
- Compress với [TinyPNG](https://tinypng.com/)
- Chuyển sang WebP (giảm 30-50% dung lượng)

---

## 🖼️ 2. PHOTO SLOTS (VỊ TRÍ KHUNG ẢNH)

### 2.1. Định nghĩa Photo Slot

Photo Slot là vùng trong frame nơi ảnh người dùng được hiển thị.

```javascript
{
  x: 0,        // Vị trí X (% từ trái, 0-100)
  y: 0,        // Vị trí Y (% từ trên, 0-100)
  width: 100,  // Chiều rộng (% của frame, 0-100)
  height: 25,  // Chiều cao (% của frame, 0-100)
  rotation: 0  // Góc xoay (độ, -360 đến 360)
}
```

### 2.2. Chuẩn slots cho strip 4 ảnh (phổ biến nhất)

#### ✅ CÁC MẪU LAYOUT CHUẨN

**Layout 1: Full Width, Equal Height (Khuyến nghị)**
```javascript
photoSlots: [
  { x: 0, y: 0,  width: 100, height: 23, rotation: 0 }, // Top
  { x: 0, y: 24, width: 100, height: 23, rotation: 0 }, // Middle-top
  { x: 0, y: 48, width: 100, height: 23, rotation: 0 }, // Middle-bottom
  { x: 0, y: 72, width: 100, height: 23, rotation: 0 }  // Bottom
]
```

**Layout 2: Có margin/border**
```javascript
photoSlots: [
  { x: 5,  y: 5,  width: 90, height: 20, rotation: 0 },
  { x: 5,  y: 27, width: 90, height: 20, rotation: 0 },
  { x: 5,  y: 49, width: 90, height: 20, rotation: 0 },
  { x: 5,  y: 71, width: 90, height: 20, rotation: 0 }
]
```

**Layout 3: Polaroid style**
```javascript
photoSlots: [
  { x: 10, y: 8,  width: 80, height: 18, rotation: -2 },
  { x: 10, y: 28, width: 80, height: 18, rotation: 1 },
  { x: 10, y: 48, width: 80, height: 18, rotation: -1 },
  { x: 10, y: 68, width: 80, height: 18, rotation: 2 }
]
```

### 2.3. Chuẩn slots cho strip 2 ảnh

```javascript
photoSlots: [
  { x: 0, y: 10, width: 100, height: 38, rotation: 0 }, // Top half
  { x: 0, y: 52, width: 100, height: 38, rotation: 0 }  // Bottom half
]
```

### 2.4. Chuẩn slots cho strip 6 ảnh

```javascript
photoSlots: [
  { x: 0, y: 2,  width: 100, height: 15, rotation: 0 },
  { x: 0, y: 18, width: 100, height: 15, rotation: 0 },
  { x: 0, y: 34, width: 100, height: 15, rotation: 0 },
  { x: 0, y: 50, width: 100, height: 15, rotation: 0 },
  { x: 0, y: 66, width: 100, height: 15, rotation: 0 },
  { x: 0, y: 82, width: 100, height: 15, rotation: 0 }
]
```

### 2.5. ⚠️ LỖI THƯỜNG GẶP

#### ❌ **LỖI 1: Slots không đủ 100% chiều cao**
```javascript
// SAI - Chỉ chiếm 88% chiều cao → còn 12% đen thừa
photoSlots: [
  { x: 0, y: 0,  width: 100, height: 22, rotation: 0 },
  { x: 0, y: 22, width: 100, height: 22, rotation: 0 },
  { x: 0, y: 44, width: 100, height: 22, rotation: 0 },
  { x: 0, y: 66, width: 100, height: 22, rotation: 0 }
] // Tổng: 88%

// ĐÚNG - Chiếm đủ 100% hoặc gần 100%
photoSlots: [
  { x: 0, y: 0,  width: 100, height: 23, rotation: 0 },
  { x: 0, y: 24, width: 100, height: 23, rotation: 0 },
  { x: 0, y: 48, width: 100, height: 23, rotation: 0 },
  { x: 0, y: 72, width: 100, height: 23, rotation: 0 }
] // Tổng: ~96% (khoảng cách 1% giữa các slot)
```

#### ❌ **LỖI 2: Slots chồng lên nhau**
```javascript
// SAI
{ x: 0, y: 0, width: 100, height: 30, rotation: 0 },
{ x: 0, y: 25, width: 100, height: 30, rotation: 0 } // Chồng 5%
```

#### ❌ **LỖI 3: Slots vượt quá biên frame**
```javascript
// SAI
{ x: 0, y: 90, width: 100, height: 25, rotation: 0 } // 90+25 = 115% > 100%
```

---

## 🎨 3. VÙNG AN TOÀN (SAFE ZONES)

### 3.1. Định nghĩa

Vùng an toàn là khu vực nơi **KHÔNG NÊN** đặt nội dung quan trọng (text, logo, mặt người) vì có thể bị cắt hoặc che khuất.

### 3.2. Safe Zones cho frame (1080 x 1920px)

```
┌─────────────────────────────┐
│   TOP SAFE ZONE (150px)     │ ← Decoration only
├─────────────────────────────┤
│                             │
│   PHOTO SLOT AREA           │ ← User photos
│   (Keep transparent)        │
│                             │
├─────────────────────────────┤
│   BOTTOM SAFE ZONE (150px)  │ ← Decoration only
└─────────────────────────────┘
```

#### Zones:
- **Top Safe Zone**: 0 - 150px (8%) - Chỉ decoration
- **Photo Area**: 150 - 1770px (84%) - Transparent, có thể có border/edge design
- **Bottom Safe Zone**: 1770 - 1920px (8%) - Chỉ decoration

### 3.3. Vùng an toàn cho từng photo slot

Trong mỗi slot, để **20-30px margin** từ biên để tránh mặt người bị cắt:

```
┌─────────────────┐
│ 20px margin     │
│  ┌───────────┐  │
│  │  FACE     │  │ ← Safe area for face
│  │  AREA     │  │
│  └───────────┘  │
│ 20px margin     │
└─────────────────┘
```

---

## 🖌️ 4. THIẾT KẾ FRAME

### 4.1. Các thành phần của frame

```
Frame Image = Background Layer + Decorations + Transparent Slots
```

#### Background Layer
- Màu nền gradient hoặc solid
- Texture (film grain, paper, etc.)
- Không làm ảnh người dùng bị mờ

#### Decorations
- Stickers, text, shapes
- Đặt ở top/bottom safe zones
- Hoặc ở BIÊN của photo slots (không che giữa)

#### Transparent Slots
- Alpha channel = 0 (hoàn toàn trong suốt)
- Có thể có border/stroke nhẹ

### 4.2. Template Photoshop/Figma

#### Photoshop:
1. **New Document**:
   - Width: 1080px
   - Height: 1920px
   - Resolution: 300 DPI
   - Color Mode: RGB
   - Background: Transparent

2. **Create Layers**:
   - Layer 1: Background (fill color/gradient)
   - Layer 2-5: Photo Slots (use Rectangle Tool, delete fill)
   - Layer 6-10: Decorations (text, stickers)

3. **Export**:
   - File → Export → Export As
   - Format: PNG
   - ✅ Transparency: ON
   - Quality: 100%

#### Figma:
1. **Frame**: 1080 x 1920px
2. **Background**: Fill (optional)
3. **Photo Slots**: Rectangles with NO fill, only stroke (optional)
4. **Decorations**: Add elements
5. **Export**: PNG, transparent background

### 4.3. Grid guide cho 4-photo strip

Dùng grid này để canh chỉnh slots chính xác:

```
Total Height: 1920px
Photo Area: 1620px (excluding top/bottom 150px)
Per Slot: 1620 ÷ 4 = 405px/slot
Gap: 15px giữa các slot

Slot 1: y = 150px, height = 405px
Gap: 15px
Slot 2: y = 570px, height = 405px
Gap: 15px
Slot 3: y = 990px, height = 405px
Gap: 15px
Slot 4: y = 1410px, height = 405px
```

Hoặc dùng tỷ lệ %:
```
Slot 1: y = 8%,  height = 21%
Slot 2: y = 30%, height = 21%
Slot 3: y = 52%, height = 21%
Slot 4: y = 74%, height = 21%
```

---

## ✅ 5. CHECKLIST TRƯỚC KHI UPLOAD

### Pre-Upload Checklist:

- [ ] **File format**: PNG hoặc WebP
- [ ] **Dimensions**: 1080 x 1920px (hoặc tỷ lệ 9:16)
- [ ] **File size**: < 5MB (khuyến nghị < 2MB)
- [ ] **Transparency**: Background transparent, slots transparent
- [ ] **Photo slots**: Đã định nghĩa chính xác trong JSON
- [ ] **Total coverage**: Slots chiếm ≥95% chiều cao
- [ ] **No overlap**: Slots không chồng lên nhau
- [ ] **Safe zones**: Decoration chỉ ở top/bottom 150px
- [ ] **Test**: Upload và test với ảnh thật

### Validation Rules:

```javascript
// Server sẽ validate:
1. File type: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
2. File size: ≤ 5MB
3. Photo slots: Phải có ít nhất 2 slots nếu frameImage tồn tại
4. Slot values: x, y, width, height trong khoảng 0-100
```

---

## 🔧 6. CÔNG CỤ KIỂM TRA

### 6.1. Validate photoSlots trước khi upload

```javascript
function validatePhotoSlots(slots, photoCount = 4) {
  if (!slots || slots.length === 0) {
    return { valid: false, error: 'Thiếu photoSlots' }
  }
  
  if (slots.length !== photoCount) {
    return { valid: false, error: `Cần ${photoCount} slots, có ${slots.length}` }
  }
  
  let totalCoverage = 0
  
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i]
    
    // Check required fields
    if (slot.x === undefined || slot.y === undefined || 
        slot.width === undefined || slot.height === undefined) {
      return { valid: false, error: `Slot ${i} thiếu fields bắt buộc` }
    }
    
    // Check ranges
    if (slot.x < 0 || slot.x > 100 || slot.y < 0 || slot.y > 100 ||
        slot.width <= 0 || slot.width > 100 || slot.height <= 0 || slot.height > 100) {
      return { valid: false, error: `Slot ${i} có giá trị ngoài phạm vi 0-100` }
    }
    
    // Check overflow
    if (slot.x + slot.width > 100) {
      return { valid: false, error: `Slot ${i} vượt quá chiều rộng frame` }
    }
    
    if (slot.y + slot.height > 100) {
      return { valid: false, error: `Slot ${i} vượt quá chiều cao frame` }
    }
    
    totalCoverage += slot.height
  }
  
  // Check total coverage (should be close to 100%)
  if (totalCoverage < 85) {
    return { 
      valid: false, 
      error: `Slots chỉ chiếm ${totalCoverage}% chiều cao. Nên ≥85%` 
    }
  }
  
  return { valid: true, coverage: totalCoverage }
}
```

### 6.2. Tool tự động generate slots

```javascript
function generatePhotoSlots(photoCount = 4, hasMargin = false) {
  const slots = []
  const margin = hasMargin ? 5 : 0
  const gap = hasMargin ? 2 : 1
  
  const totalHeight = 100 - (2 * margin)
  const totalGaps = (photoCount - 1) * gap
  const slotHeight = (totalHeight - totalGaps) / photoCount
  
  for (let i = 0; i < photoCount; i++) {
    const y = margin + (i * (slotHeight + gap))
    slots.push({
      x: margin,
      y: Math.round(y * 100) / 100,
      width: 100 - (2 * margin),
      height: Math.round(slotHeight * 100) / 100,
      rotation: 0
    })
  }
  
  return slots
}

// Usage:
const slots4 = generatePhotoSlots(4, false)  // Full width
const slots4Margin = generatePhotoSlots(4, true)  // With 5% margin
const slots2 = generatePhotoSlots(2, false)
const slots6 = generatePhotoSlots(6, false)
```

---

## 📝 7. VÍ DỤ FRAME CHUẨN

### Example 1: Simple Y2K Frame

```json
{
  "id": "y2k-blue",
  "name": "Y2K Blue Vibes",
  "description": "Retro Y2K style with blue theme",
  "emoji": "💫",
  "color": "#4169E1",
  "bgGradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "frameImage": "https://example.com/frames/y2k-blue.png",
  "photoSlots": [
    { "x": 5, "y": 10, "width": 90, "height": 20, "rotation": 0 },
    { "x": 5, "y": 32, "width": 90, "height": 20, "rotation": 0 },
    { "x": 5, "y": 54, "width": 90, "height": 20, "rotation": 0 },
    { "x": 5, "y": 76, "width": 90, "height": 20, "rotation": 0 }
  ]
}
```

### Example 2: Polaroid Frame

```json
{
  "id": "polaroid-vintage",
  "name": "Vintage Polaroid",
  "description": "Classic instant photo style",
  "emoji": "📸",
  "color": "#F8F9FA",
  "bgGradient": "linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)",
  "frameImage": "https://example.com/frames/polaroid.png",
  "photoSlots": [
    { "x": 10, "y": 12, "width": 80, "height": 18, "rotation": -2 },
    { "x": 10, "y": 32, "width": 80, "height": 18, "rotation": 1 },
    { "x": 10, "y": 52, "width": 80, "height": 18, "rotation": -1 },
    { "x": 10, "y": 72, "width": 80, "height": 18, "rotation": 2 }
  ]
}
```

---

## 🚨 8. XỬ LÝ LỖI

### Lỗi thường gặp và cách fix:

| Lỗi | Nguyên nhân | Cách fix |
|-----|-------------|----------|
| **Ảnh bị cắt mặt** | Slots quá hẹp hoặc sai vị trí | Tăng height, điều chỉnh y |
| **Có vùng đen thừa** | Slots không đủ 100% chiều cao | Tăng height hoặc giảm gap |
| **Frame không hiển thị** | File không transparent | Re-export với transparency |
| **File quá lớn, upload fail** | File > 5MB | Compress với TinyPNG |
| **Slots lệch so với frame** | photoSlots không khớp với design | Đo lại vị trí trong Photoshop/Figma |

### Debug process:

1. **Check file**: Mở frame PNG trong Photoshop → xem alpha channel
2. **Check slots**: Log photoSlots trong console
3. **Check render**: Inspect element → xem CSS transform
4. **Test với ảnh đơn giản**: Upload ảnh solid color để thấy slots rõ hơn

---

## 📚 9. TÀI LIỆU THAM KHẢO

### Internal Docs:
- [FRAME_IMAGE_GUIDE.md](./FRAME_IMAGE_GUIDE.md) - Hướng dẫn thiết kế frame
- [FRAME_FEATURE.md](./FRAME_FEATURE.md) - Tài liệu feature
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - Hướng dẫn upload frame

### External Resources:
- [PNG Specification](http://www.libpng.org/pub/png/spec/1.2/PNG-Contents.html)
- [TinyPNG](https://tinypng.com/) - Compress PNG
- [Photopea](https://www.photopea.com/) - Free online Photoshop
- [Figma](https://www.figma.com/) - Design tool

---

## 📞 10. HỖ TRỢ

Nếu gặp vấn đề với frame:

1. **Check existing frames**: GET `/api/frames` để xem frames đã có
2. **Validate slots**: Dùng tool ở section 6.1
3. **Fix automatically**: POST `/api/fix-frame-slots` để tạo slots mặc định
4. **Fix specific frame**: POST `/api/frames/:id/fix-slots`

---

**Version**: 1.0.0  
**Last Updated**: June 19, 2026  
**Maintainer**: Photobooth Dev Team

---

✨ **Happy Frame Designing!** ✨
