import type { Pirate, Role, SkillKey, Skills } from "./crew-types"
import { SKILL_KEYS } from "./crew-types"

/* ---------- Vitals status ---------- */

export type StatusLevel = "good" | "warn" | "danger"

export function healthStatus(v: number): StatusLevel {
  if (v >= 75) return "good"
  if (v >= 50) return "warn"
  return "danger"
}

/** Scurvy is inverted — higher is worse. */
export function scurvyStatus(v: number): StatusLevel {
  if (v <= 25) return "good"
  if (v <= 50) return "warn"
  return "danger"
}

export function moraleStatus(v: number): StatusLevel {
  if (v >= 70) return "good"
  if (v >= 45) return "warn"
  return "danger"
}

/**
 * Battle readiness 0-100. High health & morale help, scurvy drags it down.
 */
export function readiness(p: Pirate): number {
  const { health, scurvy, morale } = p.vitals
  const score = health * 0.45 + morale * 0.3 + (100 - scurvy) * 0.25
  return Math.round(score)
}

export function readinessStatus(v: number): StatusLevel {
  if (v >= 75) return "good"
  if (v >= 55) return "warn"
  return "danger"
}

export function overallSkill(skills: Skills): number {
  const total = SKILL_KEYS.reduce((sum, k) => sum + skills[k], 0)
  return Math.round(total / SKILL_KEYS.length)
}

/* ---------- Avatars ---------- */

export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

const AVATAR_HUES = [78, 25, 195, 145, 300, 55, 230, 340, 160]

export function avatarHue(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return AVATAR_HUES[hash % AVATAR_HUES.length]
}

/* ---------- Mission engine ---------- */

export interface Mission {
  id: string
  name: string
  blurb: string
  difficulty: number // 1-5
  partySize: number
  /** relative importance per skill, 0-3 */
  weights: Partial<Record<SkillKey, number>>
}

export const MISSIONS: Mission[] = [
  {
    id: "m-merchant",
    name: "Merchant Sloop Raid",
    blurb: "A lightly-armed trader ripe for boarding. Speed and blades win the day.",
    difficulty: 2,
    partySize: 4,
    weights: { swordsmanship: 3, rigging: 2, stealth: 1 },
  },
  {
    id: "m-fort",
    name: "Coastal Fort Bombardment",
    blurb: "Level the shore battery before it levels you. Gunnery decides everything.",
    difficulty: 4,
    partySize: 5,
    weights: { gunnery: 3, navigation: 2, swordsmanship: 1, medicine: 1 },
  },
  {
    id: "m-reef",
    name: "Reef Passage Smuggling Run",
    blurb: "Thread a moonless reef unseen. Navigation and stealth keep the hull whole.",
    difficulty: 3,
    partySize: 4,
    weights: { navigation: 3, stealth: 3, rigging: 1 },
  },
  {
    id: "m-galleon",
    name: "Treasure Galleon Assault",
    blurb: "A heavily-guarded prize. You'll need everything — and a mender aboard.",
    difficulty: 5,
    partySize: 6,
    weights: { swordsmanship: 3, gunnery: 2, medicine: 2, navigation: 1, stealth: 1 },
  },
  {
    id: "m-storm",
    name: "Storm-Wracked Salvage",
    blurb: "Salvage a wreck in foul weather. Riggers and shipwright skill save the ship.",
    difficulty: 3,
    partySize: 4,
    weights: { rigging: 3, navigation: 2, medicine: 1 },
  },
]

export interface CandidateScore {
  pirate: Pirate
  skillFit: number // 0-100 weighted skill fit
  readiness: number
  total: number // combined 0-100
}

/** Weighted skill fit for a mission, normalized to 0-100. */
export function skillFit(p: Pirate, mission: Mission): number {
  const entries = Object.entries(mission.weights) as [SkillKey, number][]
  const weightSum = entries.reduce((s, [, w]) => s + w, 0)
  if (weightSum === 0) return overallSkill(p.skills)
  const weighted = entries.reduce((s, [k, w]) => s + p.skills[k] * w, 0)
  return Math.round(weighted / weightSum)
}

/**
 * Combined mission score. Harder missions weight readiness more heavily —
 * a scurvy-ridden crew won't survive a galleon assault however skilled.
 */
export function scoreCandidate(p: Pirate, mission: Mission): CandidateScore {
  const fit = skillFit(p, mission)
  const ready = readiness(p)
  const readyWeight = 0.2 + mission.difficulty * 0.06 // 0.26 .. 0.5
  const total = Math.round(fit * (1 - readyWeight) + ready * readyWeight)
  return { pirate: p, skillFit: fit, readiness: ready, total }
}

export interface Recommendation {
  party: CandidateScore[]
  bench: CandidateScore[]
  avgTotal: number
  coverage: { skill: SkillKey; value: number }[]
  medicAboard: boolean
}

export function recommendParty(crew: Pirate[], mission: Mission): Recommendation {
  const ranked = crew
    .map((p) => scoreCandidate(p, mission))
    .sort((a, b) => b.total - a.total)

  const party = ranked.slice(0, mission.partySize)
  const bench = ranked.slice(mission.partySize)

  const avgTotal = party.length
    ? Math.round(party.reduce((s, c) => s + c.total, 0) / party.length)
    : 0

  const coverage = SKILL_KEYS.map((skill) => {
    const best = party.reduce((max, c) => Math.max(max, c.pirate.skills[skill]), 0)
    return { skill, value: best }
  })

  const medicAboard = party.some((c) => c.pirate.skills.medicine >= 60)

  return { party, bench, avgTotal, coverage, medicAboard }
}

/* ---------- Empty pirate factory ---------- */

export function blankSkills(): Skills {
  return { swordsmanship: 50, gunnery: 50, navigation: 50, rigging: 50, stealth: 50, medicine: 50 }
}

export function newPirateId(): string {
  return `p-${Math.random().toString(36).slice(2, 9)}`
}

export const DEFAULT_ROLE: Role = "Deckhand"
