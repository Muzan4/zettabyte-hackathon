import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RaidSquad, Mission } from '../../types';
import { computeReadiness } from '../../utils/raidAlgorithm';
import { Scroll } from 'lucide-react';

function getAvatarUrl(seed: string) {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0f172a`;
}

interface Props {
  squads: RaidSquad[];
  mission: Mission;
  onSimulate: (squad: RaidSquad) => void;
  onLetter: (squad: RaidSquad) => void;
}

const SQUAD_BORDER: Record<string, string> = {
  Balanced: '#d97706',
  Berserker: '#dc2626',
  Ghost: '#6366f1',
};

const SQUAD_GLOW: Record<string, string> = {
  Balanced: '#d97706',
  Berserker: '#dc2626',
  Ghost: '#6366f1',
};

export default function PartyRecommender({ squads, mission, onSimulate, onLetter }: Props) {
  const [activeSquad, setActiveSquad] = useState<RaidSquad>(squads[0]);

  const winColor = (prob: number) =>
    prob >= 75 ? '#10b981' : prob >= 50 ? '#f59e0b' : '#dc2626';

  return (
    <div className="recommender">
      <div className="recommender-title">⚡ Raidmaster Recommendation Engine</div>

      {/* Squad type tabs */}
      <div className="squad-tabs">
        {squads.map((sq) => (
          <motion.button
            key={sq.type}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveSquad(sq)}
            className={`squad-tab ${activeSquad.type === sq.type ? 'squad-tab--active' : ''}`}
            style={activeSquad.type === sq.type ? { borderColor: SQUAD_BORDER[sq.type], color: SQUAD_BORDER[sq.type] } : {}}
          >
            <span className="squad-tab-icon">{sq.icon}</span>
            <div>
              <div className="squad-tab-label">{sq.type}</div>
              <div className="squad-tab-sublabel">{sq.label}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSquad.type}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="squad-detail"
          style={{ borderColor: SQUAD_GLOW[activeSquad.type] + '55' }}
        >
          <div className="squad-desc">{activeSquad.icon} {activeSquad.description}</div>

          <div className="squad-stats-row">
            <div className="squad-stat-box">
              <div className="squad-stat-label">Win Probability</div>
              <div className="squad-stat-value" style={{ color: winColor(activeSquad.winProbability) }}>
                {activeSquad.winProbability}%
              </div>
            </div>
            <div className="squad-stat-box">
              <div className="squad-stat-label">Suitability Score</div>
              <div className="squad-stat-value" style={{ color: '#d97706' }}>
                {activeSquad.score}
              </div>
            </div>
            <div className="squad-stat-box">
              <div className="squad-stat-label">Expected Loot</div>
              <div className="squad-stat-value" style={{ color: '#fbbf24' }}>
                ⚜ {activeSquad.expectedLoot.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Party members */}
          <div className="squad-members">
            {activeSquad.members.map((p, i) => {
              const readiness = Math.round(computeReadiness(p) * 100);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="squad-member"
                >
                  <img
                    src={getAvatarUrl(p.avatarSeed)}
                    alt={p.nickname}
                    className="squad-member-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${p.id}`;
                    }}
                  />
                  <div className="squad-member-info">
                    <div className="squad-member-name">"{p.nickname}"</div>
                    <div className="squad-member-role">{p.role}</div>
                  </div>
                  <div
                    className="squad-member-readiness"
                    style={{ color: readiness > 70 ? '#10b981' : readiness > 40 ? '#f59e0b' : '#dc2626' }}
                  >
                    {readiness}%
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="squad-actions">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-simulate"
              onClick={() => onSimulate(activeSquad)}
            >
              ⚔️ Simulate Raid!
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-letter"
              onClick={() => onLetter(activeSquad)}
            >
              <Scroll size={14} /> Letter of Marque
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
