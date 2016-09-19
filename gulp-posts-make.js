'use strict';

var gutil = require('gulp-util');
var through = require('through-gulp');

module.exports = function (srcBase, dstBase, dstDir) {

    var _data = [], data = {}, filePath = dstDir + 'articles.json';
    var linkRegExp = new RegExp(srcBase.replace(/\//g, '\\\/') + '(.*)');
    var dateRegExp = /<meta name="post-date" content="(.*)">/;
    var categoryRegExp = /<meta name="post-category" content="(.*)">/;
    var labelRegExp = /<meta name="post-label" content="(.*)">/;
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

            var dateRegResult = content.match(dateRegExp);
            if (dateRegResult) {
                metaData.date = dateRegResult[1];
            }

            var categoryRegResult = content.match(categoryRegExp);
            if (categoryRegResult) {
                metaData.category = categoryRegResult[1];
            }

            var labelRegResult = content.match(labelRegExp);
            if (labelRegResult) {
                metaData.labels = labelRegResult[1];
            }

            _data.push(metaData);
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
            cwd: "/",
            base: dstDir,
            path: filePath,
            contents: new Buffer(JSON.stringify(data))
        }));

        console.log('well done gulp-posts-make.js');

        callback();
    }, null);
};