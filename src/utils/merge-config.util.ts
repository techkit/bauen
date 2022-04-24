import merge from "lodash.merge";
import { UserConfig } from "../interfaces";

export function mergeConfig(config: UserConfig, ...configs: UserConfig[]) {
    return merge(config, ...configs) as UserConfig;
}
