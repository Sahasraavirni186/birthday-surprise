import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingParticles from "./FloatingParticles";
import Confetti from "./Confetti";
import RevealPhoto from "./RevealPhoto";
import birthdayData from "../data/birthdayData";
import "./BirthdayReveal.css";

const PHOTO_COUNT = 8;

const PHOTO_POSITIONS = [
  { top: "6%", left: "4%" },
  { top: "6%", right: "4%" },
  { top: "40%", left: "1%" },
  { top: "40%", right: "1%" },
  { top: "72%", left: "5%" },
  { top: "72%", right: "5%" },
  { top: "10%", left: "50%", transform: "translateX(-50%)" },
  { top: "72%", left: "50%", transform: "translateX(-50%)" },
];

const PHOTO_ENTRANCES = [
  { x: -120, y: -20, scale: 0.55, rotate: -10 },
  { x: 120, y: -30, scale: 0.55, rotate: 12 },
  { x: -140, y: 0, scale: 0.5, rotate: -8 },
  { x: 140, y: 10, scale: 0.5, rotate: 10 },
  { x: -110, y: 40, scale: 0.55, rotate: -12 },
  { x: 110, y: 50, scale: 0.55, rotate: 8 },
  { x: 0, y: -140, scale: 0.5, rotate: 6 },
  { x: 0, y: 130, scale: 0.5, rotate: -10 },
];

const photoContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0,
    },
  },
};

const itemVariants = {
  hidden: (custom) => ({
    opacity: 0,
    x: custom.x,
    y: custom.y,
    scale: custom.scale,
    rotate: custom.rotate,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const BirthdayReveal = ({ onComplete }) => {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [phase, setPhase] = useState(reduced ? "complete" : "intro");
  const [countdownValue, setCountdownValue] = useState(null);
  const [cleanupStarted, setCleanupStarted] = useState(false);
  const { friendName, photos } = birthdayData;

  useEffect(() => {
    if (reduced || phase !== "intro") return;

    const timer = setTimeout(() => {
      setPhase("countdown");
      setCountdownValue(3);
    }, 600);

    return () => clearTimeout(timer);
  }, [phase, reduced]);

  useEffect(() => {
    if (phase !== "countdown" || countdownValue === null || reduced) return;

    if (countdownValue > 1) {
      const timer = setTimeout(() => {
        setCountdownValue(countdownValue - 1);
      }, 1200);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setPhase("celebrate");
      setCountdownValue(null);
    }, 1200);
    return () => clearTimeout(timer);
  }, [phase, countdownValue, reduced]);

  useEffect(() => {
    if (phase !== "celebrate" || reduced) return;

    const timer = setTimeout(() => {
      setPhase("name");
    }, 2000);
    return () => clearTimeout(timer);
  }, [phase, reduced]);

  useEffect(() => {
    if (phase !== "name" || reduced) return;

    const timer = setTimeout(() => {
      setPhase("photos");
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase, reduced]);

  useEffect(() => {
    if (phase !== "photos" || reduced) return;

    const timer = setTimeout(() => {
      setPhase("complete");
    }, 2500);
    return () => clearTimeout(timer);
  }, [phase, reduced]);

  const handleComplete = () => {
    setCleanupStarted(true);
    onComplete();
  };

  const showTitle =
    phase === "celebrate" ||
    phase === "name" ||
    phase === "photos" ||
    phase === "complete";

  const showName =
    phase === "name" ||
    phase === "photos" ||
    phase === "complete";

  const showPhotos =
    phase === "photos" || phase === "complete";

  const showHint = phase === "complete";

  const confettiActive =
    !reduced &&
    (phase === "celebrate" ||
      phase === "name" ||
      phase === "photos" ||
      phase === "complete") &&
    !cleanupStarted;

  return (
    <motion.div
      className="birthday-reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="reveal-bg" />
      <div className="reveal-vignette" aria-hidden="true" />
      {!reduced && <FloatingParticles count={40} />}
      {!reduced && <Confetti isActive={confettiActive} />}

      {phase === "countdown" && countdownValue !== null && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`countdown-${countdownValue}`}
            className="countdown-number"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{
              opacity: 1,
              scale: [1, 1.15, 1],
            }}
            exit={{
              opacity: 0,
              scale: 2.5,
              filter: "blur(8px)",
            }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 1, ease: "easeOut" },
            }}
          >
            {countdownValue}
          </motion.div>
        </AnimatePresence>
      )}

      <div className="reveal-content">
        {showTitle && (
          <motion.h1
            className="birthday-title"
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <span className="title-line">HAPPIEST BIRTHDAY</span>
          </motion.h1>
        )}

        {showName && (
          <motion.h1
            className="friend-name-title"
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {friendName} ❤️
          </motion.h1>
        )}

        <motion.div
          className="photo-container"
          initial="hidden"
          animate={showPhotos ? "visible" : "hidden"}
          variants={photoContainerVariants}
        >
          {photos.slice(0, PHOTO_COUNT).map((photo, i) => (
            <motion.div
              key={i}
              className="photo-spot"
              style={PHOTO_POSITIONS[i]}
              custom={PHOTO_ENTRANCES[i]}
              variants={itemVariants}
            >
              <RevealPhoto photo={photo} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {showHint && onComplete && (
        <motion.button
          type="button"
          className="reveal-hint"
          onClick={handleComplete}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="See all our little memories"
        >
          <span className="hint-text">Swipe up for our little memories</span>
          <motion.span
            className="hint-arrow"
            animate={{ y: [0, 5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ↓
          </motion.span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default BirthdayReveal;
