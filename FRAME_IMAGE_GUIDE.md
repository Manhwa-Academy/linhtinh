# 🖼️ Hướng dẫn tạo và upload Frame Images

## 📌 Frame Image là gì?

Frame Image là ảnh PNG có nền trong suốt (transparent background) được overlay lên photo strip để tạo hiệu ứng khung ảnh đặc biệt - như trong ảnh mẫu bạn gửi với style Y2K/retro.

## 🎨 Cách tạo Frame Image

### Option 1: Dùng Photoshop

1. **Tạo file mới:**
   - Kích thước: 1080 x 1920px (portrait) hoặc tùy theo layout
   - Background: Transparent
   - Resolution: 300 DPI

2. **Thiết kế frame:**
   - Tạo các khung hình, shapes, decorations
   - Để phần giữa trong suốt (nơi ảnh sẽ hiển thị)
   - Thêm text, stickers, effects

3. **Export:**
   - File → Export → Export As
   - Format: PNG
   - Check "Transparency"
   - Save

### Option 2: Dùng Figma

1. **Tạo Frame:**
   - New Frame: 1080 x 1920px
   - Background: Transparent (bỏ check Fill)

2. **Thiết kế:**
   - Thêm shapes với Fill nhưng để giữa trống
   - Thêm text, icons, decorations
   - Sử dụng effects, shadows, blur

3. **Export:**
   - Select Frame
   - Export as PNG
   - Check "Preview" để xem transparent background

### Option 3: Dùng Canva

1. **Tạo design:**
   - Custom size: 1080 x 1920px
   - Chọn template hoặc tạo từ đầu

2. **Thiết kế:**
   - Thêm elements, shapes, text
   - Xóa background (nếu Canva Pro)
   - Để phần giữa trống

3. **Download:**
   - Download → PNG
   - Check "Transparent background" (Canva Pro required)

## 📐 Quy chuẩn Frame Image

### Kích thước đề xuất:
- **Portrait Strip**: 1080 x 1920px
- **Square Strip**: 1080 x 1080px  
- **Landscape Strip**: 1920 x 1080px

### Kỹ thuật:
- ✅ Format: PNG hoặc WebP
- ✅ Background: Transparent
- ✅ File size: < 5MB
- ✅ Resolution: 72-300 DPI

### Safe zones:
```
┌─────────────────┐
│   [Decoration]  │ <- Top safe zone (150px)
│                 │
│  [Photo Area]   │ <- Keep transparent
│                 │
│   [Decoration]  │ <- Bottom safe zone (150px)
└─────────────────┘
```

## 🎭 Các loại Frame phổ biến

### 1. **Y2K Style** (như ảnh mẫu)
- Stickers, text boxes, stars
- Màu neon, metallic
- Decorative elements: 👾 🌟 ✨ 💫
- Fonts: Bold, outline, glitch

### 2. **Vintage Polaroid**
- White border với shadow
- Date stamp, film grain
- Handwritten text

### 3. **Scrapbook**
- Washi tape effects
- Doodles, stamps
- Colorful stickers

### 4. **Minimal Modern**
- Clean lines
- Geometric shapes
- Monochrome colors

### 5. **Holiday Themes**
- Christmas: 🎄 ❄️ 🎁
- Valentine: 💝 💕 🌹
- Halloween: 🎃 👻 🕷️

## 🔧 Upload Frame vào Admin Panel

### Bước 1: Chuẩn bị file
- File PNG với nền trong suốt
- Size < 5MB
- Đặt tên file dễ nhớ: `y2k-blue-frame.png`

### Bước 2: Upload
1. Vào Admin Panel: http://localhost:5173/admin
2. Click **"+ Thêm Frame Mới"**
3. Điền thông tin:
   - **Tên**: "Y2K Blue Style"
   - **Emoji**: 💫
   - **Mô tả**: "Retro Y2K vibes"
   - **Màu nền**: #4169E1
4. Click **"Upload Frame Image"**
5. Chọn file PNG
6. Click **"Lưu"**

### Bước 3: Test
1. Vào Photobooth
2. Chọn frame mới upload
3. Chụp/upload ảnh
4. Kiểm tra frame có overlay đúng không

## 💡 Tips thiết kế Frame đẹp

### Composition:
- ✅ Để 20-30% không gian cho decoration
- ✅ Balance giữa trên và dưới
- ✅ Không che khuất mặt người

### Colors:
- ✅ Dùng màu tương phản với photo
- ✅ Consistent color scheme
- ✅ Avoid too many colors (3-5 màu max)

### Typography:
- ✅ Readable fonts
- ✅ Max 2-3 font styles
- ✅ Text phải có contrast với background

### Elements:
- ✅ Không quá lộn xộn
- ✅ Align và distribute đều
- ✅ Grouping elements có liên quan

## 🎨 Free Resources

### Fonts:
- [Google Fonts](https://fonts.google.com/)
- [DaFont](https://www.dafont.com/)
- [Font Squirrel](https://www.fontsquirrel.com/)

### Stickers/Elements:
- [Flaticon](https://www.flaticon.com/)
- [Freepik](https://www.freepik.com/)
- [Vecteezy](https://www.vecteezy.com/)

### Inspiration:
- Pinterest: Search "Y2K frame", "photo booth frame"
- Instagram: #photoboothframe #y2kframe
- Behance: "Photo strip design"

### Tutorials:
- YouTube: "How to make transparent PNG"
- YouTube: "Y2K graphic design tutorial"
- YouTube: "Photo frame overlay design"

## 📁 Frame Storage

Frames được lưu tại:
```
backend/
  uploads/
    frames/
      frame-1234567890.png
      frame-0987654321.png
```

Database reference trong `frames.json`:
```json
{
  "id": "y2k-blue-1234567890",
  "name": "Y2K Blue Style",
  "frameImage": "/uploads/frames/frame-1234567890.png"
}
```

## ⚠️ Troubleshooting

### Frame không hiện trong Photobooth
- Check file đã upload thành công: `/uploads/frames/`
- Check `frames.json` có chứa frameImage URL
- Reload page Photobooth

### Frame bị méo/lệch
- Check aspect ratio của frame image
- Resize frame về đúng kích thước
- Reupload

### File quá lớn
- Compress PNG: [TinyPNG](https://tinypng.com/)
- Resize về resolution thấp hơn
- Convert sang WebP

### Background không trong suốt
- Re-export với transparency enabled
- Xóa white background layer trong Photoshop
- Dùng remove.bg để xóa background

## 🚀 Advanced: CSS Overlay

Nếu muốn style frame bằng CSS thay vì upload image:

```css
.frame-overlay {
  position: absolute;
  inset: 0;
  border: 20px solid;
  border-image: url('pattern.png') 30 round;
  box-shadow: inset 0 0 30px rgba(0,0,0,0.3);
}
```

---

**Happy Frame Designing! 🎨✨**
