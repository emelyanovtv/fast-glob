'use strict';

import * as fs from 'fs';

export interface IOptions {
	/**
	 * The current working directory in which to search.
	 */
	cwd: string;
	/**
	 * The deep option can be set to true to traverse the entire directory structure,
	 * or it can be set to a number to only traverse that many levels deep.
	 */
	deep: number | boolean;
	/**
	 * Add a pattern or an array of glob patterns to exclude matches (also working with directories).
	 */
	ignore: string[];
	/**
	 * Return `fs.Stats` with `path` property instead of file path.
	 */
	stats: boolean;
	/**
	 * Return only files.
	 */
	onlyFiles: boolean;
	/**
	 * Return only directories.
	 */
	onlyDirectories: boolean;
	/**
	 * Allows you to transform a path or `fs.Stats` object before sending to the array.
	 */
	transform: ((entry: string | IEntry) => any) | null;
}

export type IPartialOptions = Partial<IOptions>;

export interface ITask {
	base: string;
	patterns: string[];
	positive: string[];
	negative: string[];
}

export interface IEntry extends fs.Stats {
	path?: string;
}
