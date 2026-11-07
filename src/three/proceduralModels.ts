import * as THREE from 'three';
import {
  createEarthTexture,
  createEarthSpecularMap,
  createEarthCloudTexture,
  createMachDiamondTexture,
  createSmokeBillowTexture,
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
  plumeCore: THREE.Mesh;
  plumeBell: THREE.Mesh;
  machDiamondsGroup: THREE.Group;
}

export interface SatelliteObject {
  group: THREE.Group;
  chassis: THREE.Mesh;
  dish: THREE.Mesh;
  leftSolarArray: THREE.Group;
  leftOuterGroup: THREE.Group;
  rightSolarArray: THREE.Group;
  rightOuterGroup: THREE.Group;
}

export interface LaunchpadObject {
  group: THREE.Group;
  smokeGroup: THREE.Group;
  smokeClouds: THREE.Mesh[];
}

/**
 * Creates Earth with 4K procedural albedo, ocean specular mask, rotating clouds,
 * and physical multi-layer Rayleigh atmospheric rim glow.
 */
export function createEarthAssembly(): EarthObject {
  const group = new THREE.Group();
  group.name = "EarthAssembly";

  const earthRadius = 15;

  // Earth Surface Mesh with Specular Ocean Mask
  const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
  const earthTex = createEarthTexture();
  const earthSpecMap = createEarthSpecularMap();

  const earthMat = new THREE.MeshStandardMaterial({
    map: earthTex,
    roughnessMap: earthSpecMap,
    roughness: 0.75, // Land is matte
    metalness: 0.15, // Oceans reflect directional sunlight
  });

  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthMesh.castShadow = true;
  earthMesh.receiveShadow = true;
  group.add(earthMesh);

  // Rotating Cloud Layer
  const cloudGeo = new THREE.SphereGeometry(earthRadius + 0.16, 64, 64);
  const cloudTex = createEarthCloudTexture();
  const cloudMat = new THREE.MeshStandardMaterial({
    map: cloudTex,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
  group.add(cloudsMesh);

  // Atmospheric Scattering Rim Shell (Rayleigh blue)
  const atmoGeo = new THREE.SphereGeometry(earthRadius + 0.65, 48, 48);
  const atmoMat = new THREE.MeshBasicMaterial({
    color: 0x8CAFCB, // Brand atmospheric blue
    transparent: true,
    opacity: 0.24,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
  group.add(atmosphereMesh);

  return { group, earthMesh, cloudsMesh, atmosphereMesh };
}

/**
 * Creates Launchpad structural assembly with hold-down clamps,
 * cryogenic umbilical tower, flame deflector trench, and 3D rolling smoke system.
 */
export function createLaunchpadAssembly(): LaunchpadObject {
  const group = new THREE.Group();
  group.name = "LaunchpadAssembly";

  // Octagonal concrete launch table
  const baseGeo = new THREE.CylinderGeometry(6, 7.5, 1.4, 8);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1E293B,
    roughness: 0.88,
    metalness: 0.2
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -0.7;
  base.receiveShadow = true;
  group.add(base);

  // Deep flame deflector trench (opening beneath rocket engine bells)
  const trenchGeo = new THREE.BoxGeometry(4.5, 1.6, 9);
  const trenchMat = new THREE.MeshStandardMaterial({ color: 0x090D16, roughness: 0.95 });
  const trench = new THREE.Mesh(trenchGeo, trenchMat);
  trench.position.set(0, -0.8, 0);
  group.add(trench);

  // Structural Umbilical Service Tower (Steel lattice structure positioned right/rear of vehicle)
  const towerGeo = new THREE.BoxGeometry(1.6, 13.5, 1.6);
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.45,
    metalness: 0.75
  });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.set(3.4, 6.0, -0.8);
  tower.castShadow = true;
  group.add(tower);

  // Swing Arms / Umbilical propellant connections from tower to rocket core
  const armMat = new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.8, roughness: 0.3 });
  const arm1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 0.35), armMat);
  arm1.position.set(1.9, 8.5, -0.4);
  group.add(arm1);

  const arm2 = arm1.clone();
  arm2.position.set(1.9, 4.5, -0.4);
  group.add(arm2);

  // Hold-down clamp arms at base of vehicle
  const clampMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.7, roughness: 0.3 });
  for (let i = 0; i < 4; i++) {
    const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.3), clampMat);
    const angle = (i * Math.PI) / 2;
    clamp.position.set(Math.cos(angle) * 1.0, 0.3, Math.sin(angle) * 1.0);
    group.add(clamp);
  }

  // 3D Volumetric-Style Rolling Launchpad Smoke Billow System
  const smokeGroup = new THREE.Group();
  smokeGroup.name = "LaunchpadSmokeGroup";
  smokeGroup.position.set(0, 0, 0);

  const smokeClouds: THREE.Mesh[] = [];
  const smokeTex = createSmokeBillowTexture();
  const smokeMat = new THREE.MeshStandardMaterial({
    map: smokeTex,
    transparent: true,
    opacity: 0,
    roughness: 1.0,
    depthWrite: false
  });

  // 12 3D smoke puffs arranged in expanding concentric radii around flame trench
  for (let i = 0; i < 12; i++) {
    const radius = 2.2 + (i % 3) * 1.8;
    const angle = (i / 12) * Math.PI * 2;
    const size = 1.6 + (i % 4) * 0.5;

    const puffGeo = new THREE.SphereGeometry(size, 8, 8);
    const puff = new THREE.Mesh(puffGeo, smokeMat.clone());
    puff.position.set(Math.cos(angle) * radius, 0.2 + (i % 2) * 0.4, Math.sin(angle) * radius);
    smokeClouds.push(puff);
    smokeGroup.add(puff);
  }

  group.add(smokeGroup);

  return { group, smokeGroup, smokeClouds };
}

/**
 * Creates the ORBIT Heavy Aerospace Launch Vehicle:
 * A coherent, realistic Heavy Lift Launch System comprising:
 * 1. Central Core Stage with 9-Engine Octaweb cluster and 4 titanium grid fins.
 * 2. Two Lateral Strap-on Boosters (Left and Right) with ogive nosecones and aft nozzles.
 * 3. Vented Interstage, Upper Stage vacuum engine, and clamshell payload fairings.
 */
export function createRocketAssembly(): RocketObject {
  const group = new THREE.Group();
  group.name = "ORBIT_Heavy_Launch_Vehicle";

  const whiteMetalMat = new THREE.MeshStandardMaterial({
    color: 0xF8FAFC,
    metalness: 0.35,
    roughness: 0.22
  });

  const darkAlloyMat = new THREE.MeshStandardMaterial({
    color: 0x0F172A,
    metalness: 0.85,
    roughness: 0.25
  });

  const engineMat = new THREE.MeshStandardMaterial({
    color: 0x1E293B,
    metalness: 0.95,
    roughness: 0.12
  });

  // CENTRAL CORE STAGE 1 BODY
  const stage1Geo = new THREE.CylinderGeometry(0.82, 0.85, 8.2, 32);
  const stage1 = new THREE.Mesh(stage1Geo, whiteMetalMat);
  stage1.position.y = 4.1;
  stage1.castShadow = true;
  group.add(stage1);

  // Core Stage Avionics & Separation Stripe
  const stripeGeo = new THREE.CylinderGeometry(0.83, 0.83, 0.8, 32);
  const stripe = new THREE.Mesh(stripeGeo, darkAlloyMat);
  stripe.position.y = 5.8;
  group.add(stripe);

  // 9-ENGINE OCTAWEB CLUSTER at Center Core Base (1 center + 8 perimeter nozzles)
  const nozzleGeo = new THREE.ConeGeometry(0.19, 0.55, 16);
  for (let i = 0; i < 9; i++) {
    const nozzle = new THREE.Mesh(nozzleGeo, engineMat);
    nozzle.rotation.x = Math.PI;
    if (i === 0) {
      nozzle.position.set(0, -0.28, 0); // Center gimbaled engine
    } else {
      const angle = ((i - 1) * Math.PI) / 4;
      nozzle.position.set(Math.cos(angle) * 0.48, -0.28, Math.sin(angle) * 0.48);
    }
    group.add(nozzle);
  }

  // 4 TITANIUM LATTICE GRID FINS (at top of Stage 1 for aerodynamic guidance)
  const finGeo = new THREE.BoxGeometry(0.08, 0.42, 0.55);
  const finMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.92, roughness: 0.28 });
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeo, finMat);
    const a = (i * Math.PI) / 2;
    fin.position.set(Math.cos(a) * 0.92, 7.8, Math.sin(a) * 0.92);
    fin.rotation.y = a;
    group.add(fin);
  }

  // TWO LATERAL LIQUID STRAP-ON BOOSTERS (Left: x = -1.35, Right: x = +1.35)
  // Resolves the architectural inconsistency into a real-world Heavy Lift configuration!
  const boosters: THREE.Group[] = [];
  const boosterXPositions = [-1.35, 1.35];

  boosterXPositions.forEach((posX, idx) => {
    const boosterGroup = new THREE.Group();
    boosterGroup.name = `LateralBooster_${idx === 0 ? 'Left' : 'Right'}`;

    // Booster Fuselage
    const bBodyGeo = new THREE.CylinderGeometry(0.55, 0.58, 6.8, 24);
    const bBody = new THREE.Mesh(bBodyGeo, whiteMetalMat);
    bBody.position.y = 3.4;
    bBody.castShadow = true;
    boosterGroup.add(bBody);

    // Aerodynamic Slanted Nose Cone
    const bConeGeo = new THREE.ConeGeometry(0.55, 1.6, 24);
    const bCone = new THREE.Mesh(bConeGeo, whiteMetalMat);
    bCone.position.y = 7.6;
    bCone.rotation.z = idx === 0 ? 0.08 : -0.08; // Slanted aerodynamically outward
    boosterGroup.add(bCone);

    // Forward Cold-Gas Separation Thruster Pod
    const podGeo = new THREE.BoxGeometry(0.12, 0.3, 0.12);
    const pod = new THREE.Mesh(podGeo, darkAlloyMat);
    pod.position.set(idx === 0 ? -0.58 : 0.58, 7.2, 0);
    boosterGroup.add(pod);

    // Booster Nozzle Base
    const bNozzleGeo = new THREE.ConeGeometry(0.32, 0.7, 16);
    const bNozzle = new THREE.Mesh(bNozzleGeo, engineMat);
    bNozzle.rotation.x = Math.PI;
    bNozzle.position.y = -0.35;
    boosterGroup.add(bNozzle);

    // Structural Attachment Pylons to Center Core
    const pylonGeo = new THREE.BoxGeometry(0.35, 0.2, 0.2);
    const pylonTop = new THREE.Mesh(pylonGeo, darkAlloyMat);
    pylonTop.position.set(idx === 0 ? 0.45 : -0.45, 6.2, 0);
    boosterGroup.add(pylonTop);

    const pylonBottom = pylonTop.clone();
    pylonBottom.position.y = 1.2;
    boosterGroup.add(pylonBottom);

    boosterGroup.position.set(posX, 0, 0);
    group.add(boosterGroup);
    boosters.push(boosterGroup);
  });

  // VENTED INTERSTAGE (Connects Stage 1 to Stage 2 with hot-staging vents)
  const interstageGeo = new THREE.CylinderGeometry(0.8, 0.82, 1.2, 32);
  const interstage = new THREE.Mesh(interstageGeo, darkAlloyMat);
  interstage.position.y = 8.8;
  group.add(interstage);

  // STAGE 2 UPPER BODY & VACUUM ENGINE
  const stage2Geo = new THREE.CylinderGeometry(0.78, 0.8, 3.2, 32);
  const stage2 = new THREE.Mesh(stage2Geo, whiteMetalMat);
  stage2.position.y = 10.8;
  stage2.castShadow = true;
  group.add(stage2);

  // Vacuum Engine Nozzle (Extends down inside interstage)
  const vacNozzleGeo = new THREE.ConeGeometry(0.42, 0.9, 24);
  const vacNozzle = new THREE.Mesh(vacNozzleGeo, engineMat);
  vacNozzle.rotation.x = Math.PI;
  vacNozzle.position.y = 8.7;
  group.add(vacNozzle);

  // PAYLOAD FAIRING CONTAINER & DOORS
  const payloadBay = new THREE.Group();
  payloadBay.position.y = 12.4;

  const doorGeo = new THREE.CylinderGeometry(0.79, 0.79, 3.2, 32, 1, false, 0, Math.PI);
  const doorMat = new THREE.MeshStandardMaterial({
    color: 0xF1F5F9,
    metalness: 0.5,
    roughness: 0.2
  });

  const leftDoor = new THREE.Mesh(doorGeo, doorMat);
  leftDoor.castShadow = true;
  payloadBay.add(leftDoor);

  const rightDoor = new THREE.Mesh(doorGeo, doorMat);
  rightDoor.rotation.y = Math.PI;
  rightDoor.castShadow = true;
  payloadBay.add(rightDoor);

  group.add(payloadBay);

  // Aerodynamic Biconic Nose Tip
  const noseGeo = new THREE.ConeGeometry(0.78, 1.9, 32);
  const nose = new THREE.Mesh(noseGeo, doorMat);
  nose.position.y = 14.8;
  group.add(nose);

  // SUPERSONIC COMBUSTION PLUME ASSEMBLY
  const thrustersGroup = new THREE.Group();
  thrustersGroup.position.y = 0;

  // 1. Incandescent Mach Diamond Core
  const plumeTex = createMachDiamondTexture();
  const plumeCoreGeo = new THREE.CylinderGeometry(0.2, 0.65, 4.2, 16, 1, true);
  const plumeCoreMat = new THREE.MeshBasicMaterial({
    map: plumeTex,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const plumeCore = new THREE.Mesh(plumeCoreGeo, plumeCoreMat);
  plumeCore.position.y = -2.1;
  thrustersGroup.add(plumeCore);

  // 2. Expanding Supersonic Exhaust Bell (expands with altitude)
  const plumeBellGeo = new THREE.ConeGeometry(1.2, 5.5, 24, 1, true);
  const plumeBellMat = new THREE.MeshBasicMaterial({
    color: 0xFF6A00,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
  });
  const plumeBell = new THREE.Mesh(plumeBellGeo, plumeBellMat);
  plumeBell.position.y = -2.75;
  thrustersGroup.add(plumeBell);

  // 3. Mach Diamond Shock Nodes Group
  const machDiamondsGroup = new THREE.Group();
  const diamondGeo = new THREE.OctahedronGeometry(0.18, 0);
  const diamondMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });

  for (let i = 0; i < 4; i++) {
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.y = -0.6 - i * 0.9;
    diamond.scale.set(1.0 - i * 0.15, 1.4 - i * 0.2, 1.0 - i * 0.15);
    machDiamondsGroup.add(diamond);
  }
  thrustersGroup.add(machDiamondsGroup);

  group.add(thrustersGroup);

  return {
    group,
    boosters,
    stage1,
    stage2,
    payloadBay,
    leftDoor,
    rightDoor,
    thrustersGroup,
    plumeCore,
    plumeBell,
    machDiamondsGroup
  };
}

/**
 * Creates high-detail aerospace satellite spacecraft with Kapton insulation,
 * high-gain dish, dual RCS pods, and 2-stage deployable solar arrays.
 */
export function createSatelliteAssembly(): SatelliteObject {
  const group = new THREE.Group();
  group.name = "SatelliteSpacecraft";

  // Spacecraft Bus Chassis (Kapton Gold Thermal Foil)
  const chassisGeo = new THREE.BoxGeometry(1.35, 1.35, 1.9);
  const goldTex = createGoldFoilTexture();
  const chassisMat = new THREE.MeshStandardMaterial({
    map: goldTex,
    metalness: 0.95,
    roughness: 0.16,
    color: 0xFFD700
  });
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.castShadow = true;
  group.add(chassis);

  // Silver Optical Solar Reflector Trim Panels
  const trimGeo = new THREE.BoxGeometry(1.38, 0.18, 1.92);
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xF1F5F9, metalness: 0.92, roughness: 0.18 });
  const trimTop = new THREE.Mesh(trimGeo, silverMat);
  trimTop.position.y = 0.58;
  group.add(trimTop);

  const trimBottom = new THREE.Mesh(trimGeo, silverMat);
  trimBottom.position.y = -0.58;
  group.add(trimBottom);

  // High-Gain Communication Dish & Feed Horn
  const dishGeo = new THREE.CylinderGeometry(0.82, 0.12, 0.3, 24);
  const dishMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.88, roughness: 0.15 });
  const dish = new THREE.Mesh(dishGeo, dishMat);
  dish.rotation.x = Math.PI / 2;
  dish.position.set(0, 0.95, 0);
  dish.castShadow = true;
  group.add(dish);

  // Antenna Feed Horn Mast & Struts
  const feedGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.75, 12);
  const feedMat = new THREE.MeshStandardMaterial({ color: 0x8CAFCB, metalness: 0.9 });
  const feed = new THREE.Mesh(feedGeo, feedMat);
  feed.position.set(0, 1.28, 0);
  group.add(feed);

  // 4 Reaction Control Thruster (RCS) pods for 3-axis attitude control
  const rcsMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
  const rcsGeo = new THREE.ConeGeometry(0.06, 0.15, 8);
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const rcs = new THREE.Mesh(rcsGeo, rcsMat);
    rcs.position.set(Math.cos(angle) * 0.7, 0, Math.sin(angle) * 0.7);
    rcs.rotation.z = Math.cos(angle) * (Math.PI / 2);
    group.add(rcs);
  }

  // 2-STAGE DEPLOYABLE SOLAR PANEL WINGS (Accordion Hinges)
  const solarTex = createSolarPanelTexture();
  const solarMat = new THREE.MeshStandardMaterial({
    map: solarTex,
    metalness: 0.85,
    roughness: 0.22,
    side: THREE.DoubleSide
  });

  const hingeMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.95 });
  const panelGeo = new THREE.BoxGeometry(1.45, 0.04, 0.78);

  // LEFT SOLAR ARRAY (Inner hinge at bus chassis x = -0.68)
  const leftSolarArray = new THREE.Group();
  leftSolarArray.position.set(-0.68, 0, 0);

  const leftHinge1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.38, 12), hingeMat);
  leftHinge1.rotation.z = Math.PI / 2;
  leftSolarArray.add(leftHinge1);

  const leftInner = new THREE.Mesh(panelGeo, solarMat);
  leftInner.position.set(-0.73, 0, 0);
  leftInner.castShadow = true;
  leftSolarArray.add(leftInner);

  // Left Outer Panel (Hinged at outer edge of inner panel x = -1.45)
  const leftOuterGroup = new THREE.Group();
  leftOuterGroup.position.set(-1.45, 0, 0);

  const leftHinge2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.38, 12), hingeMat);
  leftHinge2.rotation.z = Math.PI / 2;
  leftOuterGroup.add(leftHinge2);

  const leftOuter = new THREE.Mesh(panelGeo, solarMat);
  leftOuter.position.set(-0.73, 0, 0);
  leftOuter.castShadow = true;
  leftOuterGroup.add(leftOuter);

  leftSolarArray.add(leftOuterGroup);
  group.add(leftSolarArray);

  // RIGHT SOLAR ARRAY (Inner hinge at bus chassis x = +0.68)
  const rightSolarArray = new THREE.Group();
  rightSolarArray.position.set(0.68, 0, 0);

  const rightHinge1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.38, 12), hingeMat);
  rightHinge1.rotation.z = Math.PI / 2;
  rightSolarArray.add(rightHinge1);

  const rightInner = new THREE.Mesh(panelGeo, solarMat);
  rightInner.position.set(0.73, 0, 0);
  rightInner.castShadow = true;
  rightSolarArray.add(rightInner);

  // Right Outer Panel (Hinged at outer edge of inner panel x = +1.45)
  const rightOuterGroup = new THREE.Group();
  rightOuterGroup.position.set(1.45, 0, 0);

  const rightHinge2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.38, 12), hingeMat);
  rightHinge2.rotation.z = Math.PI / 2;
  rightOuterGroup.add(rightHinge2);

  const rightOuter = new THREE.Mesh(panelGeo, solarMat);
  rightOuter.position.set(0.73, 0, 0);
  rightOuter.castShadow = true;
  rightOuterGroup.add(rightOuter);

  rightSolarArray.add(rightOuterGroup);
  group.add(rightSolarArray);

  return {
    group,
    chassis,
    dish,
    leftSolarArray,
    leftOuterGroup,
    rightSolarArray,
    rightOuterGroup
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
    const r = 80 + Math.random() * 150;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const tint = Math.random();
    colors[i * 3] = 0.75 + tint * 0.25;
    colors[i * 3 + 1] = 0.85 + tint * 0.15;
    colors[i * 3 + 2] = 1.0;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.75,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  return new THREE.Points(geometry, material);
}

/**
 * Creates engine exhaust trailing particle sparks.
 */
export function createExhaustParticleSystem(): THREE.Points {
  const count = 350;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 1] = -Math.random() * 5.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleTex = createParticleGlowTexture();
  const material = new THREE.PointsMaterial({
    size: 0.55,
    map: particleTex,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}
