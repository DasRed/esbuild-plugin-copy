# esbuild-plugin-copy

esbuild plugin that copies a folder or a file into the output directory after every build, e.g. static assets from
`public/`.

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

The contents of `public/` end up next to `dist/index.js`. The plugin requires `outfile` (not `outdir`) and Node.js
16.7 or later.

## License

[MIT](LICENSE)
