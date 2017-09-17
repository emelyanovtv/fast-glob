import { Stream } from 'stream';

import { IPartialOptions } from './out/types';
import { TEntries } from './out/providers/reader';

declare namespace FastGlob {
	export interface Api {
		(patterns: string[], options?: IPartialOptions): Promise<TEntries>;

		async(patterns: string[], options?: IPartialOptions): Promise<TEntries>;
		sync(patterns: string[], options?: IPartialOptions): TEntries;
		stream(patterns: string[], options?: IPartialOptions): Stream;
	}
}

declare const api: FastGlob.Api;

export = api;
