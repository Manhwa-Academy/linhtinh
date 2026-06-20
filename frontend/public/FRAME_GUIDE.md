# 🎨 Hướng dẫn tạo Frame Strip chuẩn

## Vấn đề bạn đang gặp (dựa trên ảnh):

```
❌ SAI:                          ✅ ĐÚNG:
┌──┐                            ┌─────────────────┐
│  │ Frame quá hẹp              │                 │
│▓▓│ Ảnh không khớp             │  ┌───────────┐  │
│  │ Bị méo ngang               │  │   ẢNH 1   │  │
│▓▓│                            │  └───────────┘  │
│  │                            │                 │
│▓▓│                            │  ┌───────────┐  │
│  │                            │  │   ẢNH 2   │  │
│▓▓│                            │  └───────────┘  │
└──┘                            │                 │
 Không đúng                     │  ┌───────────┐  │
 kích thước                     │  │   ẢNH 3   │  │
                                │  └───────────┘  │
                                │                 │
                                │  ┌───────────┐  │
                                │  │   ẢNH 4   │  │
                                │  └───────────┘  │
                                │                 │
                                └─────────────────┘
                                 1080 × 2160 px
```

## Kích thước chuẩn:

### Frame 4 ô (Photo Booth tiêu chuẩn)
```
┌─────────────────────────────────┐
│      Width: 1080px              │
│     Height: 2160px              │
│                                 │
│   Tỷ lệ: 1:2 (dọc)             │
│                                 │
│   ┌─────────────────────────┐  │ ← 5% margin
│   │                         │  │
│   │      Photo Slot 1       │  │
│   │     (Safe Zone)         │  │
│   │                         │  │
│   └─────────────────────────┘  │
│                                 │
│   ┌─────────────────────────┐  │
│   │      Photo Slot 2       │  │
│   └─────────────────────────┘  │
│                                 │
│   ┌─────────────────────────┐  │
│   │      Photo Slot 3       │  │
│   └─────────────────────────┘  │
│                                 │
│   ┌─────────────────────────┐  │
│   │      Photo Slot 4       │  │
│   └─────────────────────────┘  │
│                                 │ ← 5% margin
└─────────────────────────────────┘
```

## Cách tạo frame đúng trong Photoshop:

1. **File → New**
   - Width: 1080 pixels
   - Height: 2160 pixels
   - Resolution: 300 dpi (để in đẹp)
   - Color Mode: RGB
   - Background: Transparent ✅

2. **Vẽ frame decoration**
   - Để lại 4 ô đen cho ảnh
   - Mỗi ô cao khoảng 450-500px
   - Cách đều nhau

3. **Export**
   - File → Export → Export As
   - Format: PNG
   - Transparency: ✅
   - Save

## Cách fix frame bị lỗi:

### Nếu frame quá nhỏ/to:
```bash
Image → Image Size
Width: 1080 px
Height: 2160 px
✅ Constrain Proportions
Resample: Bicubic Sharper
```

### Nếu file quá lớn (>5MB):
1. Vào https://tinypng.com
2. Upload file
3. Download file đã nén

## Photo Slots phải nằm trong Safe Zone:

```
┌─────────────────────────────────┐
│ ←── 5% margin (54px) ──────→   │
│  ╔═══════════════════════════╗  │ ↑
│  ║                           ║  │ 5% margin
│  ║    SAFE ZONE              ║  │ (108px)
│  ║    (Đặt ô ảnh ở đây)      ║  │ ↓
│  ║                           ║  │
│  ║    X: 5% → 95%            ║  │
│  ║    Y: 5% → 95%            ║  │
│  ║                           ║  │
│  ╚═══════════════════════════╝  │
│                                 │
└─────────────────────────────────┘
```

## Template Canva (dễ dùng):

1. Canva → Custom Size: 1080 × 2160
2. Chọn template "Photo Strip"
3. Hoặc tự design với 4 ô
4. Download → PNG với transparent background

## Tóm tắt nhanh:

| Yêu cầu | Giá trị |
|---------|---------|
| Width | 1080px |
| Height | 2160px (4 ô) |
| Format | PNG ⭐ |
| Size | < 5MB |
| Background | Transparent |
| Slots | 4 ô |
| Safe Zone | ≥5% từ mép |

---

**💡 Mẹo:** Tải template mẫu tại `/docs/frame-template.psd`
