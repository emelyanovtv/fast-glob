import * as union from 'arr-union';

import Reader, { TEntries } from './providers/reader';
import { generateTasks } from './managers/task';

import { IPartialOptions, IOptions } from './types';

function assertPatternsInput(patterns: string[]): never | void {
	if (!Array.isArray(patterns) || !patterns.every((pattern) => typeof pattern === 'string')) {
		throw new TypeError('patterns must be a string or an array of strings');
	}
}

function prepareOptions(options: IPartialOptions): IOptions {
	return Object.assign(<IOptions>{
		cwd: process.cwd(),
		deep: true,
		ignore: [],
		uniq: true,
		onlyDirectories: false,
		onlyFiles: false,
		stats: false,
		transform: <T>(entry: T): T => entry
	}, options);
}

export function async(source: string | string[], options?: IPartialOptions): Promise<TEntries> {
	const patterns: string[] = [].concat(source);

	assertPatternsInput(patterns);

	const opts = prepareOptions(options);

	const tasks = generateTasks(patterns, opts);
	const reader = new Reader(opts);

	return Promise.all(tasks.map((task) => reader.asyncReader(task))).then((entries) => {
		return opts.uniq ? union.apply(null, entries) : entries.reduce((res, to) => [].concat(res, to), []);
	});
}

export function sync(source: string | string[], options?: IPartialOptions): TEntries {
	const patterns: string[] = [].concat(source);

	assertPatternsInput(patterns);

	const opts = prepareOptions(options);

	const tasks = generateTasks(patterns, opts);
	const reader = new Reader(opts);

	const results = tasks.map((task) => reader.syncReader(task));

	return opts.uniq ? union.apply(null, results) : results.reduce((res, to) => [].concat(res, to), []);
}
