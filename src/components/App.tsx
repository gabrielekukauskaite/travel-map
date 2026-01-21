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
import { createPhotoPopupElement } from "./PhotoPopup";
import type { Photo } from "../types/photo";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const MAPBOX_CUSTOM_STYLE =
  "mapbox://styles/gabrielek/cmkmplewn001d01r122doa7s3";

const App = () => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [activeFeature, setActiveFeature] = useState<GeoJSONFeature | null>(
    null,
  );

  const throttleTimeoutRef = useRef<number | null>(null);
  const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);
  const currentHoverTargetRef = useRef<string | null>(null);
  const closePopupTimeoutRef = useRef<number | null>(null);

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
        style: MAPBOX_CUSTOM_STYLE,
        center: [-85, 12], // Central America (longitude, latitude)
        zoom: 4,
        minZoom: 3,
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
          if (features && features.length > 0) {
            // setActiveFeature(features[0]);

            // Zoom to the photo location with left offset
            const coords = (features[0].geometry as any).coordinates;
            mapRef.current?.easeTo({
              center: coords,
              zoom: 12,
              duration: 800,
            });
          }
        });

        const showPhotoPopup = (e: any) => {
          const features = e.features as GeoJSONFeature[];
          if (!features?.length) return;

          const feature = features[0];
          const coords = (feature.geometry as any).coordinates.slice();
          const clusterId = feature.properties?.cluster_id;
          const targetId =
            clusterId || feature.properties?.id || coords.join(",");

          // If we're already hovering this exact target, do nothing
          if (currentHoverTargetRef.current === targetId) return;

          // Clear any pending close timeout when hovering a new marker
          if (closePopupTimeoutRef.current) {
            clearTimeout(closePopupTimeoutRef.current);
            closePopupTimeoutRef.current = null;
          }

          // Update current hover target (this will cancel any pending async operations)
          currentHoverTargetRef.current = targetId;
          mapRef.current?.getCanvas().style.setProperty("cursor", "pointer");

          const displayPhoto = (photo: Photo) => {
            // Only show if this is still the current target
            if (currentHoverTargetRef.current !== targetId) return;

            if (hoverPopupRef.current) hoverPopupRef.current.remove();

            const popupElement = createPhotoPopupElement({ photo });
            hoverPopupRef.current = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: 30,
              className: "photo-hover-popup",
              anchor: "bottom",
              maxWidth: "1000px",
            })
              .setLngLat(coords)
              .setDOMContent(popupElement)
              .addTo(mapRef.current!);

            // Add hover handlers to keep popup open
            const popupContainer = hoverPopupRef.current.getElement();
            popupContainer.addEventListener("mouseenter", () => {
              if (closePopupTimeoutRef.current) {
                clearTimeout(closePopupTimeoutRef.current);
                closePopupTimeoutRef.current = null;
              }
            });
            popupContainer.addEventListener("mouseleave", () => {
              schedulePopupClose();
            });
          };

          if (clusterId) {
            const source = mapRef.current?.getSource(
              "photos",
            ) as mapboxgl.GeoJSONSource;
            source?.getClusterLeaves(
              clusterId,
              1,
              0,
              (err, clusterFeatures) => {
                if (!err && clusterFeatures?.length) {
                  const photoData = clusterFeatures[0].properties as Photo;
                  displayPhoto(photoData);
                }
              },
            );
          } else {
            const photoData = feature.properties as Photo;
            displayPhoto(photoData);
          }
        };

        const schedulePopupClose = () => {
          if (closePopupTimeoutRef.current) {
            clearTimeout(closePopupTimeoutRef.current);
          }
          closePopupTimeoutRef.current = window.setTimeout(() => {
            currentHoverTargetRef.current = null;
            mapRef.current?.getCanvas().style.setProperty("cursor", "");
            if (hoverPopupRef.current) {
              const popupElement = hoverPopupRef.current.getElement();
              popupElement.classList.add("fade-out");
              closePopupTimeoutRef.current = window.setTimeout(() => {
                hoverPopupRef.current?.remove();
                hoverPopupRef.current = null;
                closePopupTimeoutRef.current = null;
              }, 200);
            }
          }, 100);
        };

        mapRef.current?.on("mousemove", "unclustered-photos", showPhotoPopup);
        mapRef.current?.on("mouseleave", "unclustered-photos", () => {
          schedulePopupClose();
        });
        mapRef.current?.on("mousemove", "cluster-photos", showPhotoPopup);
        mapRef.current?.on("mouseleave", "cluster-photos", () => {
          schedulePopupClose();
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

          // Also expand the cluster
          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || zoom == null) return;

            mapRef.current?.easeTo({
              center: (features[0].geometry as any).coordinates,
              zoom,
              duration: 800,
            });
          });
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

        <div className="absolute bottom-15 left-15 z-50">
          <ZoomControls />
        </div>

        {/* <div className="absolute bottom-12 right-12 z-50">
          <Book map={map} />
        </div> */}
      </div>
    </div>
  );
};

export default App;
