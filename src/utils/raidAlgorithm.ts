import type { Pirate, Mission, RaidSquad, MissionWeights } from '../types';

export function computeReadiness(pirate: Pirate): number {
  const hp = pirate.hp / 100;
  const scurvyPenalty = 1 - pirate.scurvy / 100;
  const moraleFactor = 0.5 + 0.5 * (pirate.morale / 100);
  return hp * scurvyPenalty * moraleFactor;
}

export function computeSuitability(pirate: Pirate, weights: MissionWeights): number {
  const { skills } = pirate;
  const weightedSkill =
    weights.swordsmanship * skills.swordsmanship +
    weights.gunnery * skills.gunnery +
    weights.navigation * skills.navigation +
    weights.rigging * skills.rigging +
    weights.stealth * skills.stealth +
    weights.medicine * skills.medicine;
  return weightedSkill * computeReadiness(pirate);
}

function applyRoleSynergies(squad: Pirate[], baseScore: number): number {
  let bonus = 0;
  const hasGunner = squad.some((p) => p.role === 'Master Gunner');
  const hasMelee = squad.some((p) => p.skills.swordsmanship > 80);
  const hasMedic = squad.some((p) => p.skills.medicine > 70);
  const hasCaptain = squad.some((p) => p.role === 'Captain');

  if (hasGunner && hasMelee) bonus += baseScore * 0.10; // +10% breach bonus
  if (hasMedic) bonus += baseScore * 0.08; // medic reduces expected squad damage
  if (hasCaptain) bonus += baseScore * 0.05; // captain morale boost
  return baseScore + bonus;
}

function computeWinProbability(score: number, partySize: number): number {
  // Normalized win probability (score per pirate, capped at 95%)
  const avgScore = score / partySize;
  const raw = Math.min(0.95, avgScore / 80);
  return Math.round(raw * 100);
}

export function recommendSquads(mission: Mission, crew: Pirate[]): RaidSquad[] {
  // Filter out bedridden pirates
  const eligible = crew.filter((p) => p.scurvy < 75 && p.hp > 10);
  const { weights, partySize } = mission;

  // Sort all by suitability desc
  const ranked = [...eligible].sort(
    (a, b) => computeSuitability(b, weights) - computeSuitability(a, weights)
  );

  // --- BALANCED: Top K by suitability ---
  const balancedMembers = ranked.slice(0, partySize);
  const balancedRaw = balancedMembers.reduce((s, p) => s + computeSuitability(p, weights), 0);
  const balancedScore = applyRoleSynergies(balancedMembers, balancedRaw);

  // --- BERSERKER: Maximize swordsmanship + gunnery, ignore medicine ---
  const berserkerWeights: MissionWeights = { swordsmanship: 0.5, gunnery: 0.5, navigation: 0, rigging: 0, stealth: 0, medicine: 0 };
  const berserkerRanked = [...eligible].sort(
    (a, b) => computeSuitability(b, berserkerWeights) - computeSuitability(a, berserkerWeights)
  );
  const berserkerMembers = berserkerRanked.slice(0, partySize);
  const berserkerRaw = berserkerMembers.reduce((s, p) => s + computeSuitability(p, weights), 0);
  const berserkerScore = applyRoleSynergies(berserkerMembers, berserkerRaw) * 1.15; // high risk bonus

  // --- GHOST: Maximize stealth + rigging ---
  const ghostWeights: MissionWeights = { swordsmanship: 0.1, gunnery: 0, navigation: 0.1, rigging: 0.4, stealth: 0.4, medicine: 0 };
  const ghostRanked = [...eligible].sort(
    (a, b) => computeSuitability(b, ghostWeights) - computeSuitability(a, ghostWeights)
  );
  const ghostMembers = ghostRanked.slice(0, Math.max(2, partySize - 1));
  const ghostRaw = ghostMembers.reduce((s, p) => s + computeSuitability(p, weights), 0);
  const ghostScore = applyRoleSynergies(ghostMembers, ghostRaw);

  return [
    {
      type: 'Balanced',
      label: "Captain's Vanguard",
      icon: '⚖️',
      description: 'Optimal all-around squad — highest mission suitability score.',
      members: balancedMembers,
      score: Math.round(balancedScore),
      winProbability: computeWinProbability(balancedScore, partySize),
      expectedLoot: Math.round(balancedScore * 18),
    },
    {
      type: 'Berserker',
      label: 'Berserker Raid',
      icon: '⚔️',
      description: 'Max damage output. High casualties expected. High reward.',
      members: berserkerMembers,
      score: Math.round(berserkerScore),
      winProbability: Math.min(92, computeWinProbability(berserkerScore, partySize) + 8),
      expectedLoot: Math.round(berserkerScore * 24),
    },
    {
      type: 'Ghost',
      label: 'Ghost Infiltrators',
      icon: '🥷',
      description: 'Silent precision. Minimum footprint, maximum surprise.',
      members: ghostMembers,
      score: Math.round(ghostScore),
      winProbability: computeWinProbability(ghostScore, ghostMembers.length),
      expectedLoot: Math.round(ghostScore * 14),
    },
  ];
}
