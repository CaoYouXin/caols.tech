// npm install gulp gulp-minify-css gulp-uglify gulp-rename gulp-concat --save-dev

const gulp = require('gulp');
const exec = require('child_process').exec;
const clean = require('gulp-clean');
const minifyCss = require('gulp-minify-css');
const uglifyJs = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const postsMake = require('./gulp-posts-make.js');
const cssMake = require('./gulp-css-make.js');
const imageReplacement = require('./gulp-images-replacement.js');
const surveyCompute = require('./gulp-survey-compute.js');

const _3rdLib = './3rdLib/';
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

gulp.task('default', ['clean'], function() {
    gulp.start('b-js', 'b-css', 'cdn-upload', 'b-others1', 'b-others2', 'b-others3');
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

gulp.task('b-mu', function () {
    var promiseSrc = __devSrc + 'mobile/*.js';
    var promiseDst = _devSrc + 'js/mobile/';

    return jsDefault(promiseSrc, promiseDst);
});

gulp.task('b-html', function () {
    var htmlSrc = _devSrc + '*.html';

    return gulp.src(htmlSrc)
        .pipe(cssMake({msg: 'makefile', base: '_dev/', dst: 'css/', id: 'html'}))
        .pipe(imageReplacement())
        .pipe(gulp.dest(dst));
});

gulp.task('b-js', ['b-3d', 'b-pu', 'b-mu', 'b-ps-js'], function () {
    var jsSrc = _devSrc + 'js/';
    var jsDst = dst + 'js/';

    gulp.src([jsSrc + '*.js', jsSrc + '*/*.js'], {base: jsSrc})
        .pipe(uglifyJs())
        .pipe(gulp.dest(jsDst));

    gulp.src([
        _3rdLib + 'promise/es6-promise.js',
        _3rdLib + 'nanoajax/nanoajax.min.js',
        __devSrc + 'promise/PromiseUtils.js'
    ])
    .pipe(concat('pack/my-promise.min.js'))
    .pipe(uglifyJs())
    .pipe(gulp.dest(jsDst));

    gulp.src([
        __devSrc + 'pageslider/href_parser.js',
        __devSrc + 'pageslider/jsloader.js'
    ])
    .pipe(concat('pack/jsloader.min.js'))
    .pipe(uglifyJs())
    .pipe(gulp.dest(jsDst));
});

gulp.task('b-css', ['b-ps-css', 'b-html', 'posts'], function () {
    var cssSrc = _devSrc + 'css/';
    var cssDst = dst + 'css/';
    var _3rdLibCssSrc = _3rdLib + '*/*.css';
    var cssmakefiles = dst + '*-cssmakefile.json';

    gulp.src([cssSrc + '*.css', cssSrc + '*/*.css', _3rdLibCssSrc, cssmakefiles])
        .pipe(cssMake({msg: 'make', expections: ['pageslider']}))
        .pipe(imageReplacement())
        .pipe(minifyCss())
        .pipe(gulp.dest(cssDst));
});

gulp.task('posts', function () {
    var postsSrc = _devSrc + 'posts/*.html';

    return gulp.src(postsSrc, {base: _devSrc})
        .pipe(cssMake({msg: 'makefile', base: '_dev/', dst: '../css/', id: 'posts'}))
        .pipe(postsMake('_dev/', 'build/', 'posts/'))
        .pipe(imageReplacement())
        .pipe(gulp.dest(dst));
});

gulp.task('cdn-copy', function () {
    return gulp.src([imageSrc + '*', imageSrc + '*/*', imageSrc + '*/*/*']).pipe(gulp.dest(imageDst));
});

gulp.task('cdn-upload', ['cdn-copy'], function () {
    exec('cd '+imageDst+';git checkout master;git add *;git commit -m "add images";git push origin master;');
});

gulp.task('b-others1', function () {
    var htmlSrc = _devSrc + 'x-handlebars-templates/*.html';

    gulp.src(htmlSrc, {base: _devSrc})
        .pipe(imageReplacement())
        .pipe(gulp.dest(dst));
});

gulp.task('b-others2', function () {
    var jsonSrc = _devSrc + 'json/*.json';

    gulp.src(jsonSrc, {base: _devSrc})
        .pipe(gulp.dest(dst));
});

gulp.task('b-others3', function () {
    var csvSrc = _devSrc + 'csv/*.csv';

    gulp.src(csvSrc, {base: _devSrc + 'csv/'})
        .pipe(surveyCompute('json/'))
        .pipe(gulp.dest(dst));
});

gulp.task('clean', function () {
    return gulp.src(dst, {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch([_devSrc + '*/*', __devSrc + '*/*'], ['default']);
});
