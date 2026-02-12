import PhotoCard from "./PhotoCard";
import { useEffect, useState } from "react";
import type { Photo } from "../types/photo";

interface ExpandedPhotoViewProps {
  photo: Photo;
  isAnimating: boolean;
  isClosing: boolean;
  startPosition: { top: number; left: number } | null;
  clusterPhotos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

const ExpandedPhotoView = ({
  photo,
  isClosing,
  clusterPhotos,
  currentIndex,
  onClose,
  onIndexChange,
}: ExpandedPhotoViewProps) => {
  const slides = clusterPhotos.length > 0 ? clusterPhotos : [photo];
  const clampedIndex =
    slides.length <= 1
      ? 0
      : Math.max(0, Math.min(currentIndex, slides.length - 1));
  const currentPhoto = slides[clampedIndex] ?? photo;

  const [displayedPhoto, setDisplayedPhoto] = useState<Photo>(currentPhoto);

  useEffect(() => {
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

  const handlePrev = () => {
    if (!onIndexChange) return;
    if (clampedIndex <= 0) return;
    onIndexChange(clampedIndex - 1);
  };

  const handleNext = () => {
    if (!onIndexChange) return;
    if (clampedIndex >= slides.length - 1) return;
    onIndexChange(clampedIndex + 1);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed z-[101] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="relative">
          <div
            className="pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <PhotoCard
              photo={displayedPhoto}
              expanded
              animateSize={false}
              onImageClick={onClose}
            />
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[102] pointer-events-auto transition-opacity duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            {clampedIndex > 0 && (
              <button
                className="rounded-md w-10 h-10 flex items-center justify-center transition-all border-2 font-serif text-2xl font-bold bg-[linear-gradient(180deg,var(--parchment-light)_0%,var(--parchment-mid)_100%)] border-[var(--brown-medium)] text-[var(--brown-dark)] shadow-[0_4px_8px_var(--shadow-dark),inset_0_1px_0_var(--white-highlight)] [text-shadow:0_1px_1px_var(--white-highlight-medium)]"
                onClick={handlePrev}
              >
                ‹
              </button>
            )}

            <div className="rounded-md px-4 py-2 border-2 font-serif text-sm font-semibold bg-[linear-gradient(180deg,var(--parchment-light)_0%,var(--parchment-mid)_100%)] border-[var(--brown-medium)] text-[var(--brown-dark)] shadow-[0_4px_8px_var(--shadow-dark),inset_0_1px_0_var(--white-highlight)] [text-shadow:0_1px_1px_var(--white-highlight-medium)]">
              {clampedIndex + 1} / {slides.length}
            </div>

            {clampedIndex < slides.length - 1 && (
              <button
                className="rounded-md w-10 h-10 flex items-center justify-center transition-all border-2 font-serif text-2xl font-bold bg-[linear-gradient(180deg,var(--parchment-light)_0%,var(--parchment-mid)_100%)] border-[var(--brown-medium)] text-[var(--brown-dark)] shadow-[0_4px_8px_var(--shadow-dark),inset_0_1px_0_var(--white-highlight)] [text-shadow:0_1px_1px_var(--white-highlight-medium)]"
                onClick={handleNext}
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ExpandedPhotoView;
