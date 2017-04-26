'use strict';

const gutil = require('gulp-util');
const through = require('through-gulp');

module.exports = function () {

    return through(function (file, encoding, callback) {

        if (file.isStream()) {
            callback(new gutil.PluginError('build_article.js', 'Streaming not supported'));
            return;
        }

        if (file.isBuffer() && file.path.toString().match(/\.html$/)) {

            var content = file.contents.toString();

            var split = content.split(/<div class="article-content">|<\/div><i class="splitter"><\/i>/);

            var matched = content.match(/(<link.*?)<\/head>/);
            file.contents = new Buffer((matched ? matched[1] : '') + split[1]);
        }

        // 给下一个流
        this.push(file);
        callback();

    }, function (callback) {

        console.log('well done build_article.js');
        callback();

    }, null);

};
