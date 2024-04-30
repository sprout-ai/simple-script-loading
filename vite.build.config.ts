import { defineConfig } from "vite"

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "simple-script-loading",
      fileName: "index",
    },
  },
})
