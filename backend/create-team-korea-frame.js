/**
 * Script to create Team Korea PNC 2026 frame programmatically
 * Run: node create-team-korea-frame.js
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Korean flag colors
const COLORS = {
  blue: '#0047A0',
  red: '#CD2E3A',
  white: '#FFFFFF',
  black: '#000000',
  gold: '#FFD700',
  darkBlue: '#003478'
};

// Players
const PLAYERS = [
  { name: 'GYUMIN', emoji: '🦝', color: '#0047A0' },
  { name: 'SEONGJANG', emoji: '🔥', color: '#CD2E3A' },
  { name: 'HEAVEN', emoji: '😇', color: '#FFFFFF' },
  { name: 'HEATHER', emoji: '⭐', color: '#FFD700' }
];

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function createGradient(ctx, x0, y0, x1, y1, colors) {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  colors.forEach((color, i) => {
    gradient.addColorStop(i / (colors.length - 1), color);
  });
  return gradient;
}

function drawKoreanPattern(ctx, x, y, size, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 3;

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-size / 2, -size / 2 + (i * size) / 3);
    ctx.lineTo(size / 2, -size / 2 + (i * size) / 3);
    ctx.stroke();
  }

  ctx.restore();
}

function createTeamKoreaFrame() {
  console.log('🎨 Creating Team Korea frame...');

  const canvas = createCanvas(1080, 2160);
  const ctx = canvas.getContext('2d');

  // === BACKGROUND ===
  const bgGradient = createGradient(
    ctx,
    0, 0, canvas.width, canvas.height,
    ['#FFFFFF', '#F0F4FF', '#FFFFFF', '#FFF0F0', '#FFFFFF']
  );
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Korean patterns
  for (let i = 0; i < 15; i++) {
    drawKoreanPattern(
      ctx,
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      40 + Math.random() * 60,
      Math.random() * 360
    );
  }

  // Borders
  ctx.strokeStyle = COLORS.blue;
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  ctx.strokeStyle = COLORS.red;
  ctx.lineWidth = 10;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  // === HEADER ===
  const headerGradient = createGradient(
    ctx,
    0, 0, canvas.width, 150,
    [COLORS.blue, COLORS.red, COLORS.blue]
  );
  ctx.fillStyle = headerGradient;
  ctx.fillRect(0, 0, canvas.width, 180);

  // Title
  ctx.font = 'bold 90px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Title stroke
  ctx.strokeStyle = COLORS.black;
  ctx.lineWidth = 8;
  ctx.strokeText('TEAM KOREA 🇰🇷', canvas.width / 2, 90);

  // Title fill
  ctx.fillStyle = COLORS.white;
  ctx.fillText('TEAM KOREA 🇰🇷', canvas.width / 2, 90);

  // === PHOTO SLOTS ===
  const slotHeight = 450;
  const slotWidth = 900;
  const startX = (canvas.width - slotWidth) / 2;
  const startY = 250;
  const spacing = 30;

  PLAYERS.forEach((player, index) => {
    const y = startY + index * (slotHeight + spacing);

    // Slot background
    const slotGradient = createGradient(
      ctx,
      startX, y, startX + slotWidth, y + slotHeight,
      ['rgba(255, 255, 255, 0.9)', 'rgba(200, 200, 200, 0.9)']
    );
    ctx.fillStyle = slotGradient;
    ctx.fillRect(startX, y, slotWidth, slotHeight);

    // Slot border
    ctx.strokeStyle = player.color;
    ctx.lineWidth = 8;
    ctx.strokeRect(startX, y, slotWidth, slotHeight);

    // Inner glow
    const rgb = hexToRgb(player.color);
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
    ctx.lineWidth = 16;
    ctx.strokeRect(startX - 8, y - 8, slotWidth + 16, slotHeight + 16);

    // Player name label
    ctx.fillStyle = player.color;
    ctx.fillRect(startX, y - 60, slotWidth, 60);

    // Player name text
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = COLORS.white;
    ctx.textAlign = 'center';
    ctx.fillText(`${player.emoji} ${player.name}`, startX + slotWidth / 2, y - 30);

    // Corner decorations
    const cornerSize = 30;
    ctx.fillStyle = COLORS.gold;

    // Top-left
    ctx.fillRect(startX - 5, y - 5, cornerSize, 5);
    ctx.fillRect(startX - 5, y - 5, 5, cornerSize);

    // Top-right
    ctx.fillRect(startX + slotWidth - cornerSize + 5, y - 5, cornerSize, 5);
    ctx.fillRect(startX + slotWidth, y - 5, 5, cornerSize);

    // Bottom-left
    ctx.fillRect(startX - 5, y + slotHeight, cornerSize, 5);
    ctx.fillRect(startX - 5, y + slotHeight - cornerSize + 5, 5, cornerSize);

    // Bottom-right
    ctx.fillRect(startX + slotWidth - cornerSize + 5, y + slotHeight, cornerSize, 5);
    ctx.fillRect(startX + slotWidth, y + slotHeight - cornerSize + 5, 5, cornerSize);

    // Slot number
    ctx.font = 'bold 100px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillText((index + 1).toString(), startX + slotWidth / 2, y + slotHeight / 2);
  });

  // === FOOTER ===
  const footerGradient = createGradient(
    ctx,
    0, canvas.height - 200, canvas.width, canvas.height,
    [COLORS.red, COLORS.darkBlue, COLORS.red]
  );
  ctx.fillStyle = footerGradient;
  ctx.fillRect(0, canvas.height - 200, canvas.width, 200);

  // Slogan
  ctx.font = 'bold 70px Arial';
  ctx.strokeStyle = COLORS.black;
  ctx.lineWidth = 6;
  ctx.strokeText('RISE AGAIN', canvas.width / 2, canvas.height - 130);
  ctx.fillStyle = COLORS.gold;
  ctx.fillText('RISE AGAIN', canvas.width / 2, canvas.height - 130);

  // Event name
  ctx.font = 'bold 50px Arial';
  ctx.fillStyle = COLORS.white;
  ctx.fillText('PNC 2026', canvas.width / 2, canvas.height - 60);

  // === DECORATIONS ===
  // Stars
  ctx.font = '30px Arial';
  for (let i = 0; i < 25; i++) {
    const x = 60 + Math.random() * (canvas.width - 120);
    const y = 200 + Math.random() * (canvas.height - 400);
    const stars = ['⭐', '✨', '💫'];
    ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + Math.random() * 0.4})`;
    ctx.fillText(stars[Math.floor(Math.random() * stars.length)], x, y);
  }

  // Trophies in corners
  ctx.font = '60px Arial';
  ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
  ctx.fillText('🏆', 100, 150);
  ctx.fillText('🏆', canvas.width - 100, 150);
  ctx.fillText('🏆', 100, canvas.height - 150);
  ctx.fillText('🏆', canvas.width - 100, canvas.height - 150);

  // Korean flags on sides
  ctx.font = '40px Arial';
  [300, 500, 700, 900, 1100, 1300, 1500, 1700, 1900].forEach((y) => {
    if (Math.random() > 0.5) {
      ctx.fillText('🇰🇷', 60, y);
      ctx.fillText('🇰🇷', canvas.width - 90, y);
    }
  });

  console.log('✅ Frame created successfully!');

  // Save to file
  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, 'uploads', 'frames', `team-korea-pnc2026-${Date.now()}.png`);

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, buffer);
  console.log('💾 Frame saved to:', outputPath);

  return {
    filePath: outputPath,
    fileName: path.basename(outputPath),
    photoSlots: [
      { x: 8.33, y: 11.57, width: 83.33, height: 20.83, rotation: 0 },
      { x: 8.33, y: 33.8, width: 83.33, height: 20.83, rotation: 0 },
      { x: 8.33, y: 56.02, width: 83.33, height: 20.83, rotation: 0 },
      { x: 8.33, y: 78.24, width: 83.33, height: 20.83, rotation: 0 }
    ]
  };
}

// Run if called directly
if (require.main === module) {
  try {
    const result = createTeamKoreaFrame();
    console.log('\n🎉 Done! Frame details:');
    console.log('   File:', result.fileName);
    console.log('   Photo slots:', result.photoSlots.length);
    console.log('\n📝 Next steps:');
    console.log('   1. Go to AdminPage');
    console.log('   2. Click "Thêm Frame Mới"');
    console.log('   3. Upload this file:', result.fileName);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { createTeamKoreaFrame };
