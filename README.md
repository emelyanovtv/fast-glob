# :rocket: fast-glob

> Is a faster (1.5-8x for most cases) `node-glob` alternative.

[![Build Status](https://travis-ci.org/mrmlnc/fast-glob.svg?branch=master)](https://travis-ci.org/mrmlnc/fast-glob)
[![Build status](https://ci.appveyor.com/api/projects/status/i4xqijtq26qf6o9d?svg=true)](https://ci.appveyor.com/project/mrmlnc/fast-glob)

## Highlights

  * Fast by using Streams and Promises. Used [readdir-enhanced](https://github.com/BigstickCarpet/readdir-enhanced) and [micromatch](https://github.com/jonschlinkert/micromatch).
  * User-friendly by supports multiple and negated patterns.
  * Rational, because it doesn't read excluded directories.

## Install

```
$ npm install --save fast-glob
```

## Usage

```js
const glob = require('fast-glob');

glob(['src/**/*.js', '!src/**/*.spec.js']).then((entries) => {
	console.log(entries)
});
```

## API

### fastGlob(patterns, [options])

Returns a `Promise<Array>` of matching paths (array of `string`) or objects (array of `fs.Stats`).

> Tip: this method also available as `fastGlob.async`.

### fastGlob.sync(patterns, [options])

Returns an `Array` of matching  paths (array of `string`) or objects (array of `fs.Stats`).

#### patterns

  * Type: `string|string[]`

See supported `micromatch` [patterns](https://github.com/micromatch/micromatch#matching-features).

#### options

  * Type: `object`

See supported options [here](https://github.com/mrmlnc/fast-glob/tree/2.0.0#options).

## Options

#### cwd

  * Type: `string`
  * Default: `process.cwd()`

The current working directory in which to search.

#### deep

  * Type: `number|boolean`
  * Default: `true`

The deep option can be set to true to traverse the entire directory structure, or it can be set to a number to only traverse that many levels deep.

#### ignore

  * Type: `string[]`
  * Default: `[]`

Add an array of glob patterns to exclude matches. You can use `**/something/**` or `**/something` patterns to exclude directories. Excluded directories will not be read.

#### uniq

  * Type: `boolean`
  * Default: `true`

In some cases, patterns can result in the same file showing up multiple times in the result set.

#### stats

  * Type: `boolean`
  * Default: `false`

Return `fs.Stats` with additional `path` property instead of file path.

#### onlyFiles

  * Type: `boolean`
  * Default: `false`

Return only files.

#### onlyDirectories

  * Type: `boolean`
  * Default: `false`

Return only directories.

#### transform

  * Type: `function`
  * Default: `(entry) => entry`

Allows you to transform a path or `fs.Stats` object before sending to the array.

## Compatible with `node-glob`?

Not fully, because `fast-glob` not implements *all options* of `node-glob`.

## Example for `transform` option

```js
const glob = require('fast-glob');

glob('dir/**/*.txt', { transform: readFilePromise })
	.then((Promise.all)
	.then(console.log); // ['content from dir/a.txt', ...]
```

## Benchmark

  * Results.

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/fast-glob/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
