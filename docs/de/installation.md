---
title: Installation
description: esbuild-copy-plugin per npm als Dev-Abhängigkeit installieren, welche Versionen von Node.js und esbuild du brauchst und wie du prüfst, dass das Kopieren klappt.
order: 10
slug: installation
section: Einstieg
---

Das Plugin brauchst du nur beim Bauen, also als Dev-Abhängigkeit.

## Paket installieren

```bash
npm i -D esbuild-copy-plugin
```

esbuild bringt das Plugin nicht mit. Falls es noch fehlt:

```bash
npm i -D esbuild
```

## Voraussetzungen

| Was     | Version             | Warum                                                          |
|---------|---------------------|----------------------------------------------------------------|
| Node.js | ab 16.7, besser 18+ | Das Plugin kopiert mit `fs.cpSync`, das es erst ab 16.7 gibt    |
| esbuild | mit Plugin-API      | Getestet mit 0.28; gebraucht wird nur `onEnd`                  |

> [!NOTE]
> Das Paket ist reines ESM und hat nur einen Default-Export. Schreib dein Build-Skript als `.mjs` oder setz
> `"type": "module"` in deiner `package.json`.

## Prüfen

Leg ein kleines Build-Skript an, zum Beispiel `build.mjs`, wie im Beispiel unter [Verwendung](usage.md), und starte es:

```bash
node build.mjs
```

Liegen danach deine Dateien in `dist/`, passt alles.
