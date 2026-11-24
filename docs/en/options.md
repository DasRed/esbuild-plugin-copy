---
title: Options
description: The from and to options of esbuild-copy-plugin, how source and target are resolved, the fixed copy behaviour, the error messages and the remaining limitations.
order: 30
slug: options
section: Reference
---

`copy()` takes one options object or an array of them and returns an esbuild plugin named `copy`.

```js
copy({from: './public', to: '.'})
copy([{from: './public'}, {from: './fonts', to: 'fonts'}])
```

## Options

| Name   | Type     | Default  | Description                                                                                  |
|--------|----------|----------|----------------------------------------------------------------------------------------------|
| `from` | `string` | required | Folder or file to copy. Relative to `absWorkingDir` of the build                             |
| `to`   | `string` | `.`      | Target relative to the output folder. For a single file the target name or an existing folder |

The output folder is `outdir`, or the folder of `outfile` if `outdir` is not set. Without `absWorkingDir` the plugin
resolves `from` relative to the folder you start the build from.

An example with `outfile: './dist/index.js'`:

| `from`                | `to`         | Result                                  |
|-----------------------|--------------|-----------------------------------------|
| `./public`            | `.`          | contents of `public/` in `dist/`        |
| `./public`            | `static`     | contents of `public/` in `dist/static/` |
| `./config/robots.txt` | `robots.txt` | `dist/robots.txt`                       |
| `./config/robots.txt` | `.`          | `dist/robots.txt`                       |

## Fixed behaviour

The plugin passes these settings to `fs.cp`. You cannot change them.

| Setting       | Value  | Effect                                                   |
|---------------|--------|----------------------------------------------------------|
| `recursive`   | `true` | Folders are copied with all subfolders                   |
| `force`       | `true` | Existing files in the target are overwritten             |
| `dereference` | `true` | Symbolic links are resolved, their content is copied     |

Files that exist in the target but no longer in the source are not deleted. Use
[esbuild-plugin-clear](https://www.marco-starker.de/en/projects/esbuild-plugin-clear) for that.

## Errors

Problems are reported as esbuild errors, so the build fails with a message. The other sources are still copied.

| Case                                       | Message                                                   |
|--------------------------------------------|-----------------------------------------------------------|
| Neither `outdir` nor `outfile`             | `The build has neither outdir nor outfile.`               |
| The source does not exist                  | `The source "…" does not exist.`                          |
| The target lies outside the output folder  | `Refusing to copy "…" to "…", it is outside of the output folder "…".` |
| Copying fails (permissions, disk full …)   | `Could not copy "…" to "…": …`                            |

A failed build itself copies nothing and adds no message.

## Limitations

- **Copies the whole source every time.** There is no check for changed files.
- **Changes in the source do not trigger a rebuild** in watch mode, see [Usage](usage.md#watch-mode).
- **Writes to disk even with `write: false`.** The plugin does not look at esbuild's output files.
