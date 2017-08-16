import * as path from 'path';
import * as fs from 'fs';

import * as execa from 'execa';
import * as chalk from 'chalk';

import * as fixtures from './fixtures';

if (!fs.existsSync('.benchmark')) {
	console.log('Create fixtures for benchmarking...');

	fixtures.generateBaseFixtures();
	fixtures.generateNestedFixtures('10', '50', 5);
	fixtures.generateNestedFixtures('10', '100', 10);
	fixtures.generateNestedFixtures('100', '500', 5);
	fixtures.generateNestedFixtures('500', '1000', 2);
	fixtures.generateNestedFixtures('1000', '5000', 5);
	fixtures.generateNestedFixtures('5000', '10000', 2);
	fixtures.generateNestedFixtures('10000', '50000', 5);

	console.log('Run benchmarks...');
}

interface ISuiteResult {
	suite: string;
	errors: number;
	times: {
		min: number;
		max: number;
		average: number;
		raw: number[];
	};
	matches: {
		min: number;
		max: number;
		raw: number[];
	};
}

const suites = fs.readdirSync(`${__dirname}/suites`).filter((suite) => suite.endsWith('.js'));
const maxSuitePathLength = Math.max.apply(null, suites.map((suite) => suite.length));

function makePaddedSuiteName(suite: string): string {
	return suite + ' '.repeat(maxSuitePathLength - suite.length);
}

/**
 * Run suite once and return statistics about it.
 */
function runSuiteOnce(filepath: string, dest: string): Promise<number[]> {
	const env = {
		NODE_ENV: 'production',
		BENCHMARK_CWD: dest
	};

	return execa('node', [`${__dirname}/suites/${filepath}`], { env, extendEnv: true }).then((result) => {
		const measures: number[] = [];

		const matches = result.stdout.match(/(\d+(\.\d+)?)/g);

		if (!matches) {
			return Promise.reject('Ops!');
		}

		matches.forEach((match) => {
			const value = parseFloat(match);

			measures.push(value);
		});

		return Promise.resolve(measures);
	});
}

/**
 * Run one suite for current data set.
 */
async function runSuite(filepath: string, suite: string, dest: string, limit: number): Promise<ISuiteResult> {
	const results: ISuiteResult = {
		suite,
		errors: 0,
		matches: { min: 0, max: 0, raw: [] },
		times: { min: 0, max: 0, average: 0, raw: [] }
	};

	for (let i = 0; i < limit; i++) {
		let result;

		try {
			result = await runSuiteOnce(filepath, dest);

			results.matches.raw.push(result[0]);
			results.times.raw.push(result[1]);
		} catch (err) {
			results.errors++;

			results.matches.raw.push(0);
			results.times.raw.push(0);
		}
	}

	results.matches.min = Math.min.apply(null, results.matches.raw);
	results.matches.max = Math.max.apply(null, results.matches.raw);

	results.times.min = Math.min.apply(null, results.times.raw);
	results.times.max = Math.max.apply(null, results.times.raw);

	results.times.average = results.times.raw.reduce((a, b) => a + b, 0) / limit;

	return results;
}

/**
 * Run one suite for current data set and return common statistics for all runs.
 */
async function suiteWalker(dest: string, limit: number) {
	let bestSuite: string = null;
	let bestTime: number = Number.MAX_VALUE;

	for (let i = 0; i < suites.length; i++) {
		const filepath = suites[i];

		const suite = path.basename(filepath);

		const result = await runSuite(filepath, suite, dest, limit);

		if (result.times.average <= bestTime) {
			bestSuite = result.suite;
			bestTime = result.times.average;
		}

		const suiteName = makePaddedSuiteName(result.suite);

		const report = [
			`SUITE (${chalk.cyan(suiteName)} – ${result.matches.min}..${result.matches.max}):`,
			chalk.magenta(`${result.times.average.toFixed(3)}ms`),
			'(min: ' + chalk.green(`${result.times.min.toFixed(3)}ms`) + ')',
			'(max: ' + chalk.red(`${result.times.max.toFixed(3)}ms`) + ')',
			`(err: ${result.errors})`
		].join(' ');

		console.log(report);
	}

	console.log([
		'',
		chalk.grey(`========== ${chalk.cyan('RESULTS')} ==========`),
		chalk.green('Best suite: ') + bestSuite.toString(),
		chalk.green('Best time: ') + `${bestTime.toFixed(3)}ms`
	].join('\n'));
}

/**
 * Run benchmark suites for all data set's.
 */
async function runner(limit: number) {
	console.log(`LIMIT: ${limit}`);

	for (const dest of ['10', '50', '100', '500', '1000', '5000', '10000', '50000', '.']) {
		console.log([
			'',
			chalk.grey(`====================`),
			chalk.grey(`> CWD: ${chalk.bold.cyan(dest)}`),
			chalk.grey(`====================`),
			''
		].join('\n'));

		await suiteWalker(dest, limit);
	}
}

/**
 * Try to resolve limit for benchmark suites.
 */
const envLimitIndex = process.argv.findIndex((arg) => arg === '--limit');
const envLimit = envLimitIndex !== -1 ? process.argv[envLimitIndex + 1] : null;

const limits = parseInt(envLimit || '100', 10);

runner(limits).then(() => null).catch(console.error);
