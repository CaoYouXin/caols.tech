// npm install gulp gulp-minify-css gulp-uglify gulp-rename gulp-concat --save-dev

const gulp = require('gulp');
const exec = require('child_process').exec;
const minifyCss = require('gulp-minify-css');
const uglifyJs = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

const __devSrc = './__dev/';
const _devSrc = './_dev/';
const dst = './build/';

function jsDefault(src, dst) {
    gulp.src(src)
        .pipe(uglifyJs())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest(dst));
}

gulp.task('default', function() {
    gulp.start('b-ps', 'b-3d');
});

gulp.task('b-ps', function() {
    var jsSrc = __devSrc + 'pageslider/*.js';
    var cssSrc = __devSrc + 'pageslider/*.css';
    var psDst = dst + 'pageslider/';

    jsDefault(jsSrc, psDst);

    gulp.src(cssSrc)
        .pipe(minifyCss())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest(psDst));
});

gulp.task('b-3d', function () {
    var jsSrc = __devSrc + '3d/*.js';
    var _3dDst = dst + '3d/';

    jsDefault(jsSrc, _3dDst);
});
