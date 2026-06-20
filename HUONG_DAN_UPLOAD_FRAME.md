# 📋 HƯỚNG DẪN UPLOAD KHUNG STRIP

## ❗ VẤN ĐỀ BẠN ĐANG GẶP

Từ ảnh bạn gửi, tôi thấy:
- Khung strip **quá hẹp và dọc** (không đúng tỷ lệ)
- Photo slots (ô đen) **không khớp với vị trí ảnh**
- Frame bị **lệch vị trí**

➡️ **Nguyên nhân:** Frame không đúng kích thước chuẩn

---

## ✅ QUY ĐỊNH BẮT BUỘC

### 1. 📐 KÍCH THƯỚC CHUẨN

| Loại Frame | Kích thước (px) | Tỷ lệ | Dùng khi nào |
|------------|----------------|-------|--------------|
| **4 ô** | 1080 × 2160 | 1:2 | Photo booth tiêu chuẩn ⭐ |
| **2 ô** | 1080 × 1620 | 2:3 | Portrait ngắn |
| **6 ô** | 1080 × 2700 | 2:5 | Strip dài |

**⚠️ QUAN TRỌNG:**
- Width (chiều rộng) **PHẢI là 1080px**
- Height (chiều cao) tùy số ô: 1620 / 2160 / 2700
- Chênh lệch cho phép: **±10%**

### 2. 📁 ĐỊNH DẠNG FILE

✅ **Được phép:**
- PNG (khuyên dùng - nền trong suốt)
- WebP (nền trong suốt)
- JPEG/JPG (không có nền trong suốt)

❌ **Không được:**
- GIF động
- BMP, TIFF
- File quá 5MB

### 3. 💾 DUNG LƯỢNG FILE

- **Tối đa: 5MB**
- Nếu file lớn hơn → Dùng TinyPNG.com để nén

### 4. 🎯 VÙNG AN TOÀN (Safe Zone)

```
┌─────────────────────────────┐
│ ← 5% lề        5% lề → │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │   VÙNG AN TOÀN      │    │
│  │   (Đặt ô ảnh ở đây) │    │
│  │                     │    │
│  └─────────────────────┘    │
│    ↑ 5% lề trên/dưới   │
└─────────────────────────────┘
```

**Quy tắc:**
- Photo slots phải **cách mép ≥5%**
- X position: từ 5% đến 95%
- Y position: từ 5% đến 95%

---

## 🔧 CÁCH FIX FRAME CỦA BẠN

### Bước 1: Kiểm tra kích thước hiện tại

1. Mở file frame trong Photoshop/GIMP
2. Xem: Image → Image Size
3. Ghi lại width × height

### Bước 2: Resize về đúng chuẩn

**Cho 4 ô (như frame bạn đang dùng):**

```
Width: 1080px
Height: 2160px
Maintain aspect ratio: BẬT ✅
```

**Trong Photoshop:**
1. Image → Image Size
2. Width: 1080
3. Height: 2160
4. Resample: Bicubic Sharper
5. OK

**Trong Canva:**
1. Resize → Custom size
2. 1080 × 2160 px
3. Apply

### Bước 3: Điều chỉnh Photo Slots

Sau khi upload frame mới, trong Admin Panel:

1. **Số ô ảnh:** Nhập 4
2. Hệ thống tự tạo 4 slots mặc định
3. Click **"🔧 Chỉnh sửa vị trí & kích thước"**
4. Điều chỉnh từng slot để khớp với ô đen trong frame:

```javascript
Ví dụ cho 4 ô:
Slot 1: x=10, y=5,  width=80, height=20
Slot 2: x=10, y=28, width=80, height=20
Slot 3: x=10, y=51, width=80, height=20
Slot 4: x=10, y=74, width=80, height=20
```

---

## 🎨 MẪU CHUẨN

### Frame 4 ô đúng:
```
┌─────────────────┐
│                 │ ← 5% lề
│  ┌───────────┐  │ ← Slot 1 (ảnh 1)
│  └───────────┘  │
│                 │
│  ┌───────────┐  │ ← Slot 2 (ảnh 2)
│  └───────────┘  │
│                 │
│  ┌───────────┐  │ ← Slot 3 (ảnh 3)
│  └───────────┘  │
│                 │
│  ┌───────────┐  │ ← Slot 4 (ảnh 4)
│  └───────────┘  │
│                 │ ← 5% lề
└─────────────────┘
   1080 × 2160px
```

---

## ✅ CHECKLIST TRƯỚC KHI UPLOAD

- [ ] Kích thước: 1080 × 2160 (hoặc 1620/2700)
- [ ] File PNG với nền trong suốt
- [ ] Dung lượng < 5MB
- [ ] Photo slots đã định nghĩa (2, 4, hoặc 6 ô)
- [ ] Slots nằm trong vùng an toàn (≥5% từ mép)
- [ ] Test preview: ảnh khớp với ô đen

---

## 🚨 CÁC LỖI THƯỜNG GẶP

### Lỗi 1: "Frame dimensions do not match standard"
**Nguyên nhân:** Kích thước sai
**Fix:** Resize về 1080 × 2160

### Lỗi 2: "File size exceeds 5MB limit"
**Nguyên nhân:** File quá lớn
**Fix:** Compress tại tinypng.com

### Lỗi 3: "Photo slot extends outside safe zone"
**Nguyên nhân:** Slot quá sát mép
**Fix:** Điều chỉnh x, y ≥ 5

### Lỗi 4: Ảnh bị méo/lệch (như ảnh bạn gửi)
**Nguyên nhân:** Frame không đúng tỷ lệ
**Fix:** 
1. Xóa frame cũ
2. Upload frame mới với kích thước đúng 1080×2160
3. Định nghĩa lại photo slots

---

## 📞 HỖ TRỢ

Nếu vẫn gặp lỗi:
1. Check file `docs/frame-standards.md` (chi tiết đầy đủ)
2. Hệ thống sẽ hiển thị lỗi cụ thể khi upload
3. Xem preview để điều chỉnh slots

---

**Cập nhật:** 2026-06-19  
**Phiên bản:** 1.0
