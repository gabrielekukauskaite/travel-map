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
        boxShadow: "0 0 15px rgba(0,0,0,0.3)",
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-8 h-8 bg-white hover:bg-gray-100 text-red-600 font-bold rounded border-2 border-red-600 z-20"
      >
        ✕
      </button>

      {/* Outer black border */}
      <div
        style={{
          border: "1px solid #000",
          padding: "5px",
          background: "#f5f1e8",
          position: "relative",
        }}
      >
        {/* Inner border */}
        <div style={{ border: "1px solid #8b6f47", position: "relative" }}>
          <img
            ref={imgRef}
            src={url}
            alt={title}
            onLoad={handleImageLoad}
            className="block max-w-full max-h-full object-contain bg-white"
          />

          {/* Collapsible info overlay */}
          <div
            className="absolute bottom-0 left-0 right-0"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            style={{
              background:
                "linear-gradient(to top, rgba(245, 232, 212, 0.95) 0%, rgba(245, 232, 212, 0.85) 100%)",
              borderTop: "1px solid rgba(139, 111, 71, 0.5)",
              transition: "all 0.3s ease-in-out",
              maxHeight: isExpanded ? "400px" : "50px",
              overflow: "hidden",
              cursor: "default",
            }}
          >
            {/* Title - always visible */}
            <div
              style={{
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                className="text-lg font-bold truncate"
                style={{
                  color: "#3d2817",
                  fontFamily: "Garamond, Georgia, serif",
                  textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                  flex: 1,
                }}
              >
                {title || PLACEHOLDER_TITLE}
              </h3>
              {date && (
                <div
                  className="text-sm"
                  style={{
                    color: "#6b5438",
                    fontFamily: "Garamond, Georgia, serif",
                    fontStyle: "italic",
                    marginLeft: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(date).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Expandable content */}
            <div
              style={{
                padding: "0 16px 12px 16px",
                opacity: isExpanded ? 1 : 0,
                transition: "opacity 0.3s ease-in-out 0.1s",
              }}
            >
              <p
                className="font-serif leading-snug line-clamp-3"
                style={{ color: "#3d2817" }}
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
