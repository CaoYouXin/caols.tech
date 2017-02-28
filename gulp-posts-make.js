'use strict';

var gutil = require('gulp-util');
var through = require('through-gulp');

module.exports = function (srcBase, dstBase, dstDir) {

    var _data = [], data = {}, filename = 'articles.json';

    var regExpressions= {
        name: /<meta name="post-name" content="(.*?)".*>/,
        date: /<meta name="post-date" content="(.*)">/,
        category: /<meta name="post-category" content="(.*)">/,
        labels: /<meta name="post-label" content="(.*)">/,
        postCateOrder: /<meta name="post-cate-order" content="(.*)">/
    };

    var linkRegExp = new RegExp(srcBase.replace(/\//g, '\\\/') + '(.*)');
    var dateParseRegExp = /(.*)-(.*)-(.*) ~ (.*)-(.*)-(.*)/;

    return through(function (file, encoding, callback) {

        if (file.isStream()) {
            callback(new gutil.PluginError('gulp-posts-make.js', 'Streaming not supported'));
            return;
        }

        if (file.isBuffer()) {

            var metaData = {};

            var content = file.contents.toString();

            var linkRegResult = file.path.toString().match(linkRegExp);
            if (linkRegResult) {
                metaData.url = dstBase + linkRegResult[1];
            }

            var keys = Object.keys(regExpressions);
            keys.forEach(function (key) {
                var exp = regExpressions[key];
                var result = content.match(exp);
                if (result) {
                    metaData[key] = result[1];
                }
            });

            if (keys.length + 1 - Object.keys(metaData).length < 2) {
                _data.push(metaData);
            }

        }

        //给下一个流
        this.push(file);
        callback();

    }, function (callback) {

        for (var k = 0; k < _data.length; k++) {
            var metaData = _data[k];

            if (metaData.date) {

                var dateParseRegResult = metaData.date.match(dateParseRegExp);
                if (dateParseRegResult) {
                    var year = null, month = null;
                    for (var j = 1; j < dateParseRegResult.length; j += 3) {
                        if (!data.dates) {
                            data.dates = {};
                        }

                        year = year !== dateParseRegResult[j] ? dateParseRegResult[j] : null;
                        if (null !== year && !data.dates[year]) {
                            data.dates[year] = {};
                        }

                        month = month !== dateParseRegResult[j + 1] ? dateParseRegResult[j + 1] : null;
                        if (null !== year && null !== month && !data.dates[year][month]) {
                            data.dates[year][month] = [];
                        }

                        if (null !== year && null !== month) {
                            data.dates[year][month].push(metaData);
                        }

                        metaData.lastUpdateTime = new Date(dateParseRegResult[j]
                                + '-'
                            + '00'.substr(dateParseRegResult[j + 1].length)
                            + dateParseRegResult[j + 1]
                                + '-'
                            + '00'.substr(dateParseRegResult[j + 2].length)
                            + dateParseRegResult[j + 2]).getTime();
                    }
                }
            }

            if (metaData.category) {

                if (!data.categories) {
                    data.categories = {};
                }

                if (!data.categories[metaData.category]) {
                    data.categories[metaData.category] = [];
                }

                data.categories[metaData.category].push(metaData);

                // if (!data.categories[metaData.category].lastUpdateTime) {
                //     data.categories[metaData.category].lastUpdateTime = Number.MIN_VALUE;
                // }
                //
                // if (data.categories[metaData.category].lastUpdateTime < metaData.lastUpdateTime) {
                //     data.categories[metaData.category].lastUpdateTime = metaData.lastUpdateTime;
                // }
            }

            if (metaData.labels) {

                var labels = metaData.labels.split(',');

                for (var i = 0; i < labels.length; i++) {
                    if (!data.labels) {
                        data.labels = {};
                    }

                    if (!data.labels[labels[i]]) {
                        data.labels[labels[i]] = [];
                    }

                    data.labels[labels[i]].push(metaData);
                }
            }
        }

        this.push(new gutil.File({
            cwd: '',
            base: '',
            path: dstDir + filename,
            contents: new Buffer(JSON.stringify(data))
        }));

        console.log('well done gulp-posts-make.js');

        callback();
    }, null);
};
