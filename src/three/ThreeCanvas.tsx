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
  SatelliteObject
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
    scene.fog = new THREE.FogExp2(0x030407, 0.004);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
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
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio environment reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting rig
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFF8F0, 2.5); // Sun key light
    keyLight.position.set(20, 30, 20);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const combustionLight = new THREE.PointLight(0xFF6A00, 0, 30); // Dynamic rocket flame orange light
    combustionLight.position.set(0, 0, 0);
    scene.add(combustionLight);

    const fillLight = new THREE.HemisphereLight(0x8CAFCB, 0x080C13, 0.7); // Atmospheric fill
    scene.add(fillLight);

    // Add starfield
    const starfield = createStarfield();
    scene.add(starfield);

    // Add Earth
    const earthAssy: EarthObject = createEarthAssembly();
    earthAssy.group.position.set(0, -15, 0);
    scene.add(earthAssy.group);

    // Add Launchpad
    const launchpad = createLaunchpadAssembly();
    launchpad.position.set(0, 0, 0);
    scene.add(launchpad);

    // Add Rocket
    const rocketAssy: RocketObject = createRocketAssembly();
    rocketAssy.group.position.set(0, 0.2, 0);
    scene.add(rocketAssy.group);

    // Add Exhaust particle system
    const exhaustParticles = createExhaustParticleSystem();
    rocketAssy.thrustersGroup.add(exhaustParticles);
    exhaustParticles.visible = false;

    // Add Satellite inside payload
    const satelliteAssy: SatelliteObject = createSatelliteAssembly();
    satelliteAssy.group.scale.set(0.65, 0.65, 0.65);
    satelliteAssy.group.position.set(0, 12.25, 0);
    rocketAssy.group.add(satelliteAssy.group);

    // Reusable math objects
    const targetCamPos = new THREE.Vector3();
    const targetCamLook = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3(0, 4, 0);

    let animationFrameId: number;

    const renderLoop = () => {
      const p = scrollRef.current; // 0.0 to 1.0

      // Rotate Earth & clouds continuously
      earthAssy.earthMesh.rotation.y += 0.0004;
      earthAssy.cloudsMesh.rotation.y += 0.0006;
      starfield.rotation.y += 0.00008;

      // MISSION SCENE PROGRESSION & DYNAMICS
      if (p < 0.16) {
        // SCENE 01 — LAUNCHPAD STANDBY
        const localP = p / 0.16;
        rocketAssy.group.position.set(0, 0.2, 0);
        launchpad.position.set(0, 0, 0);
        earthAssy.group.position.set(0, -18, 0);
        earthAssy.group.scale.set(1, 1, 1);
        exhaustParticles.visible = false;
        combustionLight.intensity = 0;

        targetCamPos.set(
          Math.sin(localP * Math.PI * 0.5) * 4,
          2.5 + localP * 3,
          14 - localP * 4
        );
        targetCamLook.set(0, 4, 0);

        rocketAssy.leftDoor.rotation.y = 0;
        rocketAssy.rightDoor.rotation.y = Math.PI;

      } else if (p < 0.33) {
        // SCENE 02 — IGNITION & INITIAL LAUNCH
        const localP = (p - 0.16) / 0.17;
        const altitude = Math.pow(localP, 1.8) * 25;

        rocketAssy.group.position.set(0, 0.2 + altitude, 0);
        exhaustParticles.visible = true;

        // Dynamic combustion flame light intensity & sinusoidal pulsation
        combustionLight.position.set(0, 0.2 + altitude, 0);
        const pulse = Math.sin(Date.now() * 0.03) * 0.8;
        combustionLight.intensity = (5 + pulse) * (1 - localP * 0.3);

        exhaustParticles.rotation.y += 0.2;
        exhaustParticles.scale.set(1 + Math.abs(pulse) * 0.2, 1 + localP * 2, 1 + Math.abs(pulse) * 0.2);

        targetCamPos.set(8 - localP * 3, 4 + altitude * 0.8, 12 + localP * 6);
        targetCamLook.set(0, 0.2 + altitude, 0);

      } else if (p < 0.50) {
        // SCENE 03 — ATMOSPHERIC ASCENT & DEEP SPACE TRANSITION
        const localP = (p - 0.33) / 0.17;
        const altitude = 25 + localP * 50;

        rocketAssy.group.position.set(0, 0.2 + altitude, 0);
        rocketAssy.group.rotation.z = localP * 0.3;
        exhaustParticles.visible = true;
        combustionLight.intensity = 2;

        rocketAssy.boosters.forEach((booster, idx) => {
          const sepAngle = (idx * Math.PI) / 2;
          const sepDist = localP * 4;
          booster.position.x = Math.cos(sepAngle) * (1.15 + sepDist);
          booster.position.z = Math.sin(sepAngle) * (1.15 + sepDist);
          booster.rotation.z = localP * 0.5;
        });

        earthAssy.group.position.set(-10, -20 - localP * 25, -localP * 15);

        targetCamPos.set(18 - localP * 8, altitude - 2, 22);
        targetCamLook.set(0, 0.2 + altitude, 0);

      } else if (p < 0.70) {
        // SCENE 04 — ORBITAL INSERTION & PROJECT SHOWCASE
        const localP = (p - 0.50) / 0.20;
        exhaustParticles.visible = false;
        combustionLight.intensity = 0;

        rocketAssy.group.position.set(Math.sin(localP * Math.PI * 0.5) * 8, 75, Math.cos(localP * Math.PI * 0.5) * 4);
        rocketAssy.group.rotation.set(0.1, localP * Math.PI * 0.4, 1.4);

        // Position Earth at left orbital horizon away from center text card
        earthAssy.group.position.set(-25, 20, -45);
        earthAssy.group.scale.set(3.0, 3.0, 3.0);

        targetCamPos.set(0, 76, 16);
        targetCamLook.set(rocketAssy.group.position.x, 75, rocketAssy.group.position.z);

      } else if (p < 0.85) {
        // SCENE 05 — SATELLITE DEPLOYMENT & SOLAR ARRAY EXTENSION
        const localP = (p - 0.70) / 0.15;
        exhaustParticles.visible = false;
        combustionLight.intensity = 0;

        // Sequence: 1. Fairing open (0 to 60%)
        const doorAngle = Math.min(1, localP * 1.6) * (Math.PI * 0.55);
        rocketAssy.leftDoor.rotation.y = doorAngle;
        rocketAssy.rightDoor.rotation.y = Math.PI - doorAngle;

        // Eject satellite (20% to 80%)
        const sepProgress = Math.min(1, Math.max(0, localP - 0.2) * 1.25);
        satelliteAssy.group.position.set(0, 12.25 + sepProgress * 4.5, sepProgress * 2.0);
        satelliteAssy.group.rotation.y = localP * Math.PI * 0.5;
        satelliteAssy.group.scale.set(1.1, 1.1, 1.1);

        // Deploy solar panels (40% to 100%)
        const unfoldAngle = Math.min(1, Math.max(0, localP - 0.4) * 1.6) * (Math.PI * 0.5);
        satelliteAssy.leftSolarArray.rotation.z = unfoldAngle;
        satelliteAssy.rightSolarArray.rotation.z = -unfoldAngle;

        // Position Earth as a dramatic lower orbital backdrop
        earthAssy.group.position.set(-28, 15, -48);
        earthAssy.group.scale.set(3.2, 3.2, 3.2);

        targetCamPos.set(Math.sin(localP * Math.PI) * 5, 78 + localP * 2, 14);
        targetCamLook.set(0, 77 + sepProgress * 3.5, 0);

      } else {
        // SCENE 06 — MISSION CONTROL ACTIVE & DEPLOYED SATELLITE IN STABLE ORBIT
        const localP = (p - 0.85) / 0.15;
        exhaustParticles.visible = false;
        combustionLight.intensity = 0;

        satelliteAssy.group.position.set(Math.sin(localP * Math.PI * 0.4) * 5, 82, Math.cos(localP * Math.PI * 0.4) * 3);
        satelliteAssy.group.rotation.y += 0.004;
        satelliteAssy.leftSolarArray.rotation.z = Math.PI * 0.5;
        satelliteAssy.rightSolarArray.rotation.z = -Math.PI * 0.5;

        // Lower-left Earth position to avoid text background glare
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
