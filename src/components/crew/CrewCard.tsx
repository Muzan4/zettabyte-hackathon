import { motion } from 'framer-motion';
import type { Pirate } from '../../types';
import { useCrewStore } from '../../store/crewStore';
import { getScurvyPenalties } from '../../utils/scurvyEffects';

interface Props {
  pirate: Pirate;
  isSelected: boolean;
}

const ROLE_ICONS: Record<string, string> = {
  'Captain': '👑',
  'Quartermaster': '📜',
  'Bosun': '⚓',
  'Master Gunner': '💣',
  'Lookout': '🔭',
  'Shipwright': '🔨',
  'Deckhand': '🪝',
};

function getAvatarUrl(seed: string) {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1e293b`;
}

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="mini-bar-track">
      <div className="mini-bar-fill" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
}

export default function CrewCard({ pirate, isSelected }: Props) {
  const { selectPirate } = useCrewStore();
  const scurvy = getScurvyPenalties(pirate.scurvy);

  const hpColor = pirate.hp > 60 ? '#10b981' : pirate.hp > 30 ? '#f59e0b' : '#dc2626';
  const moraleColor = pirate.morale > 60 ? '#8b5cf6' : pirate.morale > 35 ? '#f59e0b' : '#dc2626';

  const isBedridden = scurvy.nonDeployable;
  const isMutinous = pirate.morale < 30;
  const isInjured = pirate.hp < 50;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: isSelected ? 1 : 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => selectPirate(pirate.id)}
      className={`crew-card ${isSelected ? 'crew-card--selected' : ''} ${isBedridden ? 'crew-card--bedridden' : ''}`}
    >
      <div className="card-avatar-col">
        <img
          src={getAvatarUrl(pirate.avatarSeed)}
          alt={pirate.nickname}
          className="card-avatar"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${pirate.id}&backgroundColor=1e293b`;
          }}
        />
      </div>

      <div className="card-info">
        <div className="card-name-row">
          <span className="card-nickname">"{pirate.nickname}"</span>
          <span className="card-role">
            {ROLE_ICONS[pirate.role]} {pirate.role}
          </span>
        </div>
        <div className="card-fullname">{pirate.name}</div>

        <div className="card-vitals">
          <div className="vital-row">
            <span className="vital-label" style={{ color: hpColor }}>HP {pirate.hp}%</span>
            <MiniBar value={pirate.hp} color={hpColor} />
            {isInjured && <span className="vital-warn">⚠️</span>}
          </div>
          <div className="vital-row">
            <span className="vital-label" style={{ color: scurvy.tierColor }}>
              🍋 {pirate.scurvy}%
            </span>
            <MiniBar value={pirate.scurvy} color={scurvy.tierColor} />
            {pirate.scurvy > 50 && <span className="vital-warn">🍊</span>}
          </div>
          <div className="vital-row">
            <span className="vital-label" style={{ color: moraleColor }}>⚡ {pirate.morale}%</span>
            <MiniBar value={pirate.morale} color={moraleColor} />
            {isMutinous && <span className="vital-warn">🔥</span>}
          </div>
        </div>

        <div className="card-skill-highlights">
          <span className="skill-hi">⚔️{pirate.skills.swordsmanship}</span>
          <span className="skill-hi">💣{pirate.skills.gunnery}</span>
          <span className="skill-hi">🥷{pirate.skills.stealth}</span>
          <span className="skill-hi">⚜{pirate.bounty.toLocaleString()}</span>
        </div>
      </div>

      {isBedridden && <div className="bedridden-overlay">🛏️ BEDRIDDEN</div>}
      {isMutinous && !isBedridden && <div className="mutiny-ribbon">⚡ MUTINOUS</div>}
    </motion.div>
  );
}
