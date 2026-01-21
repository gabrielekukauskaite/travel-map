import type { GeoJSONFeature } from "mapbox-gl";
import { useState, useRef } from "react";

interface PostcardProps {
  feature: GeoJSONFeature;
  onClose: () => void;
}

//https://fonts.google.com/specimen/Kalam?preview.text=hello
const PLACEHOLDER_TITLE = "Untitled Location";
const PLACEHOLDER_DESCRIPTION = "No description available.";

const Postcard = ({ feature, onClose }: PostcardProps) => {
  const { title, description, url, date } = feature.properties || {};

  const [imageDimensions, setImageDimensions] = useState({
    width: 384,
    height: 256,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = () => {
    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      const aspectRatio = naturalWidth / naturalHeight;
      const maxWidthHeight = 800;

      let width, height;

      if (aspectRatio > 1) {
        // Landscape
        width = Math.min(maxWidthHeight, naturalWidth);
        height = width / aspectRatio;
      } else {
        // Portrait or square
        height = Math.min(maxWidthHeight, naturalHeight);
        width = height * aspectRatio;
      }

      setImageDimensions({ width, height });
    }
  };

  return (
    <div
      className="absolute bottom-15 right-15 z-999"
      style={{
        width: `${imageDimensions.width}px`,
        height: `${imageDimensions.height}px`,
        boxShadow: "0 0 15px var(--shadow-dark)",
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-7 h-7 m-2 rounded-full border flex items-center justify-center z-20 cursor-pointer transition-colors duration-200"
        style={{
          background:
            "linear-gradient(to top, var(--parchment-overlay-1) 0%, var(--parchment-overlay-2) 100%)",
          borderColor: "var(--brown-light)",
          color: "var(--brown-light)",
          fontSize: "18px",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background =
            "linear-gradient(to top, var(--parchment-overlay-hover-1) 0%, var(--parchment-overlay-hover-2) 100%)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--parchment-light)")
        }
      >
        ×
      </button>

      {/* Outer black border */}
      <div
        className="border border-black p-1.5 relative"
        style={{ background: "var(--background-light)" }}
      >
        {/* Inner border */}
        <div
          className="relative"
          style={{ border: "1px solid var(--brown-light)" }}
        >
          <img
            ref={imgRef}
            src={url}
            alt={title}
            onLoad={handleImageLoad}
            className="block max-w-full max-h-full object-contain bg-white"
          />

          {/* Collapsible info overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden cursor-default transition-all duration-300"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            style={{
              background:
                "linear-gradient(to top, var(--parchment-overlay-1) 0%, var(--parchment-overlay-2) 100%)",
              borderTop: "1px solid var(--gold-border-light)",
              maxHeight: isExpanded ? "400px" : "50px",
            }}
          >
            {/* Title - always visible */}
            <div className="py-3 px-4 flex justify-between items-center">
              <h3
                className="text-lg font-bold truncate flex-1"
                style={{
                  color: "var(--brown-dark)",
                  fontFamily: "Garamond, Georgia, serif",
                  textShadow: "0 1px 2px var(--white-highlight-strong)",
                }}
              >
                {title || PLACEHOLDER_TITLE}
              </h3>
              {date && (
                <div
                  className="text-sm italic ml-3 whitespace-nowrap"
                  style={{
                    color: "var(--brown-medium)",
                    fontFamily: "Garamond, Georgia, serif",
                  }}
                >
                  {new Date(date).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Expandable content */}
            <div
              className="px-4 pb-3 transition-opacity duration-300 delay-100"
              style={{
                opacity: isExpanded ? 1 : 0,
              }}
            >
              <p
                className="font-serif leading-snug line-clamp-3"
                style={{ color: "var(--brown-dark)" }}
              >
                {description || PLACEHOLDER_DESCRIPTION}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Postcard;
