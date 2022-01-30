import { readFile } from "fs/promises";
import { resolve } from "pathe";
import { PackageJson } from "../interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let packageJson: PackageJson = {} as any;

export async function loadPackage(rootDir: string, force?: boolean) {
    if (packageJson.name && !force) {
        return Promise.resolve(packageJson);
    }

    const raw = await readFile(resolve(rootDir, "package.json"));
    packageJson = JSON.parse(raw.toString()) as PackageJson;

    return Promise.resolve(packageJson);
}
