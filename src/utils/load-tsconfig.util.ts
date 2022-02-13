import { readFile } from "fs/promises";
import { basename, dirname, resolve } from "pathe";
import { TsConfig } from "../interfaces";

export async function loadTsConfig(rootDir: string, filename: string) {
    const resolved = resolve(rootDir, filename);
    const readed = await readFile(resolved, { encoding: "utf-8" });
    const tsConfig = JSON.parse(readed) as TsConfig;

    tsConfig.compilerOptions = tsConfig.compilerOptions || {};

    if (typeof tsConfig.extends === "string") {
        const filepath = resolve(dirname(resolved), tsConfig.extends);
        const parent = await loadTsConfig(dirname(filepath), basename(filepath));
        tsConfig.compilerOptions = Object.assign(parent.compilerOptions, tsConfig.compilerOptions);
    }

    return tsConfig;
}
