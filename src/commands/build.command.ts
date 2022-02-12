import { createBuilder, getRollupOptions } from "../builder";
import { BauenOptions } from "../interfaces";
import { remove } from "../utils";

export async function build(options: BauenOptions) {
    const rollupOptions = await getRollupOptions(options);
    await remove(options.outDir);
    return createBuilder(options, rollupOptions);
}
