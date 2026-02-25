import { useState } from "react";
import type { Photo } from "../../types/photo";
import PostcardFrame from "./PostcardFrame";
import PhotoStamp from "./PhotoStamp";

interface PhotoCardProps {
  photo: Photo;
  expanded: boolean;
  hasMultiplePhotos?: boolean;
  onImageClick?: () => void;
}

const PhotoCard = ({
  photo: { url, title, date },
  expanded,
  hasMultiplePhotos = false,
  onImageClick,
}: PhotoCardProps) => {
  // Check if image is already cached
  const isImageCached = () => {
    const img = new Image();
    img.src = url;
    return img.complete;
  };

  const [loadedUrl, setLoadedUrl] = useState<string | null>(() =>
    isImageCached() ? url : null,
  );
  const isImageLoaded = loadedUrl === url;

  return (
    <div className="relative">
      {/* Fake postcards for depth effect - only show when not expanded and there are multiple photos */}
      {!expanded && hasMultiplePhotos && (
        <>
          {/* Third layer - furthest back */}
          <div className="absolute border-2 rounded-sm border-[var(--brown-dark)] p-2 bg-[var(--parchment-mid)] top-[-6px] left-[6px] right-[-6px] bottom-[6px] opacity-100 z-[-2]" />
          {/* Second layer - middle */}
          <div className="absolute border-2 rounded-sm border-[var(--brown-dark)] p-2 bg-[var(--parchment-light)] top-[-3px] left-[3px] right-[-3px] bottom-[3px] opacity-100 z-[-1]" />
        </>
      )}

      {/* Main postcard */}
      <PostcardFrame
        outerClassName="border-1 group z-0"
        innerClassName={`box-border`}
      >
        <img
          src={url}
          alt={title || "Photo"}
          className={`w-full h-full transition-opacity duration-200 ${
            expanded ? "cursor-zoom-out" : "cursor-zoom-in"
          } ${isImageLoaded ? "opacity-100" : "opacity-0"} select-none [-webkit-touch-callout:none] border-2 border-[var(--brown-medium)] object-contain bg-[var(--parchment-light)] max-w-[500px] max-h-[500px]`}
          onClick={onImageClick}
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
          onLoad={() => setLoadedUrl(url)}
          onError={() => setLoadedUrl(url)}
        />

        {/* <PhotoStamp title={title} date={date} /> */}
      </PostcardFrame>
    </div>
  );
};

export default PhotoCard;
