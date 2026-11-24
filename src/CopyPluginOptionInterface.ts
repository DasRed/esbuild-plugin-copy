export default interface CopyPluginOptionInterface {
    /** Folder or file to copy, relative to the working directory of the build. */
    from: string;
    /** Target relative to the output folder (outdir or the folder of outfile). For a single file the file name or a folder. */
    to?: string;
}
