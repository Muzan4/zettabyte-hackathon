export const ROLES = [
  "Captain",
  "Quartermaster",
  "Bosun",
  "Master Gunner",
  "Lookout",
  "Shipwright",
  "Deckhand",
] as const

export type Role = (typeof ROLES)[number]

export const SKILL_KEYS = [
  "swordsmanship",
  "gunnery",
  "navigation",
  "rigging",
  "stealth",
  "medicine",
] as const

export type SkillKey = (typeof SKILL_KEYS)[number]

export const SKILL_LABELS: Record<SkillKey, string> = {
  swordsmanship: "Swordsmanship",
  gunnery: "Cannon Gunnery",
  navigation: "Navigation",
  rigging: "Rigging",
  stealth: "Stealth",
  medicine: "Medicine",
}

export type Skills = Record<SkillKey, number>

export interface Vitals {
  /** 0-100, higher is better */
  health: number
  /** 0-100, higher is worse (more scurvy) */
  scurvy: number
  /** 0-100, higher is better */
  morale: number
}

export interface Pirate {
  id: string
  name: string
  epithet: string
  role: Role
  origin: string
  yearsAtSea: number
  skills: Skills
  vitals: Vitals
}
