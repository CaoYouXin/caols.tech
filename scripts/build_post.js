'use strict';

const gutil = require('gulp-util');
const through = require('through-gulp');

module.exports = function (options) {

    const _data = [];

    const regExpressions= {
        name: /<meta name="post-name" content="(.*?)">/,
        create: /<meta name="post-create" content="(.*)">/,
        update: /<meta name="post-update" content="(.*)">/,
        category: /<meta name="post-category" content="(.*)">/,
        type: /<meta name="post-type" content="(.*)">/,
        brief: /<meta name="post-brief" content="(.*)">/,
        release: /<meta name="post-release" content="(.*)">/
    };

    const fileNameRegExp = new RegExp(options.srcBase.replace(/\//g, '\\\/') + '(.*\).html');

    return through(function (file, encoding, callback) {

        if (file.isStream()) {
            callback(new gutil.PluginError('build_post.js', 'Streaming not supported'));
            return;
        }

        var filePath = file.path.toString();
        if (file.isBuffer() && filePath.match(/\.html$/)) {

            var metaData = {};

            var content = file.contents.toString();

            var linkRegResult = filePath.match(fileNameRegExp);
            if (linkRegResult) {
                metaData.url = options.dstBase + linkRegResult[1] + '.html';
                if (options.jsDstBase) {
                    metaData.script = options.jsDstBase + linkRegResult[1] + '.min.js';
                }
            }

            var keys = Object.keys(regExpressions);
            keys.forEach(function (key) {
                var exp = regExpressions[key];
                content = content.replace(exp, function ($0, $1) {
                    metaData[key] = $1;

                    return '';
                });
            });

            _data.push(metaData);
            file.contents = new Buffer(content);
        }

        //给下一个流
        this.push(file);
        callback();

    }, function (callback) {

        this.push(new gutil.File({
            cwd: '',
            base: '',
            path: options.dstFilePath,
            contents: new Buffer(JSON.stringify({
                buildPOSTs: _data.reduce(function (p, v) {
                    if (v.release === 'True') {
                        p.push(v);
                    }
                    delete v.release;
                    return p;
                }, [])
            }))
        }));

        console.log('well done build_post.js');

        callback();
    }, null);
};
