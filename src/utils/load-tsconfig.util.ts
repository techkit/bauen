import { readFile } from "fs/promises";
import { dirname, resolve } from "pathe";
import { TsConfig } from "../interfaces";

let tsConfig: TsConfig;

export async function loadTsConfig(rootDir: string, filename: string) {
    if (!tsConfig) {
        const resolved = resolve(rootDir, filename);
        const readed = await readFile(resolved, { encoding: "utf-8" });
        tsConfig = JSON.parse(readed) as TsConfig;

        tsConfig.compilerOptions = tsConfig.compilerOptions || {};

        if (typeof tsConfig.extends === "string") {
            const filepath = resolve(dirname(resolved), tsConfig.extends);
            const parent = await loadTsConfig(filepath, filename);
            tsConfig.compilerOptions = Object.assign(
                parent.compilerOptions,
                tsConfig.compilerOptions
            );
        }
    }

    return tsConfig;
}
