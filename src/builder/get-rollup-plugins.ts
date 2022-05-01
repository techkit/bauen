import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import run from "@rollup/plugin-run";
import { Plugin } from "rollup";
import { BauenOptions, TsConfig } from "../interfaces";
import { esbuild, raw, swc } from "../plugins";
import { loadTsConfig } from "../utils";

export async function getRollupPlugins(options: BauenOptions) {
    const defaultPlugins = await getDefaultPlugins(options);

    return typeof options.mapRollupPlugins === "function"
        ? options.mapRollupPlugins(defaultPlugins)
        : defaultPlugins;
}

async function getDefaultPlugins(options: BauenOptions) {
    const tsConfigJson = await loadTsConfig(options.rootDir, options.tsConfig);
    const syntaxParser = resolveSyntaxParser(options, tsConfigJson);

    return <Plugin[]>[
        replace({
            preventAssignment: true,
            ...options.rollupPlugins?.replace
        }),
        alias({
            ...options.rollupPlugins?.alias
        }),
        resolve({
            mainFields: ["module", "jsnext", "main"],
            browser: options.target === "browser",
            extensions: options.extensions,
            exportConditions: [options.target === "node" ? "node" : "browser"],
            preferBuiltins: options.target === "node",
            ...options.rollupPlugins?.resolve
        }),
        json({
            preferConst: true,
            ...options.rollupPlugins?.json
        }),
        syntaxParser(),
        commonjs({
            include: [/node_modules/],
            extensions: options.extensions,
            ignoreTryCatch: true,
            requireReturnsDefault: "namespace",
            ...options.rollupPlugins?.commonjs
        }),
        raw({
            ...options.rollupPlugins?.raw
        }),
        options.run &&
            run({
                ...options.rollupPlugins?.run
            })
    ];
}

function resolveSyntaxParser(options: BauenOptions, tsConfigJson: TsConfig) {
    return () => {
        switch (options.parser) {
            case "swc":
                return swc(options, tsConfigJson);

            default:
                return esbuild(options, tsConfigJson);
        }
    };
}
