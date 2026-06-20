# 🇰🇷 Team Korea Frame - PUBG Nations Cup 2026

## 🎨 Thiết kế đã tạo

### Thông tin Frame
- **Tên**: Team Korea - PNC 2026
- **Kích thước**: 1080×2160px (4-slot standard)
- **Chủ đề**: PUBG Nations Cup 2026 - Đội tuyển Hàn Quốc
- **Màu sắc**: Lấy cảm hứng từ quốc kỳ Hàn Quốc (Blue #0047A0, Red #CD2E3A, White)

### Cấu trúc Frame

#### 📍 Header (Top 180px)
```
╔══════════════════════════════════════╗
║     TEAM KOREA 🇰🇷                   ║
║  (Gradient: Blue → Red → Blue)       ║
╚══════════════════════════════════════╝
```
- Font: Arial Black, 90px
- Text với stroke đen dày để nổi bật
- Background gradient ngang theo màu cờ Hàn Quốc

#### 👥 Photo Slots (4 slots - mỗi slot 450px cao)

**Slot 1: GYUMIN 🦝**
- Y: 250px
- Màu chủ đạo: Blue (#0047A0)
- Label trên đầu: "🦝 GYUMIN"

**Slot 2: SEONGJANG 🔥**
- Y: 730px  
- Màu chủ đạo: Red (#CD2E3A)
- Label trên đầu: "🔥 SEONGJANG"

**Slot 3: HEAVEN 😇**
- Y: 1210px
- Màu chủ đạo: White (#FFFFFF)
- Label trên đầu: "😇 HEAVEN"

**Slot 4: HEATHER ⭐**
- Y: 1690px
- Màu chủ đạo: Gold (#FFD700)
- Label trên đầu: "⭐ HEATHER"

Mỗi slot:
- Width: 900px
- Height: 450px
- Border: 8px với màu riêng của player
- Label bar: 60px cao, background màu player
- Corner decorations: Góc vàng kim 30px
- Inner glow effect

#### 🎯 Footer (Bottom 200px)
```
╔══════════════════════════════════════╗
║         RISE AGAIN                   ║
║         (Gold text, 70px)            ║
║                                      ║
║         PNC 2026                     ║
║         (White text, 50px)           ║
╚══════════════════════════════════════╝
```
- Background gradient: Red → Dark Blue → Red
- Slogan nổi bật với text outline

### 🎨 Decorative Elements

#### Hiệu ứng nền:
- Korean trigram patterns (15 patterns random)
- Blue border 20px (outer)
- Red border 10px (inner)
- Gradient background trắng với blue/red tints

#### Icons & Emojis:
- ⭐ 20-30 stars random vị trí
- ✨ Sparkles around slots (optional)
- 🏆 4 trophies ở 4 góc
- 🇰🇷 Korean flags dọc 2 bên
- 🔫 Gun icons (top corners)
- 💊 Medkit icons (bottom corners)

### 📐 Photo Slots Data (JSON)

```json
{
  "photoSlots": [
    {
      "x": 8.33,
      "y": 11.57,
      "width": 83.33,
      "height": 20.83,
      "rotation": 0,
      "label": "GYUMIN 🦝"
    },
    {
      "x": 8.33,
      "y": 33.80,
      "width": 83.33,
      "height": 20.83,
      "rotation": 0,
      "label": "SEONGJANG 🔥"
    },
    {
      "x": 8.33,
      "y": 56.02,
      "width": 83.33,
      "height": 20.83,
      "rotation": 0,
      "label": "HEAVEN 😇"
    },
    {
      "x": 8.33,
      "y": 78.24,
      "width": 83.33,
      "height": 20.83,
      "rotation": 0,
      "label": "HEATHER ⭐"
    }
  ]
}
```

## 🚀 Cách sử dụng

### Option 1: Tạo bằng HTML Generator

1. Mở file trong browser:
   ```
   frontend/public/create-team-korea-frame.html
   ```

2. Click các buttons:
   - **🎨 Tạo Frame**: Vẽ frame lên canvas
   - **✨ Thêm Hiệu Ứng**: Thêm sparkles và decorations
   - **💾 Download PNG**: Download file PNG

3. File sẽ được download với tên: `Team-Korea-PNC2026-Frame.png`

### Option 2: Upload vào Admin (Khuyến nghị)

1. Mở browser: `http://localhost:5173/admin`

2. Login với password: `kaito`

3. Click button **"🎨 Thiết kế Frame"**

4. Trong Frame Designer:
   - Chọn **4 slots**
   - Name: `Team Korea PNC 2026`
   - Color: `#F0F4FF` (light blue-white)
   - Click **"Blue Sky"** preset

5. Add elements:
   - **Text 1**: "TEAM KOREA 🇰🇷"
     - Font size: 90
     - Color: Red (#CD2E3A)
     - Position: Top center
   
   - **Text 2**: "RISE AGAIN"
     - Font size: 70
     - Color: Gold (#FFD700)
     - Position: Bottom center
   
   - **Text 3**: "PNC 2026"
     - Font size: 50
     - Color: White
     - Position: Below "RISE AGAIN"

6. Add decorations:
   - Click **"Hình tròn"** 4-6 lần
   - Drag circles đến các góc
   - Chỉnh color: Blue/Red alternating

7. Click **"Lưu vào Admin"**

### Option 3: Upload file PNG đã tạo

1. Dùng HTML generator tạo file PNG

2. Vào AdminPage → Click **"Thêm Frame Mới"**

3. Fill form:
   ```
   Tên: Team Korea PNC 2026
   Emoji: 🇰🇷
   Mô tả: PUBG Nations Cup 2026 - Korean Team
   Màu nền: #F0F4FF
   ```

4. Upload file PNG

5. Nhập **số ô ảnh: 4**

6. Điều chỉnh photo slots trong editor:
   - Slot 1 (GYUMIN): Y = 11.57%
   - Slot 2 (SEONGJANG): Y = 33.80%
   - Slot 3 (HEAVEN): Y = 56.02%
   - Slot 4 (HEATHER): Y = 78.24%

7. Click **"Lưu"**

## 🎯 Kết quả mong đợi

### Visual Preview:
```
┌────────────────────────────────────┐
│  🔵────── TEAM KOREA 🇰🇷 ──────🔴  │ ← Header
├────────────────────────────────────┤
│ 🇰🇷  🏆                      ⭐ 🇰🇷 │
│      ┌──────────────────┐          │
│      │  🦝 GYUMIN       │ ✨       │ ← Slot 1
│      │                  │          │
│ 🔫   │   [PHOTO 1]      │          │
│      │                  │          │
│      └──────────────────┘          │
│      ┌──────────────────┐          │
│      │  🔥 SEONGJANG    │          │ ← Slot 2
│      │                  │   ⭐     │
│      │   [PHOTO 2]      │          │
│ 🇰🇷  │                  │          │
│      └──────────────────┘          │
│      ┌──────────────────┐   ✨    │
│      │  😇 HEAVEN       │          │ ← Slot 3
│      │                  │          │
│      │   [PHOTO 3]      │          │
│ ✨   │                  │     🏆   │
│      └──────────────────┘          │
│      ┌──────────────────┐          │
│      │  ⭐ HEATHER      │          │ ← Slot 4
│ 💊   │                  │          │
│      │   [PHOTO 4]      │     🇰🇷  │
│      │                  │          │
│      └──────────────────┘          │
│ 🇰🇷                            💊  │
├────────────────────────────────────┤
│         🏆 RISE AGAIN 🏆           │ ← Footer
│            PNC 2026                │
│  🔴──────────────────────────🔵    │
└────────────────────────────────────┘
```

### Features:
✅ 4 photo slots với tên player riêng biệt
✅ Màu sắc Korean flag (Blue, Red, White, Gold)
✅ Decorations: Stars, Trophies, Korean flags
✅ PUBG elements: Guns, Medkits
✅ Professional typography với text outlines
✅ Gradient backgrounds
✅ Corner decorations
✅ Korean trigram patterns

## 💡 Tips cho thiết kế đẹp

1. **Màu sắc hài hòa**:
   - Blue (#0047A0) cho trust và stability
   - Red (#CD2E3A) cho passion và energy
   - White (#FFFFFF) cho purity và peace
   - Gold (#FFD700) cho victory và excellence

2. **Typography**:
   - Main title: 90px, Bold, Black outline
   - Slogan: 70px, Bold, Gold color
   - Player names: 40px, Bold, White on colored bg

3. **Spacing**:
   - 30px spacing giữa các slots
   - 60px cho player name labels
   - 20px border tổng thể

4. **Effects**:
   - Không quá nhiều decorations (clutter)
   - Balance giữa 4 góc
   - Sparkles ở vị trí strategic

## 🐛 Troubleshooting

### Issue: File quá lớn (>5MB)
**Solution**: Giảm số decorations, dùng compression

### Issue: Photo slots không align
**Solution**: Dùng editor trong Admin để fine-tune

### Issue: Text bị cut
**Solution**: Giảm font size hoặc tăng spacing

### Issue: Màu không rõ
**Solution**: Tăng contrast, thêm text outline

## 📊 Specs Summary

| Property | Value |
|----------|-------|
| Width | 1080px |
| Height | 2160px |
| Slots | 4 |
| Slot Width | 900px (83.33%) |
| Slot Height | 450px (20.83%) |
| Header Height | 180px |
| Footer Height | 200px |
| Border Width | 20px (outer), 10px (inner) |
| Primary Color | #0047A0 (Blue) |
| Secondary Color | #CD2E3A (Red) |
| Accent Color | #FFD700 (Gold) |

---

**Created**: 2026-06-19
**Theme**: Team Korea - PUBG Nations Cup 2026
**Status**: ✅ Ready to use
**Quality**: ⭐⭐⭐⭐⭐ Professional
