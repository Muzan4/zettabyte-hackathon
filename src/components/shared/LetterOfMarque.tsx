import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Scroll } from 'lucide-react';
import { RaidSquad, Mission } from '../../types';

interface Props {
  squad: RaidSquad | null;
  mission: Mission | null;
  onClose: () => void;
}

export default function LetterOfMarque({ squad, mission, onClose }: Props) {
  const [printing, setPrinting] = useState(false);

  const today = new Date();
  const oldDate = `${today.getDate()} ${today.toLocaleString('en-US', { month: 'long' })}, Anno Domini ${today.getFullYear() - 307}`;

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 300);
  };

  if (!squad || !mission) return null;

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
          initial={{ scale: 0.8, rotateY: -15 }}
          animate={{ scale: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="letter-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>

          <div className="letter-content">
            <div className="letter-header-decor">
              <span>⚓ ❧ ⚓</span>
            </div>

            <h1 className="letter-title">Letter of Marque</h1>
            <h2 className="letter-subtitle">& Reprisal</h2>

            <div className="letter-divider">✦ ✦ ✦</div>

            <p className="letter-body">
              By the Authority of the Brethren of the Coast and the Articles of the Black Galleon,
              let it be known to all Nations and upon every Sea, that the crew herein named
              are duly commissioned and empowered to undertake the following raid upon His Majesty's enemies:
            </p>

            <div className="letter-mission-box">
              <div className="letter-mission-icon">{mission.icon}</div>
              <div className="letter-mission-name">{mission.id}</div>
            </div>

            <p className="letter-body">
              The following Pirates of repute, sailing under the Black Flag, are hereby
              authorized and commanded to proceed forthwith:
            </p>

            <div className="letter-crew-list">
              {squad.members.map((p, i) => (
                <div key={p.id} className="letter-crew-entry">
                  <span className="letter-crew-num">
                    {['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ'][i] ?? i + 1}.
                  </span>
                  <span className="letter-crew-name">"{p.nickname}"</span>
                  <span className="letter-crew-role">{p.role}</span>
                </div>
              ))}
            </div>

            <div className="letter-stats">
              <span>⚔ Expected Victory: <strong>{squad.winProbability}%</strong></span>
              <span>💰 Expected Plunder: <strong>⚜ {squad.expectedLoot.toLocaleString()}</strong></span>
            </div>

            <div className="letter-divider">✦ ✦ ✦</div>

            <p className="letter-body letter-closing">
              Signed and sealed this {oldDate}, at the helm of the <em>HMS Black Galleon</em>.
              May Providence smile upon your blades and Fortune fill your holds.
            </p>

            <div className="letter-seal">
              <div className="seal-circle">
                <Scroll size={32} className="seal-icon" />
                <div className="seal-text">OFFICIAL SEAL</div>
              </div>
            </div>

            <div className="letter-signature">
              <div className="sig-line" />
              <div className="sig-label">Captain's Mark</div>
            </div>
          </div>

          <div className="letter-footer-actions">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              disabled={printing}
              className="btn-print"
            >
              <Printer size={16} />
              {printing ? 'Preparing...' : 'Print Letter'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
