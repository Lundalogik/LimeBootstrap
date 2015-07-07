var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var zip = require('gulp-zip');
// Lint Task
gulp.task('lint', function() {
    return gulp.src([
        'system/js/lbs*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('externalscripts', function() {
    return gulp.src(
        [
        'system/js/jquery-1.9.1.min.js',
        'system/js/knockout-*',
        'system/js/knockout.punches.min.js',
        'system/js/bootstrap.min.js',
        'system/js/knockout.mapping-latest.js',
        'system/js/xml2json.js',
        'system/js/moment.min.js',
        'system/js/underscore-min.js',
        'system/js/highlight.pack.js',
        'system/js/snowstorm.js',
        'system/js/appInvoker/appInvoker.js',
        'system/js/json2xml.js'
        ])
        .pipe(concat('ext.all.js'))
        .pipe(gulp.dest('system/dist'))
        .pipe(rename('ext.all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('system/dist'));
});

// Concatenate & Minify JS
gulp.task('lbsscripts', function() {
    return gulp.src(
        [
        'system/js/lbs.js',
        'system/js/lbs.log.js',
        'system/js/lbs.loader.js',
        'system/js/lbs.apploader.js',
        'system/js/lbs.common.js',
        'system/js/lbs.bindings.js',
        'system/js/lbs.jotnar.js'
        ])
        .pipe(concat('lbs.all.js'))
        .pipe(gulp.dest('system/dist'))
        .pipe(rename('lbs.all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('system/dist'));
});

// Concatenate & Minify CSS
gulp.task('css',function(){
    return gulp.src([
        'system/css/bootstrap.min.css',
        'system/css/bootstrap-theme.min.css',
        'system/css/font-awesome.min.css', 
        'system/css/animate.min.css', 
        'system/css/highlightJS/github.css',
        'system/css/lime.css'

    ])
    .pipe(concat('all.css'))
    .pipe(gulp.dest('system/dist'))
    .pipe(rename('all.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('system/dist'));
});

gulp.task('zip-upgrade',function(){
    return gulp.src([
        'lbs.html',
        '_config.js',
        'system/**/*'
    ],{base:'.'})
    .pipe(zip('upgrade_release.zip'))
    .pipe(gulp.dest(''))
});

gulp.task('zip-full',function(){
    return gulp.src([
        'lbs.html',
        '_config.js',
        'system/**/*',
        'apps/template/**/*',
        'resources/**/*',
        'README.md',
        'serve.bat'
    ],{base:'.'})
    .pipe(zip('full_release.zip'))
    .pipe(gulp.dest(''))
});

// Default Task
gulp.task('default',['externalscripts','lbsscripts', 'css', 'zip-upgrade','zip-full']);