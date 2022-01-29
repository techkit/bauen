type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export type UserConfig = DeepPartial<Config>;

export interface Config {
    rootDir: string;
    outDir: string;
    entries: string[];
}
