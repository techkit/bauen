import { createBuilder, getRollupOptions } from "../builder";
import { BauenOptions } from "../interfaces";

export function build(options: BauenOptions) {
    const rollupOptions = getRollupOptions(options);
    return createBuilder(rollupOptions, options.declaration);
}
