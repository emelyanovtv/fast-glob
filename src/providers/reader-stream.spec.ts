import * as assert from 'assert';

import StreamReader from './reader-stream';

import { IEntry } from '../types';

const defaultTransformer = (entry: IEntry) => entry;

describe('Provders → StreamReader', () => {

	describe('Constructor', () => {
		it('should create instance of class', () => {
			const reader = new StreamReader(<any>{});

			assert.ok(reader instanceof StreamReader);
		});
	});

	describe('Patterns', () => {
		const reader = new StreamReader(<any>{
			cwd: process.cwd(),
			transform: defaultTransformer,
			deep: true
		});

		it('should match all entries in the base directory', () => {
			const expected = [
				'.tmp/styles.css',
				'.tmp/components',
				'.tmp/components/header',
				'.tmp/components/header/styles.css',
				'.tmp/components/header/scripts.js',
				'.tmp/components/footer',
				'.tmp/components/footer/styles.css',
				'.tmp/components/footer/scripts.js'
			];

			const stream = reader.read({
				base: '.tmp',
				patterns: ['.tmp/**/*'],
				ignore: []
			});

			const actual: string[] = [];

			stream.on('data', (entry) => actual.push(entry));
			stream.on('end', () => {
				console.log(actual);
			});
		});
	});

});
