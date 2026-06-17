# Deploy Backend lên Vercel

## Bước 1: Cài đặt Vercel CLI (nếu chưa có)
```bash
npm install -g vercel
```

## Bước 2: Login vào Vercel
```bash
vercel login
```

## Bước 3: Deploy backend
```bash
cd backend
vercel
```

Làm theo hướng dẫn:
- Chọn "Yes" để setup và deploy
- Chọn scope (tài khoản Vercel của bạn)
- Link to existing project? → No (nếu lần đầu) hoặc Yes (nếu đã có project)
- Project name: `meomiry-backend` (hoặc tên khác)
- Directory: `.` (thư mục hiện tại)

## Bước 4: Cấu hình Environment Variables trên Vercel

Sau khi deploy, vào Vercel Dashboard:
1. Chọn project `meomiry-backend`
2. Vào Settings → Environment Variables
3. Thêm các biến:
   - `DATABASE_URL`: [Your NeonDB connection string]
   - `NODE_ENV`: `production`

## Bước 5: Redeploy để áp dụng env vars
```bash
vercel --prod
```

## Bước 6: Kiểm tra
Truy cập: `https://meomiry-backend.vercel.app/api/health`

Nếu thành công, bạn sẽ thấy:
```json
{"status":"ok","message":"Server đang chạy"}
```

## Lưu ý về Uploads
Vercel serverless không hỗ trợ lưu file persistent. Các file upload sẽ bị mất sau mỗi request.

**Giải pháp:**
1. Sử dụng Vercel Blob Storage
2. Hoặc dùng Cloudinary / AWS S3
3. Hoặc deploy backend lên Railway/Render (có persistent storage)
