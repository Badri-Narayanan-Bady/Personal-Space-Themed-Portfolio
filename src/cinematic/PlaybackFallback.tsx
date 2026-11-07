import React from 'react';
import { CinematicFrameState } from './ScrollProgressController';
import { AssetPreloader } from './AssetPreloader';

interface PlaybackFallbackProps {
  state: CinematicFrameState;
  preloader: AssetPreloader;
}

export const PlaybackFallback: React.FC<PlaybackFallbackProps> = ({ state, preloader }) => {
  const posterUrl = preloader.getPosterUrl(state.shot);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#030407]"
      aria-hidden="true"
    >
      <img
        src={posterUrl}
        alt={state.shot.name}
        className="w-full h-full object-cover transition-opacity duration-700 ease-out"
        loading="eager"
      />
      {/* Cinematic subtle contrast vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030407]/30 to-[#030407]/75" />
    </div>
  );
};
