import { useState } from "react";
import { motion } from "framer-motion";
import "./PhotoCard.css";

const PhotoCard = ({ photo, onClick }) => {
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    if (onClick) onClick(photo);
  };

  return (
    <motion.div
      className="photo-card-wrapper"
      whileHover={{ scale: 1.05, y: -6 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="photo-frame">
        <div className="photo-inner">
          {imgError ? (
            <div className="photo-placeholder">
              <span className="placeholder-icon" aria-hidden="true">
                ⟡
              </span>
              <span className="placeholder-text">
                {photo.title || "[MEMORY]"}
              </span>
            </div>
          ) : (
            <img
              src={photo.image}
              alt={photo.title || "Birthday memory"}
              className="photo-img"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <div className="photo-caption">
  <p className="photo-message">{photo.message}</p>
</div>
      </div>
    </motion.div>
  );
};

export default PhotoCard;
