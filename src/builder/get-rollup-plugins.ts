import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { Plugin } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { BauenOptions } from "../interfaces";

export function getRollupPlugins(options: BauenOptions): Plugin[] {
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
        esbuild({
            ...options.rollupPlugins?.esbuild
        }),
        commonjs({
            include: [/node_modules/],
            extensions: options.extensions,
            requireReturnsDefault: "namespace",
            ...options.rollupPlugins?.commonjs
        })
    ];
}
