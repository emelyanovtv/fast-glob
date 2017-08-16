import * as assert from 'assert';

import * as fastGlob from './fast-glob';

describe('fast-glob', () => {

	it('should throw error for broken patterns', () => {
		assert.throws(() => fastGlob.async(<any>null), /patterns must be a string or an array of strings/);
	});

	it('.async', async () => {
		const expected = [
			'.tmp/styles.css',
			'.tmp/components',
			'.tmp/components/header',
			'.tmp/components/footer',
			'.tmp/components/header/scripts.js',
			'.tmp/components/header/styles.css',
			'.tmp/components/footer/styles.css',
			'.tmp/components/footer/scripts.js'
		];

		const actual = await fastGlob.async('.tmp/**/*');

		assert.deepEqual(actual.sort(), expected.sort());
	});

	it('.sync', () => {
		const expected = [
			'.tmp/styles.css',
			'.tmp/components',
			'.tmp/components/header',
			'.tmp/components/footer',
			'.tmp/components/header/scripts.js',
			'.tmp/components/header/styles.css',
			'.tmp/components/footer/styles.css',
			'.tmp/components/footer/scripts.js'
		];

		const actual = fastGlob.sync('.tmp/**/*');

		assert.deepEqual(actual.sort(), expected.sort());
	});

});
