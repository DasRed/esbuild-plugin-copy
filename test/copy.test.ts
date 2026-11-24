import copy from '@/copy';
import esbuild, {type BuildOptions, type BuildResult, type OnEndResult, type PluginBuild} from 'esbuild';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

type OnEndCallbackType = (result: BuildResult) => Promise<OnEndResult>;

let workingDir: string;

function read(file: string): string {
    return fs.readFileSync(path.join(workingDir, file), 'utf8');
}

function run(options: Parameters<typeof copy>[0], initialOptions: BuildOptions = {outfile: './dist/index.js'}, errors: BuildResult['errors'] = []): Promise<OnEndResult> {
    let callback: OnEndCallbackType | undefined;

    const build = {
        initialOptions: {absWorkingDir: workingDir, ...initialOptions},
        onEnd:          (onEnd: OnEndCallbackType): void => {
            callback = onEnd;
        },
    } as unknown as PluginBuild;

    void copy(options).setup(build);

    if (callback === undefined) {
        throw new Error('onEnd was not registered');
    }

    return callback({errors, warnings: []} as unknown as BuildResult);
}

function write(file: string, content: string = file): string {
    const fullPath = path.join(workingDir, file);
    fs.mkdirSync(path.dirname(fullPath), {recursive: true});
    fs.writeFileSync(fullPath, content);

    return fullPath;
}

beforeEach(() => {
    workingDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'esbuild-plugin-copy-')));
});

afterEach(() => {
    vi.restoreAllMocks();
    fs.rmSync(workingDir, {force: true, recursive: true});
});

describe('copy', () => {
    it('returns a plugin named copy', () => {
        expect(copy({from: './public'}).name).toBe('copy');
    });

    it('copies the contents of a folder into the output folder', async () => {
        write('public/index.html');
        write('public/img/logo.svg');

        await expect(run({from: './public', to: '.'})).resolves.toEqual({errors: []});

        expect(read('dist/index.html')).toBe('public/index.html');
        expect(read('dist/img/logo.svg')).toBe('public/img/logo.svg');
    });

    it('copies into the output folder without to', async () => {
        write('public/index.html');

        await expect(run({from: './public'})).resolves.toEqual({errors: []});

        expect(read('dist/index.html')).toBe('public/index.html');
    });

    it('copies into a subfolder and creates it', async () => {
        write('assets/a.css');

        await expect(run({from: './assets', to: 'static/css'})).resolves.toEqual({errors: []});

        expect(read('dist/static/css/a.css')).toBe('assets/a.css');
    });

    it('copies a single file under a new name', async () => {
        write('config/robots.production.txt');

        await expect(run({from: './config/robots.production.txt', to: 'robots.txt'})).resolves.toEqual({errors: []});

        expect(read('dist/robots.txt')).toBe('config/robots.production.txt');
    });

    it('copies a single file into the output folder with to "."', async () => {
        write('dist/index.js');
        write('config/robots.txt');

        await expect(run({from: './config/robots.txt', to: '.'})).resolves.toEqual({errors: []});

        expect(read('dist/robots.txt')).toBe('config/robots.txt');
        expect(read('dist/index.js')).toBe('dist/index.js');
    });

    it('copies a single file into an existing subfolder', async () => {
        write('dist/static/keep.txt');
        write('favicon.ico');

        await expect(run({from: './favicon.ico', to: 'static'})).resolves.toEqual({errors: []});

        expect(read('dist/static/favicon.ico')).toBe('favicon.ico');
    });

    it('copies several entries in order', async () => {
        write('public/index.html', 'public');
        write('override/index.html', 'override');
        write('fonts/a.woff2');

        await expect(run([
            {from: './public'},
            {from: './override'},
            {from: './fonts', to: 'fonts'},
        ])).resolves.toEqual({errors: []});

        expect(read('dist/index.html')).toBe('override');
        expect(read('dist/fonts/a.woff2')).toBe('fonts/a.woff2');
    });

    it('overwrites existing files', async () => {
        write('dist/index.html', 'old');
        write('public/index.html', 'new');

        await expect(run({from: './public'})).resolves.toEqual({errors: []});

        expect(read('dist/index.html')).toBe('new');
    });

    it('copies the content of symbolic links', async () => {
        write('shared/logo.svg', 'logo');
        fs.mkdirSync(path.join(workingDir, 'public'));
        fs.symlinkSync(path.join(workingDir, 'shared/logo.svg'), path.join(workingDir, 'public/logo.svg'));

        await expect(run({from: './public'})).resolves.toEqual({errors: []});

        expect(fs.lstatSync(path.join(workingDir, 'dist/logo.svg')).isSymbolicLink()).toBe(false);
        expect(read('dist/logo.svg')).toBe('logo');
    });

    it('prefers outdir over outfile', async () => {
        write('public/index.html');

        await expect(run({from: './public'}, {outdir: './out', outfile: './dist/index.js'})).resolves.toEqual({errors: []});

        expect(read('out/index.html')).toBe('public/index.html');
        expect(fs.existsSync(path.join(workingDir, 'dist'))).toBe(false);
    });

    it('fails without outdir and outfile', async () => {
        await expect(run({from: './public'}, {})).resolves.toEqual({errors: [{text: 'The build has neither outdir nor outfile.'}]});
    });

    it('does not copy after a failed build', async () => {
        write('public/index.html');

        await expect(run({from: './public'}, undefined, [{text: 'syntax error'}] as BuildResult['errors'])).resolves.toEqual({});

        expect(fs.existsSync(path.join(workingDir, 'dist'))).toBe(false);
    });

    it('reports a missing source and copies the other entries', async () => {
        write('public/index.html');

        await expect(run([{from: './missing'}, {from: './public'}])).resolves.toEqual({errors: [{text: `The source "${path.join(workingDir, 'missing')}" does not exist.`}]});

        expect(read('dist/index.html')).toBe('public/index.html');
    });

    it('reports a source that cannot be read', async () => {
        vi.spyOn(fsPromises, 'stat').mockRejectedValue(new Error('EACCES'));

        await expect(run({from: './public'})).resolves.toEqual({errors: [{text: `Could not read the source "${path.join(workingDir, 'public')}": EACCES`}]});
    });

    it.each(['..', '../other', '/tmp/somewhere'])('refuses a target outside of the output folder: %s', async (to) => {
        write('public/index.html');

        const result = await run({from: './public', to});

        expect(result.errors?.[0]?.text).toMatch(/^Refusing to copy ".+" to ".+", it is outside of the output folder ".+"\.$/);
    });

    it('allows a target whose name starts with two dots', async () => {
        write('public/index.html');

        await expect(run({from: './public', to: '..assets'})).resolves.toEqual({errors: []});

        expect(read('dist/..assets/index.html')).toBe('public/index.html');
    });

    it('reports an error while copying', async () => {
        write('public/index.html');
        vi.spyOn(fsPromises, 'cp').mockRejectedValue(new Error('ENOSPC'));

        await expect(run({from: './public'})).resolves.toEqual({errors: [{text: `Could not copy "${path.join(workingDir, 'public')}" to "${path.join(workingDir, 'dist')}": ENOSPC`}]});
    });

    it('reports a non error value while copying', async () => {
        write('public/index.html');
        vi.spyOn(fsPromises, 'cp').mockRejectedValue('full');

        await expect(run({from: './public'})).resolves.toEqual({errors: [{text: `Could not copy "${path.join(workingDir, 'public')}" to "${path.join(workingDir, 'dist')}": full`}]});
    });

    it('uses the current directory without absWorkingDir', async () => {
        write('public/index.html');
        vi.spyOn(process, 'cwd').mockReturnValue(workingDir);

        await expect(run({from: './public'}, {absWorkingDir: undefined, outfile: './dist/index.js'})).resolves.toEqual({errors: []});

        expect(read('dist/index.html')).toBe('public/index.html');
    });
});

describe('copy with esbuild', () => {
    it('copies after the build with outdir', async () => {
        write('src/index.js', 'export default 1;');
        write('public/index.html');

        await esbuild.build({
            absWorkingDir: workingDir,
            bundle:        true,
            entryPoints:   ['./src/index.js'],
            logLevel:      'silent',
            outdir:        './dist',
            plugins:       [copy({from: './public'})],
        });

        expect(read('dist/index.html')).toBe('public/index.html');
        expect(fs.existsSync(path.join(workingDir, 'dist/index.js'))).toBe(true);
    });

    it('does not copy when the build fails', async () => {
        write('src/index.js', 'export default (;');
        write('public/index.html');

        await expect(esbuild.build({
            absWorkingDir: workingDir,
            entryPoints:   ['./src/index.js'],
            logLevel:      'silent',
            outfile:       './dist/index.js',
            plugins:       [copy({from: './public'})],
        })).rejects.toThrow();

        expect(fs.existsSync(path.join(workingDir, 'dist/index.html'))).toBe(false);
    });

    it('fails the build for a missing source', async () => {
        write('src/index.js', 'export default 1;');

        await expect(esbuild.build({
            absWorkingDir: workingDir,
            entryPoints:   ['./src/index.js'],
            logLevel:      'silent',
            outfile:       './dist/index.js',
            plugins:       [copy({from: './public'})],
        })).rejects.toThrow('does not exist');
    });

    it('copies again after every rebuild', async () => {
        write('src/index.js', 'export default 1;');
        write('public/index.html', 'first');

        const context = await esbuild.context({
            absWorkingDir: workingDir,
            entryPoints:   ['./src/index.js'],
            logLevel:      'silent',
            outfile:       './dist/index.js',
            plugins:       [copy({from: './public'})],
        });

        try {
            await context.rebuild();
            expect(read('dist/index.html')).toBe('first');

            write('public/index.html', 'second');
            await context.rebuild();
            expect(read('dist/index.html')).toBe('second');
        }
        finally {
            await context.dispose();
        }
    });
});
