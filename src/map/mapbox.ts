import mapboxgl from "mapbox-gl";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

if (!MAPBOX_ACCESS_TOKEN) {
  // Mapbox will throw later anyway; this makes the root cause clearer.
  // Avoid throwing to preserve current behavior in production builds.
  console.warn("VITE_MAPBOX_ACCESS_TOKEN is not set");
}

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export { mapboxgl };
