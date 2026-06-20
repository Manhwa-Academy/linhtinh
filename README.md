# 📸 Meomiry Station - PUBG Photo Booth

Ứng dụng chụp ảnh kỷ niệm với khung hình PUBG chuyên nghiệp cho các team thi đấu.

## 🌟 Tính năng

- ✅ **6 khung ảnh PUBG 2026** chuyên nghiệp
- ✅ **Photo booth interface** với camera và filters
- ✅ **Drag & drop photos** với stickers
- ✅ **Real-time preview** 1:2 ratio (1080×2160px)
- ✅ **Frame Designer** - Tạo frame mới với UI
- ✅ **Upload to CDN** - UploadThing storage
- ✅ **Admin panel** - Quản lý frames
- ✅ **Validation** - Kiểm tra frame standards tự động

## 🎨 PUBG Frames Available

### 1. DNS PUBG 2026 🎮
- **Theme:** Erangel (Blue)
- **Players:** GYUMIN 🦝, HEAVEN 😇, DIEL 🐶, REX 🦖
- **Size:** 1080×2160px

### 2. Team Korea - RISE AGAIN 🇰🇷
- **Theme:** Korean Flag Colors
- **Players:** GYUMIN, SEONGJANG, HEAVEN, HEATHER
- **Footer:** RISE AGAIN 🍗

### 3. GENG PUBG 2026 🐯
- **Theme:** Tiger (Gold & Black)
- **Players:** SEOUL, BEAN, DIYY, SALUTE
- **Footer:** ROAR TO WIN

### 4. Team Vietnam PNC 2026 🇻🇳
- **Theme:** Vietnam Flag Colors
- **Players:** TANVUU, HIMASS, DELWYN, SOLOLZY
- **Footer:** VIET NAM WIN

### 5. Team Korea PNC 2026 🇰🇷
- **Theme:** Official Korean Flag
- **Players:** GYUMIN, SEONGJANG, HEAVEN, HEATHER
- **Special:** Blue text with white stroke + KR badge

### 6. PGC 2025 📸
- Custom event frame

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# Mở http://localhost:5173
```

### Backend
```bash
cd backend
npm install
npm start
# API chạy tại http://localhost:3001
```

## 📁 Project Structure

```
linhtinh/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── BoothPage.jsx       # Photo booth chính
│   │   │   ├── AdminPage.jsx       # Quản lý frames
│   │   │   └── FrameDesigner.jsx   # Tạo frame mới
│   │   ├── components/
│   │   └── styles/
│   └── public/
│       ├── frame-template-generator.html  # SVG frame generator
│       └── upload-all-frames-to-production.html  # Upload tool
│
├── backend/                # Express API + NeonDB
│   ├── server.js           # Main API
│   ├── frames.json         # Frame metadata (local)
│   ├── uploads/frames/     # Frame images
│   ├── uploadthing.js      # CDN upload config
│   ├── validators/
│   │   └── frameValidator.js   # Frame validation
│   └── upload-frames-cli.js    # CLI upload tool
│
└── docs/
    ├── UPLOAD_FRAMES_GUIDE.md      # Hướng dẫn upload
    ├── UPLOAD_SUCCESS_SUMMARY.md   # Upload summary
    ├── FRAME_STANDARDS.md          # Frame chuẩn
    └── ADMIN_GUIDE.md              # Admin guide
```

## 🎯 Workflows

### 1. Tạo Frame Mới

#### Option A: Frame Designer (UI)
1. Vào Admin → Frame Designer
2. Upload ảnh background
3. Điều chỉnh photo slots
4. Preview và save

#### Option B: Script (Code)
1. Copy template: `create-team-korea-frame.js`
2. Chỉnh sửa: colors, players, theme
3. Chạy: `node create-xxx-frame.js`
4. Kiểm tra: `backend/uploads/frames/`

### 2. Upload lên Production

```bash
cd backend
npm run upload-frames
```

Script sẽ:
- ✅ Đọc `frames.json`
- ✅ Upload ảnh lên UploadThing CDN
- ✅ Lưu metadata vào NeonDB
- ✅ Hiển thị progress

### 3. Test Frame

#### Local:
```
http://localhost:5173/booth
```

#### Production:
```
https://meomiy.vercel.app/booth
```

## 🛠️ Technologies

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **html2canvas** - Screenshot
- **Lucide Icons** - Icons

### Backend
- **Express** - API server
- **NeonDB** - PostgreSQL database
- **UploadThing** - CDN storage
- **Sharp** - Image processing
- **Multer** - File upload

### Deployment
- **Vercel** - Frontend & Backend hosting
- **UploadThing** - CDN for frame images
- **NeonDB** - Database hosting

## 📊 Frame Standards

### Size
- **Canvas:** 1080 × 2160px (1:2 ratio)
- **File format:** PNG
- **Max size:** 5 MB

### Photo Slots
- **Count:** 4 slots (vertical)
- **Position:** x=10%, width=80%
- **Heights:** y = 7%, 29.8%, 51.9%, 74.1% (each 21.3% height)
- **Background:** Transparent

### Text
- **Player names:** White with stroke (3-4px black)
- **Position:** Left side (x=30px)
- **Font:** Bold, 40-48px

### Colors
- Must follow team/event branding
- High contrast for visibility
- Test on both light and dark photos

## 🔗 Links

### Production
- **App:** https://meomiy.vercel.app
- **Backend API:** https://meomiry-backend.vercel.app
- **Booth:** https://meomiy.vercel.app/booth
- **Admin:** https://meomiy.vercel.app/admin

### API Endpoints
- `GET /api/frames` - List all frames
- `GET /api/frames/:id` - Get single frame
- `POST /api/frames` - Create frame
- `PUT /api/frames/:id` - Update frame
- `DELETE /api/frames/:id` - Delete frame
- `POST /api/upload-frame` - Upload frame image

## 📝 Scripts

### Backend
```bash
npm start              # Start server
npm run dev            # Start with watch mode
npm run upload-frames  # Upload frames to production
```

### Frame Generation
```bash
node create-dns-pubg-frame.js        # DNS PUBG frame
node create-team-korea-v2.js         # Team Korea V2
node create-geng-pubg-frame.js       # GENG frame
node create-team-vietnam-frame.js    # Team Vietnam
node create-team-korea-pnc-frame.js  # Team Korea PNC
```

## 🐛 Troubleshooting

### Upload Failed (CORS)
**Problem:** Browser blocks localhost → production
**Solution:** Use CLI script (`npm run upload-frames`)

### Frame Not Showing
**Problem:** Frame không hiện trong dropdown
**Solution:** 
1. Check `frames.json` có frame đó không
2. Check `frameImage` URL có hợp lệ không
3. Check `photoSlots` có được định nghĩa không

### Invalid Frame Size
**Problem:** Validation fails
**Solution:** 
1. Frame phải 1080×2160px
2. Dùng `frame-template-generator.html` để tạo đúng size
3. Kiểm tra với `validateFrameUpload()` function

## 📚 Documentation

- **[Upload Guide](UPLOAD_FRAMES_GUIDE.md)** - Hướng dẫn upload frames
- **[Upload Success](UPLOAD_SUCCESS_SUMMARY.md)** - Upload summary
- **[Frame Standards](FRAME_STANDARDS.md)** - Frame specifications
- **[Admin Guide](ADMIN_GUIDE.md)** - Admin panel guide
- **[Features](FEATURES.md)** - Full features list

## 🎉 Status

✅ **Production Ready**
- 6 PUBG frames deployed
- All frames on CDN
- Validation enabled
- Admin panel active

## 👥 Teams

- **DNS PUBG:** GYUMIN, HEAVEN, DIEL, REX
- **Team Korea:** GYUMIN, SEONGJANG, HEAVEN, HEATHER
- **GENG PUBG:** SEOUL, BEAN, DIYY, SALUTE
- **Team Vietnam:** TANVUU, HIMASS, DELWYN, SOLOLZY

## 📄 License

MIT

---

**Made with ❤️ for PUBG community**

Last updated: 2026-06-20
