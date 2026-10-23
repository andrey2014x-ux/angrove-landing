import fs from 'fs';

// Helper to create a multi-point organic deformed blob
function makeOrganicBlob(cx, cy, rx, ry, numPoints = 8, irregularity = 0.35, angleOffset = 0) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = angleOffset + (i / numPoints) * Math.PI * 2;
    // pseudo-random seed based on cx, cy, i
    const rand = Math.sin(cx * 12.9898 + cy * 78.233 + i * 45.123) * 43758.5453;
    const factor = 1 - irregularity + (Math.abs(rand % 1)) * (irregularity * 2);
    const px = cx + Math.cos(angle) * rx * factor;
    const py = cy + Math.sin(angle) * ry * factor;
    points.push([px, py]);
  }
  
  // Build smooth closed SVG curve
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length; i++) {
    const p0 = points[i];
    const p1 = points[(i + 1) % points.length];
    const p2 = points[(i + 2) % points.length];
    const cp1x = (p0[0] + p1[0]) / 2;
    const cp1y = (p0[1] + p1[1]) / 2;
    const cp2x = (p1[0] + p2[0]) / 2;
    const cp2y = (p1[1] + p2[1]) / 2;
    d += ` Q ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}`;
  }
  d += ' Z';
  return d;
}

// Helper to create an authentic broken leopard rosette:
// 1. Slightly darker saturated inner patch
// 2. 2 to 4 surrounding irregular claw/crescent dark spots hugging the perimeter
function makeRosette(cx, cy, radius, rotation = 0) {
  let svg = '';
  // Saturated inner patch
  const innerBlob = makeOrganicBlob(cx, cy, radius * 0.75, radius * 0.65, 7, 0.25, rotation);
  svg += `  <path d="${innerBlob}" fill="#1D36C4" />\n`;

  // Number of surrounding claw petals (2, 3, or 4)
  const seed = Math.abs(Math.sin(cx * 71.3 + cy * 19.7)) * 10;
  const numPetals = seed > 6.5 ? 4 : seed > 2.5 ? 3 : 2;

  const step = (Math.PI * 2) / numPetals;
  for (let p = 0; p < numPetals; p++) {
    // Skip a random small sector to make it broken/open (natural rosette)
    const arcAngle = step * 0.65;
    const centerAngle = rotation + p * step;
    
    // Create an irregular curved crescent/claw
    const dist = radius * 0.78;
    const clawX = cx + Math.cos(centerAngle) * dist;
    const clawY = cy + Math.sin(centerAngle) * dist;
    const clawRx = radius * 0.42;
    const clawRy = radius * 0.26;

    const claw = makeOrganicBlob(clawX, clawY, clawRx, clawRy, 6, 0.38, centerAngle + Math.PI / 2);
    svg += `  <path d="${claw}" fill="#080C22" />\n`;
  }

  // Small internal speckle in some rosettes
  if (seed > 5) {
    const speckleX = cx + Math.cos(rotation + 1) * radius * 0.2;
    const speckleY = cy + Math.sin(rotation + 1) * radius * 0.2;
    const speckle = makeOrganicBlob(speckleX, speckleY, radius * 0.14, radius * 0.12, 5, 0.3);
    svg += `  <path d="${speckle}" fill="#080C22" />\n`;
  }

  return svg;
}

// Generate tileable 360x360 SVG
const W = 360;
const H = 360;

// Rosette centers
const rosettes = [
  { x: 45, y: 50, r: 26, rot: 0.3 },
  { x: 180, y: 40, r: 24, rot: 1.8 },
  { x: 300, y: 65, r: 28, rot: 2.5 },
  
  { x: 105, y: 140, r: 25, rot: 3.2 },
  { x: 235, y: 130, r: 27, rot: 0.9 },
  
  { x: 40, y: 240, r: 26, rot: 2.1 },
  { x: 165, y: 235, r: 28, rot: 4.0 },
  { x: 310, y: 220, r: 25, rot: 1.2 },

  { x: 100, y: 325, r: 27, rot: 0.5 },
  { x: 250, y: 320, r: 26, rot: 3.6 },
];

// Single organic solid spots between rosettes
const singleSpots = [
  { x: 115, y: 45, rx: 9, ry: 6, rot: 0.8 },
  { x: 250, y: 40, rx: 8, ry: 7, rot: 1.5 },
  { x: 350, y: 140, rx: 11, ry: 7, rot: 2.2 },
  { x: 10, y: 150, rx: 10, ry: 6, rot: 0.4 },
  { x: 175, y: 140, rx: 12, ry: 8, rot: 1.1 },
  { x: 30, y: 330, rx: 10, ry: 6, rot: 2.8 },
  { x: 180, y: 315, rx: 9, ry: 6, rot: 0.7 },
  { x: 340, y: 330, rx: 11, ry: 7, rot: 1.4 },
  { x: 90, y: 225, rx: 7, ry: 5, rot: 0.5 },
  { x: 235, y: 235, rx: 10, ry: 6, rot: 2.4 },
  { x: 280, y: 140, rx: 7, ry: 5, rot: 0.9 },
  // Tiny specks
  { x: 60, y: 110, rx: 4, ry: 3, rot: 0.3 },
  { x: 145, y: 95, rx: 4.5, ry: 3.5, rot: 1.1 },
  { x: 215, y: 85, rx: 5, ry: 3, rot: 2.2 },
  { x: 270, y: 90, rx: 4, ry: 4, rot: 0 },
  { x: 135, y: 185, rx: 4.5, ry: 3, rot: 0.7 },
  { x: 200, y: 180, rx: 5, ry: 3.5, rot: 1.6 },
  { x: 75, y: 280, rx: 4, ry: 3, rot: 2.5 },
  { x: 130, y: 275, rx: 5, ry: 3.5, rot: 0.2 },
  { x: 205, y: 280, rx: 4.5, ry: 3, rot: 1.8 },
  { x: 285, y: 270, rx: 5, ry: 3.5, rot: 3.0 },
  { x: 355, y: 245, rx: 4, ry: 3, rot: 0.5 },
  { x: 15, y: 55, rx: 4, ry: 3, rot: 1.2 },
];

let svgContent = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Organic base gradient for tactile fur feel -->
    <linearGradient id="leopardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3D5CFF"/>
      <stop offset="50%" stop-color="#3553F5"/>
      <stop offset="100%" stop-color="#2E4BF0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#leopardBg)"/>

  <!-- Rosettes -->
`;

rosettes.forEach(r => {
  svgContent += makeRosette(r.x, r.y, r.r, r.rot);
});

svgContent += `\n  <!-- Solid spots & specks -->\n`;
singleSpots.forEach(s => {
  const blob = makeOrganicBlob(s.x, s.y, s.rx, s.ry, 6, 0.35, s.rot);
  svgContent += `  <path d="${blob}" fill="#080C22" />\n`;
});

svgContent += `</svg>\n`;

fs.writeFileSync('public/leopard-pattern.svg', svgContent);
console.log('Successfully generated authentic organic leopard-pattern.svg!');
