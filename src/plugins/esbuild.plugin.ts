/* eslint-disable @typescript-eslint/no-explicit-any */
import merge from "lodash.merge";
import RollupEsbuild, { Options as RollupEsbuildOptions } from "rollup-plugin-esbuild";
import { BauenOptions, TsConfig } from "../interfaces";

export function esbuild(options: BauenOptions, tsConfig: TsConfig) {
    const esbuildOptions = _getEsbuildOptions(options, tsConfig);
    return RollupEsbuild(esbuildOptions);
}

function _getEsbuildOptions(options: BauenOptions, tsConfig: TsConfig) {
    const esbuildOptions = options.rollupPlugins?.esbuild || {};
    const compilerOptions = tsConfig?.compilerOptions;
    const excludes = parseExclude(tsConfig.exclude);
    const jsx = compilerOptions?.jsx || "preserve";

    const defaultOptions: RollupEsbuildOptions = {
        include: esbuildOptions.include || /\.[jt]sx?$/,
        exclude: excludes,
        sourceMap: compilerOptions?.sourceMap,
        minify: esbuildOptions.minify ?? process.env.NODE_ENV === "production",
        target: compilerOptions?.target as any,
        jsx: jsx === "preserve" ? "preserve" : "transform",
        jsxFactory: compilerOptions?.jsxFactory,
        jsxFragment: compilerOptions?.jsxFragmentFactory,
        tsconfig: esbuildOptions.tsconfig || options.tsConfig
    };

    return merge(defaultOptions, esbuildOptions) as RollupEsbuildOptions;
}

function parseExclude(excludes: string[] = ["node_modules"]) {
    return excludes.map(exclude => new RegExp(exclude));
}
