# bauen

[![npm-version][npm-version-src]][npm-version-href]
[![release][release-src]][release-href]
[![license][license-src]][license-href]

> A javascript build system for libraries

## Usage

Create `.bauenrc.ts` configuration file and add entries:

```ts
import { defineConfig } from "bauen";

export default defineConfig({
    entries: ["./src/index"],
    outputs: ["cjs", "esm"]
});
```

## Configuration

You can use .bauenrc.{js,cjs,mjs,ts} or bauen.config.{js,cjs,mjs,ts} to define the build configuration.

## Examples

```
  $ bauen

  $ bauen build

  $ bauen watch
```

## License

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://badgen.net/npm/v/bauen
[npm-version-href]: https://npmjs.com/package/unbuild
[release-src]: https://github.com/techkit/bauen/actions/workflows/release.yml/badge.svg
[release-href]: https://badgen.net/npm/v/bauen
[license-src]: https://badgen.net/npm/license/bauen
[license-href]: https://npmjs.com/package/unbuild
