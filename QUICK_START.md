# 🚀 Quick Start - Chạy ngay trong 3 bước!

## Bước 1: Cài đặt dependencies

```bash
npm run install:all
```

Hoặc nếu lỗi, cài từng phần:

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

## Bước 2: Chạy ứng dụng

```bash
npm run dev
```

## Bước 3: Mở trình duyệt

Vào địa chỉ: **http://localhost:5173**

---

## ✅ Checklist

Đảm bảo đã cài:
- ✅ Node.js 18+ (`node --version`)
- ✅ npm (`npm --version`)
- ✅ Webcam (để chụp ảnh)

## 🎉 Xong!

Giờ bạn có thể:
1. Click "Start Photobooth"
2. Cho phép truy cập camera
3. Chọn filter yêu thích
4. Chụp ảnh hoặc tạo photo strip
5. Tải xuống ảnh về máy

## ⚡ Commands hữu ích

```bash
# Chạy cả frontend và backend
npm run dev

# Chỉ chạy frontend
npm run dev:frontend

# Chỉ chạy backend
npm run dev:backend
```

## 🆘 Gặp lỗi?

Xem file **SETUP.md** để biết chi tiết cách xử lý lỗi.

**Lỗi phổ biến:**
- Port đã được sử dụng → Đổi port trong .env
- Camera không hoạt động → Kiểm tra quyền truy cập
- Module not found → Chạy lại `npm run install:all`

## 📖 Docs

- **README.md** - Tổng quan dự án
- **SETUP.md** - Hướng dẫn chi tiết
- **FEATURES.md** - Danh sách tính năng
- **QUICK_START.md** - File này

---

Made with ♥ for Meomiry Station
