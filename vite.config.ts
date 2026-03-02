import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
  },
  preview: {
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("/mapbox-gl/")) return "mapbox";
          if (id.includes("/firebase/")) return "firebase";
          if (id.includes("/framer-motion/")) return "framer-motion";
          if (id.includes("/swiper/")) return "swiper";

          return "vendor";
        },
      },
    },
  },
});
