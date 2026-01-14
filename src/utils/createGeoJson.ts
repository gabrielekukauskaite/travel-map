import type { Photo } from "../types/photo";

export const createGeoJson = (data: Photo[]): GeoJSON.FeatureCollection => ({
  type: "FeatureCollection",
  features: data.map((p) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [Number(p.lng), Number(p.lat)],
    },
    properties: {
      id: p.id,
      title: p.title || "",
      date: p.date || "",
      url: p.url || "",
      thumbUrl: p.thumbUrl || p.url || "",
    },
  })),
});
