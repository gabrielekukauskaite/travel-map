import { motion } from "framer-motion";

interface PhotoNavigationControlsProps {
  currentIndex: number;
  totalCount: number;
  onNavigate: (direction: "prev" | "next") => void;
}

const NAV_BUTTON_CLASS =
  "rounded-md w-10 h-10 flex items-center justify-center transition-all border-2 text-2xl font-semibold bg-[var(--parchment-light)] border-[var(--brown-medium)] text-[var(--brown-dark)] leading-none pb-[2px] hover:bg-[var(--parchment-dark)] hover:border-[var(--brown-dark)]";

const PhotoNavigationControls = ({
  currentIndex,
  totalCount,
  onNavigate,
}: PhotoNavigationControlsProps) => {
  return (
    <motion.div
      className="fixed bottom-10 sm:bottom-15 left-1/2 -translate-x-1/2 z-[102] pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3">
        <button
          className={NAV_BUTTON_CLASS}
          onClick={() => onNavigate("prev")}
          style={{ visibility: currentIndex > 0 ? "visible" : "hidden" }}
        >
          ‹
        </button>

        <div className="rounded-md px-4 py-2 border-2 text-sm font-semibold bg-[var(--parchment-light)] border-[var(--brown-medium)] text-[var(--brown-dark)] min-w-[80px] text-center">
          {currentIndex + 1} / {totalCount}
        </div>

        <button
          className={NAV_BUTTON_CLASS}
          onClick={() => onNavigate("next")}
          style={{
            visibility: currentIndex < totalCount - 1 ? "visible" : "hidden",
          }}
        >
          ›
        </button>
      </div>
    </motion.div>
  );
};

export default PhotoNavigationControls;
