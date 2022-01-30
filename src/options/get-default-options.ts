import { BauenOptions } from "../interfaces";

export function getDefaultOptions(): BauenOptions {
    return {
        command: "build",
        rootDir: process.cwd(),
        outDir: "dist",
        entries: [],
        outputs: [],
        declaration: true,
        target: "node",
        extensions: [".ts", ".tsx", ".mjs", ".cjs", ".js", ".jsx", ".json"],
        externals: []
    };
}
