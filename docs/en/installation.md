---
title: Installation
description: Install esbuild-copy-plugin via npm as a dev dependency, which versions of Node.js and esbuild you need and how to check that copying works after a build.
order: 10
slug: installation
section: Getting started
---

You only need the plugin at build time, so add it as a dev dependency.

## Install the package

```bash
npm i -D esbuild-copy-plugin
```

The plugin does not ship esbuild. If it is missing:

```bash
npm i -D esbuild
```

## Requirements

| What    | Version                | Why                                                         |
|---------|------------------------|-------------------------------------------------------------|
| Node.js | 16.7 or later, 18+ recommended | The plugin copies with `fs.cpSync`, available since 16.7 |
| esbuild | with plugin API        | Tested with 0.28; only `onEnd` is used                      |

> [!NOTE]
> The package is pure ESM with a single default export. Write your build script as `.mjs` or set `"type": "module"`
> in your `package.json`.

## Check

Create a small build script, e.g. `build.mjs`, like the example under [Usage](usage.md), and run it:

```bash
node build.mjs
```

If your files show up in `dist/`, you are good to go.
