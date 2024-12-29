import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Allows external access
    port: 8080, // Custom port for local development
  },
  build: {
    outDir: "dist", // Ensure this matches Vercel's expected output directory
    emptyOutDir: true, // Clears the output directory before each build
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: mode === "production" ? "/" : "/", // Ensure the base URL is correct
}));
