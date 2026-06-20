# Frame Designer - Tính năng thiết kế Frame trong trình duyệt

## 🎨 Tổng quan
Frame Designer là công cụ thiết kế frame trực tiếp trong trình duyệt, cho phép tạo frame strip nhanh chóng mà không cần phần mềm thiết kế chuyên nghiệp.

## ✨ Tính năng chính

### 1. Canvas Drawing Engine
- **Canvas-based rendering** với khả năng real-time preview
- Hỗ trợ các kích thước chuẩn:
  - 2-slot: 1080×1620px
  - 4-slot: 1080×2160px ⭐
  - 6-slot: 1080×2700px
- Tự động scale canvas để hiển thị trong viewport

### 2. Design Tools
#### Text Tool
- Thêm text với custom font size
- Chỉnh màu chữ tùy ý
- Font family: Arial (có thể mở rộng)
- Text alignment: center/left/right

#### Shape Tools
- **Rectangle**: Tạo khung chữ nhật với fill color và stroke
- **Circle**: Tạo hình tròn trang trí với fill và stroke
- Chỉnh kích thước, vị trí tùy ý

### 3. Photo Slots Management
- **Auto-generate slots**: Tự động tạo photo slots phân bố đều
- Hiển thị preview với số thứ tự slot
- Checkerboard pattern để dễ nhận diện

### 4. Interactive Editing
#### Mouse Interaction
- **Click to select**: Click vào element để chọn và chỉnh sửa
- **Drag & drop**: Kéo thả element để di chuyển vị trí
- Visual highlight khi element được chọn
- Cursor changes: `grab` khi hover, `grabbing` khi drag

#### Keyboard Shortcuts
- `Delete`: Xóa element đang chọn
- `Esc`: Bỏ chọn element
- `← ↑ → ↓`: Di chuyển element (1px mỗi lần)
- `Shift + ← ↑ → ↓`: Di chuyển nhanh (10px mỗi lần)

### 5. Property Editor
Real-time editing panel cho từng element:
- **Position**: X, Y coordinates
- **Text properties**: Text content, font size, color
- **Rectangle properties**: Width, height, fill color
- **Circle properties**: Radius, fill color
- Delete button để xóa element

### 6. Color Presets
6 preset màu phổ biến:
- 🌸 Pink Gradient (#FFE4E9)
- ☁️ Blue Sky (#E0F2FE)
- 🌿 Mint Fresh (#D1FAE5)
- 💜 Lavender (#E9D5FF)
- 🌅 Sunset (#FED7AA)
- 🍒 Cherry (#FECACA)

### 7. Export & Save
- **Download PNG**: Export trực tiếp ra file PNG
- **Save to Admin**: Lưu vào database với photo slots metadata
- Tự động upload lên server
- Tích hợp với validation system

## 🎯 User Experience

### Visual Feedback
- Selected element có border màu cam với dashed line
- Hover cursor thay đổi theo context
- Real-time preview khi chỉnh sửa
- Photo slots có màu gradient mẫu để dễ thấy

### Guided Workflow
1. Chọn số ô ảnh (2/4/6 slots)
2. Chọn preset hoặc màu tùy chỉnh
3. Thêm text/shapes với công cụ
4. Click để select, drag để di chuyển
5. Chỉnh sửa properties trong panel bên trái
6. Lưu hoặc download

### Tips & Instructions
- Banner hướng dẫn sử dụng ở đầu trang
- Keyboard shortcuts reminder
- Contextual hints khi không có element nào được chọn

## 🔗 Integration với Admin Page

### Modal Implementation
- Full-screen modal với overlay
- Close button ở góc phải trên
- Max width 1400px, responsive
- Scroll nếu nội dung quá dài

### Save Callback
```javascript
onSave={async (designData) => {
  // Convert canvas dataURL to blob
  // Create File object
  // Upload to server
  // Save frame to database with photo slots
}}
```

### Data Flow
1. User thiết kế frame trong FrameDesigner
2. Click "Lưu vào Admin"
3. Canvas export thành PNG dataURL
4. Convert sang File object
5. Upload qua `uploadFrameImageWithTimeout()`
6. Save frame metadata + photo slots vào database
7. Refresh frames list

## 📐 Technical Details

### Canvas Rendering
- 2D context rendering
- Layered drawing: background → photo slots → elements
- Anti-aliasing cho smooth graphics
- Proper scaling với `getBoundingClientRect()`

### State Management
- `frameConfig`: Frame settings (size, color, name)
- `elements`: Array of design elements
- `photoSlots`: Array of photo slot positions
- `selectedElement`: Currently selected element index
- `isDragging`: Drag state for mouse interaction

### Coordinate System
- Canvas uses absolute pixel coordinates (0-1080 × 0-2160)
- Photo slots use percentage-based positioning (0-100%)
- Mouse events scaled from screen to canvas coordinates

## 🚀 Future Enhancements

### Potential Features
- [ ] Image upload for decorations
- [ ] Gradient backgrounds
- [ ] Pattern fills
- [ ] More font families
- [ ] Text effects (shadow, outline)
- [ ] Stickers library
- [ ] Undo/Redo functionality
- [ ] Copy/Paste elements
- [ ] Layers panel
- [ ] Templates gallery
- [ ] Export to SVG
- [ ] Collaborative editing

### Performance Optimizations
- [ ] Canvas caching for static elements
- [ ] Debounced redraw
- [ ] Virtual scrolling for element list
- [ ] Web Worker for image processing

## 📝 Usage Example

```javascript
// In AdminPage.jsx
<FrameDesigner
  onSave={async (designData) => {
    // designData contains:
    // - name: Frame name
    // - imageDataUrl: Canvas as PNG data URL
    // - photoSlots: Array of slot positions
    // - config: Frame configuration
    
    const blob = await fetch(designData.imageDataUrl).then(r => r.blob())
    const file = new File([blob], `${designData.name}.png`, { type: 'image/png' })
    
    const frameImageUrl = await uploadFrameImageWithTimeout(file, designData.photoSlots)
    
    await saveFrame({
      name: designData.name,
      frameImage: frameImageUrl,
      photoSlots: designData.photoSlots,
      color: designData.config.bgColor
    })
  }}
/>
```

## 🎨 Design Philosophy

### Simplicity First
- Minimal UI, maximum functionality
- Clear visual hierarchy
- Obvious interactions
- No learning curve

### Progressive Disclosure
- Basic features visible
- Advanced options when needed
- Contextual help
- Guided workflow

### Professional Output
- Standard dimensions
- Quality export
- Validation-ready
- Production-ready files

---

**Status**: ✅ Hoàn thành và đã tích hợp vào AdminPage
**Version**: 1.0.0
**Last Updated**: 2026-06-19
