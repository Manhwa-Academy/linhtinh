# 🚀 Hướng dẫn Upload Frames lên Production

## ⚠️ Vấn đề CORS

Khi chạy tool từ **localhost** → upload lên **production**, bạn gặp lỗi **CORS**:
- Browser chặn request từ `localhost:5173` → `meomiy.vercel.app`
- Đây là bảo mật bình thường của browser

## ✅ Giải pháp 1: CLI Script (Khuyên dùng - Dễ nhất)

Upload trực tiếp từ Node.js (không qua browser, không bị CORS):

```bash
cd backend
npm run upload-frames
```

Script sẽ:
- ✅ Đọc tất cả frames từ `frames.json`
- ✅ Tìm file ảnh trong `uploads/frames/`
- ✅ Convert sang base64
- ✅ Upload qua API `/api/upload-frame`
- ✅ Tự động lưu metadata vào production database
- ✅ Hiển thị progress và kết quả

### Output mẫu:
```
🎨 Frame Upload CLI
==================================================
📡 Production URL: https://meomiy-backend.vercel.app

📋 Found 10 frames in frames.json
📤 6 frames have images

📤 Uploading: PGC 2025
📊 Image size: 517.60 KB
🚀 Uploading to: https://meomiy-backend.vercel.app/api/upload-frame
✅ Upload successful!
📎 URL: https://utfs.io/f/xxx
⏳ Waiting 2 seconds...

...

==================================================
🎉 Upload Complete!
✅ Success: 6 frames
❌ Failed: 0 frames
⏭️  Skipped: 0 frames
```

## 📋 Giải pháp 2: Web Tool từ Production

Upload từ web interface (phải deploy tool lên production trước):

### Bước 1: Deploy frontend
```bash
cd frontend
vercel --prod
```

### Bước 2: Truy cập tool
```
https://meomiy.vercel.app/upload-all-frames-to-production.html
```

### Bước 3: Upload
1. Click "📋 Tải danh sách frames"
2. Kiểm tra danh sách frames
3. Click "🚀 Upload tất cả"
4. Frames đã upload sẽ tự động ẩn đi

**Lưu ý:** Tool này chỉ hoạt động khi chạy từ **cùng domain** với backend (production → production).

## 🔍 Giải pháp 3: Tạm thời cho phép CORS (Không khuyên dùng)

Thêm localhost vào CORS whitelist trong `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'https://meomiry.vercel.app', 
    'http://localhost:5173',
    'http://localhost:3001'  // Thêm dòng này
  ],
  credentials: true
}))
```

**Nhược điểm:**
- ⚠️ Giảm bảo mật
- ⚠️ Phải deploy backend lại mỗi lần thay đổi
- ⚠️ Không cần thiết khi có CLI script

## 📊 Kiểm tra Frames đã Upload

### API: Xem tất cả frames trên production
```bash
curl https://meomiy-backend.vercel.app/api/frames
```

### Frontend: Xem trong app
```
https://meomiy.vercel.app/booth
```

Chọn frame từ dropdown để xem.

## 🎯 So sánh 3 giải pháp

| Giải pháp | Ưu điểm | Nhược điểm | Khuyên dùng |
|-----------|---------|------------|-------------|
| **CLI Script** | ✅ Không bị CORS<br>✅ Nhanh<br>✅ Dễ debug | ❌ Phải có Node.js | **⭐⭐⭐** |
| **Web Tool (Production)** | ✅ Có UI đẹp<br>✅ Dễ sử dụng | ❌ Phải deploy trước<br>❌ Phụ thuộc production | ⭐⭐ |
| **CORS Whitelist** | ✅ Có thể test local | ❌ Giảm bảo mật<br>❌ Phải deploy backend | ⭐ |

## 🚨 Troubleshooting

### Lỗi: "Failed to fetch"
- **Nguyên nhân:** CORS hoặc production API không hoạt động
- **Giải pháp:** Dùng CLI script (`npm run upload-frames`)

### Lỗi: "Image not found"
- **Nguyên nhân:** File ảnh không tồn tại trong `backend/uploads/frames/`
- **Giải pháp:** Kiểm tra `frames.json` và đảm bảo file tồn tại

### Lỗi: "Validation failed"
- **Nguyên nhân:** Ảnh không đúng chuẩn (kích thước, format, slots)
- **Giải pháp:** Xem chi tiết lỗi trong console

## 📁 Files liên quan

- `backend/upload-frames-cli.js` - CLI upload script
- `backend/frames.json` - Danh sách frames và metadata
- `backend/uploads/frames/` - Thư mục chứa ảnh frames
- `frontend/public/upload-all-frames-to-production.html` - Web tool UI
- `backend/server.js` - API endpoint `/api/upload-frame`

## 🎯 Workflow khuyên dùng

1. **Tạo frame mới** → Chạy script tạo frame (vd: `node create-dns-pubg-frame.js`)
2. **Kiểm tra local** → Mở `http://localhost:5173/booth` để xem frame
3. **Upload production** → Chạy `npm run upload-frames`
4. **Verify** → Mở `https://meomiy.vercel.app/booth` để xem frame trên production

---

**💡 Tip:** CLI script là cách đơn giản và nhanh nhất! Không cần deploy, không bị CORS, chạy một lệnh là xong.
