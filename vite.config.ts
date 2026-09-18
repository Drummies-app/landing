import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react()],
  build: { target: "es2022" },
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
});
