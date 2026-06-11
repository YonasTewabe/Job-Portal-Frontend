import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_BASE_URL || "http://localhost:5000";

  return {
    plugins: [react()],
    server: {
      proxy: {
        // All /api/* calls are forwarded to the backend as-is.
        // Backend routes are all prefixed /api/ so no rewrite needed.
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
