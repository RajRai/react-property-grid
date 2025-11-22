import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  root: __dirname,                // 👈 tell Vite the root is /playground
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  }
});
