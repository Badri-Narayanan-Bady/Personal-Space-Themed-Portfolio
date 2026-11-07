import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  createEarthAssembly,
  createLaunchpadAssembly,
  createRocketAssembly,
  createSatelliteAssembly,
  createStarfield,
  createExhaustParticleSystem,
  EarthObject,
  RocketObject,
  SatelliteObject,
  LaunchpadObject
} from './proceduralModels';

interface ThreeCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
  activeScene: number; // 1 to 6
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ scrollProgress }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030407); // Absolute Space Black
    scene.fog = new THREE.FogExp2(0x030407, 0.0035);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 18);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio environment reflection for PBR materials
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting rig
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFF9F2, 2.8); // Direct Solar key light
    keyLight.position.set(25, 35, 25);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    // Dynamic combustion flame light (orange emission casting light onto pad & vehicle)
    const combustionLight = new THREE.PointLight(0xFF6A00, 0, 35);
    combustionLight.position.set(0, 0, 0);
    scene.add(combustionLight);

    // Atmospheric Rayleigh fill
    const fillLight = new THREE.HemisphereLight(0x8CAFCB, 0x050811, 0.75);
    scene.add(fillLight);

    // Add starfield
    const starfield = createStarfield();
    scene.add(starfield);

    // Add Earth
    const earthAssy: EarthObject = createEarthAssembly();
    earthAssy.group.position.set(0, -18, 0);
    scene.add(earthAssy.group);

    // Add Launchpad
    const launchpad: LaunchpadObject = createLaunchpadAssembly();
    launchpad.group.position.set(0, 0, 0);
    scene.add(launchpad.group);

    // Add ORBIT Heavy Rocket Assembly
    const rocketAssy: RocketObject = createRocketAssembly();
    rocketAssy.group.position.set(5.2, 0.2, 0);
    scene.add(rocketAssy.group);

    // Add Exhaust spark particle system
    const exhaustParticles = createExhaustParticleSystem();
    rocketAssy.thrustersGroup.add(exhaustParticles);
    exhaustParticles.visible = false;

    // Add Satellite inside payload fairing
    const satelliteAssy: SatelliteObject = createSatelliteAssembly();
    satelliteAssy.group.scale.set(0.68, 0.68, 0.68);
    satelliteAssy.group.position.set(0, 12.35, 0);
    rocketAssy.group.add(satelliteAssy.group);

    // Reusable math objects
    const targetCamPos = new THREE.Vector3();
    const targetCamLook = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3(1.5, 4, 0);

    let animationFrameId: number;

    const renderLoop = () => {
      const p = scrollRef.current; // 0.0 to 1.0 (Master normalized scroll progress)

      // DETERMINISTIC ROTATIONS (Strictly derived from scroll progress 'p' for 100% reversible scrubbing)
      earthAssy.earthMesh.rotation.y = p * 1.8;
      earthAssy.cloudsMesh.rotation.y = p * 2.5;
      starfield.rotation.y = p * 0.4;

      // Deterministic periodic combustion flicker
      const deterministicPulse = (Math.sin(p * 450.0) * 0.5 + Math.cos(p * 850.0) * 0.3);

      // MISSION SCENE PROGRESSION & KINEMATICS
      if (p < 0.16) {
        // ==========================================
        // SCENE 01 — LAUNCHPAD STANDBY (Hero Safe Zone)
        // ==========================================
        const localP = p / 0.16;
        rocketAssy.group.position.set(6.4, 0.2, 0);
        rocketAssy.group.rotation.set(0, 0, 0);
        launchpad.group.position.set(6.4, 0, 0);
        earthAssy.group.position.set(0, -18, 0);
        earthAssy.group.scale.set(1, 1, 1);

        // Engines off
        exhaustParticles.visible = false;
        (rocketAssy.plumeCore.material as THREE.MeshBasicMaterial).opacity = 0;
        (rocketAssy.plumeBell.material as THREE.MeshBasicMaterial).opacity = 0;
        rocketAssy.machDiamondsGroup.children.forEach(c => {
          ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0;
        });
        combustionLight.intensity = 0;

        // Smoke hidden on pad
        launchpad.smokeClouds.forEach(cloud => {
          (cloud.material as THREE.MeshStandardMaterial).opacity = 0;
        });

        // Lateral boosters secured to core
        rocketAssy.boosters[0].position.set(-1.35, 0, 0);
        rocketAssy.boosters[0].rotation.set(0, 0, 0);
        rocketAssy.boosters[1].position.set(1.35, 0, 0);
        rocketAssy.boosters[1].rotation.set(0, 0, 0);

        // Fairings closed
        rocketAssy.leftDoor.rotation.y = 0;
        rocketAssy.rightDoor.rotation.y = Math.PI;

        // Satellite stowed inside fairing
        satelliteAssy.group.position.set(0, 12.35, 0);
        satelliteAssy.leftSolarArray.rotation.z = 0;
        satelliteAssy.leftOuterGroup.rotation.z = 0;
        satelliteAssy.rightSolarArray.rotation.z = 0;
        satelliteAssy.rightOuterGroup.rotation.z = 0;

        // Low-angle establishing shot framing rocket safely in the right 45% of viewport
        targetCamPos.set(
          Math.sin(localP * Math.PI * 0.5) * 2.0,
          3.8 + localP * 2,
          17.5 - localP * 2
        );
        targetCamLook.set(3.8, 4.5, 0);

      } else if (p < 0.33) {
        // ==========================================
        // SCENE 02 — IGNITION, THRUST BUILDUP & TOWER CLEARANCE
        // ==========================================
        const localP = (p - 0.16) / 0.17;

        // Two-phase physical launch sequence:
        // Phase 1 (0 to 30%): Hold-down clamped, engines ignite, Mach diamonds form, smoke billows.
        // Phase 2 (30% to 100%): Hold-down released, quadratic liftoff acceleration clearing the tower.
        let altitude = 0;
        let ignitionIntensity = 0;

        if (localP < 0.30) {
          // Pre-liftoff engine spinup & full thrust build
          const igniteP = localP / 0.30;
          altitude = 0;
          ignitionIntensity = igniteP;

          // Smoke expands radially across the launchpad flame trench
          launchpad.smokeClouds.forEach((cloud, idx) => {
            const mat = cloud.material as THREE.MeshStandardMaterial;
            mat.opacity = Math.min(0.75, igniteP * 1.2);
            cloud.scale.setScalar(1.0 + igniteP * (1.2 + (idx % 3) * 0.4));
          });

          // Subtle deterministic launch rumble
          const rumble = Math.sin(localP * 600.0) * 0.04 * igniteP;
          targetCamPos.x += rumble;
          targetCamPos.y += rumble * 0.5;

        } else {
          // Hold-down clamp release & vertical liftoff acceleration (gravity + inertia curve)
          const flightP = (localP - 0.30) / 0.70;
          altitude = Math.pow(flightP, 2.2) * 30; // Realistic acceleration curve
          ignitionIntensity = 1.0;

          // Smoke gradually dissipates as vehicle climbs
          launchpad.smokeClouds.forEach(cloud => {
            const mat = cloud.material as THREE.MeshStandardMaterial;
            mat.opacity = Math.max(0, 0.75 * (1 - flightP * 1.4));
          });
        }

        // Vehicle translates vertically without sideways drift
        rocketAssy.group.position.set(6.4, 0.2 + altitude, 0);
        rocketAssy.group.rotation.set(0, 0, 0);

        // Supersonic combustion plume & Mach diamonds active
        exhaustParticles.visible = true;
        const plumeOpacity = Math.min(1.0, ignitionIntensity * (0.85 + deterministicPulse * 0.15));
        (rocketAssy.plumeCore.material as THREE.MeshBasicMaterial).opacity = plumeOpacity;
        (rocketAssy.plumeBell.material as THREE.MeshBasicMaterial).opacity = plumeOpacity * 0.75;
        
        rocketAssy.machDiamondsGroup.children.forEach((c, idx) => {
          ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = Math.max(0, plumeOpacity - idx * 0.15);
        });

        // Plume bell expands slightly as ambient air pressure drops
        rocketAssy.plumeBell.scale.set(
          1.0 + altitude * 0.02,
          1.0 + altitude * 0.015,
          1.0 + altitude * 0.02
        );

        // Dynamic combustion lighting on pad & rocket hull
        combustionLight.position.set(6.4, 0.2 + altitude - 0.8, 0);
        combustionLight.intensity = ignitionIntensity * (6.5 + deterministicPulse * 2.0);

        // Tracking camera tracking liftoff past tower
        targetCamPos.set(9.8 - localP * 3, 4 + altitude * 0.75, 15 + localP * 5);
        targetCamLook.set(6.4, 0.2 + altitude, 0);

      } else if (p < 0.50) {
        // ==========================================
        // SCENE 03 — ATMOSPHERIC ASCENT & STRAP-ON BOOSTER STAGING
        // ==========================================
        const localP = (p - 0.33) / 0.17;
        const altitude = 30 + localP * 55;

        // Gravity turn pitch
        const pitchAngle = localP * 0.22;
        rocketAssy.group.position.set(6.4 - localP * 6.4, 0.2 + altitude, 0);
        rocketAssy.group.rotation.z = pitchAngle;

        // Plume under-expands in thinner upper atmosphere (higher expansion ratio)
        rocketAssy.plumeBell.scale.set(
          1.6 + localP * 0.8,
          1.4 + localP * 0.6,
          1.6 + localP * 0.8
        );
        (rocketAssy.plumeCore.material as THREE.MeshBasicMaterial).opacity = 0.9;
        (rocketAssy.plumeBell.material as THREE.MeshBasicMaterial).opacity = 0.65;
        combustionLight.intensity = 4.0;
        combustionLight.position.set(rocketAssy.group.position.x, 0.2 + altitude, 0);

        // TWO LATERAL LIQUID STRAP-ON BOOSTERS SEPARATION (Authentic Heavy Staging)
        // Boosters detach laterally left and right, and pitch away safely
        const sepDist = Math.pow(localP, 1.4) * 5.5;
        const boosterPitch = localP * 0.55;

        // Left Booster moves left (-X)
        rocketAssy.boosters[0].position.set(-1.35 - sepDist, -localP * 3.5, 0);
        rocketAssy.boosters[0].rotation.z = -boosterPitch;

        // Right Booster moves right (+X)
        rocketAssy.boosters[1].position.set(1.35 + sepDist, -localP * 3.5, 0);
        rocketAssy.boosters[1].rotation.z = boosterPitch;

        // Earth recedes into lower field of view
        earthAssy.group.position.set(-12, -22 - localP * 25, -localP * 18);

        targetCamPos.set(16 - localP * 7, altitude - 3, 20);
        targetCamLook.set(rocketAssy.group.position.x, 0.2 + altitude, 0);

      } else if (p < 0.70) {
        // ==========================================
        // SCENE 04 — ORBITAL INSERTION (Projects Cleared)
        // ==========================================
        const localP = (p - 0.50) / 0.20;

        // First stage shut down, vacuum flight
        exhaustParticles.visible = false;
        (rocketAssy.plumeCore.material as THREE.MeshBasicMaterial).opacity = 0;
        (rocketAssy.plumeBell.material as THREE.MeshBasicMaterial).opacity = 0;
        combustionLight.intensity = 0;

        // Strap-on boosters fully jettisoned off-screen
        rocketAssy.boosters[0].position.set(-200, 0, 0);
        rocketAssy.boosters[1].position.set(200, 0, 0);

        // Core positioned off-screen to the right (x = 14) so projects are 100% clear
        rocketAssy.group.position.set(14, 75, -8);
        rocketAssy.group.rotation.set(0.1, localP * Math.PI * 0.4, 1.35);

        // Earth placed at lower-left orbital horizon
        earthAssy.group.position.set(-28, 15, -45);
        earthAssy.group.scale.set(3.0, 3.0, 3.0);

        targetCamPos.set(0, 76, 16);
        targetCamLook.set(0, 75, 0);

      } else if (p < 0.85) {
        // ==========================================
        // SCENE 05 — SATELLITE DEPLOYMENT & 2-STAGE ACCORDION SOLAR WINGS
        // ==========================================
        const localP = (p - 0.70) / 0.15;
        exhaustParticles.visible = false;
        combustionLight.intensity = 0;

        rocketAssy.group.position.set(0, 75, 0);
        rocketAssy.group.rotation.set(0, 0, 0);

        // Step 1: Symmetrical Payload Fairing Jettison (0 to 45%)
        const doorAngle = Math.min(1, localP * 2.2) * (Math.PI * 0.55);
        rocketAssy.leftDoor.rotation.y = doorAngle;
        rocketAssy.rightDoor.rotation.y = Math.PI - doorAngle;

        // Step 2: Spacecraft Separation on pneumatic separation ring (20% to 70%)
        const sepProgress = Math.min(1, Math.max(0, localP - 0.20) * 2.0);
        satelliteAssy.group.position.set(0, 12.35 + sepProgress * 5.2, sepProgress * 2.4);
        satelliteAssy.group.rotation.y = localP * Math.PI * 0.5;
        satelliteAssy.group.scale.set(1.15, 1.15, 1.15);

        // Step 3: Accordion Solar Array Unfolding
        // Stage A: Inner Main Wing Hinge rotates 90° (40% to 80%)
        const wingAngle = Math.min(1, Math.max(0, localP - 0.40) * 2.5) * (Math.PI * 0.5);
        satelliteAssy.leftSolarArray.rotation.z = wingAngle;
        satelliteAssy.rightSolarArray.rotation.z = -wingAngle;

        // Stage B: Outer Panel Hinge folds out 180° (60% to 100%)
        const outerAngle = Math.min(1, Math.max(0, localP - 0.60) * 2.5) * (Math.PI * 0.95);
        satelliteAssy.leftOuterGroup.rotation.z = -outerAngle;
        satelliteAssy.rightOuterGroup.rotation.z = outerAngle;

        // Earth in lower orbital composition
        earthAssy.group.position.set(-28, 15, -48);
        earthAssy.group.scale.set(3.2, 3.2, 3.2);

        targetCamPos.set(Math.sin(localP * Math.PI) * 4.2, 78 + localP * 2, 14);
        targetCamLook.set(0, 77 + sepProgress * 3.8, 0);

      } else {
        // ==========================================
        // SCENE 06 — MISSION CONTROL & SATELLITE IN STABLE ORBIT
        // ==========================================
        const localP = (p - 0.85) / 0.15;
        exhaustParticles.visible = false;
        combustionLight.intensity = 0;

        // Rocket lower stages safely retired
        rocketAssy.group.position.set(0, -300, 0);

        // Satellite in stable Earth orbit with fully deployed solar wings
        satelliteAssy.group.position.set(Math.sin(localP * Math.PI * 0.4) * 4, 82, Math.cos(localP * Math.PI * 0.4) * 3);
        satelliteAssy.group.rotation.y = Math.PI * 0.5 + localP * 0.5; // Deterministic rotation
        satelliteAssy.leftSolarArray.rotation.z = Math.PI * 0.5;
        satelliteAssy.leftOuterGroup.rotation.z = -Math.PI * 0.95;
        satelliteAssy.rightSolarArray.rotation.z = -Math.PI * 0.5;
        satelliteAssy.rightOuterGroup.rotation.z = Math.PI * 0.95;

        // Planetary backdrop at bottom left away from contact form
        earthAssy.group.position.set(-30, 10, -50);
        earthAssy.group.scale.set(3.5, 3.5, 3.5);

        targetCamPos.set(0, 84, 18);
        targetCamLook.set(0, 82, 0);
      }

      // Smooth camera damping
      camera.position.lerp(targetCamPos, 0.08);
      currentLookAt.lerp(targetCamLook, 0.08);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
