import { motion, AnimatePresence } from 'framer-motion';
import { useCrewStore } from '../../store/crewStore';
import { getScurvyPenalties } from '../../utils/scurvyEffects';
import { computeReadiness } from '../../utils/raidAlgorithm';
import SkillRadar from './SkillRadar';
import VitalsBar from './VitalsBar';
import { StatusBadges, DossierActions, RoleSynergies, BountyBadge } from './DossierActions';
import { Swords } from 'lucide-react';

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
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0a0f18&eyes=variant12,variant16,variant26&hair=long01,long07,short01&accessories=glasses01,glasses02,glasses03&accessoriesProbability=60`;
}

export default function DossierPanel() {
  const { getSelectedPirate } = useCrewStore();
  const pirate = getSelectedPirate();

  if (!pirate) {
    return (
      <div className="dossier-panel dossier-empty">
        <Swords size={48} className="empty-icon" />
        <p className="empty-text">Select a crew member to view their dossier</p>
      </div>
    );
  }

  const scurvyInfo = getScurvyPenalties(pirate.scurvy);
  const readiness = Math.round(computeReadiness(pirate) * 100);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pirate.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="dossier-panel"
      >
        {/* === PIRATE HEADER === */}
        <div className="dossier-header">
          <div className="dossier-avatar-wrapper">
            <img
              src={getAvatarUrl(pirate.avatarSeed)}
              alt={pirate.nickname}
              className="dossier-avatar"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${pirate.id}`; }}
            />
            <div
              className="readiness-ring"
              style={{ borderColor: readiness > 70 ? '#10b981' : readiness > 40 ? '#f59e0b' : '#dc2626' }}
            />
          </div>

          <div className="dossier-identity">
            <div className="dossier-nickname">"{pirate.nickname}"</div>
            <div className="dossier-fullname">{pirate.name}</div>
            <div className="dossier-role-badge">
              <span className="role-icon">{ROLE_ICONS[pirate.role]}</span>
              <span>{pirate.role}</span>
            </div>
            <BountyBadge pirate={pirate} />
          </div>

          <div className="dossier-readiness">
            <div className="readiness-label">READINESS</div>
            <div
              className="readiness-value"
              style={{ color: readiness > 70 ? '#10b981' : readiness > 40 ? '#f59e0b' : '#dc2626' }}
            >
              {readiness}%
            </div>
            {scurvyInfo.tier > 0 && (
              <div className="scurvy-tier" style={{ color: scurvyInfo.tierColor }}>
                {scurvyInfo.tierLabel}
              </div>
            )}
          </div>
        </div>

        <div className="dossier-trait">
          <span className="trait-icon">✦</span>
          <em>"{pirate.trait}"</em>
        </div>

        <StatusBadges pirate={pirate} />

        {/* === SCROLL BODY === */}
        <div className="dossier-body">
          <div className="dossier-left-col">
            <SkillRadar pirate={pirate} />
            <RoleSynergies pirate={pirate} />
          </div>
          <div className="dossier-right-col">
            <VitalsBar pirate={pirate} />
          </div>
        </div>

        <DossierActions pirate={pirate} />
      </motion.div>
    </AnimatePresence>
  );
}
