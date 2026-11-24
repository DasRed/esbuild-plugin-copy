---
title: Usage
description: Typical uses of esbuild-copy-plugin: static files next to the bundle, subfolders, single files, several sources, outdir, esbuild-plugin-clear and watch mode.
order: 20
slug: usage
section: Getting started
---

Call `copy({from, to})` and pass the result to esbuild in `plugins`. `from` is the source, `to` the target inside the
output folder. What both values mean in detail is listed under [Options](options.md).

## Put static files next to the bundle

The most common case: everything from `public/` should end up directly in `dist/`.

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

`public/index.html` and `public/img/logo.svg` become `dist/index.html` and `dist/img/logo.svg`. Without `to` the
plugin copies straight into the output folder, the same as `to: '.'`.

## With outdir

The plugin uses `outdir` if it is set, otherwise the folder of `outfile`:

```js
await esbuild.build({
    entryPoints: ['./src/index.js', './src/admin.js'],
    bundle:      true,
    outdir:      './dist',
    plugins:     [
        copy({from: './public'}),
    ],
});
```

## Copy into a subfolder

```js
copy({from: './assets', to: 'static'})
```

The contents of `assets/` end up in `dist/static/`. Missing folders are created.

## Copy a single file

For a single file, `to` is either the new file name or a folder:

```js
copy({from: './config/robots.production.txt', to: 'robots.txt'})
copy({from: './favicon.ico', to: '.'})
```

The first call writes `dist/robots.txt`, the second `dist/favicon.ico`. If `to` is an existing folder, the file keeps
its name inside that folder.

## Several sources

Pass an array to copy several sources with one plugin. They are copied in that order, so a later source can overwrite
files of an earlier one:

```js
plugins: [
    copy([
        {from: './public'},
        {from: './node_modules/some-lib/dist/fonts', to: 'fonts'},
        {from: './config/robots.production.txt', to: 'robots.txt'},
    ]),
],
```

Adding the plugin several times works as well.

## Together with esbuild-plugin-clear

`esbuild-plugin-clear` empties the output folder before the build, `esbuild-copy-plugin` fills it again afterwards.
That way no stale files are left behind:

```js
import esbuild from 'esbuild';
import clear from 'esbuild-plugin-clear';
import copy from 'esbuild-copy-plugin';

await esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle:      true,
    outfile:     './dist/index.js',
    plugins:     [
        clear(),
        copy({from: './public'}),
    ],
});
```

## Watch mode

With `esbuild.context()` and `watch()` the plugin copies again after every successful rebuild, always the whole
source.

```js
const ctx = await esbuild.context({
    entryPoints: ['./src/index.js'],
    bundle:      true,
    outfile:     './dist/index.js',
    plugins:     [
        copy({from: './public'}),
    ],
});

await ctx.watch();
```

> [!NOTE]
> esbuild only watches files that are part of the bundle. Changing something in `public/` alone does not trigger a
> rebuild. The change arrives with the next rebuild, i.e. when you save a change to your code.
