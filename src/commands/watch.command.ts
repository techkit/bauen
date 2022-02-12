import { createWatcher, getRollupOptions } from "../builder";
import { BauenOptions } from "../interfaces";
import { remove } from "../utils";

export async function watch(options: BauenOptions) {
    const rollupOptions = await getRollupOptions(options, true);
    await remove(options.outDir);
    return createWatcher(options, rollupOptions);
}
