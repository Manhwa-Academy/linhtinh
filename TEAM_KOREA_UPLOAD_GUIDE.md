# 🇰🇷 Team Korea Frame - Hướng dẫn Upload Tự Động

## ✅ Frame đã được thêm vào database!

**Frame ID**: `frame_1781880861870`  
**Tên**: Team Korea PNC 2026  
**Status**: Chờ upload ảnh PNG

---

## 🚀 Cách 1: Upload tự động (Đơn giản nhất)

### Bước 1: Tạo ảnh PNG
1. Mở File Explorer
2. Vào: `frontend/public/`
3. Double-click: **`create-team-korea-frame.html`**
4. Browser sẽ tự động vẽ frame
5. Click **"💾 Download PNG"**
6. File sẽ được save: `Team-Korea-PNC2026-Frame.png`

### Bước 2: Upload vào AdminPage
1. Refresh AdminPage (nếu đang mở)
2. Scroll xuống, tìm frame: **"Team Korea PNC 2026 🇰🇷"**
3. Click button **"✏️ Sửa"**
4. Click **"Upload Frame Image"**
5. Chọn file `Team-Korea-PNC2026-Frame.png`
6. Wait for upload (có progress bar)
7. Click **"💾 Lưu"**

✅ **Done!** Frame sẽ xuất hiện đầy đủ với ảnh overlay!

---

## 🎨 Cách 2: Dùng Frame Designer (Tùy chỉnh)

Nếu bạn muốn điều chỉnh thiết kế:

1. Vào AdminPage
2. Click **"🎨 Thiết kế Frame"**
3. Setup:
   - Slots: **4 ô**
   - Name: **Team Korea PNC 2026**
   - Preset: **Blue Sky** hoặc custom

4. Add elements:
   ```
   Text 1: "TEAM KOREA 🇰🇷"
   - Font size: 80-90
   - Color: Blue (#0047A0) hoặc Red (#CD2E3A)
   - Position: Top center
   
   Text 2: "GYUMIN 🦝"
   - Font size: 35-40
   - Color: Blue
   - Position: Y ~200-250
   
   Text 3: "SEONGJANG 🔥"
   - Font size: 35-40
   - Color: Red
   - Position: Y ~650-700
   
   Text 4: "HEAVEN 😇"
   - Font size: 35-40
   - Color: White
   - Position: Y ~1100-1150
   
   Text 5: "HEATHER ⭐"
   - Font size: 35-40
   - Color: Gold (#FFD700)
   - Position: Y ~1550-1600
   
   Text 6: "RISE AGAIN"
   - Font size: 60-70
   - Color: Gold
   - Position: Bottom center (Y ~2000)
   
   Text 7: "PNC 2026"
   - Font size: 45-50
   - Color: White
   - Position: Below "RISE AGAIN"
   ```

5. Add decorations:
   - Circles ở 4 góc (màu Blue/Red/Gold)
   - Rectangles cho player labels

6. Click **"Lưu vào Admin"**

---

## 🔍 Kiểm tra Frame đã upload

Sau khi upload, frame sẽ có:

✅ Frame image (PNG overlay)  
✅ 4 photo slots đã định nghĩa:
- Slot 1 (Y: 11.57%): GYUMIN 🦝
- Slot 2 (Y: 33.80%): SEONGJANG 🔥
- Slot 3 (Y: 56.02%): HEAVEN 😇  
- Slot 4 (Y: 78.24%): HEATHER ⭐

✅ Metadata đầy đủ:
- Name: Team Korea PNC 2026
- Emoji: 🇰🇷
- Description: PUBG Nations Cup 2026 - Korean Team
- Colors: Korean flag inspired

---

## 🎮 Test Frame

1. Vào **BoothPage** (http://localhost:5173/)
2. Click **"Bắt đầu"**
3. Select frame **"Team Korea PNC 2026 🇰🇷"**
4. Take photos
5. Verify:
   - ✅ Frame overlay hiển thị đúng
   - ✅ 4 ô ảnh align chính xác
   - ✅ Player names visible
   - ✅ Colors đẹp (Blue, Red, White, Gold)

---

## 📊 Frame Specifications

```json
{
  "id": "frame_1781880861870",
  "name": "Team Korea PNC 2026",
  "emoji": "🇰🇷",
  "size": "1080×2160px (4-slot)",
  "theme": "PUBG Nations Cup 2026",
  "colors": {
    "primary": "#0047A0 (Korean Blue)",
    "secondary": "#CD2E3A (Korean Red)",
    "accent": "#FFD700 (Gold)",
    "background": "#F0F4FF (Light Blue-White)"
  },
  "players": [
    "GYUMIN 🦝",
    "SEONGJANG 🔥",
    "HEAVEN 😇",
    "HEATHER ⭐"
  ],
  "slogan": "RISE AGAIN",
  "event": "PNC 2026"
}
```

---

## 🐛 Troubleshooting

### Issue: Frame không xuất hiện trong list
**Solution**: Refresh browser (Ctrl+F5 hoặc Cmd+R)

### Issue: Upload failed
**Solution**: 
- Check file size (<5MB)
- Check file format (PNG/JPG/WebP)
- Check backend đang chạy (http://localhost:3001)

### Issue: Photo slots không khớp
**Solution**: 
- Vào AdminPage → Edit frame
- Click "Chỉnh sửa vị trí & kích thước"
- Adjust Y positions:
  - Slot 1: Y = 11.57%
  - Slot 2: Y = 33.80%
  - Slot 3: Y = 56.02%
  - Slot 4: Y = 78.24%

### Issue: Colors không đẹp
**Solution**: Edit frame, chọn preset "Blue Sky" hoặc custom màu #F0F4FF

---

## 🎉 Quick Start (TL;DR)

```bash
# 1. Mở HTML file
start frontend/public/create-team-korea-frame.html

# 2. Download PNG từ browser

# 3. Refresh AdminPage
# Browser: http://localhost:5173/admin

# 4. Tìm frame "Team Korea PNC 2026"
# Click "Sửa" → Upload PNG → Save

# ✅ Done!
```

---

**Status**: ✅ Frame đã có trong database  
**Next**: Upload PNG để hoàn tất  
**ETA**: 2 phút

🇰🇷 **RISE AGAIN - PNC 2026!** 🏆
