/**
 * ORBIT — Pure Deterministic Scroll Progress Controller
 * Converts raw scroll progress into frame indices, sub-frame interpolation
 * factors, and telemetry readouts.
 * 
 * GUARANTEE: Zero wall-clock accumulators. Any scroll progress p always
 * evaluates to the exact same visual state regardless of scroll direction,
 * speed, or session history.
 */

import { CINEMATIC_SHOTS, CinematicShot, getActiveShot } from './ShotManifest';

export interface CinematicFrameState {
  shot: CinematicShot;
  localProgress: number;   // 0.0 to 1.0 within active shot
  frameIndex: number;      // Integer frame index [0..frameCount-1]
  nextFrameIndex: number;  // For smooth frame interpolation
  frameBlend: number;      // 0.0 to 1.0 between current and next frame
  altitudeKm: string;
  velocityKmS: string;
  telemetryState: string;
  isFirstShot: boolean;
  isFinalShot: boolean;
}

export class ScrollProgressController {
  private lastProgress: number = 0;
  private scrollDirection: 'forward' | 'backward' | 'idle' = 'idle';

  /**
   * Evaluates the cinematic state for a given scroll progress p.
   * Pure deterministic calculation.
   */
  public evaluate(progress: number): CinematicFrameState {
    const clamped = Math.max(0, Math.min(1, progress));
    
    // Detect scroll direction for directional preloading
    if (clamped > this.lastProgress + 0.0001) {
      this.scrollDirection = 'forward';
    } else if (clamped < this.lastProgress - 0.0001) {
      this.scrollDirection = 'backward';
    } else {
      this.scrollDirection = 'idle';
    }
    this.lastProgress = clamped;

    const { shot, localProgress, frameIndex } = getActiveShot(clamped);

    // Sub-frame interpolation calculation
    const exactFrame = localProgress * (shot.frameCount - 1);
    const primaryFrame = Math.floor(exactFrame);
    const nextFrame = Math.min(shot.frameCount - 1, primaryFrame + 1);
    const frameBlend = exactFrame - primaryFrame;

    // Dynamic telemetry interpolation across the shot range
    const shotIndex = CINEMATIC_SHOTS.findIndex(s => s.id === shot.id);
    const isFirstShot = shotIndex === 0;
    const isFinalShot = shotIndex === CINEMATIC_SHOTS.length - 1;

    // Interpolate numerical altitude and velocity for continuous telemetry
    const nextShot = isFinalShot ? shot : CINEMATIC_SHOTS[shotIndex + 1];
    const currentAlt = parseFloat(shot.altitudeKm) || 0;
    const nextAlt = parseFloat(nextShot.altitudeKm) || currentAlt;
    const interpAlt = Math.round(currentAlt + (nextAlt - currentAlt) * localProgress);
    const paddedAlt = interpAlt.toString().padStart(3, '0');

    const currentVel = parseFloat(shot.velocityKmS) || 0;
    const nextVel = parseFloat(nextShot.velocityKmS) || currentVel;
    const interpVel = (currentVel + (nextVel - currentVel) * localProgress).toFixed(2);

    return {
      shot,
      localProgress,
      frameIndex: primaryFrame,
      nextFrameIndex: nextFrame,
      frameBlend,
      altitudeKm: paddedAlt,
      velocityKmS: interpVel,
      telemetryState: shot.telemetryState,
      isFirstShot,
      isFinalShot
    };
  }

  public getDirection(): 'forward' | 'backward' | 'idle' {
    return this.scrollDirection;
  }
}
