'use strict';

const gutil = require('gulp-util');
const through = require('through-gulp');

module.exports = function () {

    const hrefRegExp = /href=('|").*?misc\/(.*)('|")/g;
    const trStrRegExp = /P\.misc\((['|"]?).*?misc\/(.*?)(['|"]?)\)/g;

    return through(function (file, encoding, callback) {

        if (file.isStream()) {
            callback(new gutil.PluginError('build_template_replacement.js', 'Streaming not supported'));
            return;
        }

        if (file.isBuffer()) {

            var contents = file.contents.toString();
            file.contents = new Buffer(contents.replace(hrefRegExp, function ($0, $1, $2, $3) {
                return 'href=' + $1 + 'http://caols.tech/post/misc/' + $2 + $3;
            }).replace(trStrRegExp, function ($0, $1, $2, $3) {
                return $1 + 'http://caols.tech/post/misc/' + $2 + $3;
            }));

        }

        // 给下一个流
        this.push(file);
        callback();

    }, function (callback) {

        console.log('well done build_template_replacement.js');
        callback();

    }, null);

};
