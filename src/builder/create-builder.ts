import { OutputOptions, rollup, RollupOptions, RollupOutput } from "rollup";
import dts from "rollup-plugin-dts";
import { getRollupOutput } from "./get-rollup-outputs";

export async function createBuilder(rollupOptions: RollupOptions, declaration?: boolean) {
    const parallelBuilds: Promise<RollupOutput>[] = [];

    const buildResult = await rollup(rollupOptions);

    const allOutputOptions = rollupOptions.output! as OutputOptions[];

    for (const outputOptions of allOutputOptions) {
        const writter = buildResult.write(outputOptions);
        parallelBuilds.push(writter);
    }

    if (declaration) {
        rollupOptions.plugins?.push(dts({}));
        const typesBuild = await rollup(rollupOptions);
        const typesOptions = getRollupOutput("__dts__") as OutputOptions;
        const typesWritter = typesBuild.write(typesOptions);
        parallelBuilds.push(typesWritter);
    }

    return Promise.all(parallelBuilds);
}
