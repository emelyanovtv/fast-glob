import * as readdir from 'readdir-enhanced';
import * as micromatch from 'micromatch';

import { IOptions, ITask, IEntry } from '../types';

export type TEntries = Array<string | IEntry>;

export default class Reader {
	constructor(public readonly options: IOptions) { }

	/**
	 * Return true if error has ENOENT code.
	 */
	public isEnoentCodeError(err: any): boolean {
		return err.code === 'ENOENT';
	}

	/**
	 * Return options for reader.
	 */
	public getReaderOptions(task: ITask): readdir.IReaddirOptions {
		return {
			basePath: task.base === '.' ? '' : task.base,
			filter: (entry) => this.filter(entry, task.patterns, task.ignore),
			deep: (entry) => this.deep(entry, task.ignore),
			sep: '/'
		};
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
		return micromatch([entry.path], patterns).length !== 0;
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

		return micromatch([entry.path], negative).length === 0;
	}
}
