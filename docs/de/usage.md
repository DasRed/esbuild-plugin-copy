---
title: Verwendung
description: Typische Einsätze von esbuild-copy-plugin – Ordner kopieren, einzelne Dateien, mehrere Quellen und Watch-Modus.
order: 20
slug: verwendung
section: Einstieg
---

Du rufst `copy({from, to})` auf und gibst das Ergebnis in `plugins` an esbuild. `from` ist die Quelle, `to` das Ziel
im Ordner von `outfile`. Was die beiden Werte genau bedeuten, steht unter [Optionen](options.md).

## Statische Dateien neben das Bundle legen

Der häufigste Fall: Alles aus `public/` soll direkt in `dist/` landen.

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

Aus `public/index.html` und `public/img/logo.svg` werden `dist/index.html` und `dist/img/logo.svg`.

## In einen Unterordner kopieren

```js
copy({from: './assets', to: 'static'})
```

Der Inhalt von `assets/` landet in `dist/static/`. Fehlende Ordner legt das Plugin an.

## Eine einzelne Datei kopieren

Bei einer Datei gibst du in `to` den Dateinamen im Ziel an:

```js
copy({from: './config/robots.production.txt', to: 'robots.txt'})
```

> [!WARNING]
> `to: '.'` funktioniert bei einer einzelnen Datei nicht. Node.js versucht dann, den Ausgabeordner durch die Datei zu
> ersetzen, und der Build bricht mit „Cannot overwrite directory“ ab.

## Mehrere Quellen

Ein Aufruf kopiert genau eine Quelle. Für mehrere trägst du das Plugin mehrfach ein:

```js
plugins: [
    copy({from: './public', to: '.'}),
    copy({from: './node_modules/some-lib/dist/fonts', to: 'fonts'}),
    copy({from: './config/robots.production.txt', to: 'robots.txt'}),
],
```

## Zusammen mit esbuild-plugin-clear

`esbuild-plugin-clear` leert den Ausgabeordner vor dem Build, `esbuild-copy-plugin` füllt ihn danach wieder. So
bleiben keine alten Dateien liegen:

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

## Watch-Modus

Mit `esbuild.context()` und `watch()` kopiert das Plugin nach jedem Rebuild erneut, und zwar immer die komplette Quelle.

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
> esbuild beobachtet nur Dateien, die im Bundle stecken. Änderst du nur etwas in `public/`, startet kein Rebuild. Die
> Änderung kommt erst mit dem nächsten Rebuild, also wenn du am Code etwas speicherst.
