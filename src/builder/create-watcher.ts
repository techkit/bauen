import { OutputOptions, RollupOptions, RollupWatcherEvent, watch } from "rollup";

export function createWatcher(rollupOptions: RollupOptions) {
    if (Array.isArray(rollupOptions.output)) {
        rollupOptions.output = rollupOptions.output.map(out => _transformOutput(out));
    }

    console.info("Watching for file changes...");

    const watcher = watch(rollupOptions);

    watcher.on("event", _onEventHandler);

    watcher.close();

    return watcher;
}

function _onEventHandler(event: RollupWatcherEvent) {
    if (event.code === "BUNDLE_START") {
        console.info("Build started...");
    } else if (event.code === "BUNDLE_END") {
        event.result.close();
        console.info(`Built in ${event.duration}ms.`);
    } else if (event.code === "ERROR") {
        console.error(event.error.message);
    }
}

function _transformOutput(outputOptions: OutputOptions) {
    const chunkFileNames = outputOptions.chunkFileNames;

    if (typeof chunkFileNames === "string") {
        outputOptions.chunkFileNames = chunkFileNames.replace("[hash]", "[name]");
    }

    return outputOptions;
}
