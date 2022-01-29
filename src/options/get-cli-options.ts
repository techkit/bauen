/* eslint-disable @typescript-eslint/no-explicit-any */
import mri from "mri";
import { CliOptions } from "../interfaces/options.interface";

export function getCliOptions(argv: string[]): CliOptions {
    const args = mri([...argv].splice(2), {});
    const { _, ...restArgs } = args;

    return {
        ...(_.length > 0 && { command: _[0] }),
        ...(restArgs as any)
    };
}
