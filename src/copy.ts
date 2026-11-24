import type CopyPluginOptionInterface from '@/CopyPluginOptionInterface';
import type {BuildOptions, BuildResult, OnEndResult, PartialMessage, Plugin, PluginBuild} from 'esbuild';
import type {Stats} from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function getOutputDir({outdir, outfile}: BuildOptions): string | undefined {
    if (outdir !== undefined) {
        return outdir;
    }

    return outfile === undefined ? undefined : path.dirname(outfile);
}

async function copyEntry({from, to = '.'}: CopyPluginOptionInterface, workingDir: string, outputDir: string): Promise<PartialMessage | null> {
    const source = path.resolve(workingDir, from);
    const target = path.resolve(outputDir, to);

    const relative = path.relative(outputDir, target);
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        return {text: `Refusing to copy "${source}" to "${target}", it is outside of the output folder "${outputDir}".`};
    }

    let sourceStats: Stats;
    try {
        sourceStats = await fs.stat(source);
    }
    catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            return {text: `The source "${source}" does not exist.`};
        }

        return {text: `Could not read the source "${source}": ${getErrorMessage(error)}`};
    }

    const targetStats = sourceStats.isFile() ? await fs.stat(target).catch((): null => null) : null;
    const destination = targetStats?.isDirectory() === true ? path.join(target, path.basename(source)) : target;

    try {
        await fs.cp(source, destination, {dereference: true, force: true, recursive: true});
    }
    catch (error) {
        return {text: `Could not copy "${source}" to "${destination}": ${getErrorMessage(error)}`};
    }

    return null;
}

export default function copy(options: CopyPluginOptionInterface | CopyPluginOptionInterface[]): Plugin {
    const entries = Array.isArray(options) ? options : [options];

    return {
        name:  'copy',
        setup: (build: PluginBuild): void => {
            build.onEnd(async (result: BuildResult): Promise<OnEndResult> => {
                if (result.errors.length > 0) {
                    return {};
                }

                const relative = getOutputDir(build.initialOptions);
                if (relative === undefined) {
                    return {errors: [{text: 'The build has neither outdir nor outfile.'}]};
                }

                const workingDir               = build.initialOptions.absWorkingDir ?? process.cwd();
                const outputDir                = path.resolve(workingDir, relative);
                const errors: PartialMessage[] = [];

                // one after another, so a later entry can overwrite files of an earlier one
                for (const entry of entries) {
                    const error = await copyEntry(entry, workingDir, outputDir);
                    if (error !== null) {
                        errors.push(error);
                    }
                }

                return {errors};
            });
        },
    };
}
