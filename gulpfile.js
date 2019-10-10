const { series, parallel, dest, src, watch } = require('gulp');

const sass = require('gulp-sass'),
browserSync = require('browser-sync').create(),
autoprefixer = require('gulp-autoprefixer'),
plumber = require('gulp-plumber'),
concat = require('gulp-concat'),
rename = require('gulp-rename'),
gutil = require('gulp-util'),
cleanCSS = require('gulp-clean-css');


const cssDest = 'app/css/',
cssPath = 'app/css/**/*.css',
scssPath = 'app/scss/**/*.scss',
htmlPath = 'app/*.html',
jsPath = 'app/js/**/.js',
distPath = 'app/dist';

let onError = function (err) {
	gutil.beep();
	console.log(err);
};

function cssTask() {
	return src(cssPath)
	    .pipe(concat('app/dist'))
		.pipe(rename('all.min.css'))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(dest(distPath))
		.pipe(browserSync.stream());
}

function sassTask(err) {
     return	src(scssPath)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(dest(cssDest));
}

function browserSyncTask() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        notify: false
    });

        watch(scssPath, sassTask);
		watch(cssPath, cssTask);
        watch(htmlPath).on('change', browserSync.reload);
        watch(jsPath).on('change', browserSync.reload);

}

exports.default = series(sassTask, cssTask, browserSyncTask);
