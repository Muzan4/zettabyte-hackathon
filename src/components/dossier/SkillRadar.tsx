import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Pirate } from '../../types';
import { applyScurvyToSkills } from '../../utils/scurvyEffects';

interface Props {
  pirate: Pirate;
}

const SKILL_LABELS: Record<string, string> = {
  swordsmanship: '⚔️ Sword',
  gunnery: '💣 Gunnery',
  navigation: '🧭 Navigation',
  rigging: '🧗 Rigging',
  stealth: '🥷 Stealth',
  medicine: '🩺 Medicine',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: { subject: string; A: number; B: number } }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="radar-tooltip">
        <div className="radar-tooltip-label">{d.subject}</div>
        <div className="radar-tooltip-val">Base: <span style={{ color: '#475569' }}>{d.B}</span></div>
        <div className="radar-tooltip-val">Effective: <span style={{ color: '#10b981' }}>{d.A}</span></div>
        {d.A < d.B && <div className="radar-tooltip-penalty">⚠ Scurvy penalty: -{d.B - d.A}</div>}
      </div>
    );
  }
  return null;
}

export default function SkillRadar({ pirate }: Props) {
  const effective = applyScurvyToSkills(pirate.skills, pirate.scurvy);

  const data = [
    { subject: SKILL_LABELS.swordsmanship, A: effective.swordsmanship, B: pirate.skills.swordsmanship, fullMark: 100 },
    { subject: SKILL_LABELS.gunnery, A: effective.gunnery, B: pirate.skills.gunnery, fullMark: 100 },
    { subject: SKILL_LABELS.navigation, A: effective.navigation, B: pirate.skills.navigation, fullMark: 100 },
    { subject: SKILL_LABELS.rigging, A: effective.rigging, B: pirate.skills.rigging, fullMark: 100 },
    { subject: SKILL_LABELS.stealth, A: effective.stealth, B: pirate.skills.stealth, fullMark: 100 },
    { subject: SKILL_LABELS.medicine, A: effective.medicine, B: pirate.skills.medicine, fullMark: 100 },
  ];

  return (
    <div className="radar-container">
      <div className="radar-title">🕸 Skill Web</div>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#1e3a5f" strokeOpacity={0.8} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
          />
          {/* Base skills (dimmed) */}
          <Radar
            name="Base"
            dataKey="B"
            stroke="#334155"
            fill="#334155"
            fillOpacity={0.25}
          />
          {/* Effective skills (glowing emerald) */}
          <Radar
            name="Effective"
            dataKey="A"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.35}
            dot={{ fill: '#10b981', r: 3 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
