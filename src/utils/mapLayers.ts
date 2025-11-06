import type { Map } from "mapbox-gl";

const addTransparentCirclesLayer = (map: Map) => {
  map.addLayer({
    id: "transparent-circles",
    type: "circle",
    source: "photos",
    paint: {
      "circle-color": "transparent",
      "circle-radius": 20,
    },
  });
};

const addClusterPhotosLayer = (map: Map) => {
  map.addLayer({
    id: "cluster-photos",
    type: "symbol",
    source: "photos",
    filter: ["has", "point_count"],
    layout: {
      "icon-image": [
        "concat",
        ["get", "firstPhotoId"],
        "-",
        ["to-string", ["get", "point_count"]],
      ],
      "icon-allow-overlap": true,
      "icon-size": 0.75,
    },
  });
};

const addUnclusteredPhotosLayer = (map: Map) => {
  map.addLayer({
    id: "unclustered-photos",
    type: "symbol",
    source: "photos",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": ["get", "id"],
      "icon-allow-overlap": true,
      "icon-size": 0.75,
    },
  });
};

export {
  addTransparentCirclesLayer,
  addClusterPhotosLayer,
  addUnclusteredPhotosLayer,
};
