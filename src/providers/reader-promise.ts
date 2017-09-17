import * as path from 'path';

import * as readdir from 'readdir-enhanced';

import Reader from './reader';

import { ITask, TEntries } from '../types';

export default class PromiseReader extends Reader {
	/**
	 * Use async API to read entries for Task.
	 */
	public read(task: ITask): Promise<TEntries> {
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
}
