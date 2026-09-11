import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RaidSquad, Mission, BattleLogEntry } from '../../types';
import { computeReadiness } from '../../utils/raidAlgorithm';

interface Props {
  squad: RaidSquad;
  mission: Mission;
  onClose: () => void;
}

const ATTACK_VERBS = ['slashes', 'blasts', 'lunges at', 'grapples', 'fires upon', 'charges'];
const ENEMY_ACTIONS = [
  'The enemy returns fire with a volley!',
  'A cannon ball splashes off the port bow!',
  'Enemy soldiers advance from the upper deck!',
  'Musket fire rakes across the boarding party!',
  'A Spanish officer challenges the vanguard!',
  'The enemy swings their cutlass in a fury!',
];
const LOOT_ITEMS = [
  'Chests of doubloons',
  'Spanish silver ingots',
  'Jeweled navigational instruments',
  'Barrels of fine rum',
  'A sealed Letter of Marque',
  'Maps to hidden treasure',
];

function generateCombatLog(squad: RaidSquad, mission: Mission): BattleLogEntry[] {
  const log: BattleLogEntry[] = [];
  const members = squad.members;
  let turn = 1;

  log.push({ turn: turn++, text: `⚓ The ${squad.label} approaches the ${mission.label}!`, type: 'attack' });
  log.push({ turn: turn++, text: `🌊 Grappling hooks fly! The boarding begins in earnest!`, type: 'attack' });

  members.forEach((p) => {
    const verb = ATTACK_VERBS[Math.floor(Math.random() * ATTACK_VERBS.length)];
    const isCrit = Math.random() > 0.75;
    log.push({
      turn: turn++,
      text: isCrit
        ? `💥 CRITICAL! "${p.nickname}" ${verb} the enemy with devastating force!`
        : `⚔️ "${p.nickname}" ${verb} a defending soldier!`,
      type: isCrit ? 'critical' : 'attack',
    });
  });

  // Enemy counterattack
  const enemyAction = ENEMY_ACTIONS[Math.floor(Math.random() * ENEMY_ACTIONS.length)];
  log.push({ turn: turn++, text: `🔫 ${enemyAction}`, type: 'defend' });

  // Medic heal
  const medic = members.find((p) => p.skills.medicine > 70);
  if (medic) {
    log.push({
      turn: turn++,
      text: `🩺 "${medic.nickname}" patches up the wounded — casualties reduced by 40%!`,
      type: 'heal',
    });
  }

  // Miss
  const missChance = Math.random() > 0.7;
  if (missChance) {
    const p = members[Math.floor(Math.random() * members.length)];
    log.push({ turn: turn++, text: `💨 "${p.nickname}" swings wide — Miss!`, type: 'miss' });
  }

  // Final push
  log.push({ turn: turn++, text: `⚡ The crew rallies with a thunderous war cry!`, type: 'attack' });

  const won = squad.winProbability > Math.random() * 100;
  if (won) {
    const loot = LOOT_ITEMS[Math.floor(Math.random() * LOOT_ITEMS.length)];
    log.push({ turn: turn++, text: `🏆 VICTORY! The enemy surrenders!`, type: 'loot' });
    log.push({ turn: turn++, text: `💰 Plunder secured: ${loot}! ⚜ +${squad.expectedLoot.toLocaleString()} gold!`, type: 'loot' });
  } else {
    log.push({ turn: turn++, text: `💀 DEFEAT! The crew retreats to fight another day...`, type: 'defend' });
  }

  return log;
}

const LOG_TYPE_COLORS: Record<BattleLogEntry['type'], string> = {
  attack: '#10b981',
  defend: '#ef4444',
  heal: '#ec4899',
  loot: '#fbbf24',
  critical: '#f97316',
  miss: '#64748b',
};

export default function BattleSimulator({ squad, mission, onClose }: Props) {
  const [log, setLog] = useState<BattleLogEntry[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [done, setDone] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'battle' | 'done'>('intro');

  const fullLog = generateCombatLog(squad, mission);
  const won = fullLog.some((l) => l.type === 'loot' && l.text.includes('VICTORY'));

  useEffect(() => {
    // Intro phase
    const introTimer = setTimeout(() => setPhase('battle'), 1200);
    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'battle') return;
    if (currentIdx >= fullLog.length - 1) {
      setDone(true);
      setPhase('done');
      return;
    }
    const delay = currentIdx === -1 ? 200 : 600;
    const timer = setTimeout(() => {
      setCurrentIdx((i) => i + 1);
      setLog((prev) => [...prev, fullLog[currentIdx + 1]]);
    }, delay);
    return () => clearTimeout(timer);
  }, [currentIdx, phase]);

  const avgReadiness = Math.round(
    (squad.members.reduce((s, p) => s + computeReadiness(p), 0) / squad.members.length) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={done ? onClose : undefined}
    >
      <motion.div
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.85 }}
        className="battle-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="battle-header">
          <div className="battle-title">
            ⚔️ RAID SIMULATION — {mission.label.toUpperCase()}
          </div>
          <div className="battle-squad-name">{squad.icon} {squad.label}</div>
        </div>

        {/* Combatant avatars */}
        <div className="battle-combatants">
          <div className="battle-side">
            {squad.members.slice(0, 3).map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="battle-pirate"
              >
                ☠️ {p.nickname.split(' ')[0]}
              </motion.div>
            ))}
          </div>
          <div className="battle-vs">
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ⚔️
            </motion.div>
          </div>
          <div className="battle-side battle-side--enemy">
            <div className="battle-pirate battle-pirate--enemy">🛡️ Guard</div>
            <div className="battle-pirate battle-pirate--enemy">💂 Captain</div>
            <div className="battle-pirate battle-pirate--enemy">🔫 Soldier</div>
          </div>
        </div>

        {/* Intro overlay */}
        <AnimatePresence>
          {phase === 'intro' && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="battle-intro"
            >
              <motion.div
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.8 }}
                className="battle-intro-text"
              >
                {mission.icon} BOARDING!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Combat log */}
        <div className="battle-log">
          <AnimatePresence>
            {log.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="battle-log-entry"
                style={{ color: LOG_TYPE_COLORS[entry.type] }}
              >
                <span className="log-turn">T{entry.turn}</span>
                <span>{entry.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {!done && (
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="battle-in-progress"
            >
              ⚡ Battle in progress...
            </motion.div>
          )}
        </div>

        {/* Result */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`battle-result ${won ? 'battle-result--win' : 'battle-result--loss'}`}
            >
              <div className="result-title">{won ? '🏆 VICTORY!' : '💀 DEFEATED!'}</div>
              {won && (
                <div className="result-loot">
                  ⚜ {squad.expectedLoot.toLocaleString()} gold secured!
                </div>
              )}
              <div className="result-sub">
                Party Readiness: {avgReadiness}% | Win Probability was: {squad.winProbability}%
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-close-battle"
                onClick={onClose}
              >
                ⚓ Return to Quarterdeck
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
