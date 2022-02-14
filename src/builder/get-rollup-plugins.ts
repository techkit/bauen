import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { Plugin } from "rollup";
import { BauenOptions } from "../interfaces";
import { swc } from "../plugins";
import { loadTsConfig } from "../utils";

export async function getRollupPlugins(options: BauenOptions): Promise<Plugin[]> {
    const tsConfigJson = await loadTsConfig(options.rootDir, options.tsConfig);

    return [
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
        swc(options.rootDir, tsConfigJson, options.rollupPlugins?.swc || {}),
        commonjs({
            include: [/node_modules/],
            extensions: options.extensions,
            requireReturnsDefault: "namespace",
            ...options.rollupPlugins?.commonjs
        })
    ];
}
