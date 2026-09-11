import React from 'react';
import { useCrewStore } from '../../store/crewStore';
import { Anchor, Wind, Citrus, Beer, Coins, Skull } from 'lucide-react';
import GrogButton from '../shared/GrogButton';

export default function Header() {
  const { ship } = useCrewStore();

  const seaworthColor =
    ship.seaworthiness > 70 ? '#10b981' : ship.seaworthiness > 40 ? '#f59e0b' : '#dc2626';
  const moraleColor =
    ship.morale > 60 ? '#8b5cf6' : ship.morale > 35 ? '#f59e0b' : '#dc2626';

  return (
    <header className="header-bar">
      <div className="header-left">
        <Skull className="skull-icon" size={28} />
        <div>
          <div className="ship-name">🏴‍☠️ QUARTERDECK OS</div>
          <div className="ship-subtitle">{ship.name}</div>
        </div>
      </div>

      <div className="header-vitals">
        <StatPill icon={<Anchor size={14} />} label="Seaworthiness" value={`${ship.seaworthiness}%`} color={seaworthColor} />
        <StatPill icon={<Wind size={14} />} label="Ship Morale" value={`${ship.morale}%`} color={moraleColor} />
        <StatPill icon={<Citrus size={14} />} label="Limes" value={String(ship.limes)} color="#84cc16" />
        <StatPill icon={<Beer size={14} />} label="Grog" value={String(ship.grog)} color="#b45309" />
        <StatPill icon={<Coins size={14} />} label="Gold" value={`⚜ ${ship.gold.toLocaleString()}`} color="#fbbf24" />
      </div>

      <div className="header-right">
        <GrogButton />
      </div>
    </header>
  );
}

function StatPill({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="stat-pill">
      <span style={{ color }}>{icon}</span>
      <span className="stat-label">{label}</span>
      <span className="stat-value" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
