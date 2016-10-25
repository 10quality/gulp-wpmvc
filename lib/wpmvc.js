'use strict';

/**
 * Wordpress MVC gulp development file.
 * Enables predefined (standarized) tasks, such use minify or sass compilation.
 *
 * @link http://gulpjs.com/
 * @author Alejandro Mostajo <info@10quality.com>
 * @copyright 10 Quality
 * @license MIT
 * @version 1.0.2
 */

/**
 * Dependencies.
 * @since 1.0.0
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var zip = require('gulp-zip');
var del = require('del');

/**
 * Export module.
 * @since 1.0.0
 * @since 1.0.1 Changed execution order and added staging.
 * @since 1.0.2 Added project's gulp as a parameter.
 *
 * @param object gulp   Gulp project application.
 * @param array  config Configuration file.
 */
module.exports = function(gulp, config)
{
    // Prepare options
    if (!config) config = {};
    if (!config.name) config.name = 'app';
    if (!config.version) config.version = '1.0.0';
    if (!config.prestep) config.prestep = ['sass'];

    // Set GULP tasks
    // SASS
    gulp.task('sass', function () {
        return gulp.src('./assets/raw/sass/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./assets/raw/css'));
    });
    // Styles
    gulp.task('styles', config.prestep, function () {
        return gulp.src('./assets/raw/css/*.css')
            .pipe(concat('app.css'))
            .pipe(gulp.dest('./assets/css'));
    });
    // Scripts
    gulp.task('scripts', function() {
        return gulp.src('./assets/raw/js/*.js')
            .pipe(concat('app.js'))
            .pipe(gulp.dest('./assets/js'));
    });
    // JS minify
    gulp.task('jsmin', ['scripts', 'build-files'], function() {
        return gulp.src('./assets/js/*.js')
            .pipe(minify({
                ext:{
                    min:'.js'
                }
            }))
            .pipe(gulp.dest('./builds/staging/'+config.name+'/assets/js'));
    });
    // CSS minify
    gulp.task('cssmin', ['styles', 'build-files'], function() {
        return gulp.src('./assets/css/*.css')
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest('./builds/staging/'+config.name+'/assets/css'));
    });
    // Build files
    gulp.task('build-files', ['scripts', 'styles'], function() {
        return gulp.src([
                '{app,assets,vendor}/**/*',
                './LICENSE',
                './*.{php,css,jpg,txt}'
            ])
            .pipe(gulp.dest('./builds/staging/'+config.name));
    });
    // Build clean pre zip
    gulp.task('build-prezip', ['build-files'], function() {
        return del([
            './builds/staging/'+config.name+'/assets/{raw,css,js}/**/*',
            './builds/staging/'+config.name+'/vendor/10quality/{ayuco,wpmvc-commands,nikic}/**/*',
            './builds/staging/'+config.name+'/assets/{raw,css,js}',
            './builds/staging/'+config.name+'/vendor/10quality/{ayuco,wpmvc-commands,nikic}',
        ]);
    });
    // Build zip
    gulp.task('build-zip', ['build-prezip', 'jsmin', 'cssmin'], function() {
        return gulp.src('./builds/staging/**/*')
            .pipe(zip(config.name+'-'+config.version+'.zip'))
            .pipe(gulp.dest('./builds'));
    });
    // Build clean
    gulp.task('build-clean', ['build-zip'], function() {
        return del([
            './builds/staging/**/*',
            './builds/staging',
        ]);
    });
    // DEV
    gulp.task('dev', [
        'sass',
        'styles',
        'scripts',
    ]);
    // BUILD
    gulp.task('build', [
        'sass',
        'styles',
        'scripts',
        'build-files',
        'jsmin',
        'cssmin',
        'build-prezip',
        'build-zip',
        'build-clean',
    ]);
}