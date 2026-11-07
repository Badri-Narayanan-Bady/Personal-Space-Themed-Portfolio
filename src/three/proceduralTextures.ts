import * as THREE from 'three';

/**
 * Creates an ultra-detailed procedural Earth Albedo texture (2048x1024)
 * with realistic continental landmasses, mountain elevation, arid deserts,
 * coastal shelf shallows, and polar ice shelves.
 */
export function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep oceanic base gradient (polar to tropical oceanic hues)
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#020C1B');
  oceanGrad.addColorStop(0.2, '#041B3B');
  oceanGrad.addColorStop(0.5, '#072A54');
  oceanGrad.addColorStop(0.8, '#041B3B');
  oceanGrad.addColorStop(1, '#020C1B');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Continental shelf shallows (turquoise/cyan coastal fringes)
  const drawCoastalShelf = (x: number, y: number, rx: number, ry: number) => {
    ctx.save();
    ctx.fillStyle = 'rgba(20, 184, 166, 0.22)'; // Teal/cyan shallow waters
    ctx.beginPath();
    ctx.ellipse(x, y, rx * 1.14, ry * 1.14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Landmasses with realistic terrain biomes (tundra, forest, desert, savannah)
  interface LandRegion {
    x: number;
    y: number;
    rx: number;
    ry: number;
    biome: 'temperate' | 'jungle' | 'desert' | 'taiga';
  }

  const regions: LandRegion[] = [
    // North America
    { x: 420, y: 300, rx: 190, ry: 130, biome: 'temperate' },
    { x: 340, y: 220, rx: 140, ry: 90, biome: 'taiga' },
    { x: 500, y: 250, rx: 110, ry: 80, biome: 'temperate' },
    { x: 430, y: 400, rx: 70, ry: 80, biome: 'desert' }, // Southwest/Mexico
    { x: 460, y: 460, rx: 40, ry: 60, biome: 'jungle' }, // Central America

    // South America
    { x: 620, y: 620, rx: 150, ry: 190, biome: 'jungle' }, // Amazon
    { x: 650, y: 780, rx: 90, ry: 150, biome: 'temperate' }, // Argentina/Pampas
    { x: 550, y: 690, rx: 40, ry: 180, biome: 'desert' }, // Andes spine

    // Europe
    { x: 1040, y: 260, rx: 130, ry: 90, biome: 'temperate' },
    { x: 1120, y: 210, rx: 90, ry: 70, biome: 'taiga' }, // Scandinavia
    { x: 990, y: 310, rx: 70, ry: 50, biome: 'temperate' }, // Iberia/France

    // Africa
    { x: 1080, y: 450, rx: 190, ry: 120, biome: 'desert' }, // Sahara/Sahel
    { x: 1110, y: 600, rx: 160, ry: 130, biome: 'jungle' }, // Congo
    { x: 1150, y: 760, rx: 100, ry: 110, biome: 'temperate' }, // Southern Africa
    { x: 1290, y: 720, rx: 35, ry: 75, biome: 'jungle' }, // Madagascar

    // Asia
    { x: 1380, y: 240, rx: 320, ry: 140, biome: 'taiga' }, // Siberia
    { x: 1460, y: 360, rx: 250, ry: 120, biome: 'temperate' }, // East Asia
    { x: 1240, y: 390, rx: 130, ry: 80, biome: 'desert' }, // Middle East
    { x: 1380, y: 460, rx: 120, ry: 90, biome: 'jungle' }, // India
    { x: 1560, y: 490, rx: 100, ry: 75, biome: 'jungle' }, // Southeast Asia
    { x: 1680, y: 370, rx: 40, ry: 90, biome: 'temperate' }, // Japan arc

    // Australia & Oceania
    { x: 1680, y: 720, rx: 140, ry: 100, biome: 'desert' },
    { x: 1740, y: 760, rx: 60, ry: 70, biome: 'temperate' },
    { x: 1840, y: 830, rx: 30, ry: 50, biome: 'temperate' } // New Zealand
  ];

  // Draw coastal fringes first
  regions.forEach(r => drawCoastalShelf(r.x, r.y, r.rx, r.ry));

  // Biome palette
  const biomeColors = {
    temperate: { base: '#22543D', highlight: '#2F855A', accent: '#48BB78' },
    jungle: { base: '#1A4731', highlight: '#22543D', accent: '#276749' },
    desert: { base: '#975A16', highlight: '#B7791F', accent: '#D69E2E' },
    taiga: { base: '#1C3D32', highlight: '#234E3F', accent: '#2C5E4E' }
  };

  // Draw procedural continental textures with fractal noise simulation
  regions.forEach(r => {
    const pal = biomeColors[r.biome];

    // Base continental fill
    ctx.fillStyle = pal.base;
    ctx.beginPath();
    ctx.ellipse(r.x, r.y, r.rx, r.ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Secondary topological ridge
    ctx.fillStyle = pal.highlight;
    ctx.beginPath();
    ctx.ellipse(r.x + r.rx * 0.15, r.y - r.ry * 0.1, r.rx * 0.75, r.ry * 0.7, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Mountain ridges / desert dune chains
    ctx.fillStyle = pal.accent;
    ctx.beginPath();
    ctx.ellipse(r.x - r.rx * 0.1, r.y + r.ry * 0.12, r.rx * 0.45, r.ry * 0.4, -0.15, 0, Math.PI * 2);
    ctx.fill();
  });

  // Micro island archipelago details
  const islands = [
    { x: 530, y: 440, r: 8 }, // Caribbean
    { x: 560, y: 430, r: 10 },
    { x: 580, y: 450, r: 7 },
    { x: 1600, y: 560, r: 12 }, // Indonesia / Philippines
    { x: 1640, y: 580, r: 15 },
    { x: 1680, y: 600, r: 14 },
    { x: 1720, y: 590, r: 11 },
    { x: 920, y: 180, r: 14 } // Iceland
  ];

  ctx.fillStyle = '#2F855A';
  islands.forEach(isl => {
    ctx.beginPath();
    ctx.arc(isl.x, isl.y, isl.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Arctic & Antarctic Polar Ice Shelves
  const northIce = ctx.createLinearGradient(0, 0, 0, 130);
  northIce.addColorStop(0, '#FFFFFF');
  northIce.addColorStop(0.7, '#EBF8FF');
  northIce.addColorStop(1, 'rgba(226, 232, 240, 0)');
  ctx.fillStyle = northIce;
  ctx.fillRect(0, 0, canvas.width, 130);

  const southIce = ctx.createLinearGradient(0, canvas.height - 150, 0, canvas.height);
  southIce.addColorStop(0, 'rgba(226, 232, 240, 0)');
  southIce.addColorStop(0.3, '#EBF8FF');
  southIce.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = southIce;
  ctx.fillRect(0, canvas.height - 150, canvas.width, 150);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates Earth Specular / Water Mask (2048x1024).
 * Oceans = pure white/silver (high specularity for sunlight reflection).
 * Landmasses = pure dark/black (matte, zero specular ocean glare).
 */
export function createEarthSpecularMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Oceans are highly reflective
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Landmasses are non-reflective (black in specular map)
  ctx.fillStyle = '#080808';

  const landRegions = [
    { x: 420, y: 300, rx: 200, ry: 140 },
    { x: 340, y: 220, rx: 150, ry: 100 },
    { x: 500, y: 250, rx: 120, ry: 90 },
    { x: 430, y: 400, rx: 75, ry: 85 },
    { x: 460, y: 460, rx: 45, ry: 65 },
    { x: 620, y: 620, rx: 160, ry: 200 },
    { x: 650, y: 780, rx: 95, ry: 160 },
    { x: 1040, y: 260, rx: 140, ry: 95 },
    { x: 1120, y: 210, rx: 95, ry: 75 },
    { x: 1080, y: 450, rx: 200, ry: 130 },
    { x: 1110, y: 600, rx: 170, ry: 140 },
    { x: 1150, y: 760, rx: 105, ry: 115 },
    { x: 1380, y: 240, rx: 330, ry: 150 },
    { x: 1460, y: 360, rx: 260, ry: 130 },
    { x: 1240, y: 390, rx: 140, ry: 85 },
    { x: 1380, y: 460, rx: 130, ry: 95 },
    { x: 1560, y: 490, rx: 110, ry: 80 },
    { x: 1680, y: 720, rx: 150, ry: 110 }
  ];

  landRegions.forEach(r => {
    ctx.beginPath();
    ctx.ellipse(r.x, r.y, r.rx, r.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates procedural Earth Cloud texture (2048x1024) with realistic
 * cyclone spirals, atmospheric convergence zones, and layered transparency.
 */
export function createEarthCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Tropical convergence cloud belts
  const drawCloudBand = (yCenter: number, spread: number, opacity: number, count: number) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    for (let i = 0; i < count; i++) {
      const x = (i / count) * canvas.width + (Math.sin(i * 1.5) * 80);
      const y = yCenter + Math.sin(i * 0.8) * spread;
      const rx = 60 + (i % 7) * 20;
      const ry = 14 + (i % 5) * 6;

      ctx.beginPath();
      ctx.ellipse(x % canvas.width, y, rx, ry, (i % 3 - 1) * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Multiple atmospheric circulation cloud bands
  drawCloudBand(480, 50, 0.45, 36); // Equatorial Intertropical Convergence
  drawCloudBand(280, 65, 0.55, 32); // Northern temperate jet stream
  drawCloudBand(720, 65, 0.50, 32); // Southern roaring forties

  // Spiral cyclones
  const drawCyclone = (cx: number, cy: number, radius: number) => {
    for (let a = 0; a < Math.PI * 5; a += 0.25) {
      const r = (a / (Math.PI * 5)) * radius;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * (r * 0.65);
      const dotRadius = 12 + a * 2.5;

      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, 0.75 - a * 0.08)})`;
      ctx.beginPath();
      ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  drawCyclone(650, 340, 110);  // Atlantic hurricane
  drawCyclone(1500, 360, 140); // Western Pacific typhoon
  drawCyclone(1300, 780, 120); // Southern ocean vortex

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates procedural Mach Diamond supersonic rocket shock wave texture (256x512).
 * Shows incandescent shock nodes along the supersonic expansion plume.
 */
export function createMachDiamondTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 256, 512);

  // Background core gradient (incandescent white-hot to flame orange)
  const plumeGrad = ctx.createLinearGradient(128, 0, 128, 512);
  plumeGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)'); // Throat white-hot
  plumeGrad.addColorStop(0.15, 'rgba(255, 220, 120, 0.95)'); // Yellow
  plumeGrad.addColorStop(0.45, 'rgba(255, 106, 0, 0.85)'); // Flame orange #FF6A00
  plumeGrad.addColorStop(0.8, 'rgba(255, 60, 0, 0.4)'); // Deep amber
  plumeGrad.addColorStop(1.0, 'rgba(120, 20, 0, 0.0)'); // Dissipation
  ctx.fillStyle = plumeGrad;

  // Parabolic supersonic envelope
  ctx.beginPath();
  ctx.moveTo(110, 0);
  ctx.lineTo(146, 0);
  ctx.quadraticCurveTo(175, 220, 140, 500);
  ctx.lineTo(116, 500);
  ctx.quadraticCurveTo(81, 220, 110, 0);
  ctx.fill();

  // Draw 5 distinct supersonic Mach diamonds (shock wave reflections)
  const diamondPositions = [60, 130, 210, 300, 400];
  diamondPositions.forEach((y, idx) => {
    const scale = 1.0 - idx * 0.16;
    const w = 24 * scale;
    const h = 34 * scale;

    // Diamond shock node
    ctx.fillStyle = `rgba(255, 255, 255, ${0.9 - idx * 0.15})`;
    ctx.beginPath();
    ctx.moveTo(128, y - h);
    ctx.lineTo(128 + w, y);
    ctx.lineTo(128, y + h);
    ctx.lineTo(128 - w, y);
    ctx.closePath();
    ctx.fill();

    // Central white-hot plasma dot
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(128, y, 6 * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates volumetric-style rolling launchpad smoke billow texture (256x256).
 */
export function createSmokeBillowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 256, 256);

  // Soft spherical cloud puff with multiple turbulent lobes
  const lobes = [
    { x: 128, y: 128, r: 85, o: 0.65 },
    { x: 105, y: 110, r: 60, o: 0.45 },
    { x: 150, y: 115, r: 55, o: 0.45 },
    { x: 115, y: 150, r: 65, o: 0.40 },
    { x: 145, y: 145, r: 55, o: 0.40 }
  ];

  lobes.forEach(l => {
    const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
    g.addColorStop(0, `rgba(226, 232, 240, ${l.o})`);
    g.addColorStop(0.6, `rgba(148, 163, 184, ${l.o * 0.5})`);
    g.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates high-detail gold foil insulation texture for aerospace satellites (512x512).
 */
export function createGoldFoilTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep radiant thermal gold
  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(0, 0, 512, 512);

  // Multi-frequency thermal crinkles
  ctx.strokeStyle = '#996515';
  ctx.lineWidth = 1;
  const step = 8;
  for (let i = 0; i < 512; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Crinkle diagonal highlights
  ctx.fillStyle = 'rgba(255, 240, 160, 0.18)';
  for (let y = 0; y < 512; y += 16) {
    for (let x = 0; x < 512; x += 16) {
      if ((x + y) % 32 === 0) {
        ctx.fillRect(x + 2, y + 2, 12, 12);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates high-efficiency solar panel silicon texture with busbars (512x1024).
 */
export function createSolarPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep space-grade anti-reflective silicon blue
  ctx.fillStyle = '#060B18';
  ctx.fillRect(0, 0, 512, 1024);

  // Solar cells grid
  const cols = 4;
  const rows = 12;
  const w = 512 / cols;
  const h = 1024 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * w;
      const y = r * h;

      // Cell border
      ctx.strokeStyle = '#1E3A8A';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);

      // Cell blue silicon fill
      ctx.fillStyle = '#0C1C3D';
      ctx.fillRect(x + 4, y + 4, w - 8, h - 8);

      // Silver conductive busbars (2 vertical lines per cell)
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(x + w * 0.33 - 1, y + 4, 2, h - 8);
      ctx.fillRect(x + w * 0.67 - 1, y + 4, 2, h - 8);

      // Subtle anti-reflective rainbow glint
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.fillRect(x + 6, y + 6, w - 12, (h - 12) * 0.45);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates soft radial glow texture for particle thrusters.
 */
export function createParticleGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.2, 'rgba(255, 200, 100, 0.85)');
  grad.addColorStop(0.5, 'rgba(255, 106, 0, 0.45)');
  grad.addColorStop(0.8, 'rgba(112, 199, 255, 0.15)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
