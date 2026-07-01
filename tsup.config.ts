import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      "components/button/index": "src/components/button/index.ts",
      "components/input/index": "src/components/input/index.ts",
      "components/sidebar/index": "src/components/sidebar/index.ts",
      "components/dropdown/index": "src/components/dropdown/index.ts",
      "components/field/index": "src/components/field/index.ts",
      "components/checkbox/index": "src/components/checkbox/index.ts",
      "components/tab-switcher/index": "src/components/tab-switcher/index.ts",
      "components/search/index": "src/components/search/index.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", "lucide-react"],
    splitting: true,
    treeshake: true,
  },
]);
