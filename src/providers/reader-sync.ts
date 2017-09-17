import * as path from 'path';

import * as readdir from 'readdir-enhanced';

import Reader from './reader';

import { ITask, TEntries } from '../types';

export default class SyncReader extends Reader {
	/**
	 * Use sync API to read entries for Task.
	 */
	public read(task: ITask): TEntries {
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
}
