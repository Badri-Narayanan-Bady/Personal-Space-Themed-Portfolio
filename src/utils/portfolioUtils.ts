import { skillCategories } from '../data/skills';
import { projectsData } from '../data/projects';

export interface MissionPhase {
  id: number;
  code: string;
  name: string;
  status: string;
  telemetry: string;
  scrollRange: [number, number]; // Normalized scroll progress 0.0 to 1.0
}

export const MISSION_PHASES: MissionPhase[] = [
  { id: 1, code: "SCENE_01", name: "LAUNCH: INTRODUCTION", status: "LAUNCHPAD STANDBY", telemetry: "ALT: 000 KM | VEL: 0.00 KM/S", scrollRange: [0.0, 0.16] },
  { id: 2, code: "SCENE_02", name: "IGNITION: PHILOSOPHY", status: "STAGE 1 IGNITION", telemetry: "ALT: 045 KM | VEL: 1.85 KM/S", scrollRange: [0.16, 0.33] },
  { id: 3, code: "SCENE_03", name: "ASCENT: CAPABILITIES", status: "ATMOSPHERIC ASCENT", telemetry: "ALT: 120 KM | VEL: 4.50 KM/S", scrollRange: [0.33, 0.50] },
  { id: 4, code: "SCENE_04", name: "ORBIT: PROJECTS", status: "ORBITAL INSERTION", telemetry: "ALT: 400 KM | VEL: 7.66 KM/S", scrollRange: [0.50, 0.70] },
  { id: 5, code: "SCENE_05", name: "DEPLOYMENT: PROOF", status: "SATELLITE DEPLOYED", telemetry: "ALT: 420 KM | VEL: 7.68 KM/S", scrollRange: [0.70, 0.85] },
  { id: 6, code: "SCENE_06", name: "CONTROL: CONTACT", status: "MISSION CONTROL ACTIVE", telemetry: "ALT: 450 KM | VEL: STABLE ORBIT", scrollRange: [0.85, 1.00] }
];

export function getMissionPhaseFromProgress(progress: number): MissionPhase {
  const clamped = Math.max(0, Math.min(1, progress));
  for (let i = MISSION_PHASES.length - 1; i >= 0; i--) {
    if (clamped >= MISSION_PHASES[i].scrollRange[0]) {
      return MISSION_PHASES[i];
    }
  }
  return MISSION_PHASES[0];
}

export function validateContactForm(data: { name: string; email: string; subject: string; message: string }) {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.subject || data.subject.trim().length < 3) {
    errors.subject = "Subject must be at least 3 characters long.";
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters long.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function getProjectById(id: string) {
  return projectsData.find(p => p.id === id);
}

export function filterSkillsByCategory(categoryCode: string) {
  if (!categoryCode || categoryCode === 'ALL') {
    return skillCategories.flatMap(c => c.skills);
  }
  const match = skillCategories.find(c => c.code === categoryCode || c.id === categoryCode);
  return match ? match.skills : [];
}
