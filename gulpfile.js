// npm install gulp gulp-minify-css gulp-uglify gulp-rename gulp-concat --save-dev

const gulp = require('gulp');
const exec = require('child_process').exec;
const minifyCss = require('gulp-minify-css');
const uglifyJs = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const postsMake = require('./gulp-posts-make.js');

const __devSrc = './__dev/';
const _devSrc = './_dev/';
const dst = './build/';
const imageSrc = './images/';
const imageDst = '../images/';

function jsDefault(src, dst) {
    return gulp.src(src)
        .pipe(uglifyJs())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest(dst));
}

gulp.task('default', function() {
    gulp.start('b-html', 'b-js', 'b-css', 'posts', 'cdn', 'b-others');
});

gulp.task('b-ps-js', function() {
    var jsSrc = __devSrc + 'pageslider/*.js';
    var psDst = _devSrc + 'js/pageslider/';

    return jsDefault(jsSrc, psDst);
});

gulp.task('b-ps-css', function() {
    var cssSrc = __devSrc + 'pageslider/*.css';
    var psDst = _devSrc + 'css/pageslider/';

    return gulp.src(cssSrc)
        .pipe(minifyCss())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest(psDst));
});

gulp.task('b-3d', function () {
    var jsSrc = __devSrc + '3d/*.js';
    var _3dDst = _devSrc + 'js/3d/';

    return jsDefault(jsSrc, _3dDst);
});

gulp.task('b-pu', function () {
    var promiseSrc = __devSrc + 'promise/*.js';
    var promiseDst = _devSrc + 'js/promise/';

    return jsDefault(promiseSrc, promiseDst);
});

gulp.task('b-html', function () {
    var htmlSrc = _devSrc + '*.html';

    gulp.src(htmlSrc)
        .pipe(gulp.dest(dst));
});

gulp.task('b-js', ['b-3d', 'b-pu', 'b-ps-js'], function () {
    var jsSrc = _devSrc + 'js/';
    var jsDst = dst + '/js/';

    gulp.src([jsSrc + '*.js', jsSrc + '*/*.js'], {base: jsSrc})
        .pipe(gulp.dest(jsDst));
});

gulp.task('b-css', ['b-ps-css'], function () {
    var jsSrc = _devSrc + 'css/';
    var jsDst = dst + '/css/';

    gulp.src([jsSrc + '*.css', jsSrc + '*/*.css'], {base: jsSrc})
        .pipe(gulp.dest(jsDst));
});

gulp.task('posts', function () {
    var postsSrc = _devSrc + 'posts/*.html';
    var postsDst = dst + 'posts/';

    gulp.src(postsSrc)
        .pipe(postsMake('_dev/', 'build/', postsDst))
        .pipe(gulp.dest(postsDst));
});

gulp.task('cdn', function () {
    gulp.src(imageSrc).pipe(gulp.dest(imageDst));

    exec('cd '+imageDst+';git checkout master;git add *.png;git add *.jpg;git commit -m "add images";git push origin master;');
});

gulp.task('b-others', function () {
    var htmlSrc = _devSrc + 'x-handlebars-templates/*.html';

    gulp.src(htmlSrc, {base: _devSrc})
        .pipe(gulp.dest(dst));
});
