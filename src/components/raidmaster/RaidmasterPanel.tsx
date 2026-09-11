import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCrewStore } from '../../store/crewStore';
import type { Mission, RaidSquad } from '../../types';
import { MISSIONS } from '../../data/pirates';
import { recommendSquads } from '../../utils/raidAlgorithm';
import MissionSelector from './MissionSelector';
import PartyRecommender from './PartyRecommender';
import BattleSimulator from './BattleSimulator';
import LetterOfMarque from '../shared/LetterOfMarque';

export default function RaidmasterPanel() {
  const { crew } = useCrewStore();
  const [selectedMission, setSelectedMission] = useState<Mission>(MISSIONS[0]);
  const [squads, setSquads] = useState<RaidSquad[] | null>(null);
  const [simSquad, setSimSquad] = useState<RaidSquad | null>(null);
  const [letterSquad, setLetterSquad] = useState<RaidSquad | null>(null);

  const handleRecommend = () => {
    const result = recommendSquads(selectedMission, crew);
    setSquads(result);
  };

  return (
    <div className="raidmaster-panel">
      <div className="raidmaster-header">
        <div className="raidmaster-title">🗡️ THE RAIDMASTER</div>
        <div className="raidmaster-subtitle">Intelligent Mission Assignment Engine</div>
      </div>

      <MissionSelector selected={selectedMission} onSelect={(m) => { setSelectedMission(m); setSquads(null); }} />

      <div className="raidmaster-cta">
        <button className="btn-recommend" onClick={handleRecommend}>
          ⚡ AUTO-RECOMMEND OPTIMAL PARTY
        </button>
        <div className="recommend-hint">
          {crew.filter((p) => p.scurvy < 75 && p.hp > 10).length} deployable crew members
        </div>
      </div>

      <AnimatePresence>
        {squads && (
          <PartyRecommender
            squads={squads}
            mission={selectedMission}
            onSimulate={(sq) => setSimSquad(sq)}
            onLetter={(sq) => setLetterSquad(sq)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {simSquad && (
          <BattleSimulator
            squad={simSquad}
            mission={selectedMission}
            onClose={() => setSimSquad(null)}
          />
        )}
      </AnimatePresence>

      {letterSquad && (
        <LetterOfMarque
          squad={letterSquad}
          mission={selectedMission}
          onClose={() => setLetterSquad(null)}
        />
      )}
    </div>
  );
}
