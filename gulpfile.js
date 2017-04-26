const gulp = require('gulp');
const clean = require('gulp-clean');
const minifyCss = require('gulp-minify-css');
const uglifyJs = require('gulp-uglify');

const buildPOST = require('./scripts/build_post');
const buildAPI = require('./scripts/build_api');
const myMerge = require('./scripts/util_merge');
const jsMake = require('./scripts/build_js.js');
const articleMake = require('./scripts/build_article.js');
const cssMake = require('./scripts/gulp-css-make.js');
const imageReplacement = require('./scripts/gulp-images-replacement');

const src = './src/';
const app = 'app/';
const css = 'css/';
const js = 'js/';
const article = 'article/';
const screenshot = 'screenshot/';
const dist = './dist/';
const post = 'post/';
const api = 'api/';

const appMakeFilePath = 'app-makefile.json';
const articleMakeFilePath = 'article-makefile.json';
const articleCSSMakeFilePath = 'article-css-makefile.json';
const articleJSMakeFilePath = 'article-js-makefile.json';

gulp.task('default', ['clean'], function () {
    gulp['start'](['api']);
});

gulp.task('api', ['screenshot', 'app', 'article'], function () {
    gulp.src([
        dist + post + app + appMakeFilePath,
        dist + post + article + articleMakeFilePath,
        dist + post + screenshot + 'description.json'
    ]).pipe(buildAPI({
        key: 'key_@_key',
        buildPOSTs: function (posts) {
            var self = this, _category = {}, _index = {}, dateReg = /^(.*?)-(.*?)-(.*?)$/;

            posts.forEach(function (p) {
                p[self.key] = p.name;

                myMerge(_category, JSON.parse('{"' + p.category + '":{"posts":["' + p.name + '"]}}'));

                var matched = p.update.match(dateReg);
                myMerge(_index, JSON.parse('{"' + matched[1] + '":{"'
                    + matched[2] + '":{"'
                    + matched[3] + '":{"posts":["'
                    + p.name + '"],"categories":["'
                    + p.category + '"]}}}}'));
            });

            return {post: posts, category: _category, index: _index};
        },
        screenshot: function (screenshots) {
            for (var keys = Object.keys(screenshots), k = 0;
                    k < keys.length; k++) {
                var key = keys[k];

                screenshots[key] = {imageSrc: screenshots[key]};
            }

            return {post: screenshots};
        },
        dstFilePath: {
            post: 'post.json',
            category: 'category.json',
            index: 'date_index.json'
        }
    })).pipe(gulp.dest(dist + api));
});

gulp.task('clean', function () {
    return gulp.src(dist, {read: false})
        .pipe(clean());
});

gulp.task('screenshot', function () {
    return gulp.src(src + screenshot + '**')
        .pipe(gulp.dest(dist + post + screenshot));
});

gulp.task('app', function () {
    return gulp.src(src + app + '**')
        .pipe(buildPOST({
            srcBase: src + app,
            dstBase: 'http://caols.tech/post/app/',
            dstFilePath: appMakeFilePath
        }))
        .pipe(gulp.dest(dist + post + app));
});

gulp.task('article', ['article-js'], function () {
    // keep empty
});

gulp.task('article-js', ['article-css'], function () {
    return gulp.src([
        src + js + '**',
        dist + post + article + articleJSMakeFilePath
    ]).pipe(jsMake({
            msg: 'make',
            expections: []
        }))
        .pipe(uglifyJs())
        .pipe(imageReplacement())
        .pipe(gulp.dest(dist + post + js));
});

gulp.task('article-css', ['article-html'], function () {
     return gulp.src([
         src + css + '**',
         dist + post + article + articleCSSMakeFilePath
     ]).pipe(cssMake({
             msg: 'make',
             expections: []
         }))
         .pipe(minifyCss())
         .pipe(imageReplacement())
         .pipe(gulp.dest(dist + post + css));
});

gulp.task('article-html', function () {
    return gulp.src(src + article + '*.html')
        .pipe(buildPOST({
            srcBase: src + article,
            dstBase: 'http://caols.tech/' + post + article,
            jsDstBase: 'http://caols.tech/' + post + js,
            dstFilePath: articleMakeFilePath
        }))
        .pipe(cssMake({
            msg: 'makefile',
            base: src + article,
            dst: 'http://caols.tech/' + post + css,
            filename: articleCSSMakeFilePath
        }))
        .pipe(jsMake({
            msg: 'makefile',
            base: src + article,
            dst: 'http://caols.tech/' + post + js,
            filename: articleJSMakeFilePath
        }))
        .pipe(articleMake())
        .pipe(imageReplacement())
        .pipe(gulp.dest(dist + post + article));
});
