import { PathLike } from "fs";
import { rm } from "fs/promises";

export function remove(path: PathLike) {
    return rm(path, { force: true, recursive: true });
}
