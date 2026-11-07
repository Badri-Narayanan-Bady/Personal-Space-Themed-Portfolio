/**
 * ORBIT — Master Cinematic Production Shot Manifest
 * Authoritative specification of the 8 production cinematic shots,
 * progress ranges, delivery assets, and telemetry metadata.
 */

export interface CinematicShot {
  id: string;
  name: string;
  phaseCode: string;
  startProgress: number; // 0.0 to 1.0
  endProgress: number;   // 0.0 to 1.0
  frameCount: number;
  altitudeKm: string;
  velocityKmS: string;
  telemetryState: string;
  description: string;
  cameraDirection: string;
  aspectRatio: string;
  nativeResolution: string; // e.g. "3840x2160"
  deliveryBaseUrl: string;
  posterUrl: string;
  preloadPriority: number; // 1 = highest
}

export const CINEMATIC_SHOTS: CinematicShot[] = [
  {
    id: 'launchpad',
    name: 'Launchpad Standby',
    phaseCode: 'PHASE-01',
    startProgress: 0.00,
    endProgress: 0.10,
    frameCount: 8,
    altitudeKm: '000',
    velocityKmS: '0.00',
    telemetryState: 'COUNTDOWN T-10S · LAUNCHPAD STANDBY',
    description: 'Wide cinematic establishing shot of ORBIT Heavy on pad with dawn horizon and umbilical tower.',
    cameraDirection: 'Wide establishing, 50mm, framed right to protect hero typography.',
    aspectRatio: '16:9',
    nativeResolution: '3840x2160',
    deliveryBaseUrl: '/cinematic/launchpad',
    posterUrl: '/cinematic/launchpad/poster.jpg',
    preloadPriority: 1
  },
  {
    id: 'ignition',
    name: 'Engine Ignition & Shock Waves',
    phaseCode: 'PHASE-02',
    startProgress: 0.10,
    endProgress: 0.22,
    frameCount: 8,
    altitudeKm: '000',
    velocityKmS: '0.00',
    telemetryState: 'HOLD-DOWN CLAMPED · FULL THRUST BUILDUPS',
    description: 'Multi-engine ignition with intense white-hot combustion, Mach diamonds and trench illumination.',
    cameraDirection: 'Low-angle medium shot, 35mm, ground-hugging perspective.',
    aspectRatio: '16:9',
    nativeResolution: '3840x2160',
    deliveryBaseUrl: '/cinematic/ignition',
    posterUrl: '/cinematic/ignition/poster.jpg',
    preloadPriority: 1
  },
  {
    id: 'liftoff',
    name: 'Tower Clearance & Liftoff',
    phaseCode: 'PHASE-03',
    startProgress: 0.22,
    endProgress: 0.35,
    frameCount: 8,
    altitudeKm: '003',
    velocityKmS: '0.42',
    telemetryState: 'LIFTOFF · TOWER CLEARED',
    description: 'Hold-down release, quadratic vertical acceleration clearing the umbilical service tower.',
    cameraDirection: 'Ascending tracking shot, 85mm long lens.',
    aspectRatio: '16:9',
    nativeResolution: '3840x2160',
    deliveryBaseUrl: '/cinematic/liftoff',
    posterUrl: '/cinematic/liftoff/poster.jpg',
    preloadPriority: 2
  },
  {
    id: 'ascent',
    name: 'Atmospheric Ascent & Gravity Turn',
    phaseCode: 'PHASE-04',
    startProgress: 0.35,
    endProgress: 0.52,
    frameCount: 8,
    altitudeKm: '045',
    velocityKmS: '1.85',
    telemetryState: 'TRANSONIC · GRAVITY TURN INITIATED',
    description: 'Condensation vapor cone collar around payload fairing, expanding supersonic exhaust plume.',
    cameraDirection: 'High-altitude side profile tracking shot, 70mm.',
    aspectRatio: '16:9',
    nativeResolution: '3840x2160',
    deliveryBaseUrl: '/cinematic/ascent',
    posterUrl: '/cinematic/ascent/poster.jpg',
    preloadPriority: 2
  },
  {
    id: 'separation',
    name: 'Strap-on Booster Staging',
    phaseCode: 'PHASE-05',
    startProgress: 0.52,
    endProgress: 0.68,
    frameCount: 8,
    altitudeKm: '085',
    velocityKmS: '3.60',
    telemetryState: 'MECO · LATERAL BOOSTER SEPARATION',
    description: 'Dual lateral strap-on liquid boosters disengage cleanly with nitrogen RCS plumes.',
    cameraDirection: 'Orbital boundary wide shot, 24mm, Earth curvature visible.',
    aspectRatio: '16:9',
    nativeResolution: '3840x2160',
    deliveryBaseUrl: '/cinematic/separation',
    posterUrl: '/cinematic/separation/poster.jpg',
    preloadPriority: 3
  },
  {
    id: 'orbit',
    name: 'Payload Fairing Jettison',
    phaseCode: 'PHASE-06',
    startProgress: 0.68,
    endProgress: 0.80,
    frameCount: 8,
    altitudeKm: '180',
    velocityKmS: '7.45',
    telemetryState: 'SECO · FAIRING SEPARATION',
    description: 'Clamshell payload fairing halves split and drift into space, revealing the satellite.',
    cameraDirection: 'Forward vehicle close-up, 50mm, crisp daylight reflection.',
    aspectRatio: '16:9',
    nativeResolution: '3840x2160',
    deliveryBaseUrl: '/cinematic/orbit',
    posterUrl: '/cinematic/orbit/poster.jpg',
    preloadPriority: 3
  },
  {
    id: 'deployment',
    name: 'Satellite Separation & Solar Unfolding',
    phaseCode: 'PHASE-07',
    startProgress: 0.80,
    endProgress: 0.94,
    frameCount: 8,
    altitudeKm: '320',
    velocityKmS: '7.78',
    telemetryState: 'PAYLOAD DEPLOYMENT · SOLAR WING ARTICULATION',
    description: 'Spacecraft pneumatic release, gold MLI body, 2-stage accordion solar array wings unfold.',
    cameraDirection: 'Slow orbital pan, 35mm, high-dynamic-range sunlight.',
    aspectRatio: '16:9',
    nativeResolution: '3840x2160',
    deliveryBaseUrl: '/cinematic/deployment',
    posterUrl: '/cinematic/deployment/poster.jpg',
    preloadPriority: 4
  },
  {
    id: 'final',
    name: 'Stable Orbit & Mission Control',
    phaseCode: 'PHASE-08',
    startProgress: 0.94,
    endProgress: 1.00,
    frameCount: 8,
    altitudeKm: '410',
    velocityKmS: '7.82',
    telemetryState: 'STABLE ORBIT · SYSTEMS NOMINAL',
    description: 'Fully deployed satellite in Earth orbit with solar arrays catching glint over Earth limb.',
    cameraDirection: 'Cinematic wide orbital master shot, 50mm, contemplative beauty.',
    aspectRatio: '16:9',
    nativeResolution: '3840x2160',
    deliveryBaseUrl: '/cinematic/final',
    posterUrl: '/cinematic/final/poster.jpg',
    preloadPriority: 4
  }
];

export function getActiveShot(progress: number): { shot: CinematicShot; localProgress: number; frameIndex: number } {
  const clamped = Math.max(0, Math.min(1, progress));
  
  // Find shot matching progress range
  for (let i = 0; i < CINEMATIC_SHOTS.length; i++) {
    const s = CINEMATIC_SHOTS[i];
    if (clamped >= s.startProgress && (clamped <= s.endProgress || i === CINEMATIC_SHOTS.length - 1)) {
      const range = s.endProgress - s.startProgress;
      const localProgress = range > 0 ? (clamped - s.startProgress) / range : 0;
      const frameIndex = Math.min(s.frameCount - 1, Math.floor(localProgress * s.frameCount));
      return { shot: s, localProgress, frameIndex };
    }
  }

  // Fallback to first shot
  const first = CINEMATIC_SHOTS[0];
  return { shot: first, localProgress: 0, frameIndex: 0 };
}
