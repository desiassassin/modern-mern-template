import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
     plugins: [react()],
     server: {
          port: 3000,
          open: "/",
          host: "0.0.0.0"
     },
     css: {
          preprocessorOptions: {
               scss: {}
          }
     },
     build: {
          target: "esnext",
          outDir: "dist",
          assetsDir: "assets",
          rollupOptions: {
               output: {
                    manualChunks: {
                         vendor: ["react", "react-dom", "react-router-dom", "axios"],
                         heroui: ["@heroui/react"]
                    }
               }
          },
          sourcemap: false,
          minify: "esbuild" // 'esbuild' or 'terser' or 'false'
     },
     resolve: {
          alias: {
               // these should stay in sync with `compilerOptions.paths` of file `jsconfig.json`
               "@": path.resolve(__dirname, "./src"),
               "@components": path.resolve(__dirname, "./src/components"),
               "@contexts": path.resolve(__dirname, "./src/contexts"),
               "@hooks": path.resolve(__dirname, "./src/hooks"),
               "@utils": path.resolve(__dirname, "./src/utils"),
               "@views": path.resolve(__dirname, "./src/views")
          }
     }
});
