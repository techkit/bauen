import { existsSync } from "fs";
import { resolve } from "pathe";

const configNames = new Set([
    ".buildrc.js",
    ".buildrc.cjs",
    ".buildrc.mjs",
    ".buildrc.ts",
    "build.config.ts"
]);

export function searchConfig(rootDir: string) {
    const result = { name: null, path: null };

    for (const name of configNames) {
        const path = resolve(rootDir, name);

        if (existsSync(path)) {
            Object.assign(result, { name, path });
            break;
        }
    }

    return result;
}
