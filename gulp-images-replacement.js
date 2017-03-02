'use strict';

var through = require('through-gulp');

module.exports = function () {

    var urlRegExp = /url\(('|").*images\/(.*)('|")\)/g;
    var hrefRegExp = /href=('|").*images\/(.*)('|")/g;
    var srcRegExp = /src=('|").*images\/(.*)('|")/g;
    var dataUrlRegExp = /data-url=('|").*images\/(.*)('|")/g;
    var irStrRegExp = /irStr\((['|"]?).*images\/(.*)(['|"]?)\)/g;

    return through(function (file, encoding, cb) {
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

        this.push(file);
        cb();
    }, null, null);
};