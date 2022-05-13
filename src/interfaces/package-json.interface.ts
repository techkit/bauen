export type PackageJsonType = "commonjs" | "module";

export interface PackageJsonBinTable {
    [name: string]: string;
}

export interface PackageJsonDependencyTable {
    [name: string]: string;
}

export interface PackageJsonScriptTable {
    [name: string]: string;
}

export interface PackageJson {
    name: string;
    version?: string;
    private?: boolean;
    description?: string;
    main?: string;
    module?: string;
    types?: string;
    type?: PackageJsonType;
    bin?: PackageJsonBinTable | string;
    workspaces?: string[];
    scripts?: PackageJsonScriptTable;
    dependencies?: PackageJsonDependencyTable;
    optionalDependencies?: PackageJsonDependencyTable;
    devDependencies?: PackageJsonDependencyTable;
    peerDependencies?: PackageJsonDependencyTable;
}
