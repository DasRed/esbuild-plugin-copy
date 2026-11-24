---
title: Überblick
description: esbuild-Plugin, das nach jedem erfolgreichen Build Ordner oder Dateien in das Ausgabeverzeichnis kopiert, etwa statische Assets aus public/. Mit Beispiel.
order: 0
section: Einstieg
---

esbuild bündelt dein JavaScript und CSS nach `dist/`. Statische Dateien wie `index.html`, Bilder oder `robots.txt`
musst du selbst dorthin bringen. `esbuild-copy-plugin` übernimmt das: Nach jedem erfolgreichen Build kopiert es Ordner
oder Dateien in das Ausgabeverzeichnis.

## Kurzbeispiel

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

Danach liegt der Inhalt von `public/` direkt neben `dist/index.js`.

## Was das Plugin macht

- Es hängt sich an das `onEnd` von esbuild und kopiert nach jedem erfolgreichen Build, im Watch-Modus also nach jedem
  Rebuild. Schlägt ein Build fehl, kopiert es nichts.
- Es funktioniert mit `outfile` und mit `outdir`. Das Ziel liegt immer im Ausgabeordner.
- Es kopiert rekursiv, überschreibt vorhandene Dateien und löst symbolische Links auf (kopiert wird der Inhalt, nicht
  der Link).
- Ein Aufruf kann mehrere Quellen kopieren.
- Probleme wie eine fehlende Quelle lassen den Build mit einer klaren Meldung fehlschlagen.

## Status

Version 2, 2026 in TypeScript neu geschrieben. Wird als ESM und CommonJS mit Typdefinitionen ausgeliefert. Getestet
mit esbuild 0.28 und Node.js 22 und 26. Du kommst von Version 1? Siehe [Migration](migration.md).

## Verwandte Pakete

Die drei esbuild-Plugins sind als Satz gedacht:

- [esbuild-plugin-clear](https://www.marco-starker.de/de/projekte/esbuild-plugin-clear): leert das Ausgabeverzeichnis
  vor dem Build.
- [esbuild-plugin-time](https://www.marco-starker.de/de/projekte/esbuild-plugin-time): misst, wie lange der Build
  dauert.
