import * as path from 'path';

import * as glob from 'glob';

const cwd = path.join(process.cwd(), '.benchmark', process.env.BENCHMARK_CWD);

console.time('timer');

glob('**/*.md', { cwd, ignore: ['**/50000/**'] }, (err, matches) => {
	if (err) {
		console.error(err);
		process.exit(0);
	}

	console.info('files: ' + matches.length);
	console.timeEnd('timer');
});
