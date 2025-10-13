import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
        plugins: [react()],
        build: {
            lib: {
                entry: resolve(__dirname, "src/index.js"),
                name: "ReactPropertyGrid",
                formats: ["es", "cjs"],
                fileName: (format) => (format === "es" ? "index.esm.js" : "index.cjs")
            },
            rollupOptions: {
                external: ["react","react-dom","@mui/material","@emotion/react","@emotion/styled"],
                output: {
                    globals: { react: "React", "react-dom": "ReactDOM" }
                }
            },
            sourcemap: true
        }
    }
);