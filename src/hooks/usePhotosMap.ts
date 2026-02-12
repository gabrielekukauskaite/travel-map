import { useEffect, useRef } from "react";
import type { GeoJSONFeature, Map } from "mapbox-gl";
import type { Photo } from "../types/photo";
import { getPhotos } from "../../api/firebase";
import { createGeoJson } from "../utils/createGeoJson";
import {
  addClusterPhotosLayer,
  addTransparentCirclesLayer,
  addUnclusteredPhotosLayer,
} from "../utils/mapLayers";
import { addSource } from "../utils/mapSource";
import { updateFeatureThumbnail } from "../utils/updateFeatureThumbnail";
import { createPhotoPopupElement } from "../components/PhotoPopup";
import { mapboxgl } from "../map/mapbox";

const MAPBOX_CUSTOM_STYLE =
  "mapbox://styles/gabrielek/cmkmplewn001d01r122doa7s3";

type PopupStartPosition = { top: number; left: number } | null;

type Params = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  setExpandedPhoto: (photo: Photo | null) => void;
  setClusterPhotos: (photos: Photo[]) => void;
  setCurrentPhotoIndex: (index: number) => void;
  setIsPhotoAnimating: (isAnimating: boolean) => void;
  setPopupStartPosition: (pos: PopupStartPosition) => void;
};

export function usePhotosMap({
  mapContainerRef,
  setExpandedPhoto,
  setClusterPhotos,
  setCurrentPhotoIndex,
  setIsPhotoAnimating,
  setPopupStartPosition,
}: Params) {
  const mapRef = useRef<Map | null>(null);

  const throttleTimeoutRef = useRef<number | null>(null);
  const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);
  const currentHoverTargetRef = useRef<string | null>(null);
  const closePopupTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_CUSTOM_STYLE,
      center: [-85, 12],
      zoom: 4,
      minZoom: 3,
    });

    mapRef.current = map;

    const throttledUpdate = () => {
      if (throttleTimeoutRef.current) return;

      updateFeatureThumbnail(map);
      throttleTimeoutRef.current = window.setTimeout(() => {
        throttleTimeoutRef.current = null;
      }, 500);
    };

    const schedulePopupClose = () => {
      if (closePopupTimeoutRef.current) {
        clearTimeout(closePopupTimeoutRef.current);
      }

      closePopupTimeoutRef.current = window.setTimeout(() => {
        currentHoverTargetRef.current = null;
        map.getCanvas().style.setProperty("cursor", "");

        if (!hoverPopupRef.current) return;
        const popupElement = hoverPopupRef.current.getElement();
        if (!popupElement) return;

        popupElement.classList.add("fade-out");
        closePopupTimeoutRef.current = window.setTimeout(() => {
          hoverPopupRef.current?.remove();
          hoverPopupRef.current = null;
          closePopupTimeoutRef.current = null;
        }, 200);
      }, 100);
    };

    const showPhotoPopup = (e: any) => {
      const features = e.features as GeoJSONFeature[];
      if (!features?.length) return;

      const feature = features[0];
      const coords = (feature.geometry as any).coordinates.slice();
      const clusterId = feature.properties?.cluster_id;
      const targetId = clusterId || feature.properties?.id || coords.join(",");

      if (currentHoverTargetRef.current === targetId) return;

      if (closePopupTimeoutRef.current) {
        clearTimeout(closePopupTimeoutRef.current);
        closePopupTimeoutRef.current = null;
      }

      currentHoverTargetRef.current = targetId;
      map.getCanvas().style.setProperty("cursor", "pointer");

      const displayPhoto = (photo: Photo) => {
        if (currentHoverTargetRef.current !== targetId) return;

        if (hoverPopupRef.current) hoverPopupRef.current.remove();

        const popupElement = createPhotoPopupElement({
          photo,
          hasMultiplePhotos: !!clusterId,
          onExpand: () => {
            if (hoverPopupRef.current) {
              const popupEl = hoverPopupRef.current.getElement();
              if (popupEl) {
                const rect = popupEl.getBoundingClientRect();
                setPopupStartPosition({ top: rect.top, left: rect.left });
              }
            }

            currentHoverTargetRef.current = null;

            if (clusterId) {
              const source = map.getSource("photos") as mapboxgl.GeoJSONSource;
              source?.getClusterLeaves(
                clusterId,
                100,
                0,
                (err, clusterFeatures) => {
                  if (err || !clusterFeatures?.length) return;
                  const photos = clusterFeatures.map(
                    (f) => f.properties as Photo,
                  );
                  setClusterPhotos(photos);
                  const photoIndex = photos.findIndex((p) => p.id === photo.id);
                  setCurrentPhotoIndex(photoIndex !== -1 ? photoIndex : 0);
                },
              );
            } else {
              setClusterPhotos([]);
              setCurrentPhotoIndex(0);
            }

            setExpandedPhoto(photo);

            requestAnimationFrame(() => {
              setIsPhotoAnimating(true);
              hoverPopupRef.current?.remove();
              hoverPopupRef.current = null;
            });
          },
        });

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
          .addTo(map);

        const popupContainer = hoverPopupRef.current.getElement();
        if (!popupContainer) return;
        popupContainer.addEventListener("mouseenter", () => {
          if (!closePopupTimeoutRef.current) return;
          clearTimeout(closePopupTimeoutRef.current);
          closePopupTimeoutRef.current = null;
        });
        popupContainer.addEventListener("mouseleave", () => {
          schedulePopupClose();
        });
      };

      if (clusterId) {
        const source = map.getSource("photos") as mapboxgl.GeoJSONSource;
        source?.getClusterLeaves(clusterId, 1, 0, (err, clusterFeatures) => {
          if (err || !clusterFeatures?.length) return;
          displayPhoto(clusterFeatures[0].properties as Photo);
        });
      } else {
        displayPhoto(feature.properties as Photo);
      }
    };

    const onLoad = async () => {
      (window as any).mapInstance = map;

      const markerData = await getPhotos();
      const geoJson = createGeoJson(markerData);

      addSource(map, geoJson);
      addTransparentCirclesLayer(map);
      addClusterPhotosLayer(map);
      addUnclusteredPhotosLayer(map);

      map.on("move", throttledUpdate);
      map.on("idle", () => updateFeatureThumbnail(map));

      map.on("click", "unclustered-photos", (e) => {
        const features = e.features as GeoJSONFeature[];
        if (!features?.length) return;
        const coords = (features[0].geometry as any).coordinates;
        map.easeTo({ center: coords, zoom: 12, duration: 800 });
      });

      map.on("mousemove", "unclustered-photos", showPhotoPopup);
      map.on("mouseleave", "unclustered-photos", schedulePopupClose);
      map.on("mousemove", "cluster-photos", showPhotoPopup);
      map.on("mouseleave", "cluster-photos", schedulePopupClose);

      map.on("click", "cluster-photos", (e) => {
        const features = e.features as GeoJSONFeature[];
        if (!features?.length) return;

        if (closePopupTimeoutRef.current) {
          clearTimeout(closePopupTimeoutRef.current);
          closePopupTimeoutRef.current = null;
        }
        currentHoverTargetRef.current = null;
        hoverPopupRef.current?.remove();
        hoverPopupRef.current = null;

        const clusterId = features[0].properties?.cluster_id;
        if (!clusterId) return;

        const source = map.getSource("photos") as mapboxgl.GeoJSONSource;
        source?.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return;
          map.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom,
            duration: 800,
          });
        });
      });
    };

    map.on("load", onLoad);

    return () => {
      if (throttleTimeoutRef.current) clearTimeout(throttleTimeoutRef.current);
      if (closePopupTimeoutRef.current)
        clearTimeout(closePopupTimeoutRef.current);
      hoverPopupRef.current?.remove();
      hoverPopupRef.current = null;
      currentHoverTargetRef.current = null;

      map.off("load", onLoad);
      map.remove();
      if ((window as any).mapInstance === map) {
        (window as any).mapInstance = null;
      }
      mapRef.current = null;
    };
  }, [
    mapContainerRef,
    setClusterPhotos,
    setCurrentPhotoIndex,
    setExpandedPhoto,
    setIsPhotoAnimating,
    setPopupStartPosition,
  ]);

  return { mapRef };
}
