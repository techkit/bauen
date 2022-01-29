import { Config } from "./config.interface";

export type BauenOptions = CliOptions & Config;

export interface CliOptions {
    command?: string;
}
