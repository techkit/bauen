import { build } from "./commands";
import { loadConfig } from "./config";
import { getOptions } from "./options";

async function main() {
    const config = loadConfig(process.cwd());
    const options = getOptions(process.argv, config);

    await build(options);
}

main();
