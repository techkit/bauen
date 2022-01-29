import { loadConfig } from "./config";
import { getOptions } from "./options";

async function main() {
    const config = loadConfig(process.cwd());
    const options = getOptions(process.argv, config);
    console.log(options);
}

main();
