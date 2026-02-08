import { mkdirSync, copyFileSync } from "fs";

mkdirSync("dist/tokens", { recursive: true });
copyFileSync("src/tokens/tokens.css", "dist/tokens/tokens.css");
console.log("Copied tokens.css to dist/tokens/");
