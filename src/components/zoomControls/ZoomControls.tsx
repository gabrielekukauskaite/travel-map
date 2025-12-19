import { useRef } from "react";
import EarthIcon from "./EarthIcon";
import ParchmentBackground from "./ParchmentBackground";

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
    if (!continentGroup) return;

    continentGroup.style.fill = "#FFD700";
    svgRef.current?.querySelectorAll("g").forEach((g) => {
      if (g !== continentGroup) g.style.fill = "";
    });
  };

  const handleMouseLeave = () => {
    svgRef.current?.querySelectorAll("g").forEach((g) => (g.style.fill = ""));
  };

  return (
    <ParchmentBackground>
      <EarthIcon
        ref={svgRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: "100%",
          cursor: "pointer",
          filter: "sepia(0.15) contrast(1.05)",
        }}
      />
    </ParchmentBackground>
  );
}
