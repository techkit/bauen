import merge from "lodash.merge";
import { resolve } from "pathe";
import { OutputOptions } from "rollup";
import { BauenOptions, OutputType } from "../interfaces";
import { defineOutput } from "../utils";

const outputMapping = new Map<string, OutputOptions>();

export function getRollupOutput(id: string, preserveModules = false) {
    const _output = outputMapping.get(id) as OutputOptions;
    return merge(_output, { preserveModules });
}

export function getRollupOutputs(options: BauenOptions): OutputOptions[] {
    _registerDefaultOutputs(options.outDir);
    return options.outputs.map(out => _resolveOutput(options, out));
}

export function registerOutput(id: string, output: OutputOptions, force?: boolean) {
    if (!outputMapping.has(id) || force) {
        outputMapping.set(id, output);
    }
}

function _registerDefaultOutputs(outDir: string) {
    const jsOutput = defineOutput({
        dir: outDir,
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[hash].js",
        format: "cjs",
        exports: "auto",
        preferConst: true,
        externalLiveBindings: false,
        freeze: false
    });

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

    registerOutput("js", jsOutput);
    registerOutput("cjs", cjsOutput);
    registerOutput("esm", esmOutput);
    registerOutput("__dts__", dtsOutput);
}

function _resolveOutput(options: BauenOptions, output: OutputType | OutputOptions) {
    if (typeof output !== "string") {
        const outDir = resolve(options.rootDir, output.dir || "");
        const assigns: OutputOptions = { dir: outDir };
        return merge(output, assigns);
    }

    if (!outputMapping.has(output)) {
        console.error(`${output} output type is not registered`);
        process.exit(1);
    }

    return getRollupOutput(output, options.preserveModules);
}
