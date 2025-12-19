import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import mapboxgl, { Map, type GeoJSONFeature } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { getPhotos } from "../../api/firebase";
import { createGeoJson } from "../utils/createGeoJson";
import {
  addClusterPhotosLayer,
  addTransparentCirclesLayer,
  addUnclusteredPhotosLayer,
} from "../utils/mapLayers";
import { addSource } from "../utils/mapSource";
import { updateFeatureThumbnail } from "../utils/updateFeatureThumbnail";
import Nameplate from "./Nameplate";
import ZoomControls from "./zoomControls/ZoomControls";
import Postcard from "./Postcard";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const MAPBOX_STYLE = "mapbox://styles/mapbox/outdoors-v12";

function App() {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [activeFeature, setActiveFeature] = useState<GeoJSONFeature | null>(
    null,
  );

  const throttleTimeoutRef = useRef<number | null>(null);

  const throttledUpdate = () => {
    if (throttleTimeoutRef.current) {
      return;
    }

    updateFeatureThumbnail(mapRef.current!);

    throttleTimeoutRef.current = setTimeout(() => {
      throttleTimeoutRef.current = null;
    }, 500);
  };

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new Map({
        container: mapContainerRef.current,
        style: MAPBOX_STYLE,
        zoom: 1,
      });

      mapRef.current.on("load", async () => {
        // Expose map instance globally for EarthButton and other components
        (window as any).mapInstance = mapRef.current;

        const markerData = await getPhotos();
        const geoJson = createGeoJson(markerData);

        if (mapRef.current === null) return;

        addSource(mapRef.current, geoJson);
        addTransparentCirclesLayer(mapRef.current);
        addClusterPhotosLayer(mapRef.current);

        addUnclusteredPhotosLayer(mapRef.current);

        mapRef.current?.on("move", throttledUpdate);
        mapRef.current?.on("idle", () => {
          updateFeatureThumbnail(mapRef.current!);
        });

        // Add click handler for unclustered photos
        mapRef.current?.on("click", "unclustered-photos", (e) => {
          const features = e.features as GeoJSONFeature[];
          console.log("Clicked unclustered photo:", features);
          if (features && features.length > 0) {
            console.log("Setting active feature:", features[0]);
            setActiveFeature(features[0]);
          }
        });

        // Change cursor to pointer when hovering over unclustered photos
        mapRef.current?.on("mouseenter", "unclustered-photos", () => {
          mapRef.current?.getCanvas().style.setProperty("cursor", "pointer");
        });
        mapRef.current?.on("mouseleave", "unclustered-photos", () => {
          mapRef.current?.getCanvas().style.setProperty("cursor", "");
        });

        mapRef.current?.on("click", "cluster-photos", (e) => {
          const features = e.features as GeoJSONFeature[];
          if (!features || features.length === 0) return;

          const clusterId = features[0].properties?.cluster_id;
          if (!clusterId) return;

          const source = mapRef.current?.getSource(
            "photos",
          ) as mapboxgl.GeoJSONSource;
          if (!source) return;

          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || zoom == null) return;

            mapRef.current?.easeTo({
              center: (features[0].geometry as any).coordinates,
              zoom,
              duration: 500,
            });
          });
        });

        // Optional: Change cursor to pointer when hovering over clusters
        mapRef.current?.on("mouseenter", "cluster-photos", () => {
          mapRef.current?.getCanvas().style.setProperty("cursor", "pointer");
        });
        mapRef.current?.on("mouseleave", "cluster-photos", () => {
          mapRef.current?.getCanvas().style.setProperty("cursor", "");
        });
      });
    }
  }, []);

  return (
    <div className="h-full w-full">
      <Nameplate />

      {activeFeature && (
        <Postcard
          feature={activeFeature}
          onClose={() => setActiveFeature(null)}
        />
      )}

      <div className="h-full outerBevel">
        <div className="h-full flatSurface">
          <div className="h-full innerBevel">
            <div className="w-full h-full map" ref={mapContainerRef} />
          </div>
        </div>

        <div className="absolute bottom-12 left-12 z-50">
          <ZoomControls />
        </div>

        {/* <div className="absolute bottom-12 right-12 z-50">
          <Book map={map} />
        </div> */}
      </div>
    </div>
  );
}

export default App;
