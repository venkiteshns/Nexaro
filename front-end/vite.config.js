import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("country-state-city")) {
              return "geo-data";
            }
            if (id.includes("recharts")) {
              return "charts";
            }
            if (id.includes("leaflet") || id.includes("react-leaflet")) {
              return "maps";
            }
            if (id.includes("@paypal")) {
              return "paypal";
            }
            if (id.includes("@react-oauth/google")) {
              return "google-oauth";
            }
            if (id.includes("react-icons") || id.includes("lucide-react")) {
              return "icons";
            }
          }
        },
      },
    },
  },
});