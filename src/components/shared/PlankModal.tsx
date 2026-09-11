import { motion, AnimatePresence } from 'framer-motion';
import { useCrewStore } from '../../store/crewStore';
import { Waves } from 'lucide-react';

const PLANK_QUOTES = [
  "SPLASH! Davy Jones says hello, ye bilge rat!",
  "The sharks send their regards, scallywag!",
  "May the tide carry ye to Fiddler's Green!",
  "One less mouth to feed! The ship sails lighter!",
  "Walk it, ye yellow-bellied sea snake!",
];

export default function PlankModal() {
  const { plankTarget, crew, walkThePlank, cancelPlank } = useCrewStore();
  const target = crew.find((p) => p.id === plankTarget);

  const handleConfirm = () => {
    if (plankTarget) {
      const quote = PLANK_QUOTES[Math.floor(Math.random() * PLANK_QUOTES.length)];
      console.log(quote);
      walkThePlank(plankTarget);
    }
  };

  return (
    <AnimatePresence>
      {plankTarget && target && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={cancelPlank}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            className="plank-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="plank-header">
              <Waves size={36} className="plank-icon" />
              <h2 className="plank-title">WALK THE PLANK!</h2>
            </div>

            <div className="plank-plankboard">
              <span>🪵</span>
              <div className="plank-board-line" />
              <span>🌊</span>
            </div>

            <p className="plank-text">
              Are ye sure ye want to discharge{' '}
              <span className="pirate-name-highlight">"{target.nickname}"</span>?<br />
              <span className="plank-subtext">
                {target.name} will be sent to Davy Jones' Locker. There's no coming back from the deep!
              </span>
            </p>

            <div className="plank-actions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirm}
                className="btn-plank-confirm"
              >
                ⚓ WALK THE PLANK!
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cancelPlank}
                className="btn-plank-cancel"
              >
                🏳️ Spare the Wretch
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
