import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PhotoCard from "./PhotoCard";
import PhotoModal from "./PhotoModal";
import birthdayData from "../data/birthdayData";
import "./MemoryGallery.css";

const SIZE_VARIANTS = [
  "large",
  "normal",
  "tall",
  "normal",
  "wide",
  "normal",
  "tall",
  "normal",
  "normal",
  "large",
  "normal",
  "wide",
  "normal",
  "tall",
  "normal",
  "wide",
  "normal",
  "large",
  "normal",
  "tall",
];

const ROTATIONS = [
  -3, 2, -4, 1, 3, -2, 5, -1, 4, -3, 2, -5, 1, 3, -4, 2, 5, -3, 1, -2,
];

const ENTRANCES = [
  { x: -60, y: 40 },
  { x: 60, y: 30 },
  { x: -50, y: 50 },
  { x: 50, y: 40 },
  { x: 0, y: 60 },
  { x: -40, y: 30 },
  { x: 40, y: 30 },
  { x: -30, y: 40 },
];

const galleryContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const photoItemVariants = {
  hidden: (custom) => ({
    opacity: 0,
    x: custom.x,
    y: custom.y,
    scale: 0.8,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const introVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const MemoryGallery = ({ onComplete: _onComplete }) => {
  const [modalPhoto, setModalPhoto] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);
  const { photos } = birthdayData;

  const isModalOpen = !!modalPhoto;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      if (e.key === "Escape") {
        setModalPhoto(null);
        setModalIndex(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const openModal = (photo, index) => {
    setModalPhoto(photo);
    setModalIndex(index);
  };

  const closeModal = () => {
    setModalPhoto(null);
    setModalIndex(null);
  };

  const navigateModal = (newIndex) => {
    if (newIndex >= 0 && newIndex < photos.length) {
      const photo = photos[newIndex];
      setModalPhoto(photo);
      setModalIndex(newIndex);
    }
  };

  const wrapNavigate = (delta) => {
    if (modalIndex === null) return;
    const next = (modalIndex + delta + photos.length) % photos.length;
    navigateModal(next);
  };

  return (
    <motion.div
      className={`memory-gallery${isModalOpen ? " modal-open" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="gallery-bg" />
      <div className="gallery-bokeh" aria-hidden="true">
        <div className="bokeh-orb-1" />
        <div className="bokeh-orb-2" />
      </div>
      <div className="gallery-grain" aria-hidden="true" />

      <div className="gallery-inner">
        <motion.div
          className="gallery-intro"
          variants={introVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="gallery-title">OUR LITTLE MEMORIES</h2>
          <p className="gallery-subtitle">
            Some moments are too special to stay in a camera roll.
          </p>
        </motion.div>

        <motion.div
          className="gallery-grid"
          initial="hidden"
          animate="visible"
          variants={galleryContainerVariants}
        >
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              className={`gallery-item-wrapper size-${SIZE_VARIANTS[i % SIZE_VARIANTS.length]}`}
              style={{
                "--rotation": `${ROTATIONS[i % ROTATIONS.length]}deg`,
                "--delay": `${(i % ENTRANCES.length) * 0.02}s`,
              }}
              custom={ENTRANCES[i % ENTRANCES.length]}
              variants={photoItemVariants}
            >
              <div className="gallery-item">
                <PhotoCard
                  photo={photo}
                  onClick={() => openModal(photo, i)}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <PhotoModal
        photo={modalPhoto}
        index={modalIndex}
        total={photos.length}
        isOpen={!!modalPhoto}
        onClose={closeModal}
        onPrev={() => wrapNavigate(-1)}
        onNext={() => wrapNavigate(1)}
      />
    </motion.div>
  );
};

export default MemoryGallery;
