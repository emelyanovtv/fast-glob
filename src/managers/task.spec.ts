import * as assert from 'assert';

import * as manager from './task';

import { ITask } from '../types';

describe('Managers → Task', () => {

	describe('.generateTasks', () => {
		it('should return a single task', () => {
			const expected: ITask[] = [
				{ base: '.', patterns: ['**/*', '!**/*.txt'], ignore: ['**/*.txt'] }
			];

			const actual = manager.generateTasks(['**/*', '!**/*.txt'], <any>{ ignore: [] });

			assert.deepEqual(actual, expected);
		});

		it('should return a single task without negative patterns', () => {
			const expected: ITask[] = [
				{ base: '.', patterns: ['**/*'], ignore: [] }
			];

			const actual = manager.generateTasks(['**/*'], <any>{ ignore: [] });

			assert.deepEqual(actual, expected);
		});

		it('should return a single task with negative patterns from options', () => {
			const expected: ITask[] = [
				{ base: '.', patterns: ['**/*', '!**/*.txt'], ignore: ['**/*.txt'] }
			];

			const actual = manager.generateTasks(['**/*'], <any>{ ignore: ['**/*.txt'] });

			assert.deepEqual(actual, expected);
		});

		it('should return a single task with base directory', () => {
			const expected: ITask[] = [
				{ base: 'a', patterns: ['a/**/*', '!a/**/*.txt'], ignore: ['a/**/*.txt'] }
			];

			const actual = manager.generateTasks(['a/**/*', '!a/**/*.txt'], <any>{ ignore: [] });

			assert.deepEqual(actual, expected);
		});

		it('should return two tasks', () => {
			const expected: ITask[] = [
				{ base: 'a', patterns: ['a/**/*', '!**/*.txt', '!**/*.js'], ignore: ['**/*.txt', '**/*.js'] },
				{ base: 'b', patterns: ['b/**/*', '!**/*.txt', '!**/*.js', '!b/**/*.md'], ignore: ['**/*.txt', '**/*.js', 'b/**/*.md'] }
			];

			const actual = manager.generateTasks(['a/**/*', 'b/**/*', '!**/*.txt', '!b/**/*.md'], <any>{
				ignore: ['**/*.js']
			});

			assert.deepEqual(actual, expected);
		});

		it('should work with patterns used for excluding directories', () => {
			const expected: ITask[] = [
				{ base: '.', patterns: ['**/*', '!**/.git', '!**/.tmp/**'], ignore: ['**/.git', '**/.tmp'] }
			];

			const actual = manager.generateTasks(['**/*', '!**/.git/**'], <any>{
				ignore: ['**/.tmp/**']
			});

			assert.deepEqual(actual, expected);
		});
	});

});
