# Meomiry Station Clone - Photo Booth App

Ứng dụng Photo Booth với workflow từng bước giống trang gốc https://meomiry-station.base44.app

## 🎯 Tính năng chính

### Workflow 5 bước:
1. **📷 Strip** - Chọn kiểu strip (Solo Shot / Triple Fun / Classic Strip)
2. **🎨 Filter** - Chọn bộ lọc (Y2K / Vintage / Hello Kitty / B&W)
3. **📸 Capture** - Chụp ảnh với camera hoặc tải ảnh lên
4. **🎭 Decorate** - Thêm stickers cute (Hearts, Stars, Cute, Text)
5. **✅ Done** - Download hoặc Start Over

### Chi tiết các bước:

#### Step 1: Choose Your Strip
- **Solo Shot** - 1 ảnh hoàn hảo
- **Triple Fun** - 3 ảnh liên tiếp
- **Classic Strip** - 4 ảnh iconic

#### Step 2: Pick a Filter
- **Y2K** - Glittery & futuristic (màu xanh mint)
- **Vintage** - Warm & nostalgic (màu vàng)
- **Hello Kitty** - Sweet & dreamy (màu hồng)
- **B&W** - Timeless classic (đen trắng)

#### Step 3: Capture Your Moments
- Chụp ảnh bằng webcam với đếm ngược 3-2-1
- Hoặc tải ảnh lên từ máy
- Hiển thị số ảnh đã chụp / tổng số ảnh cần

#### Step 4: Add Cute Stickers
- **Hearts** - Trái tim đủ loại ❤️💕💖💗💝💞
- **Stars** - Ngôi sao ⭐✨🌟💫⚡🌠
- **Cute** - Động vật & hoa 🐱🐰🐻🦄🌸🌈
- **Text** - Emoji cảm xúc 😊😍🥰😎🤩💯
- Click vào sticker để xóa

#### Step 5: Your Photo Strip
- Preview toàn bộ strip với filter & stickers
- **Download** - Lưu về máy
- **Start Over** - Tạo strip mới

## 📁 Cấu trúc dự án

```
meomiry-station-clone/
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── assets/       # Images, fonts
│   │   └── styles/       # CSS files
│   └── package.json
├── backend/              # Node.js + Express API
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   └── package.json
├── package.json         # Root package
└── README.md
```

## 🚀 Cài đặt và chạy

### Cài đặt dependencies

```bash
# Cài đặt tất cả (frontend + backend)
npm run install:all

# Hoặc cài riêng từng phần
npm install              # Root dependencies
cd frontend && npm install
cd ../backend && npm install
```

### Chạy ứng dụng

```bash
# Chạy đồng thời frontend và backend
npm run dev

# Hoặc chạy riêng lẻ trong terminal khác nhau
npm run dev:frontend    # http://localhost:5173
npm run dev:backend     # http://localhost:3000
```

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI library
- **Vite** - Build tool siêu nhanh
- **React Router** - Routing
- **React Webcam** - Camera integration
- **HTML2Canvas** - Screenshot & photo strips
- **CSS3** - Animations & styling

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Multer** - File upload
- **Sharp** - Image processing
- **CORS** - Cross-origin support
- **MongoDB** (optional) - Database

## 📖 Hướng dẫn sử dụng

1. **Trang chủ** - Nhấn "Start Photobooth" để bắt đầu
2. **Camera** - Cho phép truy cập webcam
3. **Chụp ảnh** - Click nút chụp hoặc Space
4. **Chọn filter** - Áp dụng hiệu ứng yêu thích
5. **Photo Strip** - Chụp 4 ảnh để tạo dải ảnh
6. **Download** - Lưu ảnh về máy

## 🎨 Danh sách bộ lọc

- **Normal** - Ảnh gốc
- **Grayscale** - Đen trắng
- **Sepia** - Tone vàng cổ điển
- **Blur** - Làm mờ
- **Brightness** - Tăng độ sáng
- **Contrast** - Tăng độ tương phản
- **Saturate** - Màu sắc rực rỡ
- **Invert** - Đảo màu

## 🌟 Screenshot

(Thêm screenshot của ứng dụng tại đây)

## 📝 License

MIT License - Free to use

## 👨‍💻 Author

Created with ♥ by AI Assistant
