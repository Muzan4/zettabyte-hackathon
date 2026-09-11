import { motion } from 'framer-motion';
import type { Pirate } from '../../types';
import { applyScurvyToSkills } from '../../utils/scurvyEffects';

interface VitalBarProps {
  label: string;
  value: number;
  max?: number;
  color: string;
  icon: string;
  showWarning?: boolean;
}

function VitalBar({ label, value, max = 100, color, icon, showWarning }: VitalBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="vital-bar-container">
      <div className="vital-bar-header">
        <span className="vital-bar-label">
          {icon} {label}
        </span>
        <span className="vital-bar-value" style={{ color }}>
          {value}%
          {showWarning && value < 30 && <span className="vital-warning">⚠️ CRITICAL</span>}
        </span>
      </div>
      <div className="vital-bar-track">
        <motion.div
          className="vital-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

interface SkillBarProps {
  label: string;
  icon: string;
  base: number;
  effective: number;
}

function SkillBar({ label, icon, base, effective }: SkillBarProps) {
  const hasPenalty = effective < base;
  return (
    <div className="skill-bar-container">
      <div className="skill-bar-header">
        <span className="skill-bar-label">{icon} {label}</span>
        <span className={`skill-bar-value ${hasPenalty ? 'penalized' : ''}`}>
          {effective}
          {hasPenalty && <span className="penalty-delta"> ({base - effective} ↓)</span>}
        </span>
      </div>
      <div className="vital-bar-track">
        <div className="skill-bar-base" style={{ width: `${base}%`, backgroundColor: '#334155' }} />
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${effective}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ backgroundColor: hasPenalty ? '#ef4444' : '#10b981' }}
        />
      </div>
    </div>
  );
}

interface Props {
  pirate: Pirate;
}

export default function VitalsBar({ pirate }: Props) {
  const effective = applyScurvyToSkills(pirate.skills, pirate.scurvy);

  const scurvyColor =
    pirate.scurvy <= 25 ? '#10b981' :
    pirate.scurvy <= 50 ? '#f59e0b' :
    pirate.scurvy <= 75 ? '#ef4444' : '#7f1d1d';

  const moraleColor =
    pirate.morale >= 60 ? '#8b5cf6' :
    pirate.morale >= 35 ? '#f59e0b' : '#dc2626';

  const SKILLS = [
    { key: 'swordsmanship', label: 'Swordsmanship', icon: '⚔️' },
    { key: 'gunnery', label: 'Gunnery', icon: '💣' },
    { key: 'navigation', label: 'Navigation', icon: '🧭' },
    { key: 'rigging', label: 'Rigging', icon: '🧗' },
    { key: 'stealth', label: 'Stealth', icon: '🥷' },
    { key: 'medicine', label: 'Medicine', icon: '🩺' },
  ] as const;

  return (
    <div className="vitals-section">
      <div className="vitals-grid">
        <VitalBar label="Health (HP)" value={pirate.hp} color="#10b981" icon="❤️" showWarning />
        <VitalBar label="Scurvy" value={pirate.scurvy} color={scurvyColor} icon="🍋" showWarning={false} />
        <VitalBar label="Morale" value={pirate.morale} color={moraleColor} icon="⚡" showWarning />
      </div>

      <div className="skills-section">
        <div className="skills-header">📊 Combat Skills Matrix</div>
        <div className="skills-grid">
          {SKILLS.map(({ key, label, icon }) => (
            <SkillBar
              key={key}
              label={label}
              icon={icon}
              base={pirate.skills[key]}
              effective={effective[key]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
