# 🎨 DESIGN BRIEF - Photo Booth Frame Strip

## 📋 THÔNG TIN DỰ ÁN

**Tên dự án:** Frame Strip cho Photo Booth  
**Loại sản phẩm:** Frame overlay cho ảnh strip photo booth  
**Định dạng file yêu cầu:** PNG với nền trong suốt  
**Deadline:** [Điền deadline của bạn]  
**Người liên hệ:** [Tên và contact]

---

## 🎯 YÊU CẦU KỸ THUẬT (BẮT BUỘC)

### 1. Kích thước Canvas

| Loại Frame | Kích thước (pixels) | Tỷ lệ | Số ô ảnh |
|------------|---------------------|-------|----------|
| **4-slot** (ưu tiên) | **1080 × 2160 px** | 1:2 | 4 ô |
| 2-slot | 1080 × 1620 px | 2:3 | 2 ô |
| 6-slot | 1080 × 2700 px | 2:5 | 6 ô |

**⚠️ QUAN TRỌNG:**
- Width PHẢI là **1080 pixels** (cố định)
- Height tùy số ô: 1620 / 2160 / 2700
- Resolution: **300 DPI** để in đẹp
- Color mode: **RGB**

### 2. Yêu cầu về File

```
✅ Format: PNG
✅ Nền: TRANSPARENT (trong suốt)
✅ Dung lượng: < 5MB
✅ Layers: Flatten trước khi export
✅ Color profile: sRGB
```

### 3. Photo Slots (Vùng ảnh)

Frame PHẢI có **4 vùng ảnh trong suốt** để ảnh của user hiển thị qua:

```
Vị trí các ô ảnh (4-slot frame):
┌─────────────────────────────┐
│ [Margin 5%]                 │
│                             │
│  ┌─────────────────────┐    │ ← Photo Slot 1
│  │   (Trong suốt)      │    │   (Transparent)
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │ ← Photo Slot 2
│  │   (Trong suốt)      │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │ ← Photo Slot 3
│  │   (Trong suốt)      │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │ ← Photo Slot 4
│  │   (Trong suốt)      │    │
│  └─────────────────────┘    │
│                             │
│ [Margin 5%]                 │
└─────────────────────────────┘
     1080 × 2160 px
```

**Kích thước mỗi ô ảnh:**
- Width: ~972px (90% của canvas)
- Height: ~486px (mỗi ô)
- Spacing: ~54px giữa các ô

### 4. Safe Zone (Vùng an toàn)

```
┌─────────────────────────────┐
│ ← 54px (5%) →              │ ← DANGER ZONE
│  ╔═════════════════════╗    │   (Không đặt nội dung quan trọng)
│  ║                     ║    │
│  ║   SAFE ZONE         ║    │
│  ║   (Đặt decoration   ║    │
│  ║    ở đây)           ║    │
│  ║                     ║    │
│  ╚═════════════════════╝    │
│              ← 54px (5%) →  │ ← DANGER ZONE
└─────────────────────────────┘
```

**Quy tắc:**
- ✅ Decoration CHỈ được đặt trong vùng an toàn (5% margin từ mép)
- ✅ Text, logo, icons phải cách mép ≥ 54 pixels
- ❌ KHÔNG đặt nội dung quan trọng sát mép (có thể bị cắt)

---

## 🎨 HƯỚNG DẪN THIẾT KẾ

### Style Guide

**Màu sắc khuyên dùng:**
- Pastel colors: #FFE4E9, #FFF0F5, #FFF4CC, #E0F2FE
- Gradient nhẹ nhàng
- Tránh màu quá đậm che mất ảnh

**Typography:**
- Font: Sans-serif, dễ đọc (Arial, Helvetica, Montserrat)
- Title size: 60-80px
- Subtitle: 30-40px
- Màu text: #333333 hoặc #FFFFFF tùy nền

**Decoration Elements:**
- Hoa, ngôi sao, trái tim, confetti
- Border nhẹ xung quanh photo slots
- Corner decorations
- Pattern background (subtle)

### Ví dụ Layout

```
┌─────────────────────────────┐
│  🌸  EVENT TITLE  ⭐       │ ← Header decoration
│                             │
│  ┌─────────────────────┐    │
│  │                     │    │ ← Photo 1
│  └─────────────────────┘    │
│     ❤️                     │ ← Small decorations
│  ┌─────────────────────┐    │
│  │                     │    │ ← Photo 2
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │                     │    │ ← Photo 3
│  └─────────────────────┘    │
│                       🏆    │
│  ┌─────────────────────┐    │
│  │                     │    │ ← Photo 4
│  └─────────────────────┘    │
│                             │
│  www.yoursite.com  📅 2025  │ ← Footer
└─────────────────────────────┘
```

---

## 📦 DELIVERABLES (File cần giao)

### Bắt buộc:
1. **Final PNG** (transparent background)
   - Filename: `frame-[tên]-final.png`
   - Size: 1080×2160px
   - < 5MB

2. **Source File** (để chỉnh sửa sau)
   - PSD/AI/Figma file với layers
   - Filename: `frame-[tên]-source.psd`

3. **Preview** (để kiểm tra)
   - PNG với ảnh mẫu trong các slots
   - Filename: `frame-[tên]-preview.png`

### Tùy chọn:
4. **Variations** (nếu có nhiều themes)
   - Spring, Summer, Autumn, Winter versions
   - Different color schemes

---

## ✅ CHECKLIST TRƯỚC KHI GỬI

Trước khi gửi file, kiểm tra:

- [ ] Kích thước: 1080 × 2160 pixels (hoặc theo yêu cầu)
- [ ] Format: PNG với nền trong suốt
- [ ] 4 vùng ảnh transparent đã có (photo slots)
- [ ] Decoration nằm trong safe zone (≥5% từ mép)
- [ ] Dung lượng file < 5MB
- [ ] Resolution: 300 DPI
- [ ] Color mode: RGB
- [ ] Không có layers ẩn hoặc junk
- [ ] Test với ảnh mẫu để check vùng trong suốt

---

## 🔧 SETUP TRONG PHOTOSHOP

### Bước 1: Tạo Document mới
```
File → New
Width: 1080 px
Height: 2160 px
Resolution: 300 dpi
Color Mode: RGB Color
Background Contents: Transparent ✅
```

### Bước 2: Tạo Guides
```
View → New Guide
Vertical: 5% (54px)
Vertical: 95% (1026px)
Horizontal: 5% (108px)
Horizontal: 95% (2052px)
```

### Bước 3: Tạo Photo Slots
```
1. New Layer → Name: "Photo Slots"
2. Rectangle Tool
3. Vẽ 4 hình chữ nhật:
   - Slot 1: X=54, Y=54, W=972, H=486
   - Slot 2: X=54, Y=594, W=972, H=486
   - Slot 3: X=54, Y=1134, W=972, H=486
   - Slot 4: X=54, Y=1674, W=972, H=486
4. Fill: Black (để debug)
5. Sau khi thiết kế xong → DELETE layer này
```

### Bước 4: Design
```
1. Layer → New Layer → Name: "Background"
2. Fill màu pastel hoặc gradient
3. Add decorations (text, shapes, stickers)
4. Keep everything OUTSIDE photo slot areas
```

### Bước 5: Export
```
1. Hide hoặc delete "Photo Slots" layer
2. File → Export → Export As
3. Format: PNG
4. Transparency: ✅ Checked
5. Save
```

---

## 🎯 REFERENCE EXAMPLES

### Good Examples ✅

**Frame 1: Minimalist**
- Clean white background
- Simple border around slots
- Small corner decorations
- Event name at bottom

**Frame 2: Floral**
- Pastel pink background
- Cherry blossoms at corners
- Delicate border pattern
- Romantic vibe

**Frame 3: Modern**
- Gradient background
- Geometric shapes
- Bold typography
- Contemporary feel

### Bad Examples ❌

**Frame X: Too busy**
- ❌ Quá nhiều decoration che ảnh
- ❌ Màu quá đậm
- ❌ Text quá gần mép

**Frame Y: Wrong size**
- ❌ Không đúng 1080×2160
- ❌ Ảnh bị méo

**Frame Z: No transparency**
- ❌ Nền trắng đặc (không trong suốt)
- ❌ Che mất ảnh user

---

## 📞 LIÊN HỆ & SUPPORT

**Câu hỏi thường gặp:**

**Q: Tôi có thể dùng font chữ bất kỳ không?**  
A: Có, nhưng nên dùng font phổ biến và dễ đọc. Avoid fancy fonts.

**Q: Photo slots phải là hình chữ nhật thẳng?**  
A: Có thể bo góc nhẹ (5-10px radius) nhưng không nên tròn hoặc shapes phức tạp.

**Q: Tôi muốn thêm logo, đặt ở đâu?**  
A: Góc dưới phải, size ~80×80px, trong safe zone.

**Q: Có thể dùng JPEG không?**  
A: KHÔNG. Phải là PNG với nền trong suốt.

**Q: File PSD có layers nhiều có sao không?**  
A: Source file có layers OK, nhưng PNG export phải flatten và transparent background.

**Q: Làm sao test xem nền trong suốt chưa?**  
A: Mở trong Photoshop, background layer phải có checkerboard pattern (không phải trắng đặc).

---

## 📚 TEMPLATE FILES

**Download templates:**
- `frame-template-4slot.svg` (Vector template)
- `frame-template-generator.html` (Browser tool)
- `HUONG_DAN_UPLOAD_FRAME.md` (Full guide)

**Generator tool:**  
Mở file `frame-template-generator.html` trong browser để xem template tương tác.

---

## 🎉 FINAL NOTES

- Design theo sở thích của bạn, miễn tuân thủ kích thước
- Sáng tạo với decoration, nhưng giữ photo slots sạch sẽ
- Test với ảnh mẫu trước khi gửi
- Gửi file qua [method: email/drive/etc]

**Good luck với design! 🎨**

---

**Version:** 1.0  
**Last updated:** 2026-06-19  
**Contact:** [Your contact info]
