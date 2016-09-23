'use strict';

var through = require('through-gulp');

module.exports = function () {

    var urlRegExp = /url\(('|").*images\/(.*)('|")\)/g;
    var hrefRegExp = /href=('|").*images\/(.*)('|")/g;

    return through(function (file, encoding, cb) {
        var contents = file.contents.toString();
        file.contents = new Buffer(contents.replace(urlRegExp, function ($0, $1, $2, $3) {
            return 'url('+$1+'http://image.caols.tech/'+$2+$3+')';
        }).replace(hrefRegExp, function ($0, $1, $2, $3) {
            return 'href='+$1+'http://image.caols.tech/'+$2+$3;
        }));

        this.push(file);
        cb();
    }, null, null);
};