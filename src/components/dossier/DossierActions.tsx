import { motion, AnimatePresence } from 'framer-motion';
import type { Pirate, PirateRole, StatusEffect } from '../../types';
import { useCrewStore } from '../../store/crewStore';
import { Shield, Citrus, Trash2, Star, Zap } from 'lucide-react';

const ROLES: PirateRole[] = [
  'Captain', 'Quartermaster', 'Bosun', 'Master Gunner',
  'Lookout', 'Shipwright', 'Deckhand',
];

interface Props {
  pirate: Pirate;
}

const STATUS_COLORS: Record<StatusEffect, string> = {
  'Scurvy': '#ef4444',
  'Rum Drunk': '#b45309',
  'Mutinous Whispers': '#dc2626',
  'Bedridden': '#7f1d1d',
  'Battle Scarred': '#92400e',
  'Iron Stomach': '#10b981',
  'Dead-Eye': '#6366f1',
  'Cursed': '#7c3aed',
};

const STATUS_ICONS: Record<StatusEffect, string> = {
  'Scurvy': '🍋',
  'Rum Drunk': '🍺',
  'Mutinous Whispers': '⚡',
  'Bedridden': '🛏️',
  'Battle Scarred': '⚔️',
  'Iron Stomach': '💪',
  'Dead-Eye': '🎯',
  'Cursed': '💀',
};

export function StatusBadges({ pirate }: Props) {
  return (
    <div className="status-badges">
      {pirate.statusEffects.map((effect) => (
        <motion.span
          key={effect}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="status-badge"
          style={{ backgroundColor: STATUS_COLORS[effect] + '33', borderColor: STATUS_COLORS[effect], color: STATUS_COLORS[effect] }}
        >
          {STATUS_ICONS[effect]} {effect}
        </motion.span>
      ))}
      {pirate.scurvy > 50 && !pirate.statusEffects.includes('Scurvy') && (
        <span className="status-badge" style={{ backgroundColor: '#ef444433', borderColor: '#ef4444', color: '#ef4444' }}>
          🍋 Scurvy
        </span>
      )}
      {pirate.morale < 30 && !pirate.statusEffects.includes('Mutinous Whispers') && (
        <span className="status-badge" style={{ backgroundColor: '#dc262633', borderColor: '#dc2626', color: '#dc2626' }}>
          ⚡ Mutinous Whispers
        </span>
      )}
    </div>
  );
}

export function DossierActions({ pirate }: Props) {
  const { assignRole, feedLime, confirmPlank, ship } = useCrewStore();

  return (
    <div className="dossier-actions">
      <div className="role-assign-row">
        <Shield size={14} className="action-icon" />
        <span className="action-label">Assign Role:</span>
        <select
          className="role-select"
          value={pirate.role}
          onChange={(e) => assignRole(pirate.id, e.target.value as PirateRole)}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="action-buttons-row">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-lime"
          onClick={() => feedLime(pirate.id)}
          disabled={ship.limes <= 0}
          title={`Feed a citrus ration — reduces Scurvy by 35% (${ship.limes} limes left)`}
        >
          <Citrus size={14} /> Distribute Citrus Ration
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-plank"
          onClick={() => confirmPlank(pirate.id)}
          title="Walk the Plank — discharge this crew member"
        >
          <Trash2 size={14} /> Walk the Plank
        </motion.button>
      </div>
    </div>
  );
}

export function RoleSynergies({ pirate }: Props) {
  const synergies: Record<PirateRole, string[]> = {
    'Captain': ['⚓ +15% Morale floor for all crew', '🌊 Unlocks Berserker formations'],
    'Quartermaster': ['📦 Tracks scurvy supply chain', '💰 Distributes plunder fairly'],
    'Bosun': ['🔧 Ship HP repairs faster', '⚔️ Deck discipline reduces mutiny'],
    'Master Gunner': ['💣 +25% cannon accuracy', '⚡ Synergy: +10% with Swordsman'],
    'Lookout': ['🌫️ Storm warning 3h ahead', '🔭 +20% stealth detection range'],
    'Shipwright': ['🛡️ Passive ship HP regen', '⛵ Sail repairs during combat'],
    'Deckhand': ['💪 Flexible boarding filler', '🪝 +5% all raid score bonus'],
  };

  const tips = synergies[pirate.role];
  return (
    <div className="role-synergies">
      <div className="synergy-header">
        <Zap size={12} />
        <span>Role Synergies</span>
      </div>
      {tips.map((tip, i) => (
        <div key={i} className="synergy-item">{tip}</div>
      ))}
    </div>
  );
}

export function BountyBadge({ pirate }: { pirate: Pirate }) {
  return (
    <div className="bounty-badge">
      <Star size={12} />
      <span>BOUNTY: ⚜ {pirate.bounty.toLocaleString()} gold</span>
    </div>
  );
}

export { AnimatePresence };
