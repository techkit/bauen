import jiti from "jiti";
import { UserConfig } from "../interfaces";
import { searchConfig } from "./search-config";

export function loadConfig(rootDir: string) {
    const _require = jiti(rootDir, { interopDefault: true });
    const foundConfig = searchConfig(rootDir);

    try {
        return _require(foundConfig.path!) as UserConfig;
    } catch (err) {
        console.error(`Config file not found in ${rootDir}`, err);
        process.exit(1);
    }
}
