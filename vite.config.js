import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/int-obs.ts"),
      name: "IntObs",
      fileName: "int-obs",
    },
  },
});
