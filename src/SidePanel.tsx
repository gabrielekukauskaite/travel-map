import type { GeoJSONFeature } from "mapbox-gl";

interface SidePanelProps {
  feature: GeoJSONFeature;
}

const PLACEHOLDER_TITLE = "Untitled Location";
const PLACEHOLDER_DESCRIPTION = "No description available.";

const SidePanel = ({ feature }: SidePanelProps) => {
  return (
    <div
      className="absolute backdrop-blur-lg bg-white/60"
      style={{
        top: 24,
        left: 24,
        width: 400,
        borderRadius: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        border: "1px solid #ddd",
        padding: 5,
        zIndex: 10,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <img
        src={feature.properties?.url}
        alt={feature.properties?.title}
        style={{ width: "100%", height: "auto" }}
      />
      <h2 className="font-bold text-xl">
        {feature.properties?.title || PLACEHOLDER_TITLE}
      </h2>
      <p>
        {new Date(feature.properties?.date).toLocaleDateString("default", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p>{feature.properties?.description || PLACEHOLDER_DESCRIPTION}</p>
    </div>
  );
};
export default SidePanel;
