---
title: Überblick
description: esbuild-Plugin, das nach jedem Build einen Ordner oder eine Datei in das Ausgabeverzeichnis kopiert, etwa statische Assets aus public/.
order: 0
section: Einstieg
---

esbuild bündelt dein JavaScript und CSS nach `dist/`. Statische Dateien wie `index.html`, Bilder oder `robots.txt`
musst du selbst dorthin bringen. `esbuild-copy-plugin` übernimmt das: Nach jedem Build kopiert es einen Ordner oder
eine Datei in das Ausgabeverzeichnis.

## Kurzbeispiel

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

Danach liegt der Inhalt von `public/` direkt neben `dist/index.js`.

## Was das Plugin macht

- Es hängt sich an das `onEnd` von esbuild und kopiert nach jedem Build, im Watch-Modus also nach jedem Rebuild.
- Es kopiert rekursiv, überschreibt vorhandene Dateien und löst symbolische Links auf (kopiert wird der Inhalt, nicht
  der Link).
- Das Ziel liegt immer relativ zum Ordner von `outfile`.

## Status

Version 1.0.0, geschrieben 2021. Getestet mit esbuild 0.28 und Node.js 22.

> [!IMPORTANT]
> Das Plugin braucht `outfile`. Mit `outdir` bricht der Build ab. Alle Grenzen stehen unter
> [Optionen](options.md#einschränkungen).

## Verwandte Pakete

Die drei esbuild-Plugins sind als Satz gedacht:

- [esbuild-plugin-clear](https://www.marco-starker.de/de/projekte/esbuild-plugin-clear): leert das Ausgabeverzeichnis
  vor dem Build.
- [esbuild-plugin-time](https://www.marco-starker.de/de/projekte/esbuild-plugin-time): misst, wie lange der Build
  dauert.
