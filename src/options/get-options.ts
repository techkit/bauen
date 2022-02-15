import merge from "lodash.merge";
import Module from "module";
import { resolve } from "pathe";
import { BauenOptions, CliOptions, PackageJson, UserConfig } from "../interfaces";
import { loadPackage, loadTsConfig } from "../utils";
import { getCliOptions } from "./get-cli-options";
import { getDefaultOptions } from "./get-default-options";

export async function getOptions(argv: string[], userConfig: UserConfig): Promise<BauenOptions> {
    const defaultOptions = getDefaultOptions();
    const inputOptions = { ...getCliOptions(argv), ...userConfig };

    const rootDir = resolve(inputOptions.rootDir || defaultOptions.rootDir);
    const tsConfig = resolve(rootDir, inputOptions.tsConfig || defaultOptions.tsConfig);

    const [packageJson] = await Promise.all([
        loadPackage(rootDir),
        loadTsConfig(rootDir, tsConfig)
    ]);

    return merge<BauenOptions, UserConfig & CliOptions, UserConfig>(defaultOptions, inputOptions, {
        rootDir,
        outDir: resolve(rootDir, inputOptions.outDir || defaultOptions.outDir),
        entries: inputOptions.entries?.map(entry => resolve(rootDir, entry as string)),
        externals: _getExternals(userConfig, packageJson)
    });
}

function _getExternals(userConfig: UserConfig, packageJson: PackageJson) {
    if (userConfig.target === "browser") {
        return [];
    }

    return [
        ...Module.builtinModules,
        ...Object.keys(packageJson.dependencies || []),
        ...Object.keys(packageJson.peerDependencies || []),
        ...(userConfig.externals || [])
    ];
}
