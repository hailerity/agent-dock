import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: "content.html",
      },
      output: {
        inlineDynamicImports: true,
        // Customize the output name for entry point JavaScript files
        entryFileNames: "js/[name].js",
        // Customize the output name for code-split chunks
        chunkFileNames: "js/[name]-chunk.js",
        // Customize the output name for assets
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
