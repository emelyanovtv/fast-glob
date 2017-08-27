import * as path from 'path';

import * as globby from 'globby';

const cwd = path.join(process.cwd(), '.benchmark', process.env.BENCHMARK_CWD);

console.time('timer');

globby('**/*.md', { cwd, ignore: ['**/50000/**'] })
	.then((matches) => {
		console.info('files: ' + matches.length);
		console.timeEnd('timer');
	})
	.catch((err) => {
		console.error(err);
		process.exit(0);
	});
