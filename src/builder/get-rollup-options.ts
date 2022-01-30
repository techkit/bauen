import merge from "lodash.merge";
import { RollupOptions } from "rollup";
import { BauenOptions } from "../interfaces";
import { getRollupOutputs } from "./get-rollup-outputs";
import { getRollupPlugins } from "./get-rollup-plugins";

export function getRollupOptions(options: BauenOptions): RollupOptions {
    const defaultOptions = {
        context: options.rootDir,
        input: options.entries,
        output: getRollupOutputs(options),
        plugins: getRollupPlugins(options),
        external: options.externals
    };

    return merge(defaultOptions, options.rollupOptions);
}
