import type { Map } from "mapbox-gl";

const addSource = (map: Map, data: FeatureCollection) => {
  map.addSource("photos", {
    type: "geojson",
    data,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 70,
    clusterProperties: {
      firstPhotoId: ["coalesce", ["get", "id"], ""],
      firstPhotoThumbUrl: ["coalesce", ["get", "thumbUrl"], ""],
    },
  });
};

export { addSource };
