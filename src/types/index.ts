export type PirateRole =
  | 'Captain'
  | 'Quartermaster'
  | 'Bosun'
  | 'Master Gunner'
  | 'Lookout'
  | 'Shipwright'
  | 'Deckhand';

export type StatusEffect =
  | 'Scurvy'
  | 'Rum Drunk'
  | 'Mutinous Whispers'
  | 'Bedridden'
  | 'Battle Scarred'
  | 'Iron Stomach'
  | 'Dead-Eye'
  | 'Cursed';

export interface PirateSkills {
  swordsmanship: number; // 0-100
  gunnery: number;
  navigation: number;
  rigging: number;
  stealth: number;
  medicine: number;
}

export interface Pirate {
  id: string;
  name: string;
  nickname: string;
  role: PirateRole;
  bounty: number; // in gold pieces
  trait: string;
  hp: number;       // 0-100
  scurvy: number;   // 0-100
  morale: number;   // 0-100
  skills: PirateSkills;
  avatarSeed: string;
  statusEffects: StatusEffect[];
  joinedDate: string;
}

export type MissionType =
  | 'Spanish Treasure Galleon'
  | 'Fortified Coastal Redoubt'
  | 'Silent Merchantman Cut-Out'
  | 'Ghost Frigate Boarding';

export interface MissionWeights {
  swordsmanship: number;
  gunnery: number;
  navigation: number;
  rigging: number;
  stealth: number;
  medicine: number;
}

export interface Mission {
  id: MissionType;
  label: string;
  icon: string;
  description: string;
  partySize: number;
  weights: MissionWeights;
  hazard: string;
  hazardIcon: string;
}

export interface RaidSquad {
  type: 'Balanced' | 'Berserker' | 'Ghost';
  label: string;
  icon: string;
  description: string;
  members: Pirate[];
  score: number;
  winProbability: number;
  expectedLoot: number;
}

export interface ShipState {
  seaworthiness: number;
  morale: number;
  limes: number;
  grog: number;
  gold: number;
  name: string;
}

export interface BattleLogEntry {
  turn: number;
  text: string;
  type: 'attack' | 'defend' | 'heal' | 'loot' | 'critical' | 'miss';
}

export interface RaidResult {
  won: boolean;
  loot: number;
  casualties: string[];
  log: BattleLogEntry[];
}

export type HealthFilter = 'All' | 'Battle-Ready' | 'Injured' | 'Scurvy Warning' | 'Mutiny Risk';
