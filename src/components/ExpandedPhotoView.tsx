import PhotoNavigationControls from "./PhotoNavigationControls";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Photo } from "../types/photo";
import { isMobile } from "react-device-detect";
import PostcardFrame from "./photoCard/PostcardFrame";

interface ExpandedPhotoViewProps {
  photo: Photo;
  startPosition: { top: number; left: number } | null;
  clusterPhotos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

const ExpandedPhotoView = ({
  photo,
  startPosition,
  clusterPhotos,
  currentIndex,
  onClose,
  onIndexChange,
}: ExpandedPhotoViewProps) => {
  const slides = clusterPhotos.length > 0 ? clusterPhotos : [photo];
  const clampedIndex = Math.max(0, Math.min(currentIndex, slides.length - 1));
  const currentPhoto = slides[clampedIndex] ?? photo;

  const [displayedPhoto, setDisplayedPhoto] = useState<Photo>(currentPhoto);
  const [direction, setDirection] = useState<"prev" | "next" | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (displayedPhoto.url === currentPhoto.url) return;

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      setDisplayedPhoto(currentPhoto);
    };
    img.onerror = () => {
      if (cancelled) return;
      setDisplayedPhoto(currentPhoto);
    };
    img.src = currentPhoto.url;

    if (img.complete) {
      setDisplayedPhoto(currentPhoto);
    }

    return () => {
      cancelled = true;
    };
  }, [currentPhoto, displayedPhoto.url]);

  const handleNavigate = (dir: "prev" | "next") => {
    if (!onIndexChange) return;
    setDirection(dir);
    const newIndex = dir === "prev" ? clampedIndex - 1 : clampedIndex + 1;
    if (newIndex >= 0 && newIndex < slides.length) {
      onIndexChange(newIndex);
    }
  };

  // Calculate initial position offset from center
  const initialPos = startPosition
    ? {
        x: startPosition.left - window.innerWidth / 2,
        y: startPosition.top - window.innerHeight / 2,
      }
    : { x: 0, y: 0 };

  // Slide animation variants
  const slideVariants = {
    enter: (direction: "prev" | "next" | null) => ({
      x: direction === "prev" ? -100 : direction === "next" ? 100 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "prev" | "next" | null) => ({
      x: direction === "prev" ? 100 : direction === "next" ? -100 : 0,
      opacity: 0,
    }),
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[100] bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      <motion.div
        className="fixed z-[101] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{
          x: initialPos.x,
          y: initialPos.y,
          scale: startPosition ? 0.5 : 0.9,
          opacity: startPosition ? 1 : 0,
        }}
        animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={displayedPhoto.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {/* Single postcard containing photo and info */}
            <PostcardFrame>
              <img
                src={displayedPhoto.url}
                alt={displayedPhoto.title || "Photo"}
                className="block select-none border-2 border-[var(--brown-medium)] max-w-[80vw] max-h-[80vh] sm:max-w-[min(70vw,750px)] sm:max-h-[min(70vh,750px)]"
                onClick={isMobile ? undefined : onClose}
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
              {/* <PhotoStamp
                title={displayedPhoto.title}
                date={displayedPhoto.date}
              /> */}
            </PostcardFrame>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {slides.length > 1 && (
        <PhotoNavigationControls
          currentIndex={clampedIndex}
          totalCount={slides.length}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
};

export default ExpandedPhotoView;
