import * as fs from 'fs';

const fixtures = [
	'.tmp/styles.css',
	'.tmp/components/header/styles.css',
	'.tmp/components/header/scripts.js',
	'.tmp/components/footer/styles.css',
	'.tmp/components/footer/scripts.js'
];

if (!fs.existsSync('.tmp')) {
	fs.mkdirSync('.tmp');
	fs.mkdirSync('.tmp/components');
	fs.mkdirSync('.tmp/components/header');
	fs.mkdirSync('.tmp/components/footer');

	fixtures.forEach((filepath) => fs.writeFileSync(filepath, ''));
}
