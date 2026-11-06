import * as THREE from 'three';

/**
 * Creates a procedural Earth Albedo map with continents, oceans, and atmosphere gradient.
 */
export function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Ocean gradient background
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#051E3E');
  oceanGrad.addColorStop(0.5, '#0B3C5D');
  oceanGrad.addColorStop(1, '#051D3B');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw procedural landmasses
  ctx.fillStyle = '#1E4D2B'; // Deep land green
  ctx.strokeStyle = '#2E6F40';
  ctx.lineWidth = 2;

  // Simple pseudo-continent clusters
  const continents = [
    // North America
    { x: 220, y: 150, r: 80 },
    { x: 180, y: 120, r: 60 },
    { x: 280, y: 180, r: 50 },
    // South America
    { x: 320, y: 320, r: 70 },
    { x: 340, y: 370, r: 55 },
    // Eurasia / Europe / Asia
    { x: 600, y: 140, r: 110 },
    { x: 750, y: 160, r: 100 },
    { x: 540, y: 120, r: 65 },
    // Africa
    { x: 550, y: 280, r: 85 },
    { x: 570, y: 340, r: 60 },
    // Australia
    { x: 820, y: 360, r: 55 }
  ];

  continents.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner terrain details
    ctx.fillStyle = '#3A602B';
    ctx.beginPath();
    ctx.arc(c.x + 10, c.y - 10, c.r * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Mountainous desert highlights
    ctx.fillStyle = '#7C6E4E';
    ctx.beginPath();
    ctx.arc(c.x - 15, c.y + 15, c.r * 0.35, 0, Math.PI * 2);
    ctx.fill();
  });

  // Polar ice caps
  ctx.fillStyle = '#E6F0FA';
  // North Pole
  ctx.fillRect(0, 0, canvas.width, 35);
  // South Pole
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates a procedural Earth Cloud texture with soft wispy cloud bands.
 */
export function createEarthCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';

  for (let i = 0; i < 90; i++) {
    const x = Math.random() * canvas.width;
    const y = 80 + Math.random() * (canvas.height - 160);
    const rx = 40 + Math.random() * 120;
    const ry = 8 + Math.random() * 24;

    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * 0.2 - 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates a gold foil texture for satellite solar thermal insulation.
 */
export function createGoldFoilTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#D4AF37'; // Gold
  ctx.fillRect(0, 0, 256, 256);

  // Micro foil grid pattern
  ctx.strokeStyle = '#996515';
  ctx.lineWidth = 1;
  const step = 8;
  for (let i = 0; i < 256; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates solar panel grid texture for satellite arrays.
 */
export function createSolarPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep metallic blue silicon
  ctx.fillStyle = '#0A1128';
  ctx.fillRect(0, 0, 256, 512);

  // Solar cells grid
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;

  const cols = 4;
  const rows = 8;
  const w = 256 / cols;
  const h = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.strokeRect(c * w + 2, r * h + 2, w - 4, h - 4);
      // Subtle reflections
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(c * w + 4, r * h + 4, w - 8, h - 8);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates soft radial glow texture for rocket thrusters & stars.
 */
export function createParticleGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.3, 'rgba(112, 199, 255, 0.8)');
  grad.addColorStop(0.7, 'rgba(255, 120, 30, 0.3)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
