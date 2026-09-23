import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "./PhotoModal.css";

const PhotoModal = ({
  photo,
  index,
  total,
  isOpen,
  onClose,
  onPrev,
  onNext,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="photo-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="photo-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <button
              type="button"
              className="modal-nav modal-nav-prev"
              onClick={onPrev}
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              className="modal-nav modal-nav-next"
              onClick={onNext}
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>

            <div className="modal-photo-container">
              <motion.img
                src={photo.image}
                alt={photo.title || "Birthday memory"}
                className="modal-photo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onError={(e) => {
                  e.target.style.display = "none";
                  const placeholder = e.target.parentNode.querySelector(
                    ".modal-photo-placeholder"
                  );
                  if (placeholder) placeholder.style.display = "flex";
                }}
              />
              <div className="modal-photo-placeholder" aria-hidden="true">
                <span className="modal-placeholder-icon">⟡</span>
              </div>
            </div>

            <motion.div
              className="modal-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="modal-title">{photo.title || "[MEMORY TITLE]"}</h3>
              <p className="modal-date">{photo.date || "[DATE]"}</p>
              <p className="modal-message">
                {photo.message || "[MEMORY]"}
              </p>
            </motion.div>

            <div className="modal-counter">
              {index !== null ? `${index + 1} / ${total}` : ""}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoModal;
