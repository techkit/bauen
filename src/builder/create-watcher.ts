import { OutputOptions, RollupOptions, RollupWatcherEvent, watch } from "rollup";
import { BauenOptions } from "../interfaces";

export function createWatcher(options: BauenOptions, rollupOptions: RollupOptions) {
    if (Array.isArray(rollupOptions.output)) {
        rollupOptions.output = rollupOptions.output.map(out => _transformOutput(out));
    }

    console.info("Watching for file changes...");

    const watcher = watch(rollupOptions);

    watcher.on("event", _createOnEventHandler(options));

    watcher.close();

    return watcher;
}

function _createOnEventHandler(options: BauenOptions) {
    return async (event: RollupWatcherEvent) => {
        if (event.code === "BUNDLE_START") {
            await options.onBundleStart?.();
            console.info("Build started...");
        } else if (event.code === "BUNDLE_END") {
            event.result.close();
            await options.onBundleEnd?.();
            console.info(`Built in ${event.duration}ms.`);
        } else if (event.code === "ERROR") {
            console.error(event.error.message);
        }
    };
}

function _transformOutput(outputOptions: OutputOptions) {
    const chunkFileNames = outputOptions.chunkFileNames;

    if (typeof chunkFileNames === "string") {
        outputOptions.chunkFileNames = chunkFileNames.replace("[hash]", "[name]");
    }

    return outputOptions;
}
