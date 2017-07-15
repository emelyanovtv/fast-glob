declare module "readdir-enhanced" {

	import { Stats } from 'fs';

	namespace readdir {
		interface IFilterFunction {
			(stat: IEntry): boolean;
		}

		interface IOptions {
			filter?: string | RegExp | IFilterFunction;
			deep?: boolean | number | RegExp | string | IFilterFunction;
			sep?: string;
			basePath?: string;
		}

		interface IEntry extends Stats {
			path: string;
		}

		// Sync
		function sync(root: string, options?: IOptions): string[];
		function readdirSyncStat(root: string, options?: IOptions): IEntry[];

		// Promise
		function async(root: string, options?: IOptions): Promise<string[]>;
		function readdirAsyncStat(root: string, options?: IOptions): Promise<IEntry[]>;

		// Callback
		function async(root: string, cb: (err: Error, files: string[]) => void): void;
		function async(root: string, options: IOptions, cb: (err: Error, files: string[]) => void): void;

		// Stream
		function stream(root: string, options?: IOptions): NodeJS.ReadableStream;
		function readdirStreamStat(root: string, options?: IOptions): NodeJS.ReadableStream;
	}

	export = readdir;
}
