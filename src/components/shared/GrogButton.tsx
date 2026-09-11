import { motion } from 'framer-motion';
import { useCrewStore } from '../../store/crewStore';

const PIRATE_QUOTES = [
  "Dead men tell no tales, but they still owe ye gold!",
  "Arr, ten grog to starboard, morale's on the mend!",
  "Splice the mainbrace — the ship sails better with merry hearts!",
  "Yo ho ho, a bottle of rum for every soul aboard!",
  "The sea gives, the sea takes — today she gives grog!",
];

export default function GrogButton() {
  const { ship, spliceMainbrace } = useCrewStore();
  const canGrog = ship.grog >= 10;

  const handleClick = () => {
    if (!canGrog) return;
    spliceMainbrace();
    const quote = PIRATE_QUOTES[Math.floor(Math.random() * PIRATE_QUOTES.length)];
    // Brief toast (we'll just use console for now, or show inline)
    console.log(quote);
  };

  return (
    <motion.button
      whileHover={{ scale: canGrog ? 1.05 : 1 }}
      whileTap={{ scale: canGrog ? 0.95 : 1 }}
      onClick={handleClick}
      disabled={!canGrog}
      className={`grog-btn ${!canGrog ? 'grog-btn--disabled' : ''}`}
      title={canGrog ? `Spend 10 Grog → +20% Morale for ALL crew` : 'Not enough grog! (Need 10)'}
    >
      🍺 Splice the Mainbrace
      <span className="grog-cost">-10 Grog</span>
    </motion.button>
  );
}
