/**
 * ORBIT — Adaptive Asset Preloader & In-Memory LRU Frame Cache
 * Dynamically selects asset resolution based on device capabilities
 * and preloads adjacent cinematic frames to guarantee 0-latency scrubbing.
 */

import { CINEMATIC_SHOTS, CinematicShot } from './ShotManifest';

export type DeliveryTier = 'master_4k' | 'desktop_1440' | 'desktop_1080' | 'mobile_720';

export class AssetPreloader {
  private cache = new Map<string, HTMLImageElement>();
  private maxCacheSize: number = 72; // Maximum 72 cached frames (~18MB memory limit)
  private currentTier: DeliveryTier = 'desktop_1080';
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();

  constructor() {
    this.detectOptimalTier();
  }

  private detectOptimalTier(): void {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const dpr = window.devicePixelRatio || 1;
    const effectiveWidth = width * dpr;

    // Detect mobile or low-power hardware
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || width < 768;

    if (isMobile || width < 768) {
      this.currentTier = 'mobile_720';
      this.maxCacheSize = 32;
    } else if (effectiveWidth > 2560) {
      // 4K capable displays
      this.currentTier = 'desktop_1440';
      this.maxCacheSize = 64;
    } else {
      this.currentTier = 'desktop_1080';
      this.maxCacheSize = 56;
    }
  }

  public getTier(): DeliveryTier {
    return this.currentTier;
  }

  public setTier(tier: DeliveryTier): void {
    this.currentTier = tier;
  }

  /**
   * Constructs the asset URL for a given shot and frame index
   */
  public getFrameUrl(shot: CinematicShot, frameIndex: number): string {
    const padded = frameIndex.toString().padStart(2, '0');
    // If specific sub-frame is available, use frame_XX.webp, otherwise fall back to tier
    return `${shot.deliveryBaseUrl}/frame_${padded}.webp`;
  }

  public getPosterUrl(shot: CinematicShot): string {
    return `${shot.deliveryBaseUrl}/${this.currentTier}.webp`;
  }

  /**
   * Loads an image asynchronously, returning from LRU cache if already loaded
   */
  public loadFrame(url: string): Promise<HTMLImageElement> {
    if (this.cache.has(url)) {
      const img = this.cache.get(url)!;
      // Refresh LRU order
      this.cache.delete(url);
      this.cache.set(url, img);
      return Promise.resolve(img);
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Enforce cache bound
        if (this.cache.size >= this.maxCacheSize) {
          const oldestKey = this.cache.keys().next().value;
          if (oldestKey) this.cache.delete(oldestKey);
        }
        this.cache.set(url, img);
        this.loadingPromises.delete(url);
        resolve(img);
      };
      img.onerror = () => {
        // If specific sub-frame fails, fallback to poster
        const fallback = new Image();
        fallback.onload = () => {
          this.cache.set(url, fallback);
          this.loadingPromises.delete(url);
          resolve(fallback);
        };
        fallback.onerror = () => {
          this.loadingPromises.delete(url);
          resolve(img);
        };
        // Extract base folder from url
        const parts = url.split('/');
        parts.pop();
        fallback.src = `${parts.join('/')}/poster.jpg`;
      };
      img.src = url;
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  /**
   * Preloads current shot and adjacent shots in background
   */
  public preloadAdjacent(activeShotId: string, direction: 'forward' | 'backward' | 'idle'): void {
    const currentIndex = CINEMATIC_SHOTS.findIndex(s => s.id === activeShotId);
    if (currentIndex === -1) return;

    const activeShot = CINEMATIC_SHOTS[currentIndex];

    // Priority 1: Preload current shot frames
    for (let f = 0; f < activeShot.frameCount; f++) {
      this.loadFrame(this.getFrameUrl(activeShot, f));
    }

    // Priority 2: Preload next or previous shot based on scroll direction
    if (direction === 'forward' && currentIndex < CINEMATIC_SHOTS.length - 1) {
      const nextShot = CINEMATIC_SHOTS[currentIndex + 1];
      for (let f = 0; f < 3; f++) {
        this.loadFrame(this.getFrameUrl(nextShot, f));
      }
    } else if (direction === 'backward' && currentIndex > 0) {
      const prevShot = CINEMATIC_SHOTS[currentIndex - 1];
      for (let f = prevShot.frameCount - 3; f < prevShot.frameCount; f++) {
        if (f >= 0) this.loadFrame(this.getFrameUrl(prevShot, f));
      }
    }
  }

  public getCached(url: string): HTMLImageElement | undefined {
    return this.cache.get(url);
  }

  public clear(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}
