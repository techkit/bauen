import { OutputOptions } from "rollup";
import { BauenOptions, OutputType } from "../interfaces";
import { defineOutput } from "../utils";

const outputMapping = new Map<string, OutputOptions>();

export const getRollupOutput = (id: string) => outputMapping.get(id);

export function getRollupOutputs(options: BauenOptions): OutputOptions[] {
    _registerDefaultOutputs(options.outDir);
    return options.outputs.map(out => _resolveOutput(out));
}

export function registerOutput(id: string, output: OutputOptions, force?: boolean) {
    if (!outputMapping.has(id) || force) {
        outputMapping.set(id, output);
    }
}

function _registerDefaultOutputs(outDir: string) {
    const cjsOutput = defineOutput({
        dir: outDir,
        entryFileNames: "[name].cjs",
        chunkFileNames: "chunks/[hash].cjs",
        format: "cjs",
        exports: "auto",
        preferConst: true,
        externalLiveBindings: false,
        freeze: false
    });

    const esmOutput = defineOutput({
        dir: outDir,
        entryFileNames: "[name].mjs",
        chunkFileNames: "chunks/[hash].mjs",
        format: "esm",
        exports: "auto",
        preferConst: true,
        externalLiveBindings: false,
        freeze: false
    });

    const dtsOutput = defineOutput({
        dir: outDir,
        format: "esm"
    });

    registerOutput("cjs", cjsOutput);
    registerOutput("esm", esmOutput);
    registerOutput("__dts__", dtsOutput);
}

function _resolveOutput(output: OutputType | OutputOptions) {
    if (typeof output !== "string") {
        return output;
    }

    if (!outputMapping.has(output)) {
        console.error(`${output} output type is not registered`);
        process.exit(1);
    }

    return outputMapping.get(output) as OutputOptions;
}
