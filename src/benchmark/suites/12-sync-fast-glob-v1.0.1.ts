import * as path from 'path';

import fastGlob from 'fast-glob';

const cwd = path.join(process.cwd(), '.benchmark', process.env.BENCHMARK_CWD);

console.time('timer');

try {
	const matches = (<any>fastGlob).sync('**/*.md', { bashNative: [], cwd, ignore: ['**/50000/**'] });

	console.info('files: ' + matches.length);
	console.timeEnd('timer');
} catch (err) {
	console.error(err);
	process.exit(0);
}
