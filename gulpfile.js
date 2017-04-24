const gulp = require('gulp');
const clean = require('gulp-clean');

const src = '../';
const dist = ['../../docs/', 'posts/'];

gulp.task('default', ['clean'], function() {
    gulp.src(src + '../404.html')
        .pipe(gulp.dest(dist.join('')));
});

gulp.task('clean', function () {
    return gulp.src(dist.join(''), {read: false})
        .pipe(clean());
});
