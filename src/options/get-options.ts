import merge from "lodash.merge";
import { resolve } from "pathe";
import { BauenOptions, UserConfig } from "../interfaces";
import { getCliOptions } from "./get-cli-options";
import { getDefaultOptions } from "./get-default-options";

export function getOptions(argv: string[], userConfig: UserConfig): BauenOptions {
    const defaultOptions = getDefaultOptions();
    const inputOptions = { ...getCliOptions(argv), ...userConfig };

    const rootDir = resolve(inputOptions.rootDir || defaultOptions.rootDir);

    return merge(defaultOptions, inputOptions, {
        rootDir,
        outDir: resolve(rootDir, inputOptions.outDir || defaultOptions.outDir)
    });
}
