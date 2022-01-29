import { defineConfig } from "./src/utils";

export default defineConfig({
    entries: ["./src/cli.ts", "./src/index.ts"],
    outputs: ["esm"]
});
