import * as assert from 'assert';
import * as path from 'path';

import SyncReader from './reader-sync';

import { IEntry } from '../types';

const defaultTransformer = (entry: IEntry) => entry;

describe('Provders → SyncReader', () => {

	describe('Constructor', () => {
		it('should create instance of class', () => {
			const reader = new SyncReader(<any>{});

			assert.ok(reader instanceof SyncReader);
		});
	});

	describe('Patterns', () => {
		const reader = new SyncReader(<any>{
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

			const actual = reader.read({
				base: '.tmp',
				patterns: ['.tmp/**/*'],
				ignore: []
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});

		it('should match all entries only in the base directory', () => {
			const expected = ['.tmp/styles.css', '.tmp/components'];

			const actual = reader.read({
				base: '.tmp',
				patterns: ['.tmp/*'],
				ignore: []
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});

		it('should match all entries in the components directory', () => {
			const expected = [
				'.tmp/components/header',
				'.tmp/components/header/styles.css',
				'.tmp/components/header/scripts.js',
				'.tmp/components/footer',
				'.tmp/components/footer/styles.css',
				'.tmp/components/footer/scripts.js'
			];

			const actual = reader.read({
				base: '.tmp/components',
				patterns: ['.tmp/components/**/*'],
				ignore: []
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});

		it('should match all entries with css extension', () => {
			const expected = [
				'.tmp/styles.css',
				'.tmp/components/header/styles.css',
				'.tmp/components/footer/styles.css'
			];

			const actual = reader.read({
				base: '.tmp',
				patterns: ['.tmp/**/*.css'],
				ignore: []
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});

		it('should match all entries without css etension', () => {
			const expected = [
				'.tmp/components',
				'.tmp/components/header',
				'.tmp/components/header/scripts.js',
				'.tmp/components/footer',
				'.tmp/components/footer/scripts.js'
			];

			const actual = reader.read({
				base: '.tmp',
				patterns: ['.tmp/**/*', '!.tmp/**/*.css'],
				ignore: ['.tmp/**/*.css']
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});

		it('should skip entries in the components directory in first level', () => {
			const expected = ['.tmp/styles.css'];

			const actual = reader.read({
				base: '.tmp',
				patterns: ['.tmp/**/*', '!.tmp/components/**'],
				ignore: ['.tmp/components']
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});

		it('should skip entries in the footer directories in all levels', () => {
			const expected = [
				'.tmp/styles.css',
				'.tmp/components',
				'.tmp/components/header',
				'.tmp/components/header/styles.css',
				'.tmp/components/header/scripts.js'
			];

			const actual = reader.read({
				base: '.tmp',
				patterns: ['.tmp/**/*', '!.tmp/**/footer/**'],
				ignore: ['.tmp/**/footer']
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});

		it('should skip entries with css extension in the header and footer directories', () => {
			const expected = [
				'.tmp/styles.css',
				'.tmp/components',
				'.tmp/components/header',
				'.tmp/components/header/scripts.js',
				'.tmp/components/footer',
				'.tmp/components/footer/scripts.js'
			];

			const actual = reader.read({
				base: '.tmp',
				patterns: ['.tmp/**/*', '!.tmp/**/footer/**/*.css', '!.tmp/**/header/**/*.css'],
				ignore: ['.tmp/**/footer/**/*.css', '.tmp/**/header/**/*.css']
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});
	});

	describe('Options', () => {
		it('stats', () => {
			const reader = new SyncReader(<any>{
				cwd: process.cwd(),
				transform: defaultTransformer,
				deep: true,
				stats: true
			});

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

			const actual = reader.read({
				base: '.tmp',
				patterns: ['.tmp/**/*'],
				ignore: []
			});

			assert.deepEqual(actual.map((entry: IEntry) => entry.path).sort(), expected.sort());
		});

		it('cwd', () => {
			const reader = new SyncReader(<any>{
				cwd: path.join(process.cwd(), '.tmp'),
				deep: true,
				transform: defaultTransformer
			});

			const expected = [
				'styles.css',
				'components',
				'components/header',
				'components/header/styles.css',
				'components/header/scripts.js',
				'components/footer',
				'components/footer/styles.css',
				'components/footer/scripts.js'
			];

			const actual = reader.read({
				base: '.',
				patterns: ['**/*'],
				ignore: []
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});

		it('onlyFiles', () => {
			const reader = new SyncReader(<any>{
				cwd: process.cwd(),
				transform: defaultTransformer,
				deep: true,
				onlyFiles: true
			});

			const expected = [
				'.tmp/styles.css',
				'.tmp/components/header/styles.css',
				'.tmp/components/header/scripts.js',
				'.tmp/components/footer/styles.css',
				'.tmp/components/footer/scripts.js'
			];

			const actual = reader.read({
				base: '.tmp',
				patterns: ['.tmp/**/*'],
				ignore: []
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});

		it('onlyDirectoris', () => {
			const reader = new SyncReader(<any>{
				cwd: process.cwd(),
				transform: defaultTransformer,
				deep: true,
				onlyDirectories: true
			});

			const expected = [
				'.tmp/components',
				'.tmp/components/header',
				'.tmp/components/footer'
			];

			const actual = reader.read({
				base: '.tmp',
				patterns: ['.tmp/**/*'],
				ignore: []
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});

		it('deep – false', () => {
			const reader = new SyncReader(<any>{
				cwd: process.cwd(),
				transform: defaultTransformer,
				deep: false
			});

			const expected = ['.tmp/styles.css', '.tmp/components'];

			const actual = reader.read({
				base: '.tmp',
				patterns: ['.tmp/**/*'],
				ignore: []
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});

		it('deep – number', () => {
			const reader = new SyncReader(<any>{
				cwd: process.cwd(),
				transform: defaultTransformer,
				deep: 2
			});

			const expected = [
				'.tmp/styles.css',
				'.tmp/components',
				'.tmp/components/footer',
				'.tmp/components/header'
			];

			const actual = reader.read({
				base: '.tmp',
				patterns: ['.tmp/**/*'],
				ignore: []
			});

			assert.deepEqual(actual.sort(), expected.sort());
		});
	});

});