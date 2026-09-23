import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingParticles from "./FloatingParticles";
import MusicControl from "./MusicControl";
import birthdayData from "../data/birthdayData";
import "./Opening.css";

const Opening = ({ onComplete }) => {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [phase, setPhase] = useState(reduced ? "ready" : "initial");
  const [isClicked, setIsClicked] = useState(false);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    if (isClicked || reduced) return;

    timeoutsRef.current = [
      setTimeout(() => setPhase("hey"), 1000),
      setTimeout(() => setPhase("made"), 2800),
      setTimeout(() => setPhase("waiting"), 4800),
      setTimeout(() => setPhase("ready"), 6600),
    ];

    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, [isClicked, reduced]);

  const handleEnter = () => {
    if (isClicked) return;
    setIsClicked(true);
  };

  const handleAnimationComplete = () => {
    if (isClicked && onComplete) {
      onComplete();
    }
  };

  const textTransition = { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] };

  return (
    <motion.div
      className="opening"
      initial={{ opacity: 0 }}
      animate={isClicked ? { opacity: 0, scale: 1.03 } : { opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0.3 : 1.2, ease: "easeInOut" }}
      onAnimationComplete={handleAnimationComplete}
    >
      <motion.div
        className="opening-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 1.5, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {!reduced && <FloatingParticles count={80} />}

      <div className="opening-vignette" aria-hidden="true" />

      <div className="opening-content">
        <div className="opening-text">
          <AnimatePresence mode="wait">
            {phase === "hey" && (
              <motion.p
                key="hey"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={textTransition}
              >
                Hey…
              </motion.p>
            )}

            {phase === "made" && (
              <motion.p
                key="made"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={textTransition}
              >
                There&apos;s something I made for you.
              </motion.p>
            )}

            {phase === "waiting" && (
              <motion.p
                key="waiting"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={textTransition}
              >
                Something special is waiting for you…
              </motion.p>
            )}

            {phase === "ready" && (
              <motion.div
                key="ready"
                className="opening-ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={textTransition}
              >
                <p className="ready-line">Something special is waiting for you…</p>
                <p className="ready-subtext">
                  For&nbsp;
                  <span className="friend-name">{birthdayData.friendName}</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {phase === "ready" && (
            <motion.button
              key="enter-btn"
              className="enter-btn"
              onClick={handleEnter}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -6, 0],
              }}
              exit={{ opacity: 0, scale: 0.85, y: 0 }}
              transition={{
                opacity: { duration: 0.6, delay: 0.3 },
                scale: { duration: 0.5, delay: 0.3, ease: "easeOut" },
                y: {
                  duration: 3,
                  delay: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }}
              whileHover={{
                scale: 1.08,
                boxShadow:
                  "0 0 40px rgba(255, 255, 255, 0.45), 0 0 60px rgba(173, 132, 252, 0.45)",
              }}
              whileTap={{ scale: 0.9 }}
              type="button"
              aria-label="Open your surprise birthday experience"
            >
              {birthdayData.buttonText}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <MusicControl musicSrc={birthdayData.music.src} />
    </motion.div>
  );
};

export default Opening;
