---
title: Overview
description: esbuild plugin that copies a folder or file into the output directory after every build, e.g. static assets from public/.
order: 0
section: Getting started
---

esbuild bundles your JavaScript and CSS into `dist/`. Static files like `index.html`, images or `robots.txt` are up to
you. `esbuild-copy-plugin` takes care of that: after every build it copies a folder or a file into the output
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
        copy({from: './public', to: '.'}),
    ],
});
```

Afterwards the contents of `public/` sit right next to `dist/index.js`.

## What the plugin does

- It hooks into esbuild's `onEnd` and copies after every build, so in watch mode after every rebuild.
- It copies recursively, overwrites existing files and resolves symbolic links (the content is copied, not the link).
- The target is always relative to the folder of `outfile`.

## Status

Version 1.0.0, written in 2021. Tested with esbuild 0.28 and Node.js 22.

> [!IMPORTANT]
> The plugin needs `outfile`. With `outdir` the build fails. All limits are listed under
> [Options](options.md#limitations).

## Related packages

The three esbuild plugins are meant as a set:

- [esbuild-plugin-clear](https://www.marco-starker.de/en/projects/esbuild-plugin-clear): empties the output directory
  before the build.
- [esbuild-plugin-time](https://www.marco-starker.de/en/projects/esbuild-plugin-time): measures how long the build
  takes.
