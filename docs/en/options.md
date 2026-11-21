---
title: Options
description: All options of esbuild-copy-plugin, the fixed copy behaviour and the known limitations.
order: 30
slug: options
section: Reference
---

`copy()` takes an object with two required fields and returns an esbuild plugin named `copy`.

```js
copy({from: './public', to: '.'})
```

## Options

| Name   | Type     | Default  | Description                                                                                       |
|--------|----------|----------|---------------------------------------------------------------------------------------------------|
| `from` | `string` | required | Folder or file to copy. Relative to the folder you start the build from                           |
| `to`   | `string` | required | Target relative to the folder of `outfile`. `.` means directly into that folder. For a file: the target name |

An example with `outfile: './dist/index.js'`:

| `from`                | `to`         | Result                               |
|-----------------------|--------------|--------------------------------------|
| `./public`            | `.`          | contents of `public/` in `dist/`     |
| `./public`            | `static`     | contents of `public/` in `dist/static/` |
| `./config/robots.txt` | `robots.txt` | `dist/robots.txt`                    |

## Fixed behaviour

The plugin passes these settings to `fs.cpSync`. You cannot change them.

| Setting       | Value  | Effect                                                   |
|---------------|--------|----------------------------------------------------------|
| `recursive`   | `true` | Folders are copied with all subfolders                   |
| `force`       | `true` | Existing files in the target are overwritten             |
| `dereference` | `true` | Symbolic links are resolved, their content is copied     |

Files that exist in the target but no longer in the source are not deleted. Use
[esbuild-plugin-clear](https://www.marco-starker.de/en/projects/esbuild-plugin-clear) for that.

## Limitations

These points apply to version 1.0.0:

- **Only with `outfile`.** The target is derived from the folder of `outfile`. With `outdir` the build fails with
  "The "path" argument must be of type string".
- **Copies even after a failed build.** The plugin does not check esbuild's result.
- **`from` is relative to the current folder of the process**, not to `absWorkingDir`. If you start the build from
  another folder, the plugin does not find the source.
- **`to` always stays inside the output folder.** Even an absolute path is appended to the folder of `outfile`.
- **A missing source fails the build** with the raw Node.js error (`ENOENT: no such file or directory`).
- **A single file needs a target name** in `to`, see [Usage](usage.md#copy-a-single-file).

> [!TIP]
> If you work with `outdir`, set `outfile` for this build instead, or copy the files in a separate step after the
> build.
