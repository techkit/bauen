import { OutputOptions } from "rollup";
import { BauenOptions, OutputType } from "../interfaces";
import { defineOutput } from "../utils";

const outputMapping = new Map<string, OutputOptions>();

export const getRollupOutput = (id: string) => outputMapping.get(id);

export function getRollupOutputs(options: BauenOptions): OutputOptions[] {
    _registerDefaultOutputs();
    return options.outputs.map(out => _resolveOutput(out, options.outDir));
}

export function registerOutput(id: string, output: OutputOptions, force?: boolean) {
    if (!outputMapping.has(id) || force) {
        outputMapping.set(id, output);
    }
}

function _registerDefaultOutputs() {
    const cjsOutput = defineOutput({
        entryFileNames: "[name].cjs",
        chunkFileNames: "chunks/[hash].cjs",
        format: "cjs",
        exports: "auto",
        preferConst: true,
        externalLiveBindings: false,
        freeze: false
    });

    const esmOutput = defineOutput({
        entryFileNames: "[name].mjs",
        chunkFileNames: "chunks/[hash].mjs",
        format: "esm",
        exports: "auto",
        preferConst: true,
        externalLiveBindings: false,
        freeze: false
    });

    const dtsOutput = defineOutput({
        format: "esm"
    });

    registerOutput("cjs", cjsOutput);
    registerOutput("esm", esmOutput);
    registerOutput("__dts__", dtsOutput);
}

function _resolveOutput(output: OutputType | OutputOptions, outDir: string) {
    if (typeof output !== "string") {
        return output;
    }

    const option = outputMapping.get(output);

    if (!option) {
        console.error(`${output} output type is not registered`);
        process.exit(1);
    }

    return Object.assign({ dir: outDir }, option);
}
