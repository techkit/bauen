import { build, watch } from "./commands";
import { loadConfig } from "./config";
import { getOptions } from "./options";

async function main() {
    const config = loadConfig(process.cwd());
    const options = await getOptions(process.argv, config);

    if (options.command === "build") {
        await build(options);
    } else if (options.command === "watch") {
        await watch(options);
    }
}

main().catch(err => {
    console.error("An error has been detected while running bauen");
    console.error(err);

    process.exit(1);
});
