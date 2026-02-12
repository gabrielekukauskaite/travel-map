import LocationIcon from "./icons/LocationIcon";
import CalendarIcon from "./icons/CalendarIcon";
import { useState } from "react";
import type { Photo } from "../types/photo";

interface PhotoCardProps {
  photo: Photo;
  expanded: boolean;
  hasMultiplePhotos?: boolean;
  onImageClick?: () => void;
  animateSize?: boolean;
}

const PhotoCard = ({
  photo: { url, title, date, description, orientation },
  expanded,
  hasMultiplePhotos = false,
  onImageClick,
  animateSize = true,
}: PhotoCardProps) => {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(() => url);
  const isImageLoaded = loadedUrl === url;

  const sizeTransitionClassName = animateSize
    ? "transition-[width,height] duration-500 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] [will-change:width,height]"
    : "transition-none";

  let frameSizeClassName = "";
  if (expanded) {
    if (orientation === "portrait") {
      frameSizeClassName =
        "aspect-[2/3] w-[min(520px,calc(100vw-6rem),calc((100vh-6rem)*2/3))] sm:w-[min(640px,calc(100vw-8rem),calc((100vh-8rem)*2/3))]";
    } else {
      frameSizeClassName =
        "aspect-[3/2] w-[min(720px,calc(100vw-6rem),calc((100vh-6rem)*3/2))] sm:w-[min(960px,calc(100vw-8rem),calc((100vh-8rem)*3/2))]";
    }
  } else {
    if (orientation === "portrait") {
      frameSizeClassName = "w-[333px] h-[500px]";
    } else {
      frameSizeClassName = "w-[500px] h-[333px]";
    }
  }

  return (
    <div className="relative">
      {/* Fake postcards for depth effect - only show when not expanded and there are multiple photos */}
      {!expanded && hasMultiplePhotos && (
        <>
          {/* Third layer - furthest back */}
          <div className="absolute border border-black p-2 bg-[var(--parchment-mid)] top-[-6px] left-[6px] right-[-6px] bottom-[6px] opacity-100 z-[-2]" />
          {/* Second layer - middle */}
          <div className="absolute border border-black p-2 bg-[var(--parchment-light)] top-[-3px] left-[3px] right-[-3px] bottom-[3px] opacity-100 z-[-1]" />
        </>
      )}

      {/* Main postcard */}
      <div className="border border-black p-2 group relative z-0 bg-[var(--background-light)]">
        <div
          className={`border border-[var(--brown-light)] relative overflow-hidden ${sizeTransitionClassName} ${frameSizeClassName}`}
        >
          <img
            key={url}
            src={url}
            alt={title || "Photo"}
            className={`w-full h-full transition-opacity duration-200 ${
              expanded ? "cursor-zoom-out" : "cursor-zoom-in"
            } ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
            onClick={onImageClick}
            onLoad={() => setLoadedUrl(url)}
            onError={() => setLoadedUrl(url)}
          />

          <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--gold-border-light)] px-4 py-3 flex justify-between items-center gap-3 bg-[linear-gradient(to_top,var(--parchment-overlay-1)_0%,var(--parchment-overlay-2)_100%)]">
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h6 className="text-sm font-bold text-[var(--brown-dark)] font-serif m-0 whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1.5 [text-shadow:0_1px_2px_var(--white-highlight-strong)]">
                  <LocationIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  {title || "Untitled Location"}
                </h6>
                {date && (
                  <div className="text-sm text-[var(--brown-medium)] font-serif whitespace-nowrap flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    {new Date(date).toLocaleDateString("en-US", {
                      year: "2-digit",
                      month: "short",
                      day: "2-digit",
                    })}
                  </div>
                )}
              </div>

              <p
                className={`text-xs text-[var(--brown-medium)] font-serif m-0 mt-1 overflow-hidden transition-all duration-300 ${
                  expanded ? "max-h-20" : "max-h-0"
                } [text-shadow:0_1px_2px_var(--white-highlight-strong)]`}
              >
                {description ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque maximus elit vitae purus cursus, quis rhoncus purus cursus."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
