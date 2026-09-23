import { useState } from "react";
import { motion } from "framer-motion";
import "./RevealPhoto.css";

const RevealPhoto = ({ photo }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      className="reveal-photo-wrapper"
      whileHover={{ scale: 1.06, y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {imgError ? (
        <div className="reveal-photo-placeholder" aria-label="Image unavailable">
          <span className="reveal-placeholder-icon" aria-hidden="true">
            ⟡
          </span>
        </div>
      ) : (
        <img
          src={photo.image}
          alt={photo.title || "Birthday memory"}
          className="reveal-photo-img"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}
    </motion.div>
  );
};

export default RevealPhoto;
