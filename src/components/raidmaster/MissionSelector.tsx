import { MISSIONS } from '../../data/pirates';
import type { Mission } from '../../types';
import { motion } from 'framer-motion';

interface Props {
  selected: Mission;
  onSelect: (m: Mission) => void;
}

export default function MissionSelector({ selected, onSelect }: Props) {
  return (
    <div className="mission-selector">
      <div className="mission-title">🗺️ Select Mission Archetype</div>
      <div className="mission-grid">
        {MISSIONS.map((m) => (
          <motion.button
            key={m.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(m)}
            className={`mission-card ${selected.id === m.id ? 'mission-card--active' : ''}`}
          >
            <div className="mission-card-icon">{m.icon}</div>
            <div className="mission-card-label">{m.label}</div>
            <div className="mission-card-hazard">
              <span>{m.hazardIcon}</span>
              <span>{m.hazard}</span>
            </div>

            <div className="mission-weights">
              {Object.entries(m.weights)
                .filter(([, v]) => v > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([skill, weight]) => (
                  <div key={skill} className="weight-row">
                    <span className="weight-skill">{skill}</span>
                    <div className="weight-track">
                      <div
                        className="weight-fill"
                        style={{ width: `${weight * 100}%`, backgroundColor: '#d97706' }}
                      />
                    </div>
                    <span className="weight-pct">{Math.round(weight * 100)}%</span>
                  </div>
                ))}
            </div>

            <div className="mission-party-size">
              Party size: <strong>{m.partySize}</strong>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
