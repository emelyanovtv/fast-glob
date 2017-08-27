import * as path from 'path';

import * as globby from 'globby';

const cwd = path.join(process.cwd(), '.benchmark', process.env.BENCHMARK_CWD);

console.time('timer');

try {
	const matches = globby.sync('**/*.md', { cwd, ignore: ['**/50000/**'] });

	console.info('files: ' + matches.length);
	console.timeEnd('timer');
} catch (err) {
	console.error(err);
	process.exit(0);
}
