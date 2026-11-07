import React, { useRef, useEffect } from 'react';
import { CinematicFrameState } from './ScrollProgressController';
import { AssetPreloader } from './AssetPreloader';

interface FrameSequenceProps {
  state: CinematicFrameState;
  preloader: AssetPreloader;
  className?: string;
}

export const FrameSequence: React.FC<FrameSequenceProps> = ({ state, preloader, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentImageRef = useRef<HTMLImageElement | null>(null);
  const nextImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let isMounted = true;

    // Build URLs for primary and adjacent frame
    const currentUrl = preloader.getFrameUrl(state.shot, state.frameIndex);
    const nextUrl = preloader.getFrameUrl(state.shot, state.nextFrameIndex);

    // Preload adjacent frames in background based on direction
    preloader.preloadAdjacent(state.shot.id, 'forward');

    // Load both current and next frame for smooth sub-frame interpolation
    Promise.all([
      preloader.loadFrame(currentUrl),
      preloader.loadFrame(nextUrl)
    ]).then(([currImg, nextImg]) => {
      if (!isMounted) return;
      currentImageRef.current = currImg;
      nextImageRef.current = nextImg;

      renderFrame(ctx, canvas, currImg, nextImg, state.frameBlend);
    }).catch(() => {
      // Fallback to poster
      preloader.loadFrame(preloader.getPosterUrl(state.shot)).then(posterImg => {
        if (!isMounted) return;
        currentImageRef.current = posterImg;
        renderFrame(ctx, canvas, posterImg, null, 0);
      });
    });

    return () => {
      isMounted = false;
    };
  }, [state.shot.id, state.frameIndex, state.nextFrameIndex, state.frameBlend, preloader]);

  // Window resize handler to maintain crisp 1:1 pixel grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      if (currentImageRef.current) {
        renderFrame(ctx, canvas, currentImageRef.current, nextImageRef.current, state.frameBlend);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.frameBlend]);

  const renderFrame = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    currImg: HTMLImageElement,
    nextImg: HTMLImageElement | null,
    blend: number
  ) => {
    const cw = canvas.width;
    const ch = canvas.height;

    // Calculate aspect-fill scale
    const imgAspect = currImg.naturalWidth / currImg.naturalHeight || 16 / 9;
    const canvasAspect = cw / ch;

    let drawW: number;
    let drawH: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasAspect > imgAspect) {
      drawW = cw;
      drawH = cw / imgAspect;
      offsetX = 0;
      offsetY = (ch - drawH) / 2;
    } else {
      drawH = ch;
      drawW = ch * imgAspect;
      offsetX = (cw - drawW) / 2;
      offsetY = 0;
    }

    // Paint primary frame
    ctx.globalAlpha = 1.0;
    ctx.drawImage(currImg, offsetX, offsetY, drawW, drawH);

    // If sub-frame blending is active and next frame is ready, cross-dissolve smoothly
    if (nextImg && blend > 0.05 && currImg !== nextImg) {
      ctx.globalAlpha = blend;
      ctx.drawImage(nextImg, offsetX, offsetY, drawW, drawH);
      ctx.globalAlpha = 1.0;
    }

    // Atmospheric cinematic vignette & color grading pass
    const grad = ctx.createRadialGradient(
      cw * 0.5, ch * 0.5, Math.min(cw, ch) * 0.35,
      cw * 0.5, ch * 0.5, Math.max(cw, ch) * 0.8
    );
    grad.addColorStop(0, 'rgba(3, 4, 7, 0.0)');
    grad.addColorStop(1, 'rgba(3, 4, 7, 0.55)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);
  };

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full object-cover pointer-events-none z-0 ${className}`}
      style={{ imageRendering: 'auto' }}
    />
  );
};
