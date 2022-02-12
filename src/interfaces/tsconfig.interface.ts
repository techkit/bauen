/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompilerOptions } from "typescript";

export interface TsConfig {
    extends?: string;
    include?: string[];
    exclude?: string[];
    compilerOptions?: CompilerOptions;
    [option: string]: any;
}
