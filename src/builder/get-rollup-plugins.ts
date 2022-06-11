import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import run from "@rollup/plugin-run";
import { Plugin } from "rollup";
import { BauenOptions, SyntaxParser, TsConfig } from "../interfaces";
import { esbuild, raw, swc, typescript } from "../plugins";
import { loadTsConfig } from "../utils";

export async function getRollupPlugins(options: BauenOptions, watch?: boolean) {
    const defaultPlugins = await getDefaultPlugins(options, watch);

    return typeof options.mapRollupPlugins === "function"
        ? options.mapRollupPlugins(defaultPlugins)
        : defaultPlugins;
}

async function getDefaultPlugins(options: BauenOptions, watch?: boolean) {
    const tsConfigJson = await loadTsConfig(options.rootDir, options.tsConfig);
    const syntaxParser = resolveSyntaxParser(options, tsConfigJson);
    const runEnabled = watch && options.run;

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
            include: [/\.(md|txt)$/],
            exclude: [],
            ...options.rollupPlugins?.raw
        }),
        runEnabled &&
            run({
                ...options.rollupPlugins?.run
            })
    ];
}

function resolveSyntaxParser(options: BauenOptions, tsConfigJson: TsConfig) {
    const factory = _resolveParserFactory(options.parser);
    return () => factory(options, tsConfigJson);
}

function _resolveParserFactory(parser?: SyntaxParser) {
    switch (parser) {
        case "swc":
            return swc;
        case "typescript":
            return typescript;
        default:
            return esbuild;
    }
}
