# esbuild-plugin-copy

esbuild plugin that copies folders or files into the output directory after every successful build, e.g. static
assets from `public/`. Ships as ESM and CommonJS with TypeScript types.

Documentation: https://www.marco-starker.de/en/projects/esbuild-plugin-copy/docs
(Deutsch: https://www.marco-starker.de/de/projekte/esbuild-plugin-copy/doku)

## Quick start

```bash
npm i -D esbuild-copy-plugin
```

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

The contents of `public/` end up next to `dist/index.js`. The plugin works with `outfile` and `outdir`, and takes an
array to copy several sources.

## Local development

```bash
npm ci
npm test
npm run build
```

The package itself runs on Node.js 22.13 or later. Building and testing need Node.js 22.18 or later.

## License

[MIT](LICENSE)
