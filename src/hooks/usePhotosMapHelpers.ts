import type { GeoJSONFeature, Map } from "mapbox-gl";
import type { Photo } from "../types/photo";
import { createPhotoPopupElement } from "../components/PhotoPopup";
import { mapboxgl } from "../map/mapbox";

export type PopupStartPosition = { top: number; left: number } | null;

type HoverPopupCallbacks = {
  setExpandedPhoto: (photo: Photo | null) => void;
  setClusterPhotos: (photos: Photo[]) => void;
  setCurrentPhotoIndex: (index: number) => void;
  setPopupStartPosition: (pos: PopupStartPosition) => void;
};

export function createHoverPopupController(map: Map, cb: HoverPopupCallbacks) {
  let hoverPopup: mapboxgl.Popup | null = null;
  let currentHoverTarget: string | null = null;
  let closePopupTimeoutId: number | null = null;

  const clearCloseTimeout = () => {
    if (!closePopupTimeoutId) return;
    clearTimeout(closePopupTimeoutId);
    closePopupTimeoutId = null;
  };

  const removePopup = () => {
    hoverPopup?.remove();
    hoverPopup = null;
  };

  const dismiss = () => {
    clearCloseTimeout();
    currentHoverTarget = null;
    removePopup();
  };

  const schedulePopupClose = () => {
    clearCloseTimeout();

    closePopupTimeoutId = window.setTimeout(() => {
      currentHoverTarget = null;
      map.getCanvas().style.setProperty("cursor", "");

      if (!hoverPopup) return;
      const popupElement = hoverPopup.getElement();
      if (!popupElement) return;

      popupElement.classList.add("fade-out");
      closePopupTimeoutId = window.setTimeout(() => {
        removePopup();
        closePopupTimeoutId = null;
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

    if (currentHoverTarget === targetId) return;

    clearCloseTimeout();

    currentHoverTarget = targetId;
    map.getCanvas().style.setProperty("cursor", "pointer");

    const displayPhoto = (photo: Photo) => {
      if (currentHoverTarget !== targetId) return;

      removePopup();

      const popupElement = createPhotoPopupElement({
        photo,
        hasMultiplePhotos: !!clusterId,
        onExpand: () => {
          if (hoverPopup) {
            const popupEl = hoverPopup.getElement();
            if (popupEl) {
              const rect = popupEl.getBoundingClientRect();
              // Use center of popup for animation start point
              cb.setPopupStartPosition({
                top: rect.top + rect.height / 2,
                left: rect.left + rect.width / 2,
              });
            }
          }

          currentHoverTarget = null;

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
                cb.setClusterPhotos(photos);
                const photoIndex = photos.findIndex((p) => p.id === photo.id);
                cb.setCurrentPhotoIndex(photoIndex !== -1 ? photoIndex : 0);
              },
            );
          } else {
            cb.setClusterPhotos([]);
            cb.setCurrentPhotoIndex(0);
          }

          cb.setExpandedPhoto(photo);

          requestAnimationFrame(() => {
            removePopup();
          });
        },
      });

      hoverPopup = new mapboxgl.Popup({
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

      const popupContainer = hoverPopup.getElement();
      if (!popupContainer) return;

      popupContainer.addEventListener("mouseenter", () => {
        clearCloseTimeout();
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

  const dispose = () => {
    clearCloseTimeout();
    removePopup();
    currentHoverTarget = null;
  };

  return { showPhotoPopup, schedulePopupClose, dismiss, dispose };
}
