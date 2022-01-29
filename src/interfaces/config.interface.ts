import { OutputOptions } from "rollup";

type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export type UserConfig = DeepPartial<Config>;

export type OutputType = "cjs" | "esm";

export type OutputTarget = "node" | "browser";

export interface Config {
    rootDir: string;
    outDir: string;
    entries: string[];
    outputs: OutputType[] | OutputOptions[];
    declaration: boolean;
    target: OutputTarget;
    extensions: string[];
    externals: string[];
}
