import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCrewStore } from '../../store/crewStore';
import FilterToolbar from './FilterToolbar';
import CrewCard from './CrewCard';
import RecruitModal from './RecruitModal';
import { UserPlus, Users } from 'lucide-react';

export default function CrewPanel() {
  const { crew, getFilteredCrew, selectedPirateId, ship } = useCrewStore();
  const [showRecruit, setShowRecruit] = useState(false);

  const filtered = getFilteredCrew();
  const totalCrew = crew.length;
  const battleReady = crew.filter((p) => p.hp >= 50 && p.scurvy <= 50 && p.morale >= 35).length;

  // Ship role validation
  const roles = crew.map((p) => p.role);
  const missingRoles: string[] = [];
  if (!roles.includes('Captain')) missingRoles.push('Captain');
  if (!roles.includes('Shipwright')) missingRoles.push('Shipwright');
  if (!roles.includes('Master Gunner')) missingRoles.push('Master Gunner');

  return (
    <div className="crew-panel">
      {/* Panel Header */}
      <div className="crew-panel-header">
        <div className="crew-panel-title">
          <Users size={18} />
          <span>Crew Manifest</span>
        </div>
        <div className="crew-stats">
          <span className="crew-stat">
            <span className="stat-num">{totalCrew}</span> aboard
          </span>
          <span className="crew-stat">
            <span className="stat-num" style={{ color: '#10b981' }}>{battleReady}</span> combat-ready
          </span>
        </div>
      </div>

      {/* Ship warnings */}
      {missingRoles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="ship-warning"
        >
          ⚠️ <strong>Warning:</strong> No {missingRoles.join(', ')} assigned! The ship is vulnerable!
        </motion.div>
      )}

      {/* Filters */}
      <FilterToolbar />

      {/* Crew list */}
      <div className="crew-list">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="crew-empty"
            >
              🏴‍☠️ No pirates match yer filters, Captain!
            </motion.div>
          ) : (
            filtered.map((pirate) => (
              <CrewCard
                key={pirate.id}
                pirate={pirate}
                isSelected={pirate.id === selectedPirateId}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Recruit button */}
      <div className="crew-panel-footer">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-recruit"
          onClick={() => setShowRecruit(true)}
        >
          <UserPlus size={16} /> Recruit Scallywag
        </motion.button>

        {ship.limes > 0 && (
          <div className="lime-stock">🍊 {ship.limes} citrus rations available</div>
        )}
      </div>

      {showRecruit && <RecruitModal onClose={() => setShowRecruit(false)} />}
    </div>
  );
}
