# UploadThing Integration - Deployment Guide

## ✅ Đã hoàn thành

1. **Cài đặt dependencies**
   - ✅ `uploadthing` đã được cài đặt ở backend và frontend
   - ✅ `@uploadthing/react` đã được cài đặt ở frontend

2. **Tạo file cấu hình UploadThing**
   - ✅ `backend/uploadthing.js` - Upload router configuration
   - ✅ `api/uploadthing.js` - Vercel serverless handler
   - ✅ `frontend/src/utils/uploadthing.js` - React hooks

3. **Cập nhật AdminPage**
   - ✅ Import `useUploadThing` hook
   - ✅ Sử dụng `startUpload` trong `handleAddFrame` và `handleUpdateFrame`
   - ✅ Upload ảnh lên UploadThing thay vì local storage

4. **Cập nhật backend configuration**
   - ✅ `backend/.env` đã có `UPLOADTHING_TOKEN`
   - ✅ `backend/vercel.json` đã được cấu hình để handle `/api/uploadthing`

5. **Commit và push code**
   - ✅ Code đã được commit và push lên GitHub

## 🔄 Bước tiếp theo - Deploy lên Vercel

### Bước 1: Thêm Environment Variable vào Vercel Backend

1. Truy cập: https://vercel.com/bluearchives-projects/meomiry-backend/settings/environment-variables

2. Thêm biến môi trường mới:
   - **Name**: `UPLOADTHING_TOKEN`
   - **Value**: `eyJhcGlLZXkiOiJza19saXZlXzE5ODk1NTY4YTZjZDBiNzU5MmJmNTYzNTZhMTU4Yzc4MzBjMDQ4OTM5ZmUwNDYzYTg0ZDM3ZGU2NjliMDJjZjciLCJhcHBJZCI6ImdzdXZwNm1hejQiLCJyZWdpb25zIjpbInNlYTEiXX0=`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development

3. Click **Save**

### Bước 2: Redeploy Backend

Có 2 cách:

**Cách 1: Deploy tự động qua GitHub (Đề xuất)**
- Vercel sẽ tự động deploy khi có commit mới
- Vào https://vercel.com/bluearchives-projects/meomiry-backend/deployments
- Đợi deployment hoàn tất (khoảng 1-2 phút)

**Cách 2: Deploy thủ công qua CLI**
```bash
cd backend
npx vercel --prod
```

### Bước 3: Redeploy Frontend

Frontend cũng sẽ tự động deploy khi có commit mới:
- Vào https://vercel.com/bluearchives-projects/meomiry/deployments
- Đợi deployment hoàn tất

### Bước 4: Test chức năng upload

1. Truy cập: https://meomiry.vercel.app/admin
2. Login với password: `kaito`
3. Click **"Thêm Frame Mới"**
4. Điền thông tin:
   - Tên Frame: `Test UploadThing`
   - Upload ảnh frame (PNG/JPG)
   - Nhập số ô ảnh (VD: 4)
5. Click **"Lưu"**
6. Kiểm tra:
   - Frame mới xuất hiện trong danh sách
   - Ảnh frame hiển thị đúng (từ UploadThing CDN)
   - URL ảnh có dạng: `https://utfs.io/f/...`

## 🧪 Test API Endpoints

### Test UploadThing endpoint
```bash
curl https://meomiry-backend.vercel.app/api/uploadthing
```
Kết quả mong đợi: Response từ UploadThing

### Test Frames API
```bash
curl https://meomiry-backend.vercel.app/api/frames
```
Kết quả mong đợi: JSON với danh sách frames

## 📝 Cấu trúc UploadThing

### Backend: `backend/uploadthing.js`
```javascript
export const uploadRouter = {
  frameImageUploader: f({ 
    image: { 
      maxFileSize: "4MB", 
      maxFileCount: 1 
    } 
  })
}
```

### API Handler: `api/uploadthing.js`
- Xử lý CORS headers
- Forward request đến UploadThing
- Sử dụng `UPLOADTHING_TOKEN` từ environment variables

### Frontend: `frontend/src/utils/uploadthing.js`
```javascript
export const { useUploadThing, uploadFiles } = generateReactHelpers({
  url: `${VITE_API_URL}/api/uploadthing`,
});
```

### AdminPage Usage:
```javascript
const { startUpload, isUploading } = useUploadThing("frameImageUploader")

// Upload file
const uploadResult = await startUpload([file])
const imageUrl = uploadResult[0].url // https://utfs.io/f/...
```

## 🔍 Troubleshooting

### Lỗi: "Failed to upload"
- ✅ Kiểm tra `UPLOADTHING_TOKEN` đã được thêm vào Vercel chưa
- ✅ Kiểm tra token còn hiệu lực trên https://uploadthing.com/dashboard

### Lỗi: "Không tìm thấy endpoint"
- ✅ Kiểm tra `backend/vercel.json` có route `/api/uploadthing`
- ✅ Kiểm tra file `api/uploadthing.js` tồn tại

### Lỗi CORS
- ✅ Kiểm tra `api/uploadthing.js` có set CORS headers

### Ảnh không hiển thị
- ✅ Kiểm tra URL có dạng `https://utfs.io/f/...`
- ✅ Kiểm tra network tab trong browser console
- ✅ Kiểm tra UploadThing dashboard: https://uploadthing.com/dashboard

## 🎯 Lưu ý quan trọng

1. **UploadThing Free Plan**: 
   - 2 GB storage
   - 10 GB bandwidth/month
   - Nếu vượt quá, cần upgrade plan

2. **File Size Limit**: 
   - Hiện tại: 4MB
   - Có thể tăng lên bằng cách sửa `maxFileSize` trong `uploadRouter`

3. **Security**:
   - Token không được commit vào Git
   - Token chỉ lưu trong `.env` (local) và Vercel Environment Variables (production)

4. **CDN URLs**:
   - Ảnh được lưu trên UploadThing CDN
   - URLs có dạng: `https://utfs.io/f/[unique-id]`
   - URLs persist permanently (không bị xóa khi redeploy)

## ✅ Checklist Deployment

- [ ] Add `UPLOADTHING_TOKEN` to Vercel backend environment variables
- [ ] Redeploy backend (automatic or manual)
- [ ] Redeploy frontend (automatic)
- [ ] Test upload frame image in admin panel
- [ ] Verify image URL is from UploadThing CDN
- [ ] Test frame display in booth page

## 🚀 Sau khi deploy thành công

Bạn có thể:
1. Upload frame images với ảnh overlay tùy chỉnh
2. Frame images được lưu trên cloud (không mất khi redeploy)
3. CDN tự động optimize và deliver ảnh nhanh hơn
4. Không giới hạn storage của Vercel (dùng UploadThing storage)
