import { useState, useRef, useCallback, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { 
  Camera, Upload, Sparkles, ArrowLeft, ArrowRight, 
  Download, RotateCcw, Heart, Star, Gift, Flower2,
  Cat, Sun, Moon, Cloud, Music, Crown, Gem, Smile,
  Snowflake, Flame, Zap, Droplet, Circle, Square, Triangle,
  Hexagon, Shield, Bookmark, Flag, MapPin, Anchor, Compass,
  Rocket, Gamepad2, Palette, Bell, Coffee, Plane, Bike, Car,
  Umbrella, Trophy, Key, Glasses
} from 'lucide-react'
import { API_URL, frameImageUrl } from '../config/api'
import { useTranslation } from '../i18n/useTranslation'
import SetupStep from '../components/SetupStep'
import CaptureStep from '../components/CaptureStep'
import '../styles/BoothPage.css'

const stripTypes = [
  { id: 'solo', name: 'Double Shot', description: 'Two perfect moments', count: 2, icon: Camera, layout: 'vertical' },
  { id: 'triple', name: 'Quad Fun', description: 'Four memories in a row', count: 4, icon: Camera, layout: 'vertical' },
  { id: 'classic', name: 'Super Strip', description: 'Six photos in grid', count: 6, icon: Camera, layout: 'grid' }
]

// Frames will be loaded from API dynamically

const filters = [
  { id: 'original', name: 'Original', description: 'No filter - natural look', value: 'none', color: '#FFFFFF', icon: Sparkles },
  { id: 'koreanglow', name: 'Korean Glow', description: 'Bright & dewy K-beauty', value: 'brightness(1.15) contrast(0.95) saturate(1.1)', color: '#FBCFE8', icon: Sparkles },
  { id: 'glassskin', name: 'Glass Skin', description: 'Ultra smooth & luminous', value: 'brightness(1.18) contrast(0.92) saturate(1.05) blur(0.2px)', color: '#F0F9FF', icon: Sparkles },
  { id: 'studiohd', name: 'Studio HD', description: 'Professional clarity', value: 'contrast(1.15) saturate(1.08) brightness(1.05) sharpen(1.2)', color: '#E0E7FF', icon: Sparkles },
  { id: 'milkwhite', name: 'Milk White', description: 'Soft milky complexion', value: 'brightness(1.2) contrast(0.88) saturate(0.95)', color: '#FAF5FF', icon: Sparkles },
  { id: 'peachglow', name: 'Peach Glow', description: 'Warm peachy radiance', value: 'saturate(1.15) brightness(1.1) hue-rotate(350deg) contrast(1.05)', color: '#FFEDD5', icon: Sparkles },
  { id: 'softpink', name: 'Soft Pink', description: 'Delicate & sweet', value: 'saturate(1.2) brightness(1.08) hue-rotate(340deg)', color: '#FCE7F3', icon: Sparkles },
  { id: 'blossomdreamy', name: 'Blossom Dreamy', description: 'Ethereal flower tones', value: 'contrast(0.9) brightness(1.12) saturate(1.18) hue-rotate(335deg) blur(0.25px)', color: '#FFF1F2', icon: Sparkles },
  { id: 'moonlight', name: 'Moonlight', description: 'Cool silver glow', value: 'brightness(1.08) contrast(1.05) saturate(0.85) hue-rotate(200deg)', color: '#E0F2FE', icon: Sparkles },
  { id: 'warm', name: 'Warm', description: 'Cozy & golden', value: 'sepia(20%) saturate(1.2) brightness(1.05)', color: '#FED7AA', icon: Sparkles },
  { id: 'cool', name: 'Cool', description: 'Fresh & crisp', value: 'saturate(0.9) brightness(1.05) hue-rotate(180deg) contrast(1.1)', color: '#BAE6FD', icon: Sparkles },
  { id: 'vintage', name: 'Vintage', description: 'Warm & nostalgic', value: 'sepia(40%) contrast(1.1)', color: '#FEF08A', icon: Sparkles },
  { id: 'bw', name: 'B&W', description: 'Timeless classic', value: 'grayscale(100%) contrast(1.2)', color: '#E2E8F0', icon: Sparkles },
  { id: 'y2k', name: 'Y2K', description: 'Glittery & futuristic', value: 'contrast(1.2) saturate(1.5) hue-rotate(330deg)', color: '#B2F5EA', icon: Sparkles },
  { id: 'hellokitty', name: 'Hello Kitty', description: 'Sweet & dreamy', value: 'saturate(1.3) brightness(1.1) hue-rotate(320deg)', color: '#FBC2EB', icon: Sparkles }
]

const stickerIconsMap = {
  Heart, Star, Sparkles, Sun, Moon, Cloud, Snowflake, Flame, Zap, Droplet, 
  Circle, Square, Triangle, Hexagon, Shield, Bookmark, Flag, MapPin, Anchor, Compass,
  Cat, Gift, Flower2, Music, Crown, Gem, Smile, Rocket, Gamepad2, Palette, 
  Bell, Coffee, Camera, Plane, Bike, Car, Umbrella, Trophy, Key, Glasses
}

const stickerCategories = {
  shapes: [
    { id: 's1', type: 'icon', name: 'Heart', props: { color: '#FF6B9D', fill: '#FF6B9D' } },
    { id: 's2', type: 'icon', name: 'Star', props: { color: '#FBBF24', fill: '#FBBF24' } },
    { id: 's3', type: 'icon', name: 'Sparkles', props: { color: '#FCD34D', fill: 'none' } },
    { id: 's4', type: 'icon', name: 'Sun', props: { color: '#F59E0B', fill: '#FCD34D' } },
    { id: 's5', type: 'icon', name: 'Moon', props: { color: '#6366F1', fill: '#C7D2FE' } },
    { id: 's6', type: 'icon', name: 'Cloud', props: { color: '#60A5FA', fill: '#DBEAFE' } },
    { id: 's7', type: 'icon', name: 'Snowflake', props: { color: '#3B82F6', fill: '#93C5FD' } },
    { id: 's8', type: 'icon', name: 'Flame', props: { color: '#EF4444', fill: '#FCA5A5' } },
    { id: 's9', type: 'icon', name: 'Zap', props: { color: '#EAB308', fill: '#FEF08A' } },
    { id: 's10', type: 'icon', name: 'Droplet', props: { color: '#06B6D4', fill: '#67E8F9' } },
    { id: 's11', type: 'icon', name: 'Circle', props: { color: '#8B5CF6', fill: '#C4B5FD' } },
    { id: 's12', type: 'icon', name: 'Square', props: { color: '#10B981', fill: '#6EE7B7' } },
    { id: 's13', type: 'icon', name: 'Triangle', props: { color: '#F43F5E', fill: '#FDA4AF' } },
    { id: 's14', type: 'icon', name: 'Hexagon', props: { color: '#D946EF', fill: '#F0ABFC' } },
    { id: 's15', type: 'icon', name: 'Shield', props: { color: '#64748B', fill: '#CBD5E1' } },
    { id: 's16', type: 'icon', name: 'Bookmark', props: { color: '#EAB308', fill: '#FDE047' } },
    { id: 's17', type: 'icon', name: 'Flag', props: { color: '#EF4444', fill: '#FCA5A5' } },
    { id: 's18', type: 'icon', name: 'MapPin', props: { color: '#EF4444', fill: '#FCA5A5' } },
    { id: 's19', type: 'icon', name: 'Anchor', props: { color: '#3B82F6', fill: '#93C5FD' } },
    { id: 's20', type: 'icon', name: 'Compass', props: { color: '#8B5CF6', fill: '#C4B5FD' } },
  ],
  cute: [
    { id: 'c1', type: 'icon', name: 'Cat', props: { color: '#D97706', fill: '#FBBF24' } },
    { id: 'c2', type: 'icon', name: 'Gift', props: { color: '#EF4444', fill: '#FCA5A5' } },
    { id: 'c3', type: 'icon', name: 'Flower2', props: { color: '#EC4899', fill: '#FBCFE8' } },
    { id: 'c4', type: 'icon', name: 'Music', props: { color: '#8B5CF6', fill: '#DDD6FE' } },
    { id: 'c5', type: 'icon', name: 'Crown', props: { color: '#F59E0B', fill: '#FDE68A' } },
    { id: 'c6', type: 'icon', name: 'Gem', props: { color: '#3B82F6', fill: '#BFDBFE' } },
    { id: 'c7', type: 'icon', name: 'Smile', props: { color: '#F59E0B', fill: '#FDE68A' } },
    { id: 'c8', type: 'icon', name: 'Rocket', props: { color: '#EF4444', fill: '#FCA5A5' } },
    { id: 'c9', type: 'icon', name: 'Gamepad2', props: { color: '#8B5CF6', fill: '#C4B5FD' } },
    { id: 'c10', type: 'icon', name: 'Palette', props: { color: '#10B981', fill: '#6EE7B7' } },
    { id: 'c11', type: 'icon', name: 'Bell', props: { color: '#EAB308', fill: '#FEF08A' } },
    { id: 'c12', type: 'icon', name: 'Coffee', props: { color: '#8B5CF6', fill: '#C4B5FD' } },
    { id: 'c13', type: 'icon', name: 'Camera', props: { color: '#64748B', fill: '#CBD5E1' } },
    { id: 'c14', type: 'icon', name: 'Plane', props: { color: '#3B82F6', fill: '#93C5FD' } },
    { id: 'c15', type: 'icon', name: 'Bike', props: { color: '#F43F5E', fill: '#FDA4AF' } },
    { id: 'c16', type: 'icon', name: 'Car', props: { color: '#10B981', fill: '#6EE7B7' } },
    { id: 'c17', type: 'icon', name: 'Umbrella', props: { color: '#EC4899', fill: '#FBCFE8' } },
    { id: 'c18', type: 'icon', name: 'Trophy', props: { color: '#EAB308', fill: '#FDE047' } },
    { id: 'c19', type: 'icon', name: 'Key', props: { color: '#D946EF', fill: '#F0ABFC' } },
    { id: 'c20', type: 'icon', name: 'Glasses', props: { color: '#3B82F6', fill: '#93C5FD' } },
  ],
  text: [
    { id: 't1', type: 'text', text: 'OMG!' },
    { id: 't2', type: 'text', text: 'Cute!' },
    { id: 't3', type: 'text', text: 'You!' },
    { id: 't4', type: 'text', text: 'LOL' },
    { id: 't5', type: 'text', text: 'BFF' },
    { id: 't6', type: 'text', text: 'Smile!' },
    { id: 't7', type: 'text', text: 'Besties' },
    { id: 't8', type: 'text', text: 'Love' },
    { id: 't9', type: 'text', text: 'Cool' },
    { id: 't10', type: 'text', text: 'Fun' },
    { id: 't11', type: 'text', text: 'Sweet!' },
    { id: 't12', type: 'text', text: 'XOXO' },
    { id: 't13', type: 'text', text: 'Vibe' },
    { id: 't14', type: 'text', text: '100%' },
    { id: 't15', type: 'text', text: 'Mood' },
    { id: 't16', type: 'text', text: 'Dope' },
    { id: 't17', type: 'text', text: 'Slay' },
    { id: 't18', type: 'text', text: 'Epic' },
    { id: 't19', type: 'text', text: 'Lit' },
    { id: 't20', type: 'text', text: 'Yasss' },
  ]
}

const categoryIcons = {
  shapes: Star,
  cute: Cat,
  text: Flower2
}

const renderStickerContent = (stickerItem, size = 48) => {
  if (stickerItem.type === 'icon') {
    const IconCmp = stickerIconsMap[stickerItem.name]
    return <IconCmp size={size} {...stickerItem.props} />
  }
  if (stickerItem.type === 'customText') {
    return (
      <span style={{
        fontFamily: stickerItem.font,
        fontSize: `${stickerItem.size}px`,
        color: stickerItem.color,
        fontWeight: '700',
        whiteSpace: 'nowrap'
      }}>
        {stickerItem.text}
      </span>
    )
  }
  return stickerItem.text
}

const makeBlackTransparent = (imgSrc) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          
          // Make BLACK/dark pixels transparent (for photo slot cutouts)
          // Increase threshold to catch more dark areas in slots
          if (r < 100 && g < 100 && b < 100) {
            data[i+3] = 0; // Set alpha to 0 (transparent)
          }
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Could not process frame transparency (CORS?):', err);
        // Fallback: return original image
        resolve(imgSrc);
      }
    };
    img.onerror = () => {
      console.error('Failed to load frame image for transparency processing');
      resolve(imgSrc);
    };
    img.src = imgSrc;
  });
};

function BoothPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const photoStripRef = useRef(null)
  const canvasRef = useRef(null)
  
  // Get current step from URL, default to 1
  const currentStep = parseInt(searchParams.get('step') || '1', 10)
  
  // Multi-step workflow states
  const [selectedStripType, setSelectedStripType] = useState(null)
  const [selectedFrame, setSelectedFrame] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [selectedStickers, setSelectedStickers] = useState([])
  const [stickerCategory, setStickerCategory] = useState('shapes')
  const [showFilterPicker, setShowFilterPicker] = useState(false)
  const [showFramePicker, setShowFramePicker] = useState(false)
  const [draggingSticker, setDraggingSticker] = useState(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  
  // Custom text states
  const [customText, setCustomText] = useState('')
  const [customTextFont, setCustomTextFont] = useState('Quicksand')
  const [customTextSize, setCustomTextSize] = useState('18')
  const [customTextColor, setCustomTextColor] = useState('#FF1493')
  
  // Load frames from API
  const [frames, setFrames] = useState([])
  const [processedFrameUrl, setProcessedFrameUrl] = useState(null)
  const [debugSlots, setDebugSlots] = useState(false) // Disable debug by default
  // Photo transform controls: per-photo { scale, x, y }
  const [photoTransforms, setPhotoTransforms] = useState({})
  const [activePhotoEdit, setActivePhotoEdit] = useState(null) // index of photo being edited
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 })

  const getTransform = (index) => photoTransforms[index] || { scale: 5.5, x: 0, y: 0 }

  const updateTransform = (index, patch) => {
    setPhotoTransforms(prev => ({
      ...prev,
      [index]: { ...getTransform(index), ...patch }
    }))
  }
  
  // Auto-fit photos to frame slots when photos change
  const autoFitPhotosToSlots = useCallback(() => {
    if (!selectedFrame?.photoSlots || capturedPhotos.length === 0) return;
    
    // Calculate ideal scale for each photo to fill its slot
    const newTransforms = {};
    capturedPhotos.forEach((photo, index) => {
      const slot = selectedFrame.photoSlots[index];
      if (!slot) return;
      
      // Photos are square (1:1 aspect ratio)
      // Slots are wider rectangles (e.g., 80% wide × 21.3% tall ≈ 3.76:1)
      // To fill the slot, we need to scale so photo width matches slot width
      
      // Calculate scale needed to fill slot width
      const slotAspect = slot.width / slot.height;
      
      // For wide slots (aspect > 1), scale up by that ratio
      // Add extra 25% to ensure full coverage with no gaps
      const fillScale = Math.max(slotAspect * 1.25, 5.5);
      
      newTransforms[index] = { 
        scale: fillScale, 
        x: 0, 
        y: 0 
      };
    });
    
    setPhotoTransforms(newTransforms);
  }, [selectedFrame, capturedPhotos]);
  
  // Run auto-fit when photos or frame changes
  useEffect(() => {
    autoFitPhotosToSlots();
  }, [autoFitPhotosToSlots]);

  const handleSlotMouseDown = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    setActivePhotoEdit(index)
    const t = getTransform(index)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    dragRef.current = { dragging: true, startX: clientX, startY: clientY, origX: t.x, origY: t.y }
  }

  const handleSlotMouseMove = (e) => {
    const d = dragRef.current
    if (!d.dragging || activePhotoEdit === null) return
    e.preventDefault()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const dx = clientX - d.startX
    const dy = clientY - d.startY
    updateTransform(activePhotoEdit, { x: d.origX + dx, y: d.origY + dy })
  }

  const handleSlotMouseUp = (e) => {
    if (e) e.preventDefault()
    dragRef.current.dragging = false
  }
  
  useEffect(() => {
    if (selectedFrame?.frameImage) {
      makeBlackTransparent(frameImageUrl(selectedFrame.frameImage))
        .then(url => setProcessedFrameUrl(url))
    } else {
      setProcessedFrameUrl(null)
    }
  }, [selectedFrame])
  
  useEffect(() => {
    loadFrames()
  }, [])
  
  const loadFrames = async () => {
    try {
      const response = await fetch(`${API_URL}/api/frames`)
      if (response.ok) {
        const data = await response.json()
        setFrames(data.frames)
      }
    } catch (error) {
      console.error('Error loading frames:', error)
      // Fallback to default frames if API fails
      setFrames([
        { id: 'spring', name: 'Spring', description: 'Cherry blossoms & nature', emoji: '🌸', color: '#FFE4E9', bgGradient: 'linear-gradient(135deg, #FFE4E9 0%, #FFF0F5 100%)' },
        { id: 'summer', name: 'Summer', description: 'Bright & sunny', emoji: '☀️', color: '#FFF4CC', bgGradient: 'linear-gradient(135deg, #FFF4CC 0%, #FFFACD 100%)' },
        { id: 'autumn', name: 'Autumn', description: 'Warm & cozy', emoji: '🍂', color: '#FFE5CC', bgGradient: 'linear-gradient(135deg, #FFE5CC 0%, #FFDAB9 100%)' },
        { id: 'winter', name: 'Winter', description: 'Cool & serene', emoji: '❄️', color: '#E0F2FE', bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)' }
      ])
    }
  }

  // Update URL when step changes
  const setCurrentStep = (step) => {
    setSearchParams({ step: step.toString() })
  }

  // Ensure user has selected a strip type before proceeding (prevents crash on refresh)
  useEffect(() => {
    if (currentStep > 1 && !selectedStripType) {
      setCurrentStep(1)
    }
  }, [currentStep, selectedStripType, setSearchParams])

  // Navigation
  const goToNextStep = () => {
    if (currentStep < 4) {
      if (currentStep === 2 && capturedPhotos.length === 0) {
        alert(t.booth.capture.alertNoPhotos)
        return
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToHome = () => {
    navigate('/')
  }

  const startOver = () => {
    setCurrentStep(1)
    setSelectedStripType(null)
    setSelectedFrame(null)
    setSelectedFilter(null)
    setCapturedPhotos([])
    setSelectedStickers([])
  }

  // Step 1: Select strip type
  const selectStripType = (type) => {
    setSelectedStripType(type)
  }

  // Step 2: Select frame
  const selectFrame = (frame) => {
    setSelectedFrame(frame)
  }

  // Step 3: Select filter
  const selectFilter = (filter) => {
    setSelectedFilter(filter)
  }

  // Step 5: Add stickers
  const addSticker = (stickerItem) => {
    const newSticker = {
      id: Date.now() + Math.random(), // Ensure unique ID
      item: stickerItem,
      x: 10, // Position as percentage from left
      y: 10, // Position as percentage from top
    }
    setSelectedStickers([...selectedStickers, newSticker])
  }

  const addCustomText = () => {
    if (!customText.trim()) {
      alert(t.booth.decorate.alertEnterText)
      return
    }
    
    const customTextItem = {
      type: 'customText',
      text: customText,
      font: customTextFont,
      size: customTextSize,
      color: customTextColor
    }
    
    addSticker(customTextItem)
    setCustomText('') // Reset input
  }

  const removeSticker = (stickerId) => {
    setSelectedStickers(selectedStickers.filter(s => s.id !== stickerId))
  }

  const updateStickerPosition = (stickerId, x, y) => {
    setSelectedStickers(selectedStickers.map(sticker =>
      sticker.id === stickerId ? { ...sticker, x, y } : sticker
    ))
  }

  const handleStickerDragStart = (e, stickerId) => {
    setDraggingSticker(stickerId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleStickerDrag = (e, stickerId, containerRect) => {
    if (e.clientX === 0 && e.clientY === 0) return // Ignore final drag event
    
    // Convert pixel position to percentage
    const xPercent = Math.max(0, Math.min(((e.clientX - containerRect.left) / containerRect.width) * 100, 90))
    const yPercent = Math.max(0, Math.min(((e.clientY - containerRect.top) / containerRect.height) * 100, 90))
    
    updateStickerPosition(stickerId, xPercent, yPercent)
  }

  const handleStickerDragEnd = () => {
    setDraggingSticker(null)
  }

  // Assign sticker to specific photo when dropped
  const handleStickerDropOnPhoto = (stickerId, photoIndex) => {
    // No longer needed as stickers are applied to the whole strip
  }

  // Step 6: Download - Download the entire strip
  const downloadAllPhotos = async () => {
    // If using image frame, use manual canvas compositing (html2canvas can't handle mix-blend-mode)
    if (selectedFrame?.frameImage) {
      try {
        // Load frame image to get natural dimensions
        const frameUrl = frameImageUrl(selectedFrame.frameImage)
        const frameImg = new Image()
        frameImg.crossOrigin = 'anonymous'
        await new Promise((res, rej) => { frameImg.onload = res; frameImg.onerror = rej; frameImg.src = processedFrameUrl || frameImageUrl(selectedFrame.frameImage) })

        const W = frameImg.naturalWidth
        const H = frameImg.naturalHeight
        const slotH = Math.floor(H / capturedPhotos.length)

        const canvas = document.createElement('canvas')
        canvas.width = W
        canvas.height = H
        const ctx = canvas.getContext('2d')

        // 1. Draw photos first (each fills equal vertical slot)
        for (let i = 0; i < capturedPhotos.length; i++) {
          const photoImg = new Image()
          photoImg.crossOrigin = 'anonymous'
          await new Promise((res, rej) => { photoImg.onload = res; photoImg.onerror = rej; photoImg.src = capturedPhotos[i] })

          const slot = selectedFrame?.photoSlots?.[i];
          // Use exact slot dimensions without expansion to prevent overlapping
          const sX = slot ? (slot.x / 100 * W) : 0;
          const sY = slot ? (slot.y / 100 * H) : slotH * i;
          const sW = slot ? (slot.width / 100 * W) : W;
          const sH = slot ? (slot.height / 100 * H) : slotH;

          // Get user's zoom/pan transform
          const t = getTransform(i);

          // Calculate scale to cover the slot (like CSS object-fit: cover)
          const scaleX = sW / photoImg.naturalWidth
          const scaleY = sH / photoImg.naturalHeight
          const coverScale = Math.max(scaleX, scaleY)
          
          // Apply user's scale on top of cover scale
          const finalScale = coverScale * t.scale
          const drawW = photoImg.naturalWidth * finalScale
          const drawH = photoImg.naturalHeight * finalScale
          
          // Center the photo in the slot, then apply user's offset
          const centerX = sX + sW / 2
          const centerY = sY + sH / 2
          const offsetX = centerX - drawW / 2 + t.x
          const offsetY = centerY - drawH / 2 + t.y

          ctx.save()
          
          // Apply filter if selected
          if (selectedFilter?.value) {
            ctx.filter = selectedFilter.value
          }
          
          if (slot?.rotation) {
             ctx.translate(sX + sW/2, sY + sH/2)
             ctx.rotate((slot.rotation * Math.PI) / 180)
             ctx.translate(-(sX + sW/2), -(sY + sH/2))
          }
          ctx.beginPath()
          ctx.rect(sX, sY, sW, sH)
          ctx.clip()
          ctx.drawImage(photoImg, offsetX, offsetY, drawW, drawH)
          ctx.restore()
        }

        // 2. Draw frame on top
        ctx.drawImage(frameImg, 0, 0, W, H)

        const link = document.createElement('a')
        link.download = `meomiry-${selectedStripType?.id}-strip-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      } catch (err) {
        console.error('Canvas download error:', err)
        alert(t.booth.final.alertDownloadError)
      }
      return
    }

    // Fallback: use html2canvas for gradient frames
    const stripElement = document.getElementById('final-photo-strip') || photoStripRef.current
    if (stripElement) {
      const canvas = await html2canvas(stripElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      })
      const link = document.createElement('a')
      link.download = `meomiry-${selectedStripType?.id}-strip-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }


  const downloadSinglePhoto = async (photoIndex) => {
    // Kept for compatibility if ever needed, but we now download the full strip
  }

  return (
    <div className="booth-page">
      <header className="booth-header">
        {currentStep === 1 ? (
          <Link to="/" className="back-button">
            <ArrowLeft size={18} /> Home
          </Link>
        ) : (
          <button onClick={goToPrevStep} className="back-button">
            <ArrowLeft size={18} /> Back
          </button>
        )}
        <h2 className="booth-logo">✨ FRAMEVERSE</h2>
        
        {/* Progress Steps - Updated to 4 steps */}
        <div className="progress-steps">
          {[t.booth.steps.setup, t.booth.steps.capture, t.booth.steps.decorate, t.booth.steps.done].map((step, index) => (
            <div 
              key={index} 
              className={`step ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}
              onClick={() => {
                if (index + 1 <= currentStep) {
                  setCurrentStep(index + 1)
                }
              }}
              style={{ cursor: index + 1 <= currentStep ? 'pointer' : 'default' }}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="booth-container">
        {/* STEP 1: Combined Setup (Strip Type + Frame + Filter) with Live Preview */}
        {currentStep === 1 && (
          <SetupStep
            stripTypes={stripTypes}
            frames={frames}
            filters={filters}
            selectedStripType={selectedStripType}
            selectedFrame={selectedFrame}
            selectedFilter={selectedFilter}
            onSelectStripType={selectStripType}
            onSelectFrame={selectFrame}
            onSelectFilter={selectFilter}
            onContinue={goToNextStep}
          />
        )}

        {/* STEP 2: Capture Photos (previously Step 4) */}
        {currentStep === 2 && selectedStripType && selectedFilter && (
          <CaptureStep
            stripType={selectedStripType}
            frame={selectedFrame}
            filter={selectedFilter}
            capturedPhotos={capturedPhotos}
            onPhotosChange={setCapturedPhotos}
            onContinue={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {/* STEP 3: Add Stickers (previously Step 5) */}
        {currentStep === 3 && selectedStripType && selectedFrame && selectedFilter && capturedPhotos.length > 0 && (
          <div className="step-content">
            <div className="step-header-with-filter">
              <div>
                <h2 className="step-title">Add Cute Stickers</h2>
                <p className="step-subtitle">Click stickers to add them to your photos</p>
              </div>
              
              <div className="step-options-selectors">
                {/* Frame selector button */}
                <div className="current-filter-display">
                  <button 
                    className="filter-change-btn"
                    onClick={() => {
                      setShowFramePicker(!showFramePicker)
                      setShowFilterPicker(false)
                    }}
                  >
                    <span className="filter-emoji" style={{ fontSize: '18px' }}>
                      {selectedFrame?.frameImage ? (
                        <img 
                          src={frameImageUrl(selectedFrame.frameImage)} 
                          alt={selectedFrame.name}
                          style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                        />
                      ) : (
                        selectedFrame?.emoji || '🖼️'
                      )}
                    </span>
                    <span className="filter-name">{selectedFrame?.name || 'Frame'}</span>
                    <span className="dropdown-icon">{showFramePicker ? '▲' : '▼'}</span>
                  </button>
                  
                  {/* Frame picker dropdown */}
                  {showFramePicker && (
                    <div className="filter-picker-dropdown">
                      <h4>Choose Frame</h4>
                      <div className="mini-filters-grid">
                        {frames.map(frame => (
                          <button
                            key={frame.id}
                            className={`mini-filter-card ${selectedFrame?.id === frame.id ? 'selected' : ''}`}
                            onClick={() => {
                              selectFrame(frame)
                              setShowFramePicker(false)
                            }}
                            style={{ background: frame.bgGradient }}
                          >
                            {frame.frameImage ? (
                              <img 
                                src={frameImageUrl(frame.frameImage)} 
                                alt={frame.name}
                                className="mini-filter-icon"
                                style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                              />
                            ) : (
                              <span className="mini-filter-icon" style={{ fontSize: '24px' }}>{frame.emoji}</span>
                            )}
                            <span className="mini-filter-name">{frame.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Filter selector button */}
                <div className="current-filter-display">
                  <button 
                    className="filter-change-btn"
                    onClick={() => {
                      setShowFilterPicker(!showFilterPicker)
                      setShowFramePicker(false)
                    }}
                  >
                    <Sparkles size={18} className="filter-icon-small" />
                    <span className="filter-name">{selectedFilter.name}</span>
                    <span className="dropdown-icon">{showFilterPicker ? '▲' : '▼'}</span>
                  </button>
                  
                  {/* Filter picker dropdown */}
                  {showFilterPicker && (
                    <div className="filter-picker-dropdown">
                      <h4>Choose Filter</h4>
                      <div className="mini-filters-grid">
                        {filters.map(filter => {
                          const IconComponent = filter.icon
                          return (
                            <button
                              key={filter.id}
                              className={`mini-filter-card ${selectedFilter.id === filter.id ? 'selected' : ''}`}
                              onClick={() => {
                                selectFilter(filter)
                                setShowFilterPicker(false)
                              }}
                              style={{ backgroundColor: filter.color }}
                            >
                              <IconComponent size={28} className="mini-filter-icon" />
                              <span className="mini-filter-name">{filter.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticker-editor">
              <div 
                className="photo-strip-card"
                id="photo-container-edit"
                style={{
                  background: selectedFrame?.frameImage ? '#000' : (selectedFrame?.bgGradient || '#ffffff'),
                  borderRadius: selectedFrame?.frameImage ? '0' : '20px',
                  padding: selectedFrame?.frameImage ? '0' : '20px',
                  margin: '0 auto 20px',
                  width: selectedFrame?.frameImage ? '100%' : (selectedStripType?.count <= 2 ? '360px' : '100%'),
                  maxWidth: selectedFrame?.frameImage ? '600px' : '500px',
                  height: 'auto',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {selectedFrame?.frameImage ? (
                  // === IMAGE FRAME MODE ===
                  // Photos render BELOW frame in DOM. Frame uses mix-blend-mode:screen.
                  // Wrapper gets height from frame img (position:relative).
                  // Photos layer is absolute inset:0, but needs wrapper to have explicit height.
                  // Solution: use a wrapping div with position:relative, height driven by frame img clone.
                  <div style={{ position: 'relative', width: '100%' }}>
                    {/* Invisible spacer to give wrapper definite height = frame natural height */}
                    <img
                      src={frameImageUrl(selectedFrame.frameImage)}
                      alt=""
                      style={{ display: 'block', width: '100%', height: 'auto', visibility: 'hidden', pointerEvents: 'none' }}
                    />
                    {/* Photos layer — absolutely fills the wrapper */}
                    <div
                      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
                      onMouseMove={handleSlotMouseMove}
                      onMouseUp={handleSlotMouseUp}
                      onMouseLeave={handleSlotMouseUp}
                      onTouchMove={handleSlotMouseMove}
                      onTouchEnd={handleSlotMouseUp}
                    >
                      {capturedPhotos.map((photo, index) => {
                        const slot = selectedFrame?.photoSlots?.[index];
                        const sY = slot ? slot.y : (100 / capturedPhotos.length) * index;
                        const sH = slot ? slot.height : (100 / capturedPhotos.length);
                        const sX = slot ? slot.x : 0;
                        const sW = slot ? slot.width : 100;
                        const t = getTransform(index);
                        const isActive = activePhotoEdit === index;
                        return (
                        <div
                          key={index}
                          onMouseDown={(e) => handleSlotMouseDown(e, index)}
                          onTouchStart={(e) => handleSlotMouseDown(e, index)}
                          style={{
                            position: 'absolute',
                            top: `${sY}%`,
                            left: `${sX}%`,
                            width: `${sW}%`,
                            height: `${sH}%`,
                            overflow: 'hidden',
                            isolation: 'isolate',
                            cursor: isActive ? 'grabbing' : 'grab',
                            outline: isActive ? '2px solid #FF6B9D' : 'none',
                            outlineOffset: '2px',
                            touchAction: 'none'
                          }}
                        >
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            draggable={false}
                            style={{
                              filter: selectedFilter?.value,
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              width: `${100 * t.scale}%`,
                              height: `${100 * t.scale}%`,
                              objectFit: 'cover',
                              objectPosition: 'center',
                              display: 'block',
                              transform: `translate(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px))`,
                              userSelect: 'none'
                            }}
                          />
                        </div>
                        );
                      })}
                    </div>
                    {/* Frame overlay on top */}
                    <img
                      src={processedFrameUrl || frameImageUrl(selectedFrame.frameImage)}
                      alt="Frame overlay"
                      style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none'
                      }}
                    />
                    {/* Debug slot overlay */}
                    {debugSlots && selectedFrame?.photoSlots?.map((slot, i) => (
                      <div key={i} style={{
                        position: 'absolute',
                        top: `${slot.y}%`,
                        left: `${slot.x}%`,
                        width: `${slot.width}%`,
                        height: `${slot.height}%`,
                        background: `hsla(${i * 90}, 100%, 50%, 0.4)`,
                        border: '2px solid white',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        pointerEvents: 'none'
                      }}>
                        #{i + 1}
                      </div>
                    ))}
                  </div>
                ) : (
                  // === GRADIENT FRAME MODE: normal strip with header/footer ===
                  <>
                    {!selectedFrame?.bgGradient?.includes('url(') && (
                      <div className="strip-header-final" style={{ background: 'transparent', boxShadow: 'none', padding: '10px 0 20px' }}>
                        <h3 style={{ color: selectedFrame ? 'rgba(0,0,0,0.75)' : '#FF6B9D' }}>
                          {selectedFrame?.emoji} FRAMEVERSE {selectedFrame?.emoji}
                        </h3>
                      </div>
                    )}
                    
                    <div className={`final-photos final-photos-${selectedStripType?.count}`} style={{ marginBottom: '25px', gap: '20px' }}>
                      {capturedPhotos.map((photo, index) => (
                        <div key={index} className="final-photo" style={{ 
                          border: `4px solid ${selectedFrame ? 'white' : 'transparent'}`, 
                          borderRadius: '12px', 
                          background: 'white',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                        }}>
                          <img src={photo} alt={`Photo ${index + 1}`} style={{ filter: selectedFilter?.value, display: 'block', width: '100%', height: 'auto', objectFit: 'contain' }} className="photo-base" />
                        </div>
                      ))}
                    </div>
                    
                    {!selectedFrame?.bgGradient?.includes('url(') && (
                      <div className="strip-footer-final" style={{ background: 'transparent', boxShadow: 'none', padding: '20px 0 10px', color: selectedFrame ? 'rgba(0,0,0,0.6)' : '#666' }}>
                        <p style={{ fontWeight: 600 }}>{new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}</p>
                      </div>
                    )}
                  </>
                )}

                {/* Zoom & pan controls — FIXED floating panel at bottom */}
                {selectedFrame?.frameImage && activePhotoEdit !== null && (() => {
                  const t = getTransform(activePhotoEdit)
                  return (
                    <div style={{
                      position: 'fixed',
                      bottom: '80px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(20,20,20,0.92)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '14px',
                      padding: '12px 18px',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      zIndex: 9999,
                      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                      minWidth: '320px',
                      maxWidth: '90vw'
                    }}>
                      <span style={{ fontSize: '13px', whiteSpace: 'nowrap', opacity: 0.8 }}>📸 #{activePhotoEdit + 1}</span>
                      <span style={{ fontSize: '12px', whiteSpace: 'nowrap', opacity: 0.7 }}>🔍 {Math.round(t.scale * 100)}%</span>
                      <input
                        type="range"
                        min="50" max="300" step="5"
                        value={Math.round(t.scale * 100)}
                        onChange={e => updateTransform(activePhotoEdit, { scale: parseInt(e.target.value) / 100 })}
                        style={{ flex: 1, accentColor: '#FF6B9D', height: '4px' }}
                      />
                      <button
                        onClick={() => updateTransform(activePhotoEdit, { scale: 1, x: 0, y: 0 })}
                        style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: '#444', color: 'white', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}
                      >↺</button>
                      <button
                        onClick={() => setActivePhotoEdit(null)}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '0 4px' }}
                      >✕</button>
                    </div>
                  )
                })()}

                {/* Stickers Layer - TOP MOST (z-index 10) */}
                <div className="stickers-on-photo" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 10 }}>
                  {selectedStickers.map((sticker) => {
                    const isTextBubble = sticker.item.type === 'text'
                    const isCustomText = sticker.item.type === 'customText'
                    return (
                      <span
                        key={sticker.id}
                        className={`sticker-on-photo ${isTextBubble || isCustomText ? 'text-bubble-on-photo' : 'emoji-on-photo'} ${draggingSticker === sticker.id ? 'dragging' : ''}`}
                        style={{
                          left: `${sticker.x}%`,
                          top: `${sticker.y}%`,
                          position: 'absolute',
                          pointerEvents: 'auto',
                          ...(isCustomText && {
                            background: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                          })
                        }}
                        draggable
                        onDragStart={(e) => handleStickerDragStart(e, sticker.id)}
                        onDrag={(e) => {
                          const container = document.getElementById(`photo-container-edit`)
                          if (container) {
                            handleStickerDrag(e, sticker.id, container.getBoundingClientRect())
                          }
                        }}
                        onDragEnd={() => handleStickerDragEnd()}
                        onDoubleClick={() => removeSticker(sticker.id)}
                        title="Drag to move, double-click to remove"
                      >
                        {renderStickerContent(sticker.item, 48)}
                      </span>
                    )
                  })}
                </div>
              </div>
              
              {selectedStickers.length > 0 && (
                <p className="sticker-hint">💡 Drag stickers to move, double-click to remove</p>
              )}


              {/* Sticker Picker */}
              <div className="sticker-picker">
                <h3 className="picker-title">Choose Stickers</h3>
                <div className="sticker-categories">
                  {Object.keys(stickerCategories).map(category => {
                    const IconComponent = categoryIcons[category]
                    return (
                      <button
                        key={category}
                        className={`category-btn ${stickerCategory === category ? 'active' : ''}`}
                        onClick={() => setStickerCategory(category)}
                      >
                        <IconComponent size={18} />
                        {' '}
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    )
                  })}
                </div>

                {/* Custom Text Input - Show when text category is selected */}
                {stickerCategory === 'text' && (
                  <div className="custom-text-panel">
                    <h4 className="custom-text-title">TEXT</h4>
                    <input
                      type="text"
                      className="custom-text-input"
                      placeholder="Type your text..."
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      maxLength={50}
                    />
                    
                    <div className="text-controls">
                      <div className="text-control-group">
                        <select 
                          className="font-select"
                          value={customTextFont}
                          onChange={(e) => setCustomTextFont(e.target.value)}
                        >
                          <option value="Quicksand">Quicksand</option>
                          <option value="Arial">Arial</option>
                          <option value="Comic Sans MS">Comic Sans</option>
                          <option value="Courier New">Courier</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Impact">Impact</option>
                          <option value="Times New Roman">Times</option>
                          <option value="Verdana">Verdana</option>
                        </select>
                        
                        <input 
                          type="number"
                          className="size-input"
                          min="12"
                          max="72"
                          value={customTextSize}
                          onChange={(e) => setCustomTextSize(e.target.value)}
                        />
                      </div>
                      
                      <div className="color-picker-row">
                        {[
                          { name: 'Black', value: '#000000' },
                          { name: 'White', value: '#FFFFFF' },
                          { name: 'Pink', value: '#FF1493' },
                          { name: 'Purple', value: '#9333EA' },
                          { name: 'Blue', value: '#3B82F6' },
                          { name: 'Orange', value: '#F97316' },
                          { name: 'Green', value: '#22C55E' },
                          { name: 'Red', value: '#EF4444' }
                        ].map(color => (
                          <button
                            key={color.value}
                            className={`color-btn ${customTextColor === color.value ? 'selected' : ''}`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setCustomTextColor(color.value)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <button 
                      className="add-text-btn"
                      onClick={addCustomText}
                      disabled={!customText.trim()}
                    >
                      + Add Text
                    </button>
                  </div>
                )}

                <div className="stickers-grid">
                  {stickerCategories[stickerCategory].map((stickerItem, index) => {
                    const isTextBubble = stickerItem.type === 'text'
                    return (
                      <button
                        key={index}
                        className={`sticker-btn ${isTextBubble ? 'text-bubble' : ''}`}
                        onClick={() => addSticker(stickerItem)}
                        title="Click to add"
                      >
                        {renderStickerContent(stickerItem, 32)}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="step-buttons">
              <button className="back-button-step" onClick={goToPrevStep}>
                <ArrowLeft size={18} /> Back
              </button>
              <button className="next-button create-btn" onClick={goToNextStep}>
                Create Strip <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Done - Download (previously Step 6) */}
        {currentStep === 4 && selectedStripType && selectedFilter && (
          <div className="step-content">
            <h2 className="step-title">Your Photo Strip</h2>
            <p className="step-subtitle">Looking amazing! Save your creation</p>

            <div className="final-result" ref={photoStripRef} id="final-photo-strip">
              <div 
                className="photo-strip-card"
                style={{
                  background: selectedFrame?.frameImage ? '#000' : (selectedFrame?.bgGradient || '#ffffff'),
                  borderRadius: selectedFrame?.frameImage ? '0' : '20px',
                  padding: selectedFrame?.frameImage ? '0' : '20px',
                  margin: '0 auto',
                  width: selectedFrame?.frameImage ? '100%' : (selectedStripType?.count <= 2 ? '360px' : '100%'),
                  maxWidth: selectedFrame?.frameImage ? '600px' : '500px',
                  height: 'auto',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {selectedFrame?.frameImage ? (
                  // === IMAGE FRAME MODE ===
                  <div style={{ position: 'relative', width: '100%' }}>
                    {/* Invisible spacer to give wrapper definite height */}
                    <img
                      src={frameImageUrl(selectedFrame.frameImage)}
                      alt=""
                      style={{ display: 'block', width: '100%', height: 'auto', visibility: 'hidden', pointerEvents: 'none' }}
                    />
                    {/* Photos layer */}
                    {/* Photos layer — absolutely fills the wrapper */}
                    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                      {capturedPhotos.map((photo, index) => {
                        const slot = selectedFrame?.photoSlots?.[index];
                        const sY = slot ? slot.y : (100 / capturedPhotos.length) * index;
                        const sH = slot ? slot.height : (100 / capturedPhotos.length);
                        const sX = slot ? slot.x : 0;
                        const sW = slot ? slot.width : 100;
                        const t = getTransform(index);
                        return (
                        <div
                          key={index}
                          style={{
                            position: 'absolute',
                            top: `${sY}%`,
                            left: `${sX}%`,
                            width: `${sW}%`,
                            height: `${sH}%`,
                            overflow: 'hidden',
                            isolation: 'isolate'
                          }}
                        >
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            style={{
                              filter: selectedFilter.value,
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              width: `${100 * t.scale}%`,
                              height: `${100 * t.scale}%`,
                              objectFit: 'contain', // Fit inside without cropping
                              objectPosition: 'center',
                              display: 'block',
                              transform: `translate(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px))`
                            }}
                          />
                        </div>
                        );
                      })}
                    </div>
                    {/* Frame overlay on top */}
                    <img
                      src={processedFrameUrl || frameImageUrl(selectedFrame.frameImage)}
                      alt="Frame overlay"
                      style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                ) : (
                  // GRADIENT FRAME MODE
                  <>
                    {!selectedFrame?.bgGradient?.includes('url(') && (
                      <div className="strip-header-final" style={{ background: 'transparent', boxShadow: 'none', padding: '10px 0 20px' }}>
                        <h3 style={{ color: selectedFrame ? 'rgba(0,0,0,0.75)' : '#FF6B9D' }}>
                          {selectedFrame?.emoji} FRAMEVERSE {selectedFrame?.emoji}
                        </h3>
                      </div>
                    )}
                    <div className={`final-photos final-photos-${selectedStripType.count}`} style={{ marginBottom: '25px', gap: '20px' }}>
                      {capturedPhotos.map((photo, index) => (
                        <div key={index} className="final-photo" style={{ 
                          border: `4px solid ${selectedFrame ? 'white' : 'transparent'}`, 
                          borderRadius: '12px', 
                          background: 'white',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                        }}>
                          <img src={photo} alt={`Photo ${index + 1}`} style={{ filter: selectedFilter.value, display: 'block', width: '100%', objectFit: 'contain' }} />
                        </div>
                      ))}
                    </div>
                    {!selectedFrame?.bgGradient?.includes('url(') && (
                      <div className="strip-footer-final" style={{ background: 'transparent', boxShadow: 'none', padding: '20px 0 10px', color: selectedFrame ? 'rgba(0,0,0,0.6)' : '#666' }}>
                        <p style={{ fontWeight: 600 }}>{new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}</p>
                      </div>
                    )}
                  </>
                )}
                

                {/* Stickers overlay - TOP MOST (z-index 10) */}

                <div className="stickers-on-photo" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 10 }}>
                  {selectedStickers.map((sticker) => {
                    const isTextBubble = sticker.item.type === 'text'
                    const isCustomText = sticker.item.type === 'customText'
                    return (
                      <div 
                        key={sticker.id}
                        className={`final-sticker ${isTextBubble || isCustomText ? 'final-text-bubble' : 'final-emoji'}`}
                        style={{
                          position: 'absolute',
                          left: `${sticker.x}%`,
                          top: `${sticker.y}%`,
                          ...(isCustomText && {
                            background: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                          })
                        }}
                      >
                        {renderStickerContent(sticker.item, 48)}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="step-buttons">
              <button className="control-btn start-over-btn" onClick={startOver}>
                <RotateCcw size={20} /> Tạo Lại
              </button>
              <button className="control-btn download-btn-final" onClick={downloadAllPhotos}>
                <Download size={20} /> Tải Xuống
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BoothPage
