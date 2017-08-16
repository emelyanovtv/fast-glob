import * as globParent from 'glob-parent';

import { ITask, IOptions } from '../types';

type TGroups = Record<string, string[]>;

/**
 * Return true if provided pattern is negative pattern.
 *
 * For example:
 *  - **\* → false
 *  - !**\* → true
 */
function isNegativePattern(pattern: string): boolean {
	return pattern.startsWith('!');
}

/**
 * Extract positive patterns from common array.
 *
 * For example:
 *  - [**\*, !**\*.txt] → [**\*]
 */
function getPositivePatterns(patterns: string[]): string[] {
	return patterns.filter((pattern) => !isNegativePattern(pattern));
}

/**
 * Returns positive patterns as negative patterns.
 *
 * For example:
 *  - [**\*] → [!**\*]
 */
function getPositivePatternsAsNegative(patterns: string[]): string[] {
	return patterns.map((pattern) => '!' + pattern);
}

/**
 * Extract negative patterns from common array as positive patterns.
 *
 * For example:
 *  - [**\*, !**\*.txt] → [**\*.txt]
 *  - [**\*, !**\.git\**] → [**\*.txt, !**\.git, !**\.git\**]
 */
function getNegativePatterns(patterns: string[]): string[] {
	const negative: string[] = [];

	patterns.forEach((pattern) => {
		if (!isNegativePattern(pattern)) {
			return;
		}

		if (pattern.endsWith('/**')) {
			negative.push(pattern.slice(1).replace(/(\/\*\*)+$/, ''));
		} else {
			negative.push(pattern.slice(1));
		}
	});

	return negative;
}

/**
 * Extract base directory from provided pattern.
 *
 * For example:
 *  - **\*.js → .
 *  - test\**\*.js → test
 */
function getParentDirectory(pattern: string): string {
	return globParent(pattern);
}

/**
 * Returns grouped patterns by base directory of each pattern.
 *
 * For example:
 *  - [**\*, a\**\*] → { '.': [**\*], 'a': [a\**\*] }
 */
function groupPatternsByParent(patterns: string[]): TGroups {
	const groups: TGroups = {};

	patterns.forEach((pattern) => {
		const parent = getParentDirectory(pattern);

		// Extract exists array of patterns for the current group or create the new array for the current pattern
		const groupPatterns = groups[parent] || [pattern];

		if (groups.hasOwnProperty(parent)) {
			groupPatterns.push(pattern);
		}

		groups[parent] = groupPatterns;
	});

	return groups;
}

/**
 * Returns combined groups for positive and negative patterns by base directory.
 *
 * By design this function trying to apply each negative pattern to positive groups
 * based on parent directory of each pattern.
 *
 * For example:
 *  - positive: { '.': [**\*], 'a': [a\**\*] }
 *  - negative: { '.': [**\*.txt], 'a': [a\**\*.md] }
 *  - result: {
 *      '.': [**\*, !**\*.txt],
 *      'a': [a\**\*, !a\**\*.md, !**\*.txt]
 *    }
 */
function combineGroupByParent(positive: TGroups, negative: TGroups): TGroups {
	const groups: TGroups = Object.assign(positive);

	const positiveKeys = Object.keys(positive);
	const negativeKeys = Object.keys(negative);

	negativeKeys.forEach((negativeParent) => {
		const negativePatterns = getPositivePatternsAsNegative(negative[negativeParent]);

		positiveKeys.forEach((positiveParent) => {
			if (negativeParent === positiveParent || negativeParent === '.') {
				groups[positiveParent] = groups[positiveParent].concat(negativePatterns);
			}
		});
	});

	return groups;
}

function buildTasksFromGroups(groups: TGroups): ITask[] {
	const tasks: ITask[] = [];

	Object.keys(groups).forEach((group) => {
		const patterns = groups[group];

		tasks.push({
			base: group,
			negative: getNegativePatterns(patterns),
			positive: getPositivePatterns(patterns),
			patterns
		});
	});

	return tasks;
}

export function generateTasks(patterns: string[], options: IOptions) {
	const positive = getPositivePatterns(patterns);
	const negative = getNegativePatterns(patterns).concat(options.ignore);

	const positiveGroup = groupPatternsByParent(positive);
	const negativeGroup = groupPatternsByParent(negative);

	const groups = combineGroupByParent(positiveGroup, negativeGroup);

	return buildTasksFromGroups(groups);
}
