import { useRef, useState } from "react";
import Background from "./Background";
import Label from "./Label";
import EarthIcon from "../icons/EarthIcon";
import CompassIcon from "../icons/CompassIcon";

const CONTINENT_COORDS: Record<string, [number, number, number]> = {
  africa: [10, -8, 3],
  asia: [105, 45, 3.5],
  australia: [135, -25, 3],
  europe: [20, 55, 3],
  "north-america": [-100, 45, 3.2],
  "south-america": [-60, -15, 3.2],
};

export default function EarthButton() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const navigateToContinent = (continentId: string) => {
    const coords = CONTINENT_COORDS[continentId];
    if (!coords) return;

    const mapInstance = (window as any).mapInstance;
    if (mapInstance) {
      mapInstance.easeTo({
        center: [coords[0], coords[1]],
        zoom: coords[2],
        duration: 1000,
      });
    }
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const continentGroup = (e.target as SVGElement).closest("g");
    if (continentGroup?.id) navigateToContinent(continentGroup.id);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const continentGroup = (e.target as SVGElement).closest("g");
    if (!continentGroup) {
      svgRef.current?.querySelectorAll("g").forEach((g) => {
        if (g !== continentGroup) g.style.filter = "";
      });
      return;
    }

    continentGroup.style.filter = "brightness(1.2)";
    svgRef.current?.querySelectorAll("g").forEach((g) => {
      if (g !== continentGroup) g.style.filter = "";
    });
  };

  const handleMouseLeave = () => {
    svgRef.current?.querySelectorAll("g").forEach((g) => (g.style.filter = ""));
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsExpanded(false);
    }, 400);
  };

  const compassIcon = (
    <div
      onClick={isExpanded ? handleClose : () => setIsExpanded(true)}
      className="w-20 h-20 cursor-pointer flex items-center justify-center transition-all duration-[400ms] ease-in-out"
    >
      <CompassIcon className="w-full h-full [filter:sepia(0.15)_contrast(1.05)]" />
    </div>
  );

  if (!isExpanded) {
    return compassIcon;
  }

  return (
    <div className="relative w-20 h-20">
      <style>{`
        @keyframes expandIn {
          from {
            opacity: 0;
            transform: scale(0.3);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes collapseOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.3);
          }
        }
      `}</style>

      <div
        className={`absolute bottom-0 left-0 [transform-origin:bottom_left] ${
          isClosing
            ? "[animation:collapseOut_0.4s_ease-in-out_forwards]"
            : "[animation:expandIn_0.4s_ease-in-out]"
        }`}
      >
        <Background>
          <Label />

          <EarthIcon
            ref={svgRef}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full [filter:sepia(0.15)_contrast(1.05)]"
          />
        </Background>
      </div>

      {/* Compass icon in bottom left corner */}
      <div className="absolute bottom-0 left-0 z-10">{compassIcon}</div>
    </div>
  );
}
