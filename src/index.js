import fs from 'fs';
import path from 'path';

export default ({from, to}) => {
    return {
        name: 'copy',
        setup(build) {
            build.onEnd(() => fs.cpSync(from, path.join(path.dirname(build.initialOptions.outfile), to), {
                recursive: true,
                force: true,
                dereference: true
            }));
        },
    }
}
