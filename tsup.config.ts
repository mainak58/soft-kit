import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      "components/button/index": "src/components/button/index.ts",
      "components/input/index": "src/components/input/index.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom"],
    splitting: true,
    treeshake: true,
  },
]);
