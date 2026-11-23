---
title: Optionen
description: Die Optionen from und to von esbuild-copy-plugin, wie Ziele relativ zu outfile aufgelöst werden, das feste Kopierverhalten und die bekannten Grenzen.
order: 30
slug: optionen
section: Referenz
---

`copy()` nimmt ein Objekt mit zwei Pflichtfeldern und gibt ein esbuild-Plugin mit dem Namen `copy` zurück.

```js
copy({from: './public', to: '.'})
```

## Optionen

| Name   | Typ      | Standard | Beschreibung                                                                                     |
|--------|----------|----------|--------------------------------------------------------------------------------------------------|
| `from` | `string` | Pflicht  | Ordner oder Datei, die kopiert wird. Relativ zum Ordner, aus dem du den Build startest            |
| `to`   | `string` | Pflicht  | Ziel relativ zum Ordner von `outfile`. `.` heißt: direkt in diesen Ordner. Bei einer Datei der Zielname |

Ein Beispiel mit `outfile: './dist/index.js'`:

| `from`                | `to`         | Ergebnis                         |
|-----------------------|--------------|----------------------------------|
| `./public`            | `.`          | Inhalt von `public/` in `dist/`  |
| `./public`            | `static`     | Inhalt von `public/` in `dist/static/` |
| `./config/robots.txt` | `robots.txt` | `dist/robots.txt`                |

## Festes Verhalten

Diese Einstellungen gibt das Plugin an `fs.cpSync` weiter. Ändern kannst du sie nicht.

| Einstellung   | Wert   | Wirkung                                                        |
|---------------|--------|----------------------------------------------------------------|
| `recursive`   | `true` | Ordner werden mit allen Unterordnern kopiert                   |
| `force`       | `true` | Vorhandene Dateien im Ziel werden überschrieben                |
| `dereference` | `true` | Symbolische Links werden aufgelöst, kopiert wird ihr Inhalt    |

Dateien, die im Ziel liegen, aber nicht mehr in der Quelle, löscht das Plugin nicht. Dafür gibt es
[esbuild-plugin-clear](https://www.marco-starker.de/de/projekte/esbuild-plugin-clear).

## Einschränkungen

Diese Punkte gelten für Version 1.0.0:

- **Nur mit `outfile`.** Das Ziel wird aus dem Ordner von `outfile` berechnet. Nutzt du `outdir`, bricht der Build mit
  „The "path" argument must be of type string“ ab.
- **Kopiert auch nach einem fehlgeschlagenen Build.** Das Plugin prüft das Ergebnis von esbuild nicht.
- **`from` ist relativ zum aktuellen Ordner des Prozesses**, nicht zu `absWorkingDir`. Startest du den Build aus einem
  anderen Ordner, findet das Plugin die Quelle nicht.
- **`to` bleibt immer im Ausgabeordner.** Auch ein absoluter Pfad wird an den Ordner von `outfile` angehängt.
- **Fehlt die Quelle, schlägt der Build fehl**, mit dem rohen Fehler von Node.js (`ENOENT: no such file or directory`).
- **Eine einzelne Datei braucht einen Zielnamen** in `to`, siehe [Verwendung](usage.md#eine-einzelne-datei-kopieren).

> [!TIP]
> Arbeitest du mit `outdir`, setz für diesen Build stattdessen `outfile` oder kopier die Dateien in einem eigenen
> Schritt nach dem Build.
