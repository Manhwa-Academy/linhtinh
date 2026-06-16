# Hướng dẫn cài đặt Meomiry Station Clone

## Yêu cầu hệ thống

- Node.js 18+ 
- npm hoặc yarn
- Trình duyệt hiện đại (Chrome, Firefox, Edge)
- Webcam (để sử dụng chức năng chụp ảnh)

## Cài đặt từng bước

### Bước 1: Clone hoặc tải project

```bash
# Nếu dùng git
git clone <repository-url>
cd meomiry-station-clone

# Hoặc giải nén file zip vào thư mục
cd meomiry-station-clone
```

### Bước 2: Cài đặt dependencies

#### Cách 1: Cài tất cả cùng lúc (khuyến nghị)

```bash
npm run install:all
```

#### Cách 2: Cài từng phần

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
cd ..
```

### Bước 3: Cấu hình (tùy chọn)

Backend đã có file `.env` mặc định. Nếu muốn thay đổi cổng:

```bash
cd backend
# Chỉnh sửa file .env
# PORT=3000 (mặc định)
```

### Bước 4: Chạy ứng dụng

#### Cách 1: Chạy cả Frontend và Backend (khuyến nghị)

```bash
# Từ thư mục root
npm run dev
```

Ứng dụng sẽ chạy tại:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

#### Cách 2: Chạy riêng lẻ

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Bước 5: Truy cập ứng dụng

Mở trình duyệt và vào: **http://localhost:5173**

## Xử lý lỗi thường gặp

### Lỗi: "Cannot find module"

```bash
# Xóa node_modules và cài lại
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

### Lỗi: "Port already in use"

Frontend (port 5173) hoặc Backend (port 3000) đang bị chiếm:

```bash
# Windows - Kill process trên port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Hoặc thay đổi port trong file .env (backend) hoặc vite.config.js (frontend)
```

### Lỗi: "Webcam not accessible"

- Đảm bảo trình duyệt có quyền truy cập camera
- Kiểm tra trong Settings -> Privacy -> Camera
- Sử dụng HTTPS hoặc localhost (HTTP chỉ hoạt động trên localhost)

### Lỗi Sharp (Windows)

Nếu gặp lỗi với thư viện `sharp`:

```bash
cd backend
npm install --platform=win32 --arch=x64 sharp
```

## Build cho production

### Frontend

```bash
cd frontend
npm run build
# Output sẽ ở thư mục frontend/dist
```

### Backend

Backend chạy trực tiếp với Node.js:

```bash
cd backend
npm start
```

## Deployment

### Frontend (Vercel/Netlify)

1. Build frontend: `cd frontend && npm run build`
2. Upload thư mục `frontend/dist` lên hosting
3. Cấu hình environment variable cho API URL

### Backend (Heroku/Railway/Render)

1. Push code lên git repository
2. Kết nối với hosting platform
3. Set environment variables (PORT, etc.)
4. Deploy

### Docker (Optional)

```bash
# TODO: Thêm Dockerfile và docker-compose.yml
```

## Cấu trúc file quan trọng

```
meomiry-station-clone/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Trang chủ
│   │   │   └── BoothPage.jsx     # Trang chụp ảnh
│   │   ├── styles/               # CSS files
│   │   ├── App.jsx               # Root component
│   │   └── main.jsx              # Entry point
│   ├── index.html
│   ├── vite.config.js            # Vite config
│   └── package.json
├── backend/
│   ├── server.js                 # Main server file
│   ├── .env                      # Environment variables
│   ├── uploads/                  # Uploaded photos
│   └── package.json
├── package.json                  # Root package
├── README.md
└── SETUP.md (file này)
```

## Scripts hữu ích

```bash
# Development
npm run dev              # Chạy cả frontend + backend
npm run dev:frontend     # Chỉ frontend
npm run dev:backend      # Chỉ backend

# Installation
npm run install:all      # Cài tất cả dependencies

# Build
cd frontend && npm run build    # Build frontend
```

## Tính năng có thể mở rộng

- [ ] Lưu ảnh vào database (MongoDB)
- [ ] Xác thực người dùng
- [ ] Gallery xem lại ảnh
- [ ] Share ảnh lên social media
- [ ] Nhiều template photo booth hơn
- [ ] Real-time collaboration
- [ ] AI filters
- [ ] QR code để tải ảnh

## Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Node.js version: `node --version` (cần >= 18)
2. npm version: `npm --version`
3. Console logs trong browser (F12)
4. Backend logs trong terminal

## License

MIT License - Free to use and modify
