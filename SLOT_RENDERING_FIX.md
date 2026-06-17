# Photo Slot Rendering Fix

## Issue Fixed
User selected PGC 2025 frame with 4 photo slots, but only saw 2 overlapped photos instead of 4 photos in separate slots. Frame overlay image was not visible.

## Root Cause
1. **Wrong rendering order**: Frame overlay was rendered FIRST with z-index 10, covering the photos underneath (z-index 1)
2. **Wrong overflow setting**: Container had `overflow: visible` instead of `overflow: hidden`, causing photos to extend beyond frame boundaries
3. **Wrong background**: Container had `transparent` background instead of black, making it hard to see photo placement

## Solution Applied

### Step 5 (Sticker Editor) Changes
1. **Rendering order fixed**:
   - Photos render FIRST (z-index 1) - placed in absolute positioned slots
   - Frame overlay renders SECOND (z-index 5) - covers photos and creates cutout effect
   - Stickers render LAST (z-index 10) - on top of everything

2. **Container styling**:
   - Background: `#000000` (black) when using slots (shows through transparent areas)
   - AspectRatio: `9/16` (vertical portrait format)
   - Overflow: `hidden` (clips photos to container bounds)
   - MaxWidth: `500px` (consistent size)

3. **Photo slot positioning**:
   - Each photo placed in absolute positioned div at slot coordinates
   - Uses `left`, `top`, `width`, `height` from slot data (percentages)
   - Photos use `objectFit: cover` to fill slot area
   - Filters applied to each photo image

### Step 6 (Done/Download) Changes
Applied same slot-based rendering logic for consistency:
- Photos in slots (z-index 1)
- Frame overlay on top (z-index 5)  
- Stickers on top (z-index 10)

## How It Works

### For frames WITH photo slots (like PGC 2025):
```
Container (black background, 9:16 aspect ratio)
  ├─ Photo Slot 1 (absolute, 10% left, 10% top, 80% width, 20% height)
  │   └─ Photo 1 (covers entire slot)
  ├─ Photo Slot 2 (absolute, 10% left, 30% top, 80% width, 20% height)
  │   └─ Photo 2 (covers entire slot)
  ├─ Photo Slot 3 (absolute, 10% left, 50% top, 80% width, 20% height)
  │   └─ Photo 3 (covers entire slot)
  ├─ Photo Slot 4 (absolute, 10% left, 70% top, 80% width, 20% height)
  │   └─ Photo 4 (covers entire slot)
  ├─ Frame Overlay Image (absolute, full size, z-index 5, non-interactive)
  └─ Stickers Layer (absolute, full size, z-index 10)
```

### For frames WITHOUT photo slots (traditional frames):
- Renders normally with header, photos in vertical grid, footer
- Uses bgGradient background
- Photos have white borders and shadows

## Files Modified
- `frontend/src/pages/BoothPage.jsx` (Step 5 and Step 6 rendering logic)

## Testing Instructions
1. Navigate to `/booth` and select PGC 2025 frame
2. Take 4 photos
3. Go to Step 5 (Stickers)
4. Verify:
   - All 4 photos visible in separate slots
   - Frame overlay displays on top with cutout areas
   - Photos visible through black cutout areas of frame
   - Stickers can be placed on top of everything
5. Go to Step 6 (Done)
6. Verify same rendering in final result
7. Download and check exported image

## Frame Data Structure
```json
{
  "id": "pgc-2025-1781623979170",
  "name": "PGC 2025",
  "frameImage": "/uploads/frames/frame-1781623979109-267847101.jpg",
  "photoSlots": [
    {"x": 10, "y": 10, "width": 80, "height": 20, "rotation": 0},
    {"x": 10, "y": 30, "width": 80, "height": 20, "rotation": 0},
    {"x": 10, "y": 50, "width": 80, "height": 20, "rotation": 0},
    {"x": 10, "y": 70, "width": 80, "height": 20, "rotation": 0}
  ]
}
```

## Next Steps (If Needed)
1. **Adjust slot positions**: If photos don't align with actual frame cutouts, edit slot coordinates in admin panel
2. **Visual slot editor**: Add drag-and-drop slot positioning UI in admin panel for precise placement
3. **Multiple frame sizes**: Support different aspect ratios (4:3, 1:1, etc.)
4. **Photo scaling**: Add zoom/pan controls for photos within slots
