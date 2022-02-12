import merge from "lodash.merge";
import { RollupOptions, RollupWarning, WarningHandler, WatcherOptions } from "rollup";
import { BauenOptions } from "../interfaces";
import { getRollupOutputs } from "./get-rollup-outputs";
import { getRollupPlugins } from "./get-rollup-plugins";

export async function getRollupOptions(options: BauenOptions, watch?: boolean) {
    const rollupPlugins = await getRollupPlugins(options);

    const defaultOptions: RollupOptions = {
        context: options.rootDir,
        input: options.entries,
        output: getRollupOutputs(options),
        plugins: rollupPlugins,
        watch: watch && _getWatchOptions(),
        external: _createExternalFilter(options),
        onwarn: _createWarnHandler()
    };

    return merge(defaultOptions, options.rollupOptions) as RollupOptions;
}

function _getWatchOptions(): WatcherOptions {
    return {
        chokidar: {
            ignoreInitial: true,
            ignorePermissionErrors: true,
            ignored: ["**/.git/**", "**/node_modules/**"]
        }
    };
}

function _getPackageName(id: string) {
    const partials = id.split("/");
    return partials[0][0] === "@" ? `${partials[0]}/${partials[1]}` : partials[0];
}

function _createExternalFilter(options: BauenOptions) {
    return (id: string) => {
        const packageName = _getPackageName(id);
        const isExternal = options.externals.includes(packageName);

        if (options.inlineDependencies || id.startsWith(".") || id.startsWith("/")) {
            return false;
        }

        // if (!isExternal) {
        //     console.warn(`Inlining implicit external ${id}`);
        // }

        return isExternal;
    };
}

function _createWarnHandler() {
    const warningIgnoreList = ["CIRCULAR_DEPENDENCY", "EMPTY_BUNDLE", "THIS_IS_UNDEFINED"];

    return (warning: RollupWarning, handler: WarningHandler) => {
        if (warning.code === "UNRESOLVED_IMPORT") {
            const id = warning.source;
            const importer = warning.importer;

            if (!importer || !/\?commonjs-external$/.test(importer)) {
                console.error(`Rollup failed to resolve import "${id}" from "${importer}"`);
                process.exit(-1);
            }
        }

        if (!warningIgnoreList.includes(warning.code!)) {
            if (warning.code === "PLUGIN_WARNING") {
                console.warn(`[plugin:${warning.plugin}] ${warning.message}`);
            } else {
                handler(warning);
            }
        }
    };
}
