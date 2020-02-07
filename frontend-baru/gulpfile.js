var autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename')

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

var styles_input = './assets/src/scss/**/*.scss',
    styles_output = './assets/dist/css/';

// Gulp task to compile SASS, combine & minify CSS files
gulp.task('styles', function () {
    return gulp.src(styles_input)
        .pipe(sass({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
        .pipe(concat('apps.css'))
        .pipe(gulp.dest(styles_output))
        .pipe(rename('apps.min.css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(styles_output))
});

gulp.task('watch', function () {
    gulp.watch(styles_input, gulp.parallel(['styles']));
});

gulp.task('default', gulp.series(['watch']));