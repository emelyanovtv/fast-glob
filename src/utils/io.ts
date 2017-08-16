import * as fs from 'fs';

export function statPath(entry: string): Promise<fs.Stats> {
	return new Promise((resolve, reject) => {
		fs.stat(entry, (err, stat) => err ? reject(err) : resolve(stat));
	});
}
