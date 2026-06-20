# Frame Designer - Hướng dẫn test

## 🧪 Test Checklist

### 1. Component Rendering
- [ ] Modal mở khi click "🎨 Thiết kế Frame" button
- [ ] Canvas hiển thị đúng kích thước (400px wide)
- [ ] Background color hiển thị đúng (#FFE4E9 mặc định)
- [ ] Photo slots render với số thứ tự (1, 2, 3, 4)
- [ ] Close button (×) ở góc phải trên

### 2. Frame Configuration
- [ ] Dropdown chọn số ô: 2, 4, 6 slots
- [ ] Canvas resize đúng khi đổi số ô
  - 2 slots: 1080×1620
  - 4 slots: 1080×2160
  - 6 slots: 1080×2700
- [ ] Photo slots tự động regenerate khi đổi số ô
- [ ] Color picker thay đổi màu nền
- [ ] Input tên frame work

### 3. Preset Colors
- [ ] 6 preset buttons hiển thị
- [ ] Click preset thay đổi màu nền
- [ ] Border highlight khi preset đang active
- [ ] Tên frame cập nhật theo preset

### 4. Design Tools
#### Add Text
- [ ] Click "Text" button thêm text "Your Text"
- [ ] Text xuất hiện giữa canvas (X: 540, Y: 100)
- [ ] Text được auto-select sau khi thêm

#### Add Rectangle
- [ ] Click "Hình chữ nhật" thêm rect
- [ ] Rect xuất hiện đúng vị trí (giữa, gần bottom)
- [ ] Rect có border màu blue (#667eea)

#### Add Circle
- [ ] Click "Hình tròn" thêm circle
- [ ] Circle xuất hiện góc trên trái
- [ ] Fill semi-transparent

### 5. Element Selection
- [ ] Click vào element để select
- [ ] Selected element có border cam dashed
- [ ] Click vào canvas trống để deselect
- [ ] Chỉ 1 element được select tại 1 thời điểm

### 6. Property Editing
#### Text Properties
- [ ] Hiển thị controls: Vị trí X/Y, Text, Font size, Màu
- [ ] Thay đổi text content cập nhật trên canvas
- [ ] Font size slider work (1-200)
- [ ] Color picker thay đổi màu chữ

#### Rectangle Properties
- [ ] Hiển thị: Vị trí X/Y, Rộng, Cao, Màu nền
- [ ] Width/Height inputs work
- [ ] Color picker work

#### Circle Properties
- [ ] Hiển thị: Vị trí X/Y, Bán kính, Màu nền
- [ ] Radius input work
- [ ] Color picker work

### 7. Drag & Drop
- [ ] Click và drag element di chuyển được
- [ ] Cursor đổi thành `grab` khi hover element
- [ ] Cursor đổi thành `grabbing` khi đang drag
- [ ] Element position update real-time khi drag
- [ ] Position inputs update theo drag

### 8. Keyboard Shortcuts
- [ ] `Delete` xóa element đang chọn
- [ ] `Esc` deselect element
- [ ] `Arrow Left` di chuyển trái 1px
- [ ] `Arrow Right` di chuyển phải 1px
- [ ] `Arrow Up` di chuyển lên 1px
- [ ] `Arrow Down` di chuyển xuống 1px
- [ ] `Shift + Arrow` di chuyển 10px

### 9. Delete Element
- [ ] Delete button xuất hiện khi có element selected
- [ ] Click delete xóa element
- [ ] Canvas redraw sau khi xóa
- [ ] Property panel ẩn sau khi xóa

### 10. Export & Save

#### Download PNG
- [ ] Click "Download PNG" trigger download
- [ ] File tên đúng format: `{name}-{timestamp}.png`
- [ ] File PNG hợp lệ, mở được
- [ ] Nội dung canvas chính xác

#### Save to Admin
- [ ] Click "Lưu vào Admin" show loading
- [ ] Canvas convert sang blob thành công
- [ ] Upload frame thành công
- [ ] Frame xuất hiện trong danh sách
- [ ] Photo slots được lưu đúng
- [ ] Modal đóng sau khi save thành công
- [ ] Toast message xuất hiện

### 11. Edge Cases

#### Empty State
- [ ] Không có element: hiển thị hint "Click vào một phần tử"
- [ ] Canvas vẫn render background và photo slots

#### Multiple Elements
- [ ] Thêm nhiều elements (>5) work bình thường
- [ ] Z-index đúng (element sau render trên cùng)
- [ ] Click select đúng element trên cùng

#### Boundary Conditions
- [ ] Di chuyển element ra ngoài canvas
- [ ] Font size = 0
- [ ] Width/Height = 0
- [ ] Negative positions

### 12. Performance
- [ ] Canvas redraw mượt mà (<16ms)
- [ ] Drag không lag
- [ ] Modal mở/đóng nhanh
- [ ] Upload không block UI

## 🐛 Known Issues

### Issues to Fix
1. **Circle color picker**: Color input không parse được rgba, dùng fallback #ffffff
2. **Text bounding box**: Text selection bounding không chính xác 100%
3. **Canvas scale**: Khi zoom browser, coordinate mapping có thể sai

### Non-issues (Expected Behavior)
1. Canvas width cố định 400px (cho vừa màn hình)
2. Photo slots không editable trong designer (chỉ auto-generate)
3. Gradient chưa support trong phase 1

## 🔍 Testing Steps

### Quick Test (5 phút)
1. Mở AdminPage → Click "🎨 Thiết kế Frame"
2. Thêm 1 text, 1 rect, 1 circle
3. Select và chỉnh sửa properties
4. Drag element di chuyển
5. Click "Download PNG"
6. Verify file PNG tải về

### Full Test (15 phút)
1. Test tất cả frame sizes (2/4/6 slots)
2. Test tất cả preset colors
3. Thêm 10 elements khác nhau
4. Test keyboard shortcuts
5. Test drag multiple elements
6. Test delete và re-add
7. Save to Admin và verify database
8. Load lại AdminPage, check frame có trong list

### Integration Test (10 phút)
1. Thiết kế frame mới trong Designer
2. Save vào Admin
3. Về BoothPage
4. Select frame vừa tạo
5. Chụp ảnh và verify frame overlay đúng
6. Check photo slots positioning
7. Download final result

## 📊 Test Results Template

```
Date: 2026-06-19
Tester: [Your Name]
Browser: Chrome/Firefox/Safari
OS: Windows/Mac/Linux

✅ Component Rendering: PASS
✅ Frame Configuration: PASS
✅ Design Tools: PASS
✅ Element Selection: PASS
✅ Property Editing: PASS
✅ Drag & Drop: PASS
✅ Keyboard Shortcuts: PASS
✅ Export & Save: PASS
⚠️ Edge Cases: PARTIAL (issue with negative positions)
✅ Performance: PASS

Overall: ✅ PASS with minor issues
```

## 🚨 Critical Test Scenarios

### Scenario 1: Full Workflow
```
1. Open AdminPage
2. Click "🎨 Thiết kế Frame"
3. Chọn 4 slots
4. Chọn preset "Pink Gradient"
5. Đổi tên "PGC 2025 Party"
6. Add text "Welcome to PGC 2025"
7. Font size 80, màu #FF1493
8. Add rect ở bottom, fill #FFFFFF
9. Add circle decoration ở corner
10. Drag text xuống giữa
11. Keyboard: Delete circle
12. Shift+Arrow move text
13. Save to Admin
14. ✅ Check frame trong database có name, frameImage, photoSlots
```

### Scenario 2: Edge Cases
```
1. Không add element nào → Download PNG → ✅ Chỉ background + slots
2. Add 20 elements → Performance check → ✅ Vẫn mượt
3. Font size 500 → ✅ Text vẫn render
4. Drag element ra ngoài canvas → ✅ Vẫn save được
5. Close modal → Reopen → ✅ State reset
```

---

**Next Steps**: 
1. Run quick test để verify basic functionality
2. Fix critical bugs nếu có
3. Run full test
4. Document issues
5. Deploy to production

**Status**: Ready for testing ✅
