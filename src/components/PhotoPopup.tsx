import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import type { Photo } from "../types/photo";
import PhotoCard from "./PhotoCard";

interface PhotoPopupProps {
  photo: Photo;
  onExpand?: () => void;
  initialExpanded?: boolean;
  hasMultiplePhotos?: boolean;
}

const PhotoPopup = ({
  photo,
  onExpand,
  initialExpanded = false,
  hasMultiplePhotos = false,
}: PhotoPopupProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // Update expanded state when initialExpanded prop changes
  useEffect(() => {
    setIsExpanded(initialExpanded);
  }, [initialExpanded]);

  const handleImageClick = () => {
    if (onExpand) {
      onExpand();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <PhotoCard
      photo={photo}
      expanded={isExpanded}
      hasMultiplePhotos={hasMultiplePhotos}
      onImageClick={handleImageClick}
    />
  );
};

export default PhotoPopup;

export const createPhotoPopupElement = (
  props: PhotoPopupProps,
): HTMLElement => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<PhotoPopup {...props} />);
  return container;
};
