import { motion } from "framer-motion";
import "./SectionTitle.css";

const SectionTitle = ({ title, subtitle }) => {
  return (
    <motion.div
      className="section-title"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="section-title-heading">{title}</h2>
      {subtitle && <p className="section-title-subtext">{subtitle}</p>}
    </motion.div>
  );
};

export default SectionTitle;
