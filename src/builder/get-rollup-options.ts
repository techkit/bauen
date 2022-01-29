import { RollupOptions } from "rollup";
import { BauenOptions } from "../interfaces";
import { getRollupOutputs } from "./get-rollup-outputs";

export function getRollupOptions(options: BauenOptions): RollupOptions {
    return {
        context: options.rootDir,
        input: options.entries,
        output: getRollupOutputs(options)
    };
}
