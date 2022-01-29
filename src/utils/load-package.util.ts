import { readFile } from "fs/promises";
import { resolve } from "pathe";
import { PackageJson } from "../interfaces/package-json.interface";

export async function loadPackage(rootDir: string) {
    const raw = await readFile(resolve(rootDir, "package.json"));
    return JSON.parse(raw.toString()) as PackageJson;
}
