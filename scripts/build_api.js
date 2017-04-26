'use strict';

const gutil = require('gulp-util');
const through = require('through-gulp');
const myMerge = require('./util_merge');

module.exports = function (options) {

    const _data = {
        post: {},
        category: {},
        index: {}
    };

    return through(function (file, encoding, callback) {

        if (file.isStream()) {
            callback(new gutil.PluginError('build_api.js', 'Streaming not supported'));
            return;
        }

        if (file.isBuffer()) {

            var content = file.contents.toString();
            var parse = JSON.parse(content);

            for (var keys = Object.keys(parse), k = 0;
                    k < keys.length; k++) {
                var key = keys[k];
                myMerge(_data, options[key](parse[key]), options.key);
            }

        }

        // 给下一个流
        // this.push(file);
        callback();

    }, function (callback) {

        for (var keys = Object.keys(_data), k = 0;
                k < keys.length; k++) {
            var key = keys[k];
            this.push(new gutil.File({
                cwd: '',
                base: '',
                path: options.dstFilePath[key],
                contents: new Buffer(JSON.stringify(_data[key]))
            }));
        }

        console.log('well done build_api.js');
        callback();

    }, null);
};
