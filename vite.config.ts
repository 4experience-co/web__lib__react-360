import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: "0.0.0.0",
    port: 3000
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src")
    }
  },
  base: "/web__template__react/"
});
