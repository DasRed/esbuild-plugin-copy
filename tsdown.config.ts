import {defineConfig} from 'tsdown';

export default defineConfig({
    // CommonJS is built on purpose, no hint to switch to ESM only
    checks:         {legacyCjs: false},
    // keep exports.default in CommonJS, so the named type exports match the runtime
    cjsDefault:     false,
    dts:            true,
    entry:          {index: './src/index.ts'},
    fixedExtension: false,
    format:         ['esm', 'cjs'],
    platform:       'node',
});
