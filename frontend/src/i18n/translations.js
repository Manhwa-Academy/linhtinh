// Translations for Vietnamese and English
export const translations = {
  vi: {
    // Home Page
    home: {
      title: 'FRAMEVERSE',
      subtitle: 'Tạo ảnh strip đẹp lung linh ✨',
      description: 'Chụp ảnh, thêm khung & sticker, tải về ngay!',
      startButton: 'Bắt đầu tạo',
      adminButton: 'Admin',
      features: {
        instant: 'Chụp ảnh tức thì',
        frames: 'Nhiều khung đẹp',
        stickers: 'Sticker đáng yêu',
        download: 'Tải về HD'
      }
    },
    
    // Booth Page
    booth: {
      backButton: 'Quay lại',
      homeButton: 'Trang chủ',
      logo: '✨ FRAMEVERSE',
      steps: {
        setup: 'Thiết lập',
        capture: 'Chụp ảnh',
        decorate: 'Trang trí',
        done: 'Hoàn thành'
      },
      
      // Setup Step
      setup: {
        title: 'Thiết lập',
        photoStrips: 'Dải ảnh',
        frame: 'Khung ảnh',
        filter: 'Bộ lọc',
        preview: 'Xem trước',
        selectFrame: 'Chọn khung...',
        selectFilter: 'Chọn bộ lọc...',
        continue: 'Tiếp tục →',
        selectStripPlaceholder: 'Chọn dải ảnh để xem trước',
        photos: 'ảnh'
      },
      
      // Capture Step
      capture: {
        photoCounter: 'Ảnh',
        of: 'trên',
        allCapturedTitle: 'Đã chụp đủ ảnh!',
        readyMessage: 'Sẵn sàng lưu lại kỷ niệm?',
        capturedTitle: 'ĐÃ CHỤP',
        uploadTooltip: 'Tải ảnh lên',
        captureTooltip: 'Chụp ảnh',
        retakeTooltip: 'Chụp lại tất cả',
        backButton: '← Quay lại',
        continueButton: 'Chỉnh sửa ảnh →',
        alertNoPhotos: 'Vui lòng chụp hoặc tải ảnh lên!',
        alertMaxPhotos: 'Bạn đã có đủ',
        alertMaxPhotosEnd: 'ảnh!'
      },
      
      // Decorate Step
      decorate: {
        title: 'Thêm Sticker Dễ Thương',
        subtitle: 'Click sticker để thêm vào ảnh',
        chooseFrame: 'Chọn khung',
        chooseFilter: 'Chọn bộ lọc',
        categories: {
          shapes: 'Hình dạng',
          cute: 'Dễ thương',
          text: 'Chữ'
        },
        customText: {
          title: '✏️ Chữ tùy chỉnh',
          placeholder: 'Nhập chữ của bạn...',
          font: 'Font chữ:',
          size: 'Kích thước:',
          color: 'Màu:',
          addButton: '+ Thêm chữ'
        },
        photoControls: {
          title: '🖼️ Chỉnh ảnh',
          editPhoto: 'Chỉnh ảnh',
          clickToEdit: 'Click để chỉnh',
          drag: 'Kéo để di chuyển',
          zoom: 'Zoom:',
          reset: 'Đặt lại'
        },
        backButton: '← Quay lại',
        continueButton: 'Xem kết quả →',
        alertEnterText: 'Vui lòng nhập chữ!'
      },
      
      // Final Step
      final: {
        title: 'Ảnh của bạn đã sẵn sàng! 🎉',
        subtitle: 'Tải xuống và chia sẻ kỷ niệm đẹp của bạn',
        downloadButton: '📥 Tải ảnh xuống',
        startOverButton: '🔄 Tạo ảnh mới',
        backButton: '← Chỉnh sửa lại',
        alertDownloadError: 'Lỗi khi tải xuống ảnh!'
      },
      
      // Filters
      filters: {
        original: { name: 'Gốc', description: 'Không lọc - tự nhiên' },
        koreanglow: { name: 'Korean Glow', description: 'Sáng & mịn K-beauty' },
        glassskin: { name: 'Glass Skin', description: 'Mịn màng & sáng bóng' },
        studiohd: { name: 'Studio HD', description: 'Rõ nét chuyên nghiệp' },
        milkwhite: { name: 'Milk White', description: 'Da sữa mềm mại' },
        peachglow: { name: 'Peach Glow', description: 'Ánh hồng đào ấm áp' },
        softpink: { name: 'Soft Pink', description: 'Dịu dàng & ngọt ngào' },
        blossomdreamy: { name: 'Blossom Dreamy', description: 'Tông hoa mơ mộng' },
        moonlight: { name: 'Moonlight', description: 'Ánh bạc mát lạnh' },
        warm: { name: 'Ấm', description: 'Ấm cúng & vàng kim' },
        cool: { name: 'Lạnh', description: 'Tươi mát & sắc nét' },
        vintage: { name: 'Vintage', description: 'Ấm áp & hoài cổ' },
        bw: { name: 'Đen trắng', description: 'Cổ điển vượt thời gian' },
        y2k: { name: 'Y2K', description: 'Lấp lánh & tương lai' },
        hellokitty: { name: 'Hello Kitty', description: 'Ngọt ngào & mơ mộng' }
      },
      
      // Strip Types
      stripTypes: {
        solo: { name: 'Đôi', description: 'Hai khoảnh khắc hoàn hảo' },
        triple: { name: 'Bốn ảnh', description: 'Bốn kỷ niệm liên tiếp' },
        classic: { name: 'Sáu ảnh', description: 'Sáu ảnh dạng lưới' }
      }
    },
    
    // Admin Page (keep in Vietnamese)
    admin: {
      title: 'Quản lý Frame',
      // ... keep existing Vietnamese
    }
  },
  
  en: {
    // Home Page
    home: {
      title: 'FRAMEVERSE',
      subtitle: 'Create stunning photo strips ✨',
      description: 'Snap photos, add frames & stickers, download instantly!',
      startButton: 'Start Creating',
      adminButton: 'Admin',
      features: {
        instant: 'Instant Capture',
        frames: 'Beautiful Frames',
        stickers: 'Cute Stickers',
        download: 'HD Download'
      }
    },
    
    // Booth Page
    booth: {
      backButton: 'Back',
      homeButton: 'Home',
      logo: '✨ FRAMEVERSE',
      steps: {
        setup: 'Setup',
        capture: 'Capture',
        decorate: 'Decorate',
        done: 'Done!'
      },
      
      // Setup Step
      setup: {
        title: 'Setup',
        photoStrips: 'Photo Strips',
        frame: 'Frame',
        filter: 'Filter',
        preview: 'Preview',
        selectFrame: 'Select frame...',
        selectFilter: 'Select filter...',
        continue: 'Continue →',
        selectStripPlaceholder: 'Select a strip type to see preview',
        photos: 'photos'
      },
      
      // Capture Step
      capture: {
        photoCounter: 'Photo',
        of: 'of',
        allCapturedTitle: 'All photos captured!',
        readyMessage: 'Ready to capture memories?',
        capturedTitle: 'CAPTURED',
        uploadTooltip: 'Upload photos',
        captureTooltip: 'Capture photo',
        retakeTooltip: 'Retake all',
        backButton: '← Back',
        continueButton: 'Edit Photos →',
        alertNoPhotos: 'Please capture or upload photos!',
        alertMaxPhotos: 'You already have',
        alertMaxPhotosEnd: 'photos!'
      },
      
      // Decorate Step
      decorate: {
        title: 'Add Cute Stickers',
        subtitle: 'Click stickers to add them to your photos',
        chooseFrame: 'Choose Frame',
        chooseFilter: 'Choose Filter',
        categories: {
          shapes: 'Shapes',
          cute: 'Cute',
          text: 'Text'
        },
        customText: {
          title: '✏️ Custom Text',
          placeholder: 'Enter your text...',
          font: 'Font:',
          size: 'Size:',
          color: 'Color:',
          addButton: '+ Add Text'
        },
        photoControls: {
          title: '🖼️ Photo Controls',
          editPhoto: 'Edit Photo',
          clickToEdit: 'Click to edit',
          drag: 'Drag to move',
          zoom: 'Zoom:',
          reset: 'Reset'
        },
        backButton: '← Back',
        continueButton: 'See Result →',
        alertEnterText: 'Please enter text!'
      },
      
      // Final Step
      final: {
        title: 'Your Photos Are Ready! 🎉',
        subtitle: 'Download and share your beautiful memories',
        downloadButton: '📥 Download Photos',
        startOverButton: '🔄 Create New',
        backButton: '← Edit Again',
        alertDownloadError: 'Error downloading photo!'
      },
      
      // Filters
      filters: {
        original: { name: 'Original', description: 'No filter - natural look' },
        koreanglow: { name: 'Korean Glow', description: 'Bright & dewy K-beauty' },
        glassskin: { name: 'Glass Skin', description: 'Ultra smooth & luminous' },
        studiohd: { name: 'Studio HD', description: 'Professional clarity' },
        milkwhite: { name: 'Milk White', description: 'Soft milky complexion' },
        peachglow: { name: 'Peach Glow', description: 'Warm peachy radiance' },
        softpink: { name: 'Soft Pink', description: 'Delicate & sweet' },
        blossomdreamy: { name: 'Blossom Dreamy', description: 'Ethereal flower tones' },
        moonlight: { name: 'Moonlight', description: 'Cool silver glow' },
        warm: { name: 'Warm', description: 'Cozy & golden' },
        cool: { name: 'Cool', description: 'Fresh & crisp' },
        vintage: { name: 'Vintage', description: 'Warm & nostalgic' },
        bw: { name: 'B&W', description: 'Timeless classic' },
        y2k: { name: 'Y2K', description: 'Glittery & futuristic' },
        hellokitty: { name: 'Hello Kitty', description: 'Sweet & dreamy' }
      },
      
      // Strip Types
      stripTypes: {
        solo: { name: 'Double Shot', description: 'Two perfect moments' },
        triple: { name: 'Quad Fun', description: 'Four memories in a row' },
        classic: { name: 'Super Strip', description: 'Six photos in grid' }
      }
    },
    
    // Admin Page (keep in Vietnamese for admin)
    admin: {
      title: 'Quản lý Frame',
      // ... keep existing Vietnamese
    }
  }
}

// Detect browser language
export const detectLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage
  // If browser is set to Vietnamese, use Vietnamese
  if (browserLang.toLowerCase().startsWith('vi')) {
    return 'vi'
  }
  // Default to English
  return 'en'
}
