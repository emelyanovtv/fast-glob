import * as fs from 'fs-extra';

/**
 * Generate first level of fixtures files.
 */
export function generateBaseFixtures(): void {
	console.log('> 10');

	const fixtures = [
		'.benchmark/10/1.txt',
		'.benchmark/10/2.txt',
		'.benchmark/10/3.txt',
		'.benchmark/10/4.txt',
		'.benchmark/10/5.txt',
		'.benchmark/10/1.md',
		'.benchmark/10/2.md',
		'.benchmark/10/3.md',
		'.benchmark/10/4.md',
		'.benchmark/10/5.md'
	];

	fs.mkdirSync('.benchmark');
	fs.mkdirSync('.benchmark/10');

	fixtures.forEach((filepath) => {
		fs.writeFileSync(filepath, '');
	});
}

/**
 * Generate files for nested level of fixtures.
 */
export function generateNestedFixtures(source: string, dest: string, n: number): void {
	console.log(`> ${dest}`);

	fs.mkdirpSync(`.benchmark/${dest}`);

	for (let i = 0; i < n; i++) {
		fs.copySync(`.benchmark/${source}`, `.benchmark/${dest}/${source}-${i}`);
	}
}
