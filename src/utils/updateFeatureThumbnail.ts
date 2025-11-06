import type { Map } from "mapbox-gl";
import { loadThumbnail } from "./loadThumbnail";

export const updateFeatureThumbnail = (map: Map) => {
  const unclusteredPoints = map.queryRenderedFeatures({
    layers: ["transparent-circles"],
    filter: ["!", ["has", "point_count"]],
  });

  for (const point of unclusteredPoints) {
    const thumbUrl = point.properties?.thumbUrl;
    const pointId = point.properties?.id;
    loadThumbnail(map, pointId, thumbUrl);
  }

  const clusters = map.queryRenderedFeatures({
    layers: ["transparent-circles"],
    filter: ["has", "point_count"],
  });

  for (const cluster of clusters) {
    const firstPhotoId = cluster.properties?.firstPhotoId;
    const thumbUrl = cluster.properties?.firstPhotoThumbUrl;
    const pointCount = cluster.properties?.point_count;
    const imageId = `${firstPhotoId}-${pointCount}`;
    loadThumbnail(map, imageId, thumbUrl, pointCount);
  }
};
