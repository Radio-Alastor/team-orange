import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  server: {
    host: true,
    port: 5174,
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
