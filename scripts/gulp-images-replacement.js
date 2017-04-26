'use strict';

const gutil = require('gulp-util');
const through = require('through-gulp');

module.exports = function () {

    const urlRegExp = /url\(('|").*images\/(.*)('|")\)/g;
    const hrefRegExp = /href=('|").*images\/(.*)('|")/g;
    const srcRegExp = /src=('|").*images\/(.*)('|")/g;
    const dataUrlRegExp = /data-url=('|").*images\/(.*)('|")/g;
    const irStrRegExp = /irStr\((['|"]?).*images\/(.*)(['|"]?)\)/g;

    return through(function (file, encoding, callback) {

        if (file.isStream()) {
            callback(new gutil.PluginError('build_article.js', 'Streaming not supported'));
            return;
        }

        if (file.isBuffer()) {

            var contents = file.contents.toString();
            file.contents = new Buffer(contents.replace(urlRegExp, function ($0, $1, $2, $3) {
                return 'url('+$1+'http://image.caols.tech/'+$2+$3+')';
            }).replace(hrefRegExp, function ($0, $1, $2, $3) {
                return 'href='+$1+'http://image.caols.tech/'+$2+$3;
            }).replace(srcRegExp, function ($0, $1, $2, $3) {
                return 'src='+$1+'http://image.caols.tech/'+$2+$3;
            }).replace(dataUrlRegExp, function ($0, $1, $2, $3) {
                return 'data-url='+$1+'http://image.caols.tech/'+$2+$3;
            }).replace(irStrRegExp, function ($0, $1, $2, $3) {
                return 'http://image.caols.tech/'+$2;
            }));

        }

        // 给下一个流
        this.push(file);
        callback();

    }, function (callback) {

        console.log('well done build_article.js');
        callback();

    }, null);

};
