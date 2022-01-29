import { loadConfig } from "./config";

async function main() {
    const result = loadConfig(process.cwd());
    console.log(result);
}

main();
