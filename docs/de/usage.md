---
title: Verwendung
description: Typische Einsätze von esbuild-copy-plugin: statische Dateien neben dem Bundle, Unterordner, Einzeldateien, mehrere Quellen, outdir, clear und Watch-Modus.
order: 20
slug: verwendung
section: Einstieg
---

Du rufst `copy({from, to})` auf und gibst das Ergebnis in `plugins` an esbuild. `from` ist die Quelle, `to` das Ziel
im Ausgabeordner. Was die beiden Werte genau bedeuten, steht unter [Optionen](options.md).

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
        copy({from: './public'}),
    ],
});
```

Aus `public/index.html` und `public/img/logo.svg` werden `dist/index.html` und `dist/img/logo.svg`. Ohne `to` kopiert
das Plugin direkt in den Ausgabeordner, wie mit `to: '.'`.

## Mit outdir

Das Plugin nimmt `outdir`, wenn es gesetzt ist, sonst den Ordner von `outfile`:

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

## In einen Unterordner kopieren

```js
copy({from: './assets', to: 'static'})
```

Der Inhalt von `assets/` landet in `dist/static/`. Fehlende Ordner legt das Plugin an.

## Eine einzelne Datei kopieren

Bei einer Datei ist `to` entweder der neue Dateiname oder ein Ordner:

```js
copy({from: './config/robots.production.txt', to: 'robots.txt'})
copy({from: './favicon.ico', to: '.'})
```

Der erste Aufruf schreibt `dist/robots.txt`, der zweite `dist/favicon.ico`. Ist `to` ein vorhandener Ordner, behält
die Datei darin ihren Namen.

## Mehrere Quellen

Übergibst du ein Array, kopiert ein Plugin mehrere Quellen. Sie werden in dieser Reihenfolge kopiert, eine spätere
Quelle kann also Dateien einer früheren überschreiben:

```js
plugins: [
    copy([
        {from: './public'},
        {from: './node_modules/some-lib/dist/fonts', to: 'fonts'},
        {from: './config/robots.production.txt', to: 'robots.txt'},
    ]),
],
```

Das Plugin mehrfach einzutragen geht ebenfalls.

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
        clear(),
        copy({from: './public'}),
    ],
});
```

## Watch-Modus

Mit `esbuild.context()` und `watch()` kopiert das Plugin nach jedem erfolgreichen Rebuild erneut, und zwar immer die
komplette Quelle.

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
> esbuild beobachtet nur Dateien, die im Bundle stecken. Änderst du nur etwas in `public/`, startet kein Rebuild. Die
> Änderung kommt erst mit dem nächsten Rebuild, also wenn du am Code etwas speicherst.
