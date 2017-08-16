import * as assert from 'assert';

import * as manager from './task';

import { ITask } from '../types';

describe('Managers → Task', () => {

	describe('.generateTasks', () => {
		it('should return a single task', () => {
			const expected: ITask[] = [
				{ base: '.', patterns: ['**/*', '!**/*.txt'], positive: ['**/*'], negative: ['**/*.txt'] }
			];

			const actual = manager.generateTasks(['**/*', '!**/*.txt'], <any>{ ignore: [] });

			assert.deepEqual(actual, expected);
		});

		it('should return a single task without negative patterns', () => {
			const expected: ITask[] = [
				{ base: '.', patterns: ['**/*'], positive: ['**/*'], negative: [] }
			];

			const actual = manager.generateTasks(['**/*'], <any>{ ignore: [] });

			assert.deepEqual(actual, expected);
		});

		it('should return a single task with negative patterns from options', () => {
			const expected: ITask[] = [
				{ base: '.', patterns: ['**/*', '!**/*.txt'], positive: ['**/*'], negative: ['**/*.txt'] }
			];

			const actual = manager.generateTasks(['**/*'], <any>{ ignore: ['**/*.txt'] });

			assert.deepEqual(actual, expected);
		});

		it('should return a single task with base directory', () => {
			const expected: ITask[] = [
				{ base: 'a', patterns: ['a/**/*', '!a/**/*.txt'], positive: ['a/**/*'], negative: ['a/**/*.txt'] }
			];

			const actual = manager.generateTasks(['a/**/*', '!a/**/*.txt'], <any>{ ignore: [] });

			assert.deepEqual(actual, expected);
		});

		it('should return two tasks', () => {
			const expected: ITask[] = [
				{
					base: 'a', patterns: ['a/**/*', '!**/*.txt', '!**/*.js'],
					negative: ['**/*.txt', '**/*.js'], positive: ['a/**/*']
				},
				{
					base: 'b', patterns: ['b/**/*', '!**/*.txt', '!**/*.js', '!b/**/*.md'],
					negative: ['**/*.txt', '**/*.js', 'b/**/*.md'], positive: ['b/**/*']
				}
			];

			const actual = manager.generateTasks(['a/**/*', 'b/**/*', '!**/*.txt', '!b/**/*.md'], <any>{
				ignore: ['**/*.js']
			});

			assert.deepEqual(actual, expected);
		});

		it('should work with patterns used for excluding directories', () => {
			const expected: ITask[] = [
				{
					base: '.', patterns: ['**/*', '!**/.git', '!**/.tmp/**'],
					positive: ['**/*'], negative: ['**/.git', '**/.tmp']
				}
			];

			const actual = manager.generateTasks(['**/*', '!**/.git/**'], <any>{
				ignore: ['**/.tmp/**']
			});

			assert.deepEqual(actual, expected);
		});
	});

});
