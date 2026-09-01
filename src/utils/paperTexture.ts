import * as THREE from 'three';
import { PaperTheme } from '../types';

interface GeneratedPaperTextures {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
}

const themeColorMap: Record<PaperTheme, { base: string; fiber: string; highlight: string; gridColor?: string }> = {
  cotton: {
    base: '#fbf9f4',
    fiber: 'rgba(80, 70, 60, 0.12)',
    highlight: 'rgba(255, 255, 255, 0.55)',
  },
  kraft: {
    base: '#d6bfa2',
    fiber: 'rgba(60, 45, 30, 0.18)',
    highlight: 'rgba(250, 240, 220, 0.35)',
  },
  blueprint: {
    base: '#1a334d',
    fiber: 'rgba(255, 255, 255, 0.10)',
    highlight: 'rgba(100, 180, 255, 0.20)',
    gridColor: 'rgba(120, 180, 230, 0.12)',
  },
  slate: {
    base: '#232428',
    fiber: 'rgba(255, 255, 255, 0.08)',
    highlight: 'rgba(255, 255, 255, 0.15)',
  },
};

const textureCache = new Map<PaperTheme, GeneratedPaperTextures>();

export function getProceduralPaperTextures(theme: PaperTheme = 'cotton'): GeneratedPaperTextures {
  const cached = textureCache.get(theme);
  if (cached) return cached;
  const textures = createProceduralPaperTextures(theme);
  textureCache.set(theme, textures);
  return textures;
}

function createProceduralPaperTextures(theme: PaperTheme = 'cotton'): GeneratedPaperTextures {
  const size = 512;
  const themeColors = themeColorMap[theme] || themeColorMap.cotton;

  const diffuseCanvas = document.createElement('canvas');
  diffuseCanvas.width = size;
  diffuseCanvas.height = size;
  const ctx = diffuseCanvas.getContext('2d')!;

  ctx.fillStyle = themeColors.base;
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 25;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  for (let i = 0; i < 30; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 15 + Math.random() * 60;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, Math.random() > 0.5 ? themeColors.fiber : themeColors.highlight);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.lineWidth = 0.75;
  for (let i = 0; i < 250; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 4 + Math.random() * 16;
    const angle = Math.random() * Math.PI * 2;
    const curve = (Math.random() - 0.5) * 10;

    ctx.strokeStyle = Math.random() > 0.3 ? themeColors.fiber : 'rgba(50, 45, 40, 0.05)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + Math.cos(angle) * (len * 0.5) + curve,
      y + Math.sin(angle) * (len * 0.5) - curve,
      x + Math.cos(angle) * len,
      y + Math.sin(angle) * len
    );
    ctx.stroke();
  }

  if (themeColors.gridColor) {
    ctx.strokeStyle = themeColors.gridColor;
    ctx.lineWidth = 1;
    const step = 32;
    for (let x = 0; x <= size; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    for (let y = 0; y <= size; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
  }

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  const bData = bCtx.getImageData(0, 0, size, size);
  const bPixels = bData.data;
  for (let i = 0; i < bPixels.length; i += 4) {
    const n = (Math.random() - 0.5) * 40;
    bPixels[i] = Math.min(255, Math.max(0, 128 + n));
    bPixels[i + 1] = Math.min(255, Math.max(0, 128 + n));
    bPixels[i + 2] = Math.min(255, Math.max(0, 128 + n));
  }
  bCtx.putImageData(bData, 0, 0);

  for (let i = 0; i < 12; i++) {
    const x1 = Math.random() * size;
    const y1 = Math.random() * size;
    const x2 = Math.random() * size;
    const y2 = Math.random() * size;

    bCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    bCtx.lineWidth = 3.5;
    bCtx.beginPath();
    bCtx.moveTo(x1, y1);
    bCtx.lineTo(x2, y2);
    bCtx.stroke();

    bCtx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    bCtx.lineWidth = 3.5;
    bCtx.beginPath();
    bCtx.moveTo(x1 + 1.5, y1 + 1.5);
    bCtx.lineTo(x2 + 1.5, y2 + 1.5);
    bCtx.stroke();
  }

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = 256;
  roughCanvas.height = 256;
  const rCtx = roughCanvas.getContext('2d')!;
  rCtx.fillStyle = '#e8e8e8';
  rCtx.fillRect(0, 0, 256, 256);

  const rData = rCtx.getImageData(0, 0, 256, 256);
  const rPixels = rData.data;
  for (let i = 0; i < rPixels.length; i += 4) {
    const r = (Math.random() - 0.5) * 20;
    rPixels[i] = Math.min(255, Math.max(0, 230 + r));
    rPixels[i + 1] = Math.min(255, Math.max(0, 230 + r));
    rPixels[i + 2] = Math.min(255, Math.max(0, 230 + r));
  }
  rCtx.putImageData(rData, 0, 0);

  const map = new THREE.CanvasTexture(diffuseCanvas);
  map.wrapS = THREE.ClampToEdgeWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;
  map.generateMipmaps = true;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.ClampToEdgeWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;
  bumpMap.generateMipmaps = true;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.ClampToEdgeWrapping;
  roughnessMap.wrapT = THREE.ClampToEdgeWrapping;
  roughnessMap.generateMipmaps = true;

  return { map, roughnessMap, bumpMap };
}
