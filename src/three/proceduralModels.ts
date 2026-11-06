import * as THREE from 'three';
import {
  createEarthTexture,
  createEarthCloudTexture,
  createGoldFoilTexture,
  createSolarPanelTexture,
  createParticleGlowTexture
} from './proceduralTextures';

export interface EarthObject {
  group: THREE.Group;
  earthMesh: THREE.Mesh;
  cloudsMesh: THREE.Mesh;
  atmosphereMesh: THREE.Mesh;
}

export interface RocketObject {
  group: THREE.Group;
  boosters: THREE.Group[];
  stage1: THREE.Mesh;
  stage2: THREE.Mesh;
  payloadBay: THREE.Group;
  leftDoor: THREE.Mesh;
  rightDoor: THREE.Mesh;
  thrustersGroup: THREE.Group;
}

export interface SatelliteObject {
  group: THREE.Group;
  chassis: THREE.Mesh;
  dish: THREE.Mesh;
  leftSolarArray: THREE.Group;
  rightSolarArray: THREE.Group;
}

/**
 * Creates Earth with continents, rotating cloud layer, and physical atmospheric rim glow.
 */
export function createEarthAssembly(): EarthObject {
  const group = new THREE.Group();
  group.name = "EarthAssembly";

  // Earth radius baseline
  const earthRadius = 15;

  // Earth Mesh
  const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
  const earthTex = createEarthTexture();
  const earthMat = new THREE.MeshStandardMaterial({
    map: earthTex,
    roughness: 0.65,
    metalness: 0.1
  });
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthMesh.castShadow = true;
  earthMesh.receiveShadow = true;
  group.add(earthMesh);

  // Clouds Mesh
  const cloudGeo = new THREE.SphereGeometry(earthRadius + 0.18, 64, 64);
  const cloudTex = createEarthCloudTexture();
  const cloudMat = new THREE.MeshStandardMaterial({
    map: cloudTex,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
  group.add(cloudsMesh);

  // Atmosphere Glow Shell
  const atmoGeo = new THREE.SphereGeometry(earthRadius + 0.6, 48, 48);
  const atmoMat = new THREE.MeshBasicMaterial({
    color: 0x70C7FF,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
  group.add(atmosphereMesh);

  return { group, earthMesh, cloudsMesh, atmosphereMesh };
}

/**
 * Creates Launchpad structure at launch site.
 */
export function createLaunchpadAssembly(): THREE.Group {
  const group = new THREE.Group();
  group.name = "LaunchpadAssembly";

  // Concrete launch base
  const baseGeo = new THREE.CylinderGeometry(6, 7, 1.2, 8);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1E293B,
    roughness: 0.9,
    metalness: 0.2
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -0.6;
  base.receiveShadow = true;
  group.add(base);

  // Structural Tower
  const towerGeo = new THREE.BoxGeometry(1.5, 12, 1.5);
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.4,
    metalness: 0.7
  });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.set(-3.5, 5.4, 0);
  tower.castShadow = true;
  group.add(tower);

  // Umbilical Arm
  const armGeo = new THREE.BoxGeometry(2.5, 0.4, 0.4);
  const armMat = new THREE.MeshStandardMaterial({ color: 0x70C7FF, metalness: 0.8, roughness: 0.3 });
  const arm1 = new THREE.Mesh(armGeo, armMat);
  arm1.position.set(-1.8, 8, 0);
  group.add(arm1);

  const arm2 = arm1.clone();
  arm2.position.set(-1.8, 4, 0);
  group.add(arm2);

  return group;
}

/**
 * Creates a photorealistic multi-part Space Rocket launch vehicle.
 */
export function createRocketAssembly(): RocketObject {
  const group = new THREE.Group();
  group.name = "RocketAssembly";

  // Core Stage 1 Rocket Body
  const stage1Geo = new THREE.CylinderGeometry(0.8, 0.85, 8, 32);
  const whiteMetalMat = new THREE.MeshStandardMaterial({
    color: 0xF8FAFC,
    metalness: 0.35,
    roughness: 0.25
  });
  const stage1 = new THREE.Mesh(stage1Geo, whiteMetalMat);
  stage1.position.y = 4;
  stage1.castShadow = true;
  group.add(stage1);

  // Dark metallic accent ring & USA stripe
  const stripeGeo = new THREE.CylinderGeometry(0.81, 0.81, 1.2, 32);
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.8, roughness: 0.2 });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.y = 5.5;
  group.add(stripe);

  // 4 Outer Side Boosters
  const boosters: THREE.Group[] = [];
  const boosterAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  const boosterDist = 1.15;

  boosterAngles.forEach((angle, idx) => {
    const boosterGroup = new THREE.Group();
    boosterGroup.name = `Booster_${idx}`;

    const bBodyGeo = new THREE.CylinderGeometry(0.4, 0.42, 5.5, 24);
    const bBody = new THREE.Mesh(bBodyGeo, whiteMetalMat);
    bBody.position.y = 2.75;
    bBody.castShadow = true;
    boosterGroup.add(bBody);

    // Booster Nose Cone
    const bConeGeo = new THREE.ConeGeometry(0.4, 1.2, 24);
    const bConeMat = new THREE.MeshStandardMaterial({ color: 0x70C7FF, metalness: 0.5, roughness: 0.3 });
    const bCone = new THREE.Mesh(bConeGeo, bConeMat);
    bCone.position.y = 6.1;
    boosterGroup.add(bCone);

    // Booster Nozzle
    const bNozzleGeo = new THREE.ConeGeometry(0.3, 0.7, 16);
    const bNozzleMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.9, roughness: 0.1 });
    const bNozzle = new THREE.Mesh(bNozzleGeo, bNozzleMat);
    bNozzle.rotation.x = Math.PI;
    bNozzle.position.y = -0.35;
    boosterGroup.add(bNozzle);

    boosterGroup.position.set(Math.cos(angle) * boosterDist, 0, Math.sin(angle) * boosterDist);
    group.add(boosterGroup);
    boosters.push(boosterGroup);
  });

  // Stage 2 Upper Body & Payload Fairing Container
  const stage2Geo = new THREE.CylinderGeometry(0.75, 0.8, 3.5, 32);
  const stage2 = new THREE.Mesh(stage2Geo, whiteMetalMat);
  stage2.position.y = 9.75;
  stage2.castShadow = true;
  group.add(stage2);

  // Payload Bay Doors (Left & Right)
  const payloadBay = new THREE.Group();
  payloadBay.position.y = 12.25;

  const doorGeo = new THREE.CylinderGeometry(0.76, 0.76, 3, 32, 1, false, 0, Math.PI);
  const doorMat = new THREE.MeshStandardMaterial({
    color: 0xE2E8F0,
    metalness: 0.6,
    roughness: 0.2
  });

  const leftDoor = new THREE.Mesh(doorGeo, doorMat);
  leftDoor.position.set(0, 0, 0);
  leftDoor.castShadow = true;
  payloadBay.add(leftDoor);

  const rightDoor = new THREE.Mesh(doorGeo, doorMat);
  rightDoor.rotation.y = Math.PI;
  rightDoor.castShadow = true;
  payloadBay.add(rightDoor);

  group.add(payloadBay);

  // Aerodynamic Nose Fairing Tip
  const noseGeo = new THREE.ConeGeometry(0.75, 1.8, 32);
  const noseMat = new THREE.MeshStandardMaterial({ color: 0x70C7FF, metalness: 0.8, roughness: 0.2 });
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.position.y = 14.4;
  group.add(nose);

  // Grid Fins (4 fins near top of stage 1)
  const finGeo = new THREE.BoxGeometry(0.08, 0.4, 0.5);
  const finMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.3 });
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeo, finMat);
    const a = (i * Math.PI) / 2;
    fin.position.set(Math.cos(a) * 0.9, 7.5, Math.sin(a) * 0.9);
    fin.rotation.y = a;
    group.add(fin);
  }

  // Thruster Group (Flame glow base)
  const thrustersGroup = new THREE.Group();
  thrustersGroup.position.y = 0;
  group.add(thrustersGroup);

  return {
    group,
    boosters,
    stage1,
    stage2,
    payloadBay,
    leftDoor,
    rightDoor,
    thrustersGroup
  };
}

/**
 * Creates photorealistic Satellite with deployable solar panel arrays.
 */
export function createSatelliteAssembly(): SatelliteObject {
  const group = new THREE.Group();
  group.name = "SatelliteAssembly";

  // Main Satellite Body Chassis (Gold foil insulation)
  const chassisGeo = new THREE.BoxGeometry(1.4, 1.4, 2.0);
  const goldTex = createGoldFoilTexture();
  const chassisMat = new THREE.MeshStandardMaterial({
    map: goldTex,
    metalness: 0.95,
    roughness: 0.15,
    color: 0xFFD700
  });
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.castShadow = true;
  group.add(chassis);

  // High Gain Communication Dish
  const dishGeo = new THREE.CylinderGeometry(0.8, 0.1, 0.3, 24);
  const dishMat = new THREE.MeshStandardMaterial({ color: 0xF8FAFC, metalness: 0.9, roughness: 0.1 });
  const dish = new THREE.Mesh(dishGeo, dishMat);
  dish.rotation.x = Math.PI / 2;
  dish.position.set(0, 1.0, 0);
  dish.castShadow = true;
  group.add(dish);

  // Antenna Feed
  const feedGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 12);
  const feedMat = new THREE.MeshStandardMaterial({ color: 0x70C7FF, metalness: 0.9 });
  const feed = new THREE.Mesh(feedGeo, feedMat);
  feed.position.set(0, 1.3, 0);
  group.add(feed);

  // Solar Panel Arrays (Left & Right)
  const solarTex = createSolarPanelTexture();
  const solarMat = new THREE.MeshStandardMaterial({
    map: solarTex,
    metalness: 0.8,
    roughness: 0.2,
    side: THREE.DoubleSide
  });

  // Left Solar Array Pivot Group
  const leftSolarArray = new THREE.Group();
  leftSolarArray.position.set(-0.7, 0, 0);

  const panelGeo = new THREE.BoxGeometry(1.6, 0.05, 0.8);
  const leftP1 = new THREE.Mesh(panelGeo, solarMat);
  leftP1.position.set(-0.8, 0, 0);
  leftP1.castShadow = true;
  leftSolarArray.add(leftP1);

  const leftP2 = new THREE.Mesh(panelGeo, solarMat);
  leftP2.position.set(-2.5, 0, 0);
  leftP2.castShadow = true;
  leftSolarArray.add(leftP2);

  group.add(leftSolarArray);

  // Right Solar Array Pivot Group
  const rightSolarArray = new THREE.Group();
  rightSolarArray.position.set(0.7, 0, 0);

  const rightP1 = new THREE.Mesh(panelGeo, solarMat);
  rightP1.position.set(0.8, 0, 0);
  rightP1.castShadow = true;
  rightSolarArray.add(rightP1);

  const rightP2 = new THREE.Mesh(panelGeo, solarMat);
  rightP2.position.set(2.5, 0, 0);
  rightP2.castShadow = true;
  rightSolarArray.add(rightP2);

  group.add(rightSolarArray);

  return {
    group,
    chassis,
    dish,
    leftSolarArray,
    rightSolarArray
  };
}

/**
 * Creates orbital starfield particles.
 */
export function createStarfield(): THREE.Points {
  const count = 1200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Distribute in sphere
    const r = 80 + Math.random() * 150;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    // Subtle blue/cyan/white star tints
    const tint = Math.random();
    colors[i * 3] = 0.7 + tint * 0.3; // R
    colors[i * 3 + 1] = 0.8 + tint * 0.2; // G
    colors[i * 3 + 2] = 1.0; // B
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  return new THREE.Points(geometry, material);
}

/**
 * Creates engine exhaust flame & smoke particle generator mesh.
 */
export function createExhaustParticleSystem(): THREE.Points {
  const count = 300;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.4;
    positions[i * 3 + 1] = -Math.random() * 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    sizes[i] = Math.random() * 0.8 + 0.2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleTex = createParticleGlowTexture();
  const material = new THREE.PointsMaterial({
    size: 0.6,
    map: particleTex,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}
