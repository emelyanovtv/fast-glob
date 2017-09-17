'use strict';

const fastGlob = require('./out/fast-glob');

module.exports = fastGlob.async;

module.exports.default = fastGlob.async;
module.exports.async = fastGlob.async;
module.exports.sync = fastGlob.sync;
module.exports.stream = fastGlob.stream;
