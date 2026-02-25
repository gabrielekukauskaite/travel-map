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
import { mapboxgl } from "../map/mapbox";
import {
  createHoverPopupController,
  type PopupStartPosition,
} from "./usePhotosMapHelpers";
import { isMobile } from "react-device-detect";
import { useLongPress } from "@uidotdev/usehooks";
import { createThrottledThumbnailUpdater } from "./createThrottledThumbnailUpdater";

const MAPBOX_CUSTOM_STYLE =
  "mapbox://styles/gabrielek/cmkmplewn001d01r122doa7s3";

type Params = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  setExpandedPhoto: (photo: Photo | null) => void;
  setClusterPhotos: (photos: Photo[]) => void;
  setCurrentPhotoIndex: (index: number) => void;
  setPopupStartPosition: (pos: PopupStartPosition) => void;
};

export function usePhotosMap({
  mapContainerRef,
  setExpandedPhoto,
  setClusterPhotos,
  setCurrentPhotoIndex,
  setPopupStartPosition,
}: Params) {
  const mapRef = useRef<Map | null>(null);
  const suppressNextClusterClickRef = useRef(false);

  const longPressHandlers = useLongPress(
    (event) => {
      if (!isMobile) return;

      const map = mapRef.current;
      const container = mapContainerRef.current;
      if (!map || !container) return;
      if (map.isMoving()) return;

      const e = event as unknown as {
        touches?: TouchList;
        changedTouches?: TouchList;
      };
      const touch = e.touches?.[0] ?? e.changedTouches?.[0];
      if (!touch) return;

      const rect = container.getBoundingClientRect();
      const point: [number, number] = [
        touch.clientX - rect.left,
        touch.clientY - rect.top,
      ];

      const hits = map.queryRenderedFeatures(point, {
        layers: ["unclustered-photos", "cluster-photos"],
      });

      const feature = hits[0];
      if (!feature) return;

      // Calculate the screen position of the marker for animation
      const coords = (feature.geometry as any).coordinates;
      const markerPoint = map.project(coords);
      const containerRect = container.getBoundingClientRect();
      setPopupStartPosition({
        top: containerRect.top + markerPoint.y,
        left: containerRect.left + markerPoint.x,
      });

      const clusterId = (feature as any).properties?.cluster_id;
      if (clusterId != null) {
        suppressNextClusterClickRef.current = true;
        window.setTimeout(() => {
          suppressNextClusterClickRef.current = false;
        }, 600);

        const source = map.getSource("photos") as mapboxgl.GeoJSONSource;
        source?.getClusterLeaves(
          clusterId,
          100,
          0,
          (
            err: unknown,
            clusterFeatures?: Array<{ properties: unknown }> | null,
          ) => {
            if (err || !clusterFeatures?.length) return;
            const photos = clusterFeatures.map((f) => f.properties as Photo);
            setClusterPhotos(photos);
            setCurrentPhotoIndex(0);
            setExpandedPhoto(photos[0] ?? null);
          },
        );
        return;
      }

      setClusterPhotos([]);
      setCurrentPhotoIndex(0);
      setExpandedPhoto((feature as any).properties as Photo);
    },
    { threshold: 450 },
  );

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

    const thumbnails = createThrottledThumbnailUpdater(map);
    const hoverPopups = createHoverPopupController(map, {
      setExpandedPhoto,
      setClusterPhotos,
      setCurrentPhotoIndex,
      setPopupStartPosition,
    });

    const onLoad = async () => {
      (window as any).mapInstance = map;

      const markerData = await getPhotos();
      const geoJson = createGeoJson(markerData);

      addSource(map, geoJson);
      addTransparentCirclesLayer(map);
      addClusterPhotosLayer(map);
      addUnclusteredPhotosLayer(map);

      map.on("move", thumbnails.update);
      map.on("idle", () => thumbnails.update());

      if (!isMobile) {
        map.on("mousemove", "unclustered-photos", hoverPopups.showPhotoPopup);
        map.on(
          "mouseleave",
          "unclustered-photos",
          hoverPopups.schedulePopupClose,
        );
        map.on("mousemove", "cluster-photos", hoverPopups.showPhotoPopup);
        map.on("mouseleave", "cluster-photos", hoverPopups.schedulePopupClose);
      }

      map.on("click", "cluster-photos", (e) => {
        if (isMobile && suppressNextClusterClickRef.current) return;
        const features = e.features as GeoJSONFeature[];
        if (!features?.length) return;

        hoverPopups.dismiss();

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
      thumbnails.dispose();
      hoverPopups.dispose();

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
    setPopupStartPosition,
  ]);

  return { mapRef, longPressHandlers };
}
