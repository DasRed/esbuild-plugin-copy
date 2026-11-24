## [2.0.0](https://github.com/DasRed/esbuild-plugin-copy/compare/v1.0.2...v2.0.0) (2026-11-24)

### ⚠ BREAKING CHANGES

* from resolves against absWorkingDir, absolute or escaping targets fail the build, nothing is copied after a failed build, CommonJS exposes the default export as require(…).default and Node.js >=22.13.0 is required.

### Features

* rewrite in TypeScript with ESM/CJS builds, types, outdir and several sources ([bb026df](https://github.com/DasRed/esbuild-plugin-copy/commit/bb026df1973c568036b87b6f058e7fca05d1495c))

## [1.0.2](https://github.com/DasRed/esbuild-plugin-copy/compare/v1.0.1...v1.0.2) (2026-11-24)

### Bug Fixes

* homepage fixed ([1383762](https://github.com/DasRed/esbuild-plugin-copy/commit/138376209c8674b3b89e7c1f7a4a1dcd6f551f80))

## [1.0.1](https://github.com/DasRed/esbuild-plugin-copy/compare/v1.0.0...v1.0.1) (2026-11-24)

### Bug Fixes

* update github workflows ([5ea1fbf](https://github.com/DasRed/esbuild-plugin-copy/commit/5ea1fbfb8ab044a3d78dcef2b9b693a7bb399e9b))
