import type { GeoJSONFeature } from "mapbox-gl";
import { useState, useRef, useEffect } from "react";

interface SidePanelProps {
  feature: GeoJSONFeature;
  onClose: () => void;
}

//https://fonts.google.com/specimen/Kalam?preview.text=hello
const PLACEHOLDER_TITLE = "Untitled Location";
const PLACEHOLDER_DESCRIPTION = "No description available.";

const Postcard = ({ feature, onClose }: SidePanelProps) => {
  const { title, description, url } = feature.properties || {};
  const coords =
    feature.geometry.type === "Point" ? feature.geometry.coordinates : null;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({
    width: 384,
    height: 256,
  });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageLoad = () => {
    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      const aspectRatio = naturalWidth / naturalHeight;
      const maxWidth = 500;
      const maxHeight = 400;

      let width, height;

      if (aspectRatio > 1) {
        // Landscape
        width = Math.min(maxWidth, naturalWidth);
        height = width / aspectRatio;
      } else {
        // Portrait or square
        height = Math.min(maxHeight, naturalHeight);
        width = height * aspectRatio;
      }

      setImageDimensions({ width, height });
    }
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div
      className="absolute top-40 left-1/2 -translate-x-1/2 z-10"
      style={{
        width: `${imageDimensions.width + 8}px`,
        height: `${imageDimensions.height + 8}px`,
        transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Push Pin */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-30 pointer-events-none">
        <div className="relative">
          {/* Pin head - glossy 3D effect */}
          <div className="relative w-7 h-7">
            {/* Main head body */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-red-600 to-red-800 rounded-full"></div>
            {/* Top highlight for glossy effect */}
            <div className="absolute top-0.5 left-1 w-3 h-3 bg-gradient-to-br from-white/60 to-transparent rounded-full"></div>
            {/* Bottom shadow for depth */}
            <div className="absolute bottom-0 inset-x-1 h-2 bg-black/30 rounded-full blur-sm"></div>
            {/* Outer rim */}
            <div className="absolute inset-0 rounded-full ring-1 ring-red-900/50"></div>
          </div>

          {/* Pin needle - metallic with perspective */}
          <div
            className="absolute top-6 left-1/2 -translate-x-1/2 w-1 h-4 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 shadow-md"
            style={{ clipPath: "polygon(40% 0, 60% 0, 50% 100%)" }}
          ></div>

          {/* Pin entry point shadow */}
          <div className="absolute top-9 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/30 rounded-full blur-md"></div>

          {/* Pin shadow cast on card */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-5 h-3 bg-gradient-radial from-black/20 to-transparent rounded-full blur-sm"></div>
        </div>
      </div>

      <div className="relative h-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-200 shadow-2xl">
        {/* Option 6: Rounded Square */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-white hover:bg-gray-100 text-red-600 font-bold rounded border-2 border-red-600 z-20"
        >
          ✕
        </button>

        <div className="p-2 h-full flex items-center justify-center">
          <div className="relative max-w-full max-h-full">
            <img
              ref={imgRef}
              src={url}
              alt={title}
              onLoad={handleImageLoad}
              className="max-w-full max-h-full object-contain bg-white border-4 border-white shadow-md"
            />

            {/* Title overlay: bottom of postcard, on top of photo */}
            <div className="absolute inset-x-1 bottom-1 pointer-events-none">
              <h3
                className="text-lg font-extrabold text-white truncate px-2"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.85)" }}
              >
                {title || PLACEHOLDER_TITLE}
              </h3>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-200 opacity-0 hover:opacity-100 transition-opacity p-4 flex gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase mb-2 border-b border-gray-300 pb-1">
              Message
            </div>
            <p className="text-sm text-gray-700 font-serif">
              {description || PLACEHOLDER_DESCRIPTION}
            </p>
          </div>

          <div className="w-px bg-gray-400" />

          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase mb-2 border-b border-gray-300 pb-1">
              Location
            </div>
            {coords && (
              <div className="text-sm text-gray-700 font-mono">
                <div>Lat: {coords[1].toFixed(4)}°</div>
                <div>Lng: {coords[0].toFixed(4)}°</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Postcard;
