import * as path from 'path';

import * as readdir from 'readdir-enhanced';
import * as micromatch from 'micromatch';

import { IOptions, ITask, IEntry } from '../types';

export type TEntries = Array<string | IEntry>;

export default class Reader {
	constructor(private readonly options: IOptions) { }

	/**
	 * Use async API to read entries for Task.
	 */
	public asyncReader(task: ITask): Promise<TEntries> {
		const cwd = path.resolve(this.options.cwd, task.base);
		const api = this.options.stats ? readdir.readdirStreamStat : readdir.stream;

		return new Promise((resolve, reject) => {
			const entries: TEntries = [];

			const stream = api(cwd, this.getReaderOptions(task));

			stream.on('error', (err) => this.isEnoentCodeError(err) ? resolve([]) : reject(err));
			stream.on('data', (entry) => entries.push(this.options.transform(entry)));
			stream.on('end', () => resolve(entries));
		});
	}

	/**
	 * Use sync API to read entries for Task.
	 */
	public syncReader(task: ITask): TEntries {
		const cwd = path.resolve(this.options.cwd, task.base);
		const api = this.options.stats ? readdir.readdirSyncStat : readdir.sync;

		try {
			const entries = api(cwd, this.getReaderOptions(task));

			return this.options.transform ? (<any>entries).map(this.options.transform) : entries;
		} catch (err) {
			if (this.isEnoentCodeError(err)) {
				return [];
			}

			throw err;
		}
	}

	/**
	 * Return options for reader.
	 */
	private getReaderOptions(task: ITask): readdir.IReaddirOptions {
		return {
			basePath: task.base === '.' ? '' : task.base,
			filter: (entry) => this.filter(entry, task.patterns, task.negative),
			deep: (entry) => this.deep(entry, task.negative),
			sep: '/'
		};
	}
	/**
	 * Return true if error has ENOENT code.
	 */
	private isEnoentCodeError(err: any): boolean {
		return err.code === 'ENOENT';
	}

	/**
	 * Return true if entry must be added to result.
	 */
	private filter(entry: IEntry, patterns: string[], negative: string[]): boolean {
		// Filter directories that will be excluded by deep filter
		if (entry.isDirectory() && micromatch.any(entry.path, negative)) {
			return false;
		}

		// Filter files and directories by only* options
		if ((this.options.onlyFiles && !entry.isFile()) || (this.options.onlyDirectories && !entry.isDirectory())) {
			return false;
		}

		// Filter by patterns
		return (<any>micromatch).all(entry.path, patterns);
	}

	/**
	 * Return true if directory must be readed.
	 */
	private deep(entry: IEntry, negative: string[]): boolean {
		if (!this.options.deep) {
			return false;
		}

		if (this.options.deep && typeof this.options.deep === 'number') {
			if (entry.path.split('/').length > this.options.deep) {
				return false;
			}
		}

		return !micromatch.any(entry.path, negative);
	}
}
