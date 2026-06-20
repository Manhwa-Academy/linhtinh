# 🎨 Frame Strip Templates - Hướng dẫn sử dụng

## 📦 Có 3 templates sẵn sàng:

### 1. ✨ HTML Generator (KHUYÊN DÙNG)
**File:** `frontend/public/frame-template-generator.html`

**Cách dùng:**
1. Mở file trong trình duyệt (double-click)
2. Chọn số ô (2/4/6)
3. Tùy chỉnh màu sắc và text
4. Click "Download PNG"
5. Xong! File đã đúng chuẩn 1080×2160

**Ưu điểm:**
- ✅ Không cần cài phần mềm
- ✅ Download ngay PNG đúng kích thước
- ✅ Có option "với Guides" để dễ chỉnh sửa
- ✅ Tự động đúng chuẩn

---

### 2. 🎨 SVG Template (cho Photoshop/Illustrator)
**File:** `frontend/public/frame-template-4slot.svg`

**Cách dùng trong Photoshop:**
```
1. File → Open → Chọn frame-template-4slot.svg
2. Resize khi import: Width: 1080, Height: 2160, Resolution: 300
3. Chỉnh sửa:
   - Xóa các ô đen (chỗ "PHOTO SLOT 1-4")
   - Thêm decoration của bạn
   - Giữ layer "Safe Zone Guide" để dễ căn chỉnh
4. Export:
   - File → Export → Export As
   - Format: PNG
   - Transparency: ✅ ON
   - Save
```

**Cách dùng trong Illustrator:**
```
1. File → Open → frame-template-4slot.svg
2. Các layer đã được tổ chức sẵn:
   - Background (nền màu)
   - Photo Slots (các ô đen - XÓA sau khi thiết kế xong)
   - Safe Zone (đường kẻ xanh - XÓA trước khi export)
   - Instructions (hướng dẫn - XÓA)
3. Thêm decoration của bạn
4. File → Export → Export for Screens → PNG
```

---

### 3. 📐 Figma Template (online, dễ nhất)

**Cách tạo trong Figma:**

#### Bước 1: Tạo Frame mới
```
1. Vào Figma.com (miễn phí)
2. Create new Design file
3. Press F để tạo Frame
4. Nhập size: 1080 × 2160
5. Rename: "Photo Booth Frame 4-slot"
```

#### Bước 2: Tạo Safe Zone guides
```
1. Vẽ Rectangle: 972 × 2052
2. Position: X=54, Y=54
3. Fill: None
4. Stroke: Green, dashed
5. Rename layer: "Safe Zone (delete before export)"
```

#### Bước 3: Tạo Photo Slots
```
Slot 1: X=54,  Y=54,   W=972, H=486
Slot 2: X=54,  Y=594,  W=972, H=486
Slot 3: X=54,  Y=1134, W=972, H=486
Slot 4: X=54,  Y=1674, W=972, H=486

Fill: Black (hoặc màu tùy ý)
Label text: "PHOTO 1", "PHOTO 2"...
```

#### Bước 4: Thêm decoration
```
- Thêm shapes, text, patterns
- Giữ trong Safe Zone
- Tránh che mất photo slots
```

#### Bước 5: Export
```
1. Select frame
2. Export settings:
   - Format: PNG
   - Scale: 1x
   - Transparent background: ✅
3. Export
```

---

## 🎯 Template đã có sẵn trong HTML Generator:

### Frame 2-slot: 1080 × 1620
```
┌─────────────────┐
│                 │ 5% margin (81px)
│  ┌───────────┐  │
│  │  PHOTO 1  │  │ Slot height: 675px
│  └───────────┘  │
│                 │
│  ┌───────────┐  │
│  │  PHOTO 2  │  │ Slot height: 675px
│  └───────────┘  │
│                 │ 5% margin (81px)
└─────────────────┘
```

### Frame 4-slot: 1080 × 2160 ⭐
```
┌─────────────────┐
│                 │ 5% margin (108px)
│  ┌───────────┐  │
│  │  PHOTO 1  │  │ Slot height: 486px
│  └───────────┘  │
│  ┌───────────┐  │
│  │  PHOTO 2  │  │ Slot height: 486px
│  └───────────┘  │
│  ┌───────────┐  │
│  │  PHOTO 3  │  │ Slot height: 486px
│  └───────────┘  │
│  ┌───────────┐  │
│  │  PHOTO 4  │  │ Slot height: 486px
│  └───────────┘  │
│                 │ 5% margin (108px)
└─────────────────┘
```

### Frame 6-slot: 1080 × 2700
```
┌─────────────────┐
│                 │ 5% margin (135px)
│  ┌───────────┐  │
│  │  PHOTO 1  │  │ Slot height: 405px
│  └───────────┘  │
│  ┌───────────┐  │
│  │  PHOTO 2  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  PHOTO 3  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  PHOTO 4  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  PHOTO 5  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  PHOTO 6  │  │
│  └───────────┘  │
│                 │ 5% margin (135px)
└─────────────────┘
```

---

## 💡 Tips thiết kế frame đẹp:

### 1. Màu sắc
- Dùng màu pastel nhẹ nhàng: #FFE4E9, #FFF0F5
- Tránh màu quá đậm che mất ảnh
- Nên có gradient để đẹp hơn

### 2. Typography
- Font size title: 60-80px
- Font size text: 30-40px
- Dùng font đơn giản, dễ đọc

### 3. Decorations
- Thêm hoa, ngôi sao, trái tim ở góc
- Giữ decoration nhẹ nhàng, không che ảnh
- Border nhẹ xung quanh photo slots

### 4. Branding
- Thêm logo nhỏ ở góc (không quá 100×100px)
- Event name ở phía dưới
- QR code nếu cần (góc dưới phải)

---

## 🚀 Workflow khuyên dùng:

### Option 1: Nhanh nhất (HTML Generator)
```
1. Mở frame-template-generator.html
2. Chọn 4-slot
3. Đổi màu background thành màu bạn muốn
4. Thêm text event
5. Download PNG
6. Mở trong Photoshop để thêm decoration chi tiết
7. Export final PNG
8. Upload vào Admin Panel
```

### Option 2: Chuyên nghiệp (Figma)
```
1. Tạo frame 1080×2160 trong Figma
2. Import template SVG hoặc tạo từ đầu
3. Design với nhiều layers
4. Export PNG transparent
5. Upload vào Admin Panel
```

### Option 3: Nhanh và đơn giản (Canva)
```
1. Canva → Custom size: 1080 × 2160
2. Chọn background màu
3. Vẽ 4 hình chữ nhật đen (photo slots)
   - Mỗi ô: 972×486px
   - Cách đều nhau
4. Thêm text, stickers
5. Download → PNG transparent
6. Upload
```

---

## ❌ Những sai lầm cần tránh:

1. **Sai kích thước**
   - ❌ Không phải 1080×2160
   - ✅ Dùng template có sẵn

2. **Quên nền trong suốt**
   - ❌ Export JPEG (nền trắng)
   - ✅ Export PNG với transparency

3. **Photo slots sai vị trí**
   - ❌ Slots quá sát mép (<5%)
   - ✅ Dùng Safe Zone guides

4. **File quá lớn**
   - ❌ Export 10MB+
   - ✅ Compress tại tinypng.com

5. **Quên định nghĩa slots trong Admin**
   - ❌ Upload frame không có slots
   - ✅ Nhập 4 slots và điều chỉnh vị trí

---

## 📞 Hỗ trợ thêm:

- **Tài liệu chi tiết:** `docs/frame-standards.md`
- **Quy định ngắn gọn:** `QUY_DINH_FRAME_STRIP.txt`
- **Video hướng dẫn:** (coming soon)
- **Examples:** Xem frames có sẵn trong Admin Panel

---

**Chúc bạn thiết kế frame đẹp! 🎨**
