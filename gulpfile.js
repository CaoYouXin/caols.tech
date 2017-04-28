const gulp = require('gulp');
const clean = require('gulp-clean');
const minifyCss = require('gulp-minify-css');
const uglifyJs = require('gulp-uglify');
const concat = require('gulp-concat');

const buildPOST = require('./scripts/build_post');
const buildCategory = require('./scripts/build_category');
const buildAPI = require('./scripts/build_api');
const myMerge = require('./scripts/util_merge');
const jsMake = require('./scripts/build_js');
const contentMake = require('./scripts/build_content');
const cssMake = require('./scripts/gulp-css-make');
const imageReplacement = require('./scripts/gulp-images-replacement');
const templateReplacement = require('./scripts/build_template_replacement');

const src = './src/';
const app = 'app/';
const css = 'css/';
const js = 'js/';
const article = 'article/';
const category = 'category/';
const template = 'x-handlebars-templates/';
const screenshot = 'screenshot/';
const dist = './dist/';
const post = 'post/';
const api = 'api/';

const appMakeFilePath = 'app-makefile.json';
const articleMakeFilePath = 'article-makefile.json';
const articleCSSMakeFilePath = 'article-css-makefile.json';
const articleJSMakeFilePath = 'article-js-makefile.json';
const categoryMakeFilePath = 'category-makefile.json';
const categoryCSSMakeFilePath = 'category-css-makefile.json';
const categoryJSMakeFilePath = 'category-js-makefile.json';

gulp.task('default', ['clean'], function () {
    gulp['start'](['api']);
});

gulp.task('api', ['screenshot', 'app', 'article', 'category', 'template'], function () {
    gulp.src([
        dist + post + app + appMakeFilePath,
        dist + post + article + articleMakeFilePath,
        dist + post + category + categoryMakeFilePath,
        dist + post + screenshot + 'description.json',
        src + 'apps.json'
    ]).pipe(buildAPI({
        key: 'key_@_key',
        buildPOSTs: function (posts) {
            var self = this, _category = {}, _index = {}, dateReg = /^(.*?)\/(.*?)\/(.*?)$/;

            posts.forEach(function (p) {
                p[self.key] = p.name;

                myMerge(_category, JSON.parse('{"' + p.category + '":{"posts":["' + p.name + '"]}}'));

                var matched = p.update.match(dateReg);
                myMerge(_index, JSON.parse('{"' + matched[1] + '":{"'
                    + matched[2] + '":{"'
                    + matched[3] + '":{"posts":["'
                    + p.name + '"],"categories":["'
                    + p.category + '"]}}}}'));

                delete p.name;
            });

            return {post: posts, category: _category, index: _index};
        },
        buildCATEGORYs: function(categories) {
            var self = this;

            categories.forEach(function (c) {
                c[self.key] = c.name;

                delete c.name;
            });

            return {category: categories};
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
        .pipe(contentMake({
            splitter: /<div class="article-content">|<\/div>.*?<i class="splitter"><\/i>/
        }))
        .pipe(imageReplacement())
        .pipe(templateReplacement())
        .pipe(gulp.dest(dist + post + article));
});

gulp.task('category', ['category-js'], function () {
    // keep empty
});

gulp.task('category-js', ['category-css'], function () {
    return gulp.src([
        src + js + '**',
        dist + post + category + categoryJSMakeFilePath
    ]).pipe(jsMake({
            msg: 'make',
            expections: []
        }))
        .pipe(uglifyJs())
        .pipe(imageReplacement())
        .pipe(gulp.dest(dist + post + js));
});

gulp.task('category-css', ['category-html'], function () {
     return gulp.src([
         src + css + '**',
         dist + post + category + categoryCSSMakeFilePath
     ]).pipe(cssMake({
             msg: 'make',
             expections: []
         }))
         .pipe(minifyCss())
         .pipe(imageReplacement())
         .pipe(gulp.dest(dist + post + css));
});

gulp.task('category-html', function () {
    return gulp.src(src + category + '*.html')
        .pipe(buildCategory({
            srcBase: src + category,
            dstBase: 'http://caols.tech/' + post + category,
            jsDstBase: 'http://caols.tech/' + post + js,
            dstFilePath: categoryMakeFilePath
        }))
        .pipe(cssMake({
            msg: 'makefile',
            base: src + category,
            dst: 'http://caols.tech/' + post + css,
            filename: categoryCSSMakeFilePath
        }))
        .pipe(jsMake({
            msg: 'makefile',
            base: src + category,
            dst: 'http://caols.tech/' + post + js,
            filename: categoryJSMakeFilePath
        }))
        .pipe(contentMake({
            splitter: /<div class="category-content">|<\/div>.*?<i class="splitter"><\/i>/
        }))
        .pipe(imageReplacement())
        .pipe(templateReplacement())
        .pipe(gulp.dest(dist + post + category));
});

gulp.task('template', function () {
    gulp.src(src + template)
        .pipe(gulp.dest(dist + post + template));
});

gulp.task('js-pack', function() {
    gulp.src([
        './3rdLib/promise/es6-promise.js',
        './3rdLib/nanoajax/nanoajax.min.js',
        './__dev/promise/PromiseUtils.js'
    ]).pipe(concat('pack/P.min.js'))
        .pipe(uglifyJs())
        .pipe(gulp.dest(src + js));
});
