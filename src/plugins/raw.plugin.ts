import { createFilter } from "@rollup/pluginutils";
import { Plugin as RollupPlugin } from "rollup";
import { RollupRawOptions } from "../interfaces";

export function raw(options: RollupRawOptions): RollupPlugin {
    const filter = createFilter(options.include, options.exclude);

    return {
        name: "raw",
        async transform(code, id) {
            if (!filter(id)) {
                return null;
            }

            return {
                code: `export default ${JSON.stringify(code)}`,
                map: null
            };
        }
    };
}
