import { defineConfig } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"
import path from "node:path"

console.log(path.resolve(__dirname, "client/test.js"))

export default defineConfig({
  root: "client",
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, "client/test.js"),
          dest: path.resolve(__dirname, "client/dist"),
        },
      ],
    }),
  ],
})
