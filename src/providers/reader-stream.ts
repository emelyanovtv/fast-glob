import * as path from 'path';
import * as stream from 'stream';

import Reader from './reader';

import * as readdir from 'readdir-enhanced';

import { IOptions, ITask, IEntry } from '../types';

class TransformStream extends stream.Transform {
	constructor(private readonly options: IOptions, private readonly objectMode = false) {
		super({
			objectMode,
			encoding: objectMode ? null : 'utf-8'
		});
	}

	public _transform(data: string | IEntry, _encoding: string, callback: any) {
		if (this.objectMode) {
			return callback(null, this.options.transform(<IEntry>data));
		}

		callback(null, this.options.transform(data));
	}
}

export default class StreamReader extends Reader {
	public read(task: ITask): NodeJS.ReadableStream {
		const cwd = path.resolve(this.options.cwd, task.base);
		const api = this.options.stats ? readdir.readdirStreamStat : readdir.stream;
		const transform = new TransformStream(this.options, this.options.stats);

		return api(cwd, this.getReaderOptions(task)).pipe(transform);
	}
}
