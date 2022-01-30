import { existsSync } from "fs";
import { resolve } from "pathe";

const configNames = new Set([
    ".bauenrc.js",
    ".bauenrc.cjs",
    ".bauenrc.mjs",
    ".bauenrc.ts",
    "bauen.config.js",
    "bauen.config.cjs",
    "bauen.config.mjs",
    "bauen.config.ts"
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
