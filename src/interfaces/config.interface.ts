import { RollupAliasOptions } from "@rollup/plugin-alias";
import { RollupCommonJSOptions } from "@rollup/plugin-commonjs";
import { RollupNodeResolveOptions } from "@rollup/plugin-node-resolve";
import { RollupReplaceOptions } from "@rollup/plugin-replace";
import { OutputOptions, RollupOptions } from "rollup";
import { Options as RollupEsbuildOptions } from "rollup-plugin-esbuild";

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export type UserConfig = DeepPartial<Config>;

export type OutputType = "cjs" | "esm";

export type OutputTarget = "node" | "browser";

export interface Config {
    rootDir: string;
    outDir: string;
    entries: string[];
    outputs: Array<OutputType | OutputOptions>;
    target: OutputTarget;
    extensions: string[];
    externals: string[];
    declaration: boolean;
    inlineDependencies?: boolean;
    rollupOptions?: RollupOptions;
    rollupPlugins?: PluginsConfig;
}

export interface PluginsConfig {
    replace?: RollupReplaceOptions;
    alias?: RollupAliasOptions;
    resolve?: RollupNodeResolveOptions;
    esbuild?: RollupEsbuildOptions;
    commonjs?: RollupCommonJSOptions;
}
