/**
 * Created by cls on 16/9/20.
 */
'use strict';

var gutil = require('gulp-util');
var through = require('through-gulp');

module.exports = function (options) {

    var makefileMsg = 'makefile', makeMsg = 'make', filename = options.id + '-cssmakefile.json';
    var data = {}, fileNameRegExp = null, cssLinkRegExp = null;

    var isMakefile = makefileMsg === options.msg;
    var isMake = makeMsg === options.msg;

    if (isMakefile) {
        fileNameRegExp = new RegExp(options.base.replace(/\//g, '\\\/') + '(.*).htm');
        cssLinkRegExp = /<link rel="stylesheet" type="text\/css" href="(.*)">/g;
    }

    function makefile(htmlfile) {
        var fileNameRegResult = htmlfile.path.toString().match(fileNameRegExp);
        if (fileNameRegResult) {
            var cssFileName = fileNameRegResult[1] + '.min.css';
            var cssFilePath = options.dst + cssFileName;

            var html = htmlfile.contents.toString().replace(cssLinkRegExp, function ($0, $1) {
                if (!data[cssFileName]) {
                    data[cssFileName] = [];
                }

                data[cssFileName].push($1.replace(/\.+\//g, ''));

                return '';
            });

            var searchString = '</head>';
            var splited = html.split(searchString);
            splited.splice(1, 0, '<link rel="stylesheet" type="text/css" href="' + cssFilePath + '">');
            htmlfile.contents = new Buffer(splited.join(''));
        }
    }

    function make(file) {
        if (file.path.toString().match(/\.css$/)) {
            if (!data.sources) {
                data.sources = [];
            }

            data.sources.push({
                filePath: file.path.toString(),
                contents: file.contents.toString()
            });

            if (file.path.toString().match(new RegExp('\/(?:'+options.expections.join('|')+')\/'))) {
                return true;
            }
        }

        if(file.path.toString().match(/\.json$/)) {
            var _data = JSON.parse(file.contents.toString());
            for (var i = 0, keys = Object.keys(_data); i < keys.length; i++) {
                data[keys[i]] = _data[keys[i]];
            }
        }

        return false;
    }

    return through(function (file, encoding, cb) {

        if (file.isStream()) {
            callback(new gutil.PluginError('gulp-posts-make.js', 'Streaming not supported'));
            return;
        }

        if (file.isBuffer()) {
            if (isMakefile) {
                makefile(file);

                this.push(file);
            }

            if (isMake) {
                if (make(file)) {
                    this.push(file);
                }
            }
        }

        //给下一个流
        cb();

    }, function (cb) {

        if (isMakefile) {
            this.push(new gutil.File({
                cwd: '',
                base: '',
                path: filename,
                contents: new Buffer(JSON.stringify(data) + '\n')
            }));
        }

        if (isMake) {
            var sourcesKey = 'sources', sources = data[sourcesKey];
            for (var i = 0, keys = Object.keys(data); i < keys.length; i++) {
                if (sourcesKey === keys[i]) {
                    continue;
                }

                var concatCss = data[keys[i]].map(function (url) {
                    return (sources.find(function (source) {
                        return source.filePath.indexOf(url) !== -1;
                    }) || {contents: ''}).contents;
                }).join('');

                this.push(new gutil.File({
                    cwd: "",
                    base: "",
                    path: keys[i],
                    contents: new Buffer(concatCss)
                }));
            }
        }

        console.log('well done gulp-css-make.js @ ' + options.msg);

        cb();
    }, 16);

};
