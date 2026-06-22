import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The playground imports component source straight from ../src, so Vite needs
// permission to read files outside this folder (the repo root).
export default defineConfig({
  plugins: [react()],
  server: {
    fs: { allow: [".."] },
  },
});
