---
title: Overview
description: esbuild plugin that copies folders or files into the output directory after every successful build, e.g. static assets from public/. Quick example and status.
order: 0
section: Getting started
---

esbuild bundles your JavaScript and CSS into `dist/`. Static files like `index.html`, images or `robots.txt` are up to
you. `esbuild-copy-plugin` takes care of that: after every successful build it copies folders or files into the output
directory.

## Quick example

```js
import esbuild from 'esbuild';
import copy from 'esbuild-copy-plugin';

await esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle:      true,
    outfile:     './dist/index.js',
    plugins:     [
        copy({from: './public'}),
    ],
});
```

Afterwards the contents of `public/` sit right next to `dist/index.js`.

## What the plugin does

- It hooks into esbuild's `onEnd` and copies after every successful build, so in watch mode after every rebuild.
  Failed builds copy nothing.
- It works with `outfile` and with `outdir`. The target is always inside the output folder.
- It copies recursively, overwrites existing files and resolves symbolic links (the content is copied, not the link).
- One plugin call can copy several sources.
- Problems like a missing source fail the build with a clear message.

## Status

Version 2, rewritten in TypeScript in 2026. Ships as ESM and CommonJS with type definitions. Tested with esbuild 0.28
and Node.js 22 and 26. Coming from version 1? See [Migration](migration.md).

## Related packages

The three esbuild plugins are meant as a set:

- [esbuild-plugin-clear](https://www.marco-starker.de/en/projects/esbuild-plugin-clear): empties the output directory
  before the build.
- [esbuild-plugin-time](https://www.marco-starker.de/en/projects/esbuild-plugin-time): measures how long the build
  takes.
