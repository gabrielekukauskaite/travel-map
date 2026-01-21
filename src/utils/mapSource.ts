import type { Map } from "mapbox-gl";

const addSource = (map: Map, data: GeoJSON.FeatureCollection) => {
  if (map.getSource("photos")) {
    return;
  }
  map.addSource("photos", {
    type: "geojson",
    data,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 40,
    clusterProperties: {
      firstPhotoId: ["coalesce", ["get", "id"], ""],
      firstPhotoThumbUrl: ["coalesce", ["get", "thumbUrl"], ""],
    },
  });
};

export { addSource };
