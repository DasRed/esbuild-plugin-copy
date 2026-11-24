---
title: Migration
description: Was sich bei esbuild-copy-plugin von Version 1 auf 2 geändert hat: outdir, optionales to, mehrere Quellen, Fehler, CommonJS, TypeScript-Typen und Node.js.
order: 40
slug: migration
section: Referenz
---

## Von 1 auf 2

Version 2 ist in TypeScript neu geschrieben. `copy({from, to})` funktioniert weiter, einiges verhält sich aber anders.

| Thema                         | Version 1                               | Version 2                                                    |
|-------------------------------|-----------------------------------------|--------------------------------------------------------------|
| `outdir`                      | Build bricht ab                         | wird unterstützt, hat Vorrang vor `outfile`                   |
| `to`                          | Pflicht                                 | optional, Standard ist `.`                                   |
| Mehrere Quellen               | Plugin mehrfach eintragen               | zusätzlich als Array in einem Aufruf                         |
| Fehlgeschlagener Build        | kopiert trotzdem                        | kopiert nichts                                               |
| `from` relativ zu             | dem aktuellen Ordner des Prozesses      | `absWorkingDir` des Builds, sonst dem aktuellen Ordner       |
| Absolutes `to`                | wird an den Ausgabeordner angehängt     | Fehler, das Ziel muss im Ausgabeordner bleiben               |
| Einzeldatei mit `to: '.'`     | Build bricht ab                         | wird unter ihrem Namen in den Ausgabeordner kopiert          |
| Fehlende Quelle               | rohe `ENOENT`-Exception                 | esbuild-Fehler mit Meldung                                   |
| Modulformate                  | nur ESM                                 | ESM und CommonJS, mit Typdefinitionen                        |
| Node.js                       | ab 16.7                                 | ab 22.13                                                     |

## Was du prüfen solltest

- Setzt du `absWorkingDir` und startest den Build aus einem anderen Ordner, gilt `from` jetzt relativ zu
  `absWorkingDir`.
- Hast du in `to` einen absoluten Pfad angegeben, ersetz ihn durch einen Pfad relativ zum Ausgabeordner.
- Hat dein Ablauf darauf gebaut, dass auch nach einem fehlgeschlagenen Build kopiert wird, passiert das nicht mehr.
