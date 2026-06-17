# UploadThing Integration Summary

## 📦 Đã cài đặt

### Files đã tạo/cập nhật:

1. **Backend Configuration**
   - ✅ `backend/uploadthing.js` - Upload router với error handling
   - ✅ `backend/.env` - Đã có `UPLOADTHING_TOKEN`
   - ✅ `backend/vercel.json` - Route cho `/api/uploadthing`

2. **API Handler**
   - ✅ `api/uploadthing.js` - Serverless handler với CORS support

3. **Frontend Integration**
   - ✅ `frontend/src/utils/uploadthing.js` - React helpers
   - ✅ `frontend/src/pages/AdminPage.jsx` - Sử dụng UploadThing hook

4. **Dependencies**
   - ✅ Backend: `uploadthing@^7.7.4`
   - ✅ Frontend: `uploadthing@^7.7.4`, `@uploadthing/react@^7.3.3`

## 🔑 Credentials

```
UPLOADTHING_TOKEN=eyJhcGlLZXkiOiJza19saXZlXzE5ODk1NTY4YTZjZDBiNzU5MmJmNTYzNTZhMTU4Yzc4MzBjMDQ4OTM5ZmUwNDYzYTg0ZDM3ZGU2NjliMDJjZjciLCJhcHBJZCI6ImdzdXZwNm1hejQiLCJyZWdpb25zIjpbInNlYTEiXX0=

API Key: sk_live_19895568a6cd0b7592bf56356a158c7830c048939fe0463a84d37de669b02cf7
```

## 🎯 Cách hoạt động

### Upload Flow:

1. User chọn ảnh trong AdminPage
2. AdminPage gọi `startUpload([file])`
3. Request được gửi đến `https://meomiry-backend.vercel.app/api/uploadthing`
4. Serverless function forward request đến UploadThing
5. UploadThing upload file lên CDN
6. Trả về URL: `https://utfs.io/f/[unique-id]`
7. Backend lưu URL vào NeonDB
8. Frame hiển thị ảnh từ UploadThing CDN

### Key Changes in AdminPage:

```javascript
// OLD: Upload to local storage (không work trên Vercel)
const formData = new FormData();
formData.append('frameImage', file);
const response = await fetch('/api/upload-frame', { method: 'POST', body: formData });

// NEW: Upload to UploadThing CDN
const { startUpload } = useUploadThing("frameImageUploader");
const uploadResult = await startUpload([file]);
const frameImageUrl = uploadResult[0].url;
```

## 🚀 Deployment Steps

### 1️⃣ Thêm Environment Variable

Vào Vercel Backend Settings:
https://vercel.com/bluearchives-projects/meomiry-backend/settings/environment-variables

Add:
- Name: `UPLOADTHING_TOKEN`
- Value: (token ở trên)
- Environments: Production, Preview, Development

### 2️⃣ Redeploy

Code đã được push lên GitHub, Vercel sẽ tự động deploy:
- Backend: https://vercel.com/bluearchives-projects/meomiry-backend/deployments
- Frontend: https://vercel.com/bluearchives-projects/meomiry/deployments

### 3️⃣ Test

1. https://meomiry.vercel.app/admin
2. Login: `kaito`
3. Thêm frame mới với ảnh
4. Verify ảnh upload thành công và URL từ `https://utfs.io/`

## 📊 API Endpoints

### UploadThing Endpoint
```
POST https://meomiry-backend.vercel.app/api/uploadthing
```
- Handles file upload
- Returns CDN URL
- CORS enabled

### Frames API
```
GET  https://meomiry-backend.vercel.app/api/frames
POST https://meomiry-backend.vercel.app/api/frames
PUT  https://meomiry-backend.vercel.app/api/frames/:id
DELETE https://meomiry-backend.vercel.app/api/frames/:id
```

## ✅ Benefits

1. **Persistent Storage**: Ảnh không bị mất khi redeploy
2. **CDN Delivery**: Load ảnh nhanh hơn từ CDN
3. **No Vercel Limits**: Không ảnh hưởng Vercel serverless limits
4. **Auto Optimization**: UploadThing tự động optimize ảnh
5. **Scalable**: Handle nhiều uploads đồng thời

## 🔧 Configuration

### File Size Limit
Trong `backend/uploadthing.js`:
```javascript
image: { 
  maxFileSize: "4MB",  // Có thể tăng lên nếu cần
  maxFileCount: 1 
}
```

### CORS Settings
Trong `api/uploadthing.js`:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

## 📝 Next Steps

Sau khi deploy:
1. Monitor UploadThing dashboard: https://uploadthing.com/dashboard
2. Check storage usage (Free plan: 2GB)
3. Test upload multiple frames
4. Verify images display correctly in booth

## ⚠️ Important Notes

- Token đã được thêm vào `backend/.env` (local)
- **CHỜ ADD TOKEN VÀO VERCEL** để production work
- Free plan có giới hạn 2GB storage, 10GB bandwidth/month
- URLs persist forever, không cần backup
