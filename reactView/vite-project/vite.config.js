import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: false,
    proxy: {
      "/api": {
        target: "http://localhost:3008/",
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [react()]
});
