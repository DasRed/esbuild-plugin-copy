---
title: Usage
description: Typical uses of esbuild-copy-plugin to put static files next to the bundle, with subfolders, single files, several sources, esbuild-plugin-clear and watch mode.
order: 20
slug: usage
section: Getting started
---

Call `copy({from, to})` and pass the result to esbuild in `plugins`. `from` is the source, `to` the target inside the
folder of `outfile`. What both values mean in detail is listed under [Options](options.md).

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
        copy({from: './public', to: '.'}),
    ],
});
```

`public/index.html` and `public/img/logo.svg` become `dist/index.html` and `dist/img/logo.svg`.

## Copy into a subfolder

```js
copy({from: './assets', to: 'static'})
```

The contents of `assets/` end up in `dist/static/`. Missing folders are created.

## Copy a single file

For a single file, `to` is the file name in the target:

```js
copy({from: './config/robots.production.txt', to: 'robots.txt'})
```

> [!WARNING]
> `to: '.'` does not work for a single file. Node.js then tries to replace the output folder with the file, and the
> build fails with "Cannot overwrite directory".

## Several sources

One call copies exactly one source. For more, add the plugin several times:

```js
plugins: [
    copy({from: './public', to: '.'}),
    copy({from: './node_modules/some-lib/dist/fonts', to: 'fonts'}),
    copy({from: './config/robots.production.txt', to: 'robots.txt'}),
],
```

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
        clear('./dist'),
        copy({from: './public', to: '.'}),
    ],
});
```

## Watch mode

With `esbuild.context()` and `watch()` the plugin copies again after every rebuild, always the whole source.

```js
const ctx = await esbuild.context({
    entryPoints: ['./src/index.js'],
    bundle:      true,
    outfile:     './dist/index.js',
    plugins:     [
        copy({from: './public', to: '.'}),
    ],
});

await ctx.watch();
```

> [!NOTE]
> esbuild only watches files that are part of the bundle. Changing something in `public/` alone does not trigger a
> rebuild. The change arrives with the next rebuild, i.e. when you save a change to your code.
