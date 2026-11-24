---
title: Optionen
description: Die Optionen from und to von esbuild-copy-plugin, wie Quelle und Ziel aufgelöst werden, das feste Kopierverhalten, die Fehlermeldungen und die Grenzen.
order: 30
slug: optionen
section: Referenz
---

`copy()` nimmt ein Objekt mit Optionen oder ein Array davon und gibt ein esbuild-Plugin mit dem Namen `copy` zurück.

```js
copy({from: './public', to: '.'})
copy([{from: './public'}, {from: './fonts', to: 'fonts'}])
```

## Optionen

| Name   | Typ      | Standard | Beschreibung                                                                                    |
|--------|----------|----------|-------------------------------------------------------------------------------------------------|
| `from` | `string` | Pflicht  | Ordner oder Datei, die kopiert wird. Relativ zu `absWorkingDir` des Builds                      |
| `to`   | `string` | `.`      | Ziel relativ zum Ausgabeordner. Bei einer Datei der Zielname oder ein vorhandener Ordner        |

Der Ausgabeordner ist `outdir` oder, wenn `outdir` fehlt, der Ordner von `outfile`. Ohne `absWorkingDir` gilt `from`
relativ zum Ordner, aus dem du den Build startest.

Ein Beispiel mit `outfile: './dist/index.js'`:

| `from`                | `to`         | Ergebnis                                 |
|-----------------------|--------------|------------------------------------------|
| `./public`            | `.`          | Inhalt von `public/` in `dist/`          |
| `./public`            | `static`     | Inhalt von `public/` in `dist/static/`   |
| `./config/robots.txt` | `robots.txt` | `dist/robots.txt`                        |
| `./config/robots.txt` | `.`          | `dist/robots.txt`                        |

## Festes Verhalten

Diese Einstellungen gibt das Plugin an `fs.cp` weiter. Ändern kannst du sie nicht.

| Einstellung   | Wert   | Wirkung                                                        |
|---------------|--------|----------------------------------------------------------------|
| `recursive`   | `true` | Ordner werden mit allen Unterordnern kopiert                   |
| `force`       | `true` | Vorhandene Dateien im Ziel werden überschrieben                |
| `dereference` | `true` | Symbolische Links werden aufgelöst, kopiert wird ihr Inhalt    |

Dateien, die im Ziel liegen, aber nicht mehr in der Quelle, löscht das Plugin nicht. Dafür gibt es
[esbuild-plugin-clear](https://www.marco-starker.de/de/projekte/esbuild-plugin-clear).

## Fehler

Probleme meldet das Plugin als esbuild-Fehler, der Build schlägt dann mit einer Meldung fehl. Die übrigen Quellen
werden trotzdem kopiert.

| Fall                                          | Meldung                                                    |
|-----------------------------------------------|------------------------------------------------------------|
| Weder `outdir` noch `outfile`                 | `The build has neither outdir nor outfile.`                |
| Die Quelle fehlt                              | `The source "…" does not exist.`                           |
| Das Ziel liegt außerhalb des Ausgabeordners   | `Refusing to copy "…" to "…", it is outside of the output folder "…".` |
| Kopieren schlägt fehl (Rechte, Platte voll …) | `Could not copy "…" to "…": …`                             |

Ein fehlgeschlagener Build kopiert nichts und erzeugt keine zusätzliche Meldung.

## Einschränkungen

- **Kopiert jedes Mal die komplette Quelle.** Geänderte Dateien werden nicht gesondert erkannt.
- **Änderungen in der Quelle starten keinen Rebuild** im Watch-Modus, siehe [Verwendung](usage.md#watch-modus).
- **Schreibt auch mit `write: false` auf die Platte.** Das Plugin schaut nicht auf die Ausgabedateien von esbuild.
