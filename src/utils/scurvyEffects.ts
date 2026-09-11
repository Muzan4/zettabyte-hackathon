import type { PirateSkills } from '../types';

export interface ScurvyPenalties {
  penalties: Partial<PirateSkills>;
  tier: 0 | 1 | 2 | 3;
  tierLabel: string;
  tierColor: string;
  nonDeployable: boolean;
}

export function getScurvyPenalties(scurvyLevel: number): ScurvyPenalties {
  if (scurvyLevel <= 25) {
    return {
      penalties: {},
      tier: 0,
      tierLabel: 'Healthy',
      tierColor: '#10b981',
      nonDeployable: false,
    };
  } else if (scurvyLevel <= 50) {
    return {
      penalties: { swordsmanship: -10, rigging: -15 },
      tier: 1,
      tierLabel: 'Bleeding Gums',
      tierColor: '#f59e0b',
      nonDeployable: false,
    };
  } else if (scurvyLevel <= 75) {
    return {
      penalties: {
        swordsmanship: -30,
        gunnery: -30,
        navigation: -30,
        rigging: -30,
        stealth: -30,
        medicine: -30,
      },
      tier: 2,
      tierLabel: 'Severe Lethargy',
      tierColor: '#ef4444',
      nonDeployable: false,
    };
  } else {
    return {
      penalties: {
        swordsmanship: -100,
        gunnery: -100,
        navigation: -100,
        rigging: -100,
        stealth: -100,
        medicine: -100,
      },
      tier: 3,
      tierLabel: 'Bedridden',
      tierColor: '#7f1d1d',
      nonDeployable: true,
    };
  }
}

export function applyScurvyToSkills(skills: PirateSkills, scurvyLevel: number): PirateSkills {
  const { penalties } = getScurvyPenalties(scurvyLevel);
  return {
    swordsmanship: Math.max(0, skills.swordsmanship + (penalties.swordsmanship ?? 0)),
    gunnery: Math.max(0, skills.gunnery + (penalties.gunnery ?? 0)),
    navigation: Math.max(0, skills.navigation + (penalties.navigation ?? 0)),
    rigging: Math.max(0, skills.rigging + (penalties.rigging ?? 0)),
    stealth: Math.max(0, skills.stealth + (penalties.stealth ?? 0)),
    medicine: Math.max(0, skills.medicine + (penalties.medicine ?? 0)),
  };
}
