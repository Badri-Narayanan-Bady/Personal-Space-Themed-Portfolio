import React, { useMemo, useState, useEffect } from 'react';
import { ScrollProgressController, CinematicFrameState } from './ScrollProgressController';
import { AssetPreloader, DeliveryTier } from './AssetPreloader';
import { FrameSequence } from './FrameSequence';
import { PlaybackFallback } from './PlaybackFallback';

interface CinematicControllerProps {
  scrollProgress: number;
  className?: string;
}

export const CinematicController: React.FC<CinematicControllerProps> = ({
  scrollProgress,
  className = ''
}) => {
  const controller = useMemo(() => new ScrollProgressController(), []);
  const preloader = useMemo(() => new AssetPreloader(), []);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [activeTier, setActiveTier] = useState<DeliveryTier>(preloader.getTier());

  // Check prefers-reduced-motion media query
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Update tier if preloader adapts
  useEffect(() => {
    setActiveTier(preloader.getTier());
  }, [preloader]);

  // Evaluate deterministic frame state from scroll progress
  const frameState: CinematicFrameState = useMemo(() => {
    return controller.evaluate(scrollProgress);
  }, [controller, scrollProgress]);

  return (
    <div
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#030407] ${className}`}
      data-cinematic-shot={frameState.shot.id}
      data-cinematic-phase={frameState.shot.phaseCode}
      data-frame-index={frameState.frameIndex}
      data-delivery-tier={activeTier}
    >
      {/* Background Cinematic Visual Sequence */}
      {prefersReducedMotion ? (
        <PlaybackFallback state={frameState} preloader={preloader} />
      ) : (
        <FrameSequence state={frameState} preloader={preloader} />
      )}

      {/* Atmospheric Space Overlay & Typographic Safe Zone */}
      {/* Left side gradient overlay to ensure hero text is 100% crisp and legible */}
      <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-[#030407]/90 via-[#030407]/50 to-transparent pointer-events-none z-1" />

      {/* Subtle top header gradient */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#030407]/90 to-transparent pointer-events-none z-1" />

      {/* Subtle bottom footer gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030407]/95 via-[#030407]/60 to-transparent pointer-events-none z-1" />
    </div>
  );
};
