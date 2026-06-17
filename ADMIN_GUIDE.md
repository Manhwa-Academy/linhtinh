# 🔐 Admin Panel - Hướng dẫn quản lý Frames

## 🎯 Tính năng Admin Panel

Admin Panel cho phép quản lý viên:
- ✅ Thêm frame mới với emoji, màu sắc, tên, mô tả tùy chỉnh
- ✅ Sửa frame hiện có (đổi tên, emoji, màu, gradient)
- ✅ Xóa frame không cần thiết
- ✅ Xem tất cả frames hiện có
- ✅ Preview frame trước khi lưu

---

## 🚀 Cách sử dụng

### 1. Truy cập Admin Panel

**Cách 1: Từ trang chủ**
- Vào http://localhost:5173
- Click vào link **"Admin Panel"** ở dưới nút Start

**Cách 2: Trực tiếp**
- Truy cập: http://localhost:5173/admin

### 2. Đăng nhập

**Mật khẩu mặc định:** `admin123`

> ⚠️ **Lưu ý bảo mật:** Đây là mật khẩu demo. Trong production, hãy thay đổi mật khẩu và implement authentication thật sự!

Sau khi đăng nhập, thông tin được lưu trong `localStorage` để không cần đăng nhập lại.

---

## 📝 Quản lý Frames

### ➕ Thêm Frame Mới

1. Click nút **"+ Thêm Frame Mới"** (màu xanh lá)
2. Form sẽ hiện ra với các trường:
   - **Tên Frame**: VD: "Valentine", "Christmas", "Birthday"
   - **Emoji**: Chọn 1 emoji đại diện (VD: 💝, 🎄, 🎂)
   - **Mô tả**: Mô tả ngắn về theme (VD: "Love & Romance")
   - **Màu nền**: Chọn màu bằng color picker
   - **Gradient** (tùy chọn): Nhập CSS gradient hoặc để trống để auto-generate

3. **Preview**: Xem trước frame với màu và emoji đã chọn
4. Click **"Lưu"** để thêm frame
5. Frame mới sẽ xuất hiện trong danh sách và có thể dùng ngay trong Photobooth

**Ví dụ:**
```
Tên: Valentine
Emoji: 💝
Mô tả: Love & Romance
Màu: #FFB3BA
Gradient: linear-gradient(135deg, #FFB3BA 0%, #FFDFBA 100%)
```

### ✏️ Sửa Frame

1. Tìm frame cần sửa trong danh sách
2. Click nút **"Sửa"** (màu tím)
3. Form chỉnh sửa sẽ hiện ra ngay trên card
4. Thay đổi thông tin cần thiết
5. Click **"✓"** để lưu hoặc **"✕"** để hủy

### 🗑️ Xóa Frame

1. Tìm frame cần xóa
2. Click nút **"Xóa"** (màu hồng)
3. Xác nhận xóa trong popup
4. Frame sẽ bị xóa khỏi hệ thống

> ⚠️ **Cảnh báo:** Xóa frame sẽ không thể hoàn tác!

---

## 🎨 Tips thiết kế Frame

### Chọn Emoji phù hợp
- 🌸 Spring/Flower themes
- ☀️ Summer/Sunny themes
- 🍂 Autumn/Fall themes
- ❄️ Winter/Snow themes
- 💝 Love/Valentine themes
- 🎄 Christmas themes
- 🎂 Birthday themes
- 🎃 Halloween themes
- 🌈 Colorful/Fun themes

### Chọn màu sắc
- **Pastel**: Dịu nhẹ, nữ tính (#FFE4E9, #E0F2FE)
- **Vibrant**: Rực rỡ, năng động (#FF6B9D, #FFC107)
- **Dark**: Sang trọng, bí ẩn (#2D3748, #4A5568)
- **Gradient**: Kết hợp 2-3 màu để tạo chiều sâu

### Tạo Gradient đẹp

**Công thức:**
```css
linear-gradient(135deg, [màu1] 0%, [màu2] 100%)
```

**Ví dụ:**
```css
/* Sunset */
linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)

/* Ocean */
linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)

/* Forest */
linear-gradient(135deg, #56AB2F 0%, #A8E063 100%)

/* Candy */
linear-gradient(135deg, #FBC2EB 0%, #A6C1EE 100%)
```

**Tool gợi ý:** https://cssgradient.io/

---

## 🛠️ Technical Details

### Lưu trữ dữ liệu

Frames được lưu trong file `backend/frames.json`:
```json
[
  {
    "id": "spring-1234567890",
    "name": "Spring",
    "description": "Cherry blossoms & nature",
    "emoji": "🌸",
    "color": "#FFE4E9",
    "bgGradient": "linear-gradient(135deg, #FFE4E9 0%, #FFF0F5 100%)"
  }
]
```

### API Endpoints

- `GET /api/frames` - Lấy tất cả frames
- `GET /api/frames/:id` - Lấy 1 frame
- `POST /api/frames` - Thêm frame mới
- `PUT /api/frames/:id` - Cập nhật frame
- `DELETE /api/frames/:id` - Xóa frame

### Cập nhật realtime

- Khi admin thêm/sửa/xóa frame, data được lưu vào `frames.json`
- User trong Photobooth sẽ tự động load frames mới khi refresh page
- Nếu backend không hoạt động, app sẽ dùng default frames

---

## 🔒 Bảo mật

### Thay đổi mật khẩu

Mở file `frontend/src/pages/AdminPage.jsx`, tìm dòng:

```javascript
if (password === 'admin123') {
```

Đổi thành:
```javascript
if (password === 'your-strong-password-here') {
```

### Implement authentication thật

Trong production, nên:
1. Tạo bảng `users` trong database
2. Hash password với bcrypt
3. Dùng JWT tokens cho session
4. Thêm middleware authentication cho API
5. Rate limiting để chống brute force

---

## 🐛 Xử lý sự cố

### Không đăng nhập được
- Kiểm tra mật khẩu: `admin123`
- Xóa localStorage: Dev Tools → Application → Local Storage → Clear
- Refresh page

### Frames không hiển thị
- Kiểm tra backend đang chạy: http://localhost:3000/api/health
- Kiểm tra file `backend/frames.json` tồn tại
- Check console log có lỗi

### Không thêm/sửa/xóa được
- Kiểm tra backend API responses trong Network tab
- Xem console log
- Kiểm tra quyền ghi file `frames.json`

### Frame mới không xuất hiện trong Photobooth
- Refresh page Photobooth
- Kiểm tra data trong `frames.json`
- Clear cache và reload

---

## 📱 Responsive

Admin Panel hoạt động tốt trên:
- ✅ Desktop (Chrome, Firefox, Edge, Safari)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iPhone, Android phones)

---

## 🚀 Nâng cao

### Thêm tính năng mới

**Upload custom background images:**
```javascript
// Thêm field trong form
<input type="file" accept="image/*" onChange={handleImageUpload} />
```

**Frame categories:**
```javascript
const frameCategories = ['Season', 'Holiday', 'Mood', 'Custom']
```

**Preview trước khi áp dụng:**
```javascript
const previewFrame = () => {
  // Show modal với frame preview
}
```

---

## 📞 Support

Nếu cần hỗ trợ:
1. Check `QUICK_START.md` để setup lại project
2. Check `USER_GUIDE.md` để hiểu workflow
3. Check console logs trong Browser DevTools
4. Check backend terminal logs

---

**Made with ♡ — Meomiry Station Admin Panel**
