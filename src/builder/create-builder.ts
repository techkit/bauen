import { OutputOptions, rollup, RollupOptions, RollupOutput } from "rollup";
import dts from "rollup-plugin-dts";
import { BauenOptions } from "../interfaces";
import { getRollupOutput } from "./get-rollup-outputs";

export async function createBuilder(options: BauenOptions, rollupOptions: RollupOptions) {
    const parallelBuilds: Promise<RollupOutput>[] = [];
    const allOutputOptions = rollupOptions.output! as OutputOptions[];

    const buildResult = await rollup(rollupOptions);

    console.info(`Building for ${options.target}`);

    for (const outputOptions of allOutputOptions) {
        const writter = buildResult.write(outputOptions);
        parallelBuilds.push(writter);
    }

    if (options.declaration) {
        rollupOptions.plugins?.push(dts({}));
        const typesBuild = await rollup(rollupOptions);
        const typesOutput = getRollupOutput("__dts__", options.preserveModules) as OutputOptions;
        const typesWritter = typesBuild.write(typesOutput);
        parallelBuilds.push(typesWritter);
    }

    return Promise.all(parallelBuilds);
}
