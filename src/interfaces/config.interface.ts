import { RollupAliasOptions } from "@rollup/plugin-alias";
import { RollupCommonJSOptions } from "@rollup/plugin-commonjs";
import { RollupJsonOptions } from "@rollup/plugin-json";
import { RollupNodeResolveOptions } from "@rollup/plugin-node-resolve";
import { RollupReplaceOptions } from "@rollup/plugin-replace";
import { Options as SWCOptions } from "@swc/core";
import { OutputOptions, Plugin, RollupOptions } from "rollup";
import { Options as RollupEsbuildOptions } from "rollup-plugin-esbuild";

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export type UserConfig = DeepPartial<Config>;

export type OutputType = "js" | "cjs" | "esm";

export type OutputTarget = "node" | "browser";

export type SyntaxParser = "swc" | "esbuild";

export interface RollupSwcOptions extends SWCOptions {
    extensions?: string[];
}

export interface Config {
    rootDir: string;
    outDir: string;
    entries: string[];
    outputs: Array<OutputType | OutputOptions>;
    target: OutputTarget;
    extensions: string[];
    externals: string[];
    tsConfig: string;
    parser?: SyntaxParser;
    declaration?: boolean;
    preserveModules?: boolean;
    inlineDependencies?: boolean;
    onBundleStart?: () => Promise<void>;
    onBundleEnd?: () => Promise<void>;
    rollupOptions?: RollupOptions;
    rollupPlugins?: PluginsConfig;
    mapRollupPlugins?: (plugins: Plugin[]) => Plugin[];
}

export interface PluginsConfig {
    replace?: RollupReplaceOptions;
    alias?: RollupAliasOptions;
    resolve?: RollupNodeResolveOptions;
    json?: RollupJsonOptions;
    swc?: RollupSwcOptions;
    esbuild?: RollupEsbuildOptions;
    commonjs?: RollupCommonJSOptions;
}
