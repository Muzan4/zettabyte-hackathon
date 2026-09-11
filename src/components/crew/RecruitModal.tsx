import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCrewStore } from '../../store/crewStore';
import { Pirate, PirateRole } from '../../types';
import { X, UserPlus } from 'lucide-react';

const ROLES: PirateRole[] = [
  'Captain', 'Quartermaster', 'Bosun', 'Master Gunner',
  'Lookout', 'Shipwright', 'Deckhand',
];

const DEFAULT_SKILLS = { swordsmanship: 50, gunnery: 50, navigation: 50, rigging: 50, stealth: 50, medicine: 50 };

interface Props {
  onClose: () => void;
}

export default function RecruitModal({ onClose }: Props) {
  const { recruitPirate } = useCrewStore();
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    role: 'Deckhand' as PirateRole,
    trait: '',
    bounty: 1000,
    hp: 80,
    scurvy: 10,
    morale: 75,
    ...DEFAULT_SKILLS,
  });

  const handleChange = (field: string, value: string | number) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleRecruit = () => {
    if (!form.name || !form.nickname) return;
    const pirate: Omit<Pirate, 'id'> = {
      name: form.name,
      nickname: form.nickname,
      role: form.role,
      trait: form.trait || 'Unknown Legend',
      bounty: Number(form.bounty),
      hp: Number(form.hp),
      scurvy: Number(form.scurvy),
      morale: Number(form.morale),
      skills: {
        swordsmanship: Number(form.swordsmanship),
        gunnery: Number(form.gunnery),
        navigation: Number(form.navigation),
        rigging: Number(form.rigging),
        stealth: Number(form.stealth),
        medicine: Number(form.medicine),
      },
      avatarSeed: `${form.nickname}-${Date.now()}`,
      statusEffects: [],
      joinedDate: new Date().toISOString().split('T')[0],
    };
    recruitPirate(pirate);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="recruit-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="recruit-header">
            <UserPlus size={22} />
            <h2>Recruit a Scallywag</h2>
            <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
          </div>

          <div className="recruit-form">
            <div className="form-row">
              <FormField label="Full Name" type="text" value={form.name} onChange={(v) => handleChange('name', v)} placeholder="e.g. William Turner" />
              <FormField label="Nickname" type="text" value={form.nickname} onChange={(v) => handleChange('nickname', v)} placeholder='e.g. "Bootstrap Bill"' />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Role</label>
                <select className="role-select" value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <FormField label="Trait" type="text" value={form.trait} onChange={(v) => handleChange('trait', v)} placeholder='e.g. "Unbreakable Spirit"' />
            </div>

            <div className="form-row">
              <FormField label="Bounty (Gold)" type="number" value={form.bounty} onChange={(v) => handleChange('bounty', v)} />
            </div>

            <div className="recruit-vitals-title">⚔️ Vitals</div>
            <div className="form-row">
              <SliderField label="HP" value={form.hp} onChange={(v) => handleChange('hp', v)} color="#10b981" />
              <SliderField label="Scurvy" value={form.scurvy} onChange={(v) => handleChange('scurvy', v)} color="#f59e0b" />
              <SliderField label="Morale" value={form.morale} onChange={(v) => handleChange('morale', v)} color="#8b5cf6" />
            </div>

            <div className="recruit-vitals-title">🗡️ Skills</div>
            <div className="form-row">
              <SliderField label="⚔️ Swordsmanship" value={form.swordsmanship} onChange={(v) => handleChange('swordsmanship', v)} color="#dc2626" />
              <SliderField label="💣 Gunnery" value={form.gunnery} onChange={(v) => handleChange('gunnery', v)} color="#b45309" />
              <SliderField label="🧭 Navigation" value={form.navigation} onChange={(v) => handleChange('navigation', v)} color="#0ea5e9" />
            </div>
            <div className="form-row">
              <SliderField label="🧗 Rigging" value={form.rigging} onChange={(v) => handleChange('rigging', v)} color="#84cc16" />
              <SliderField label="🥷 Stealth" value={form.stealth} onChange={(v) => handleChange('stealth', v)} color="#6366f1" />
              <SliderField label="🩺 Medicine" value={form.medicine} onChange={(v) => handleChange('medicine', v)} color="#ec4899" />
            </div>
          </div>

          <div className="recruit-footer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-recruit-confirm"
              onClick={handleRecruit}
              disabled={!form.name || !form.nickname}
            >
              ⚓ Sign the Articles — Recruit!
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function FormField({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string | number;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function SliderField({ label, value, onChange, color }: {
  label: string; value: number; onChange: (v: number) => void; color: string;
}) {
  return (
    <div className="form-field">
      <label className="form-label">{label} <span style={{ color }}>{value}</span></label>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="form-slider"
        style={{ accentColor: color }}
      />
    </div>
  );
}
