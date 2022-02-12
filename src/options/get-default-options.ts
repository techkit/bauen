import { BauenOptions } from "../interfaces";

export function getDefaultOptions(): BauenOptions {
    return {
        command: "build",
        rootDir: process.cwd(),
        outDir: "dist",
        entries: [],
        outputs: [],
        target: "node",
        extensions: [".ts", ".tsx", ".mjs", ".cjs", ".js", ".jsx"],
        externals: [],
        tsConfig: "tsconfig.json",
        declaration: true,
        inlineDependencies: false
    };
}
