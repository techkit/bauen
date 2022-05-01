import { createFilter } from "@rollup/pluginutils";
import { JscTarget, transform } from "@swc/core";
import { existsSync } from "fs";
import merge from "lodash.merge";
import { dirname, join, resolve } from "pathe";
import { Plugin as RollupPlugin } from "rollup";
import { BauenOptions, RollupSwcOptions, TsConfig } from "../interfaces";

export function swc(options: BauenOptions, tsConfig: TsConfig): RollupPlugin {
    const swcOptions = options.rollupPlugins?.swc || {};
    const filter = createFilter(/\.[jt]sx?$/, /node_modules/);
    const pathResolver = _createPathResolver(options.rootDir, swcOptions.extensions);

    return {
        name: "swc",
        async resolveId(source, importer) {
            let resolvedPath = pathResolver(source, importer);

            if (!resolvedPath) {
                resolvedPath = pathResolver(source, importer, true);
            }

            return resolvedPath;
        },
        async transform(code, id) {
            if (!filter(id)) {
                return null;
            }

            const _swcOptions = _getSwcOptions(id, tsConfig, swcOptions);
            const transformed = await transform(code, _swcOptions);

            return {
                code: transformed.code,
                map: transformed.map && JSON.parse(transformed.map)
            };
        },
        async renderChunk(code, chunk) {
            if (!swcOptions.minify) {
                return null;
            }

            const transformed = await transform(code, {
                minify: true,
                sourceMaps: true,
                filename: chunk.fileName
            });

            return {
                code: transformed.code,
                map: transformed.map
            };
        }
    };
}

function _createPathResolver(rootDir: string, extensions: string[] = []) {
    return (source: string, importer?: string, isIndex?: boolean) => {
        let resolvedPath;
        const basedir = importer ? dirname(importer) : rootDir;
        const filepath = resolve(basedir, source);

        for (const extension of extensions) {
            const _filepath = isIndex
                ? join(filepath, `index${extension}`)
                : join(`${extension}${extension}`);

            if (existsSync(_filepath)) {
                resolvedPath = _filepath;
                break;
            }
        }

        return resolvedPath;
    };
}

function _getSwcOptions(id: string, tsConfig: TsConfig, options: RollupSwcOptions) {
    const isTsFile = /\.tsx?$/.test(id);
    const compilerOptions = tsConfig?.compilerOptions;

    const moduleTarget = compilerOptions?.target?.toString().toLowerCase() as JscTarget;

    const defaultOptions: RollupSwcOptions = {
        filename: id,
        sourceMaps: compilerOptions?.sourceMap,
        jsc: {
            keepClassNames: compilerOptions?.experimentalDecorators,
            target: moduleTarget,
            parser: {
                syntax: isTsFile ? "typescript" : "ecmascript",
                tsx: isTsFile,
                jsx: !isTsFile,
                decorators: compilerOptions?.experimentalDecorators
            },
            transform: {
                legacyDecorator: compilerOptions?.experimentalDecorators,
                decoratorMetadata: compilerOptions?.emitDecoratorMetadata,
                react: {
                    pragma: compilerOptions?.jsxFactory,
                    pragmaFrag: compilerOptions?.jsxFragmentFactory,
                    importSource: compilerOptions?.jsxImportSource
                }
            }
        }
    };

    return merge(defaultOptions, options) as RollupSwcOptions;
}
