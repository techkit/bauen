import merge from "lodash.merge";
import RollupTypescript from "rollup-plugin-typescript2";
import { BauenOptions, RollupTypescriptOptions, TsConfig } from "../interfaces";

export function typescript(options: BauenOptions, tsConfig: TsConfig) {
    const typescriptOptions = _getTypescriptOptions(options, tsConfig);
    return RollupTypescript(typescriptOptions);
}

function _getTypescriptOptions(options: BauenOptions, tsConfig: TsConfig) {
    const typescriptOptions = options.rollupPlugins?.typescript || {};
    const compilerOptions = tsConfig?.compilerOptions;

    const defaultOptions: RollupTypescriptOptions = {
        tsconfig: "tsconfig.json",
        tsconfigOverride: { compilerOptions, declaration: false },
        useTsconfigDeclarationDir: true
    };

    return merge(defaultOptions, typescriptOptions) as RollupTypescriptOptions;
}
