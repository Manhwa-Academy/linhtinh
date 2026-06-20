/**
 * Generate Team Korea frame as SVG, then we can convert to PNG
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Korean flag colors
const COLORS = {
  blue: '#0047A0',
  red: '#CD2E3A',
  white: '#FFFFFF',
  black: '#000000',
  gold: '#FFD700',
  darkBlue: '#003478'
};

const PLAYERS = [
  { name: 'GYUMIN', emoji: '🦝', color: '#0047A0', y: 250 },
  { name: 'SEONGJANG', emoji: '🔥', color: '#CD2E3A', y: 730 },
  { name: 'HEAVEN', emoji: '😇', color: '#FFFFFF', y: 1210 },
  { name: 'HEATHER', emoji: '⭐', color: '#FFD700', y: 1690 }
];

function generateSVG() {
  const width = 1080;
  const height = 2160;
  const slotWidth = 900;
  const slotHeight = 450;
  const startX = (width - slotWidth) / 2;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#F0F4FF;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#FFFFFF;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#FFF0F0;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${COLORS.blue};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${COLORS.red};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${COLORS.blue};stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${COLORS.red};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${COLORS.darkBlue};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${COLORS.red};stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  
  <!-- Blue border -->
  <rect x="10" y="10" width="${width - 20}" height="${height - 20}" 
        fill="none" stroke="${COLORS.blue}" stroke-width="20"/>
  
  <!-- Red border -->
  <rect x="30" y="30" width="${width - 60}" height="${height - 60}" 
        fill="none" stroke="${COLORS.red}" stroke-width="10"/>
`;

  // Korean patterns (simplified)
  for (let i = 0; i < 20; i++) {
    const x = 50 + Math.random() * (width - 100);
    const y = 200 + Math.random() * (height - 400);
    const size = 30 + Math.random() * 40;
    svg += `  <g opacity="0.15">
    <line x1="${x - size/2}" y1="${y - size/3}" x2="${x + size/2}" y2="${y - size/3}" stroke="${COLORS.white}" stroke-width="2"/>
    <line x1="${x - size/2}" y1="${y}" x2="${x + size/2}" y2="${y}" stroke="${COLORS.white}" stroke-width="2"/>
    <line x1="${x - size/2}" y1="${y + size/3}" x2="${x + size/2}" y2="${y + size/3}" stroke="${COLORS.white}" stroke-width="2"/>
  </g>\n`;
  }

  // Header
  svg += `  <!-- Header -->
  <rect width="${width}" height="180" fill="url(#headerGrad)"/>
  
  <!-- Title -->
  <text x="${width/2}" y="110" font-family="Arial Black, Arial" font-size="90" font-weight="bold" 
        text-anchor="middle" fill="${COLORS.white}" 
        stroke="${COLORS.black}" stroke-width="8">TEAM KOREA 🇰🇷</text>
`;

  // Photo slots
  PLAYERS.forEach((player, index) => {
    const y = player.y;
    
    svg += `  <!-- Slot ${index + 1}: ${player.name} -->
  <!-- Slot background -->
  <rect x="${startX}" y="${y}" width="${slotWidth}" height="${slotHeight}" 
        fill="#FFFFFF" fill-opacity="0.9"/>
  
  <!-- Slot border -->
  <rect x="${startX}" y="${y}" width="${slotWidth}" height="${slotHeight}" 
        fill="none" stroke="${player.color}" stroke-width="8"/>
  
  <!-- Inner glow -->
  <rect x="${startX - 8}" y="${y - 8}" width="${slotWidth + 16}" height="${slotHeight + 16}" 
        fill="none" stroke="${player.color}" stroke-width="16" opacity="0.3"/>
  
  <!-- Player name bar -->
  <rect x="${startX}" y="${y - 60}" width="${slotWidth}" height="60" fill="${player.color}"/>
  
  <!-- Player name text -->
  <text x="${startX + slotWidth/2}" y="${y - 20}" font-family="Arial" font-size="40" font-weight="bold" 
        text-anchor="middle" fill="${COLORS.white}">${player.emoji} ${player.name}</text>
  
  <!-- Corner decorations -->
  <rect x="${startX - 5}" y="${y - 5}" width="30" height="5" fill="${COLORS.gold}"/>
  <rect x="${startX - 5}" y="${y - 5}" width="5" height="30" fill="${COLORS.gold}"/>
  <rect x="${startX + slotWidth - 25}" y="${y - 5}" width="30" height="5" fill="${COLORS.gold}"/>
  <rect x="${startX + slotWidth}" y="${y - 5}" width="5" height="30" fill="${COLORS.gold}"/>
  <rect x="${startX - 5}" y="${y + slotHeight}" width="30" height="5" fill="${COLORS.gold}"/>
  <rect x="${startX - 5}" y="${y + slotHeight - 25}" width="5" height="30" fill="${COLORS.gold}"/>
  <rect x="${startX + slotWidth - 25}" y="${y + slotHeight}" width="30" height="5" fill="${COLORS.gold}"/>
  <rect x="${startX + slotWidth}" y="${y + slotHeight - 25}" width="5" height="30" fill="${COLORS.gold}"/>
  
  <!-- Slot number watermark -->
  <text x="${startX + slotWidth/2}" y="${y + slotHeight/2 + 40}" font-family="Arial" font-size="100" font-weight="bold" 
        text-anchor="middle" fill="${COLORS.black}" opacity="0.1">${index + 1}</text>
`;
  });

  // Stars decoration
  const stars = ['⭐', '✨', '💫'];
  for (let i = 0; i < 25; i++) {
    const x = 60 + Math.random() * (width - 120);
    const y = 200 + Math.random() * (height - 400);
    const star = stars[Math.floor(Math.random() * stars.length)];
    const size = 25 + Math.random() * 15;
    const opacity = 0.3 + Math.random() * 0.4;
    svg += `  <text x="${x}" y="${y}" font-size="${size}" opacity="${opacity}">${star}</text>\n`;
  }

  // Trophies in corners
  svg += `  <!-- Trophies -->
  <text x="100" y="150" font-size="60" opacity="0.6">🏆</text>
  <text x="${width - 100}" y="150" font-size="60" opacity="0.6">🏆</text>
  <text x="100" y="${height - 100}" font-size="60" opacity="0.6">🏆</text>
  <text x="${width - 100}" y="${height - 100}" font-size="60" opacity="0.6">🏆</text>
`;

  // Korean flags on sides
  const flagPositions = [300, 500, 700, 900, 1100, 1300, 1500, 1700, 1900];
  flagPositions.forEach(y => {
    if (Math.random() > 0.5) {
      svg += `  <text x="60" y="${y}" font-size="40">🇰🇷</text>\n`;
      svg += `  <text x="${width - 90}" y="${y}" font-size="40">🇰🇷</text>\n`;
    }
  });

  // Footer
  svg += `  <!-- Footer -->
  <rect y="${height - 200}" width="${width}" height="200" fill="url(#footerGrad)"/>
  
  <!-- Slogan -->
  <text x="${width/2}" y="${height - 120}" font-family="Arial Black" font-size="70" font-weight="bold" 
        text-anchor="middle" fill="${COLORS.gold}" 
        stroke="${COLORS.black}" stroke-width="6">RISE AGAIN</text>
  
  <!-- Event name -->
  <text x="${width/2}" y="${height - 50}" font-family="Arial" font-size="50" font-weight="bold" 
        text-anchor="middle" fill="${COLORS.white}">PNC 2026</text>

</svg>`;

  return svg;
}

// Generate and save
const svg = generateSVG();
const outputPath = path.join(__dirname, 'team-korea-frame.svg');
fs.writeFileSync(outputPath, svg, 'utf8');

console.log('✅ SVG generated!');
console.log('   File:', outputPath);
console.log('\n📝 Next steps:');
console.log('   1. Open team-korea-frame.svg in browser');
console.log('   2. Take screenshot or use online SVG→PNG converter');
console.log('   3. Upload PNG to AdminPage');
console.log('\n🔗 Online converters:');
console.log('   - https://cloudconvert.com/svg-to-png');
console.log('   - https://www.svgtopng.com/');
console.log('   - https://ezgif.com/svg-to-png');
