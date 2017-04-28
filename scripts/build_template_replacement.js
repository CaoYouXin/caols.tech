'use strict';

const gutil = require('gulp-util');
const through = require('through-gulp');

module.exports = function () {

    const trStrRegExp = /P\.template\((['|"]?).*?x-handlebars-templates\/(.*?)(['|"]?)\)/g;

    return through(function (file, encoding, callback) {

        if (file.isStream()) {
            callback(new gutil.PluginError('build_template_replacement.js', 'Streaming not supported'));
            return;
        }

        if (file.isBuffer()) {

            var contents = file.contents.toString();
            file.contents = new Buffer(contents.replace(trStrRegExp, function ($0, $1, $2, $3) {
                return $1 + 'http://caols.tech/post/x-handlebars-templates/' + $2 + $3;
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
