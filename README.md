# esbuild-plugin-copy

copy some files from one destination to another 

## Installation

```
npm i --save-dev esbuild-copy-plugin
```

## Usage

```javascript
import esbuild from 'esbuild';
import copy from 'esbuild-copy-plugin';

esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle:      true,
    outfile:     './dist/index.js',
    plugins:     [
        copy({from: './public', to: '.'}),
    ]
});
```
