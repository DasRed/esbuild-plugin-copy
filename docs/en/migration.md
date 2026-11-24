---
title: Migration
description: What changed in esbuild-copy-plugin from version 1 to 2: outdir support, optional to, several sources, error handling, CommonJS, TypeScript types and Node.js.
order: 40
slug: migration
section: Reference
---

## From 1 to 2

Version 2 is a rewrite in TypeScript. `copy({from, to})` keeps working, but a few things behave differently.

| Topic                    | Version 1                                    | Version 2                                                  |
|--------------------------|----------------------------------------------|------------------------------------------------------------|
| `outdir`                 | build fails                                  | supported, preferred over `outfile`                         |
| `to`                     | required                                     | optional, defaults to `.`                                   |
| Several sources          | plugin added several times                   | additionally an array in one call                           |
| Failed build             | copies anyway                                | copies nothing                                              |
| `from` relative to       | the current folder of the process            | `absWorkingDir` of the build, otherwise the current folder  |
| Absolute `to`            | appended to the output folder                | error, the target has to stay inside the output folder      |
| Single file with `to: '.'` | build fails                                | copied into the output folder under its own name           |
| Missing source           | raw `ENOENT` exception                       | esbuild error with a message                                |
| Module formats           | ESM only                                     | ESM and CommonJS, with type definitions                     |
| Node.js                  | 16.7 or later                                | 22.13 or later                                               |

## What to check

- If you set `absWorkingDir` and start the build from another folder, `from` is now relative to `absWorkingDir`.
- If you passed an absolute path in `to`, replace it with a path relative to the output folder.
- If your setup relied on copying after a failed build, that no longer happens.
