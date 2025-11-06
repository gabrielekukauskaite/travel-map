import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import mapboxgl, { Map, type GeoJSONFeature } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { getPhotos } from "../api/firebase";
import SidePanel from "./SidePanel";
import { createGeoJson } from "./utils/createGeoJson";
import {
  addClusterPhotosLayer,
  addTransparentCirclesLayer,
  addUnclusteredPhotosLayer,
} from "./utils/mapLayers";
import { addSource } from "./utils/mapSource";
import { updateFeatureThumbnail } from "./utils/updateFeatureThumbnail";

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
        const markerData = await getPhotos();
        const geoJson = createGeoJson(markerData);

        if (mapRef.current === null) return;

        addSource(mapRef.current, geoJson);
        addTransparentCirclesLayer(mapRef.current);
        addClusterPhotosLayer(mapRef.current);

        addUnclusteredPhotosLayer(mapRef.current);

        mapRef.current?.on("move", throttledUpdate);
        mapRef.current?.on("moveend", () =>
          updateFeatureThumbnail(mapRef.current!),
        );
        mapRef.current?.once("idle", () =>
          updateFeatureThumbnail(mapRef.current!),
        );
      });
    }
  }, []);

  return (
    <>
      <div className="relative h-screen">
        {activeFeature && <SidePanel feature={activeFeature} />}
        <div className="w-full h-full" ref={mapContainerRef} />
      </div>
    </>
  );
}

export default App;
