import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Opening from "./components/Opening";
import BirthdayReveal from "./components/BirthdayReveal";
import MemoryGallery from "./components/MemoryGallery";
import "./App.css";

const App = () => {
  const [currentSection, setCurrentSection] = useState(0);

  return (
    <AnimatePresence mode="wait">
      {currentSection === 0 && (
        <Opening
          key="opening"
          onComplete={() => setCurrentSection(1)}
        />
      )}

      {currentSection === 1 && (
        <BirthdayReveal
          key="birthday-reveal"
          onComplete={() => setCurrentSection(2)}
        />
      )}

      {currentSection === 2 && (
        <MemoryGallery
          key="memories"
          onComplete={() => setCurrentSection(3)}
        />
      )}
    </AnimatePresence>
  );
};

export default App;
