'use strict';

/**
 * Wordpress MVC gulp development file.
 * Enables predefined (standarized) tasks, such use minify or sass compilation.
 *
 * @link http://gulpjs.com/
 * @author Alejandro Mostajo <info@10quality.com>
 * @copyright 10 Quality
 * @license MIT
 * @version 1.2.1
 */

/**
 * Export module.
 * @since 1.0.0
 * @since 1.0.1 Changed execution order and added staging and gulp.
 * @since 1.0.2 Added fixes for theme check.
 * @since 1.0.3 Pretasks defined and better concat scope.
 * @since 1.0.4 Minification.
 * @since 1.0.5 Enable the option to set which directories to include on root.
 * @since 1.0.6 Added prebuild tasks to enable special customization before zip and build are made.
 * @since 1.0.7 Added prezip taks to enable special customization before zip is made.
 * @since 1.1.0 Node compatibility changes.
 * @since 1.2.0 Removes "bin" folders, prepares wordpress.org SVN.
 * @since 1.2.1 Replaces gulp-minify with gulp-jsmin.
 *
 * @param object gulp   Gulp project application.
 * @param array  config Configuration file.
 */
module.exports = function(gulp, config, wordpressOrg)
{
    // Dependencies.
    if (!gulp) gulp = require('gulp');
    var sass = require('gulp-sass');
    var concat = require('gulp-concat');
    var jsmin = require('gulp-jsmin');
    var cleanCSS = require('gulp-clean-css');
    var zip = require('gulp-zip');
    var del = require('del');
    // Prepare options
    if (!config) config = {};
    if (!config.name) config.name = 'app';
    if (!config.version) config.version = '1.0.0';
    if (!config.prestyles) config.prestyles = ['sass'];
    if (!config.prescripts) config.prescripts = [];
    if (!config.prebuild) config.prebuild = ['scripts', 'styles'];
    if (!config.prezip) config.prezip = ['build-prezip', 'jsmin', 'cssmin'];
    if (!config.rootdirs) config.rootdirs = '{app,assets,vendor}/**/*';

    // Set GULP tasks
    // SASS
    gulp.task('sass', function () {
        return gulp.src('./assets/raw/sass/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./assets/raw/css'));
    });
    // Styles
    gulp.task('styles', config.prestyles, function () {
        return gulp.src('./assets/raw/css/**/*.css')
            .pipe(concat('app.css'))
            .pipe(gulp.dest('./assets/css'));
    });
    // Scripts
    gulp.task('scripts', config.prescripts, function() {
        return gulp.src('./assets/raw/js/**/*.js')
            .pipe(concat('app.js'))
            .pipe(gulp.dest('./assets/js'));
    });
    // JS minify
    gulp.task('jsmin', ['scripts', 'build-prezip'], function() {
        return gulp.src('./assets/js/**/*.js')
            .pipe(jsmin())
            .pipe(gulp.dest('./builds/staging/'+config.name+'/assets/js'));
    });
    // CSS minify
    gulp.task('cssmin', ['styles', 'build-prezip'], function() {
        return gulp.src('./assets/css/**/*.css')
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest('./builds/staging/'+config.name+'/assets/css'));
    });
    // Build files
    gulp.task('build-files', config.prebuild, function() {
        return gulp.src([
                config.rootdirs,
                './LICENSE',
                './*.{php,css,jpg,txt}'
            ])
            .pipe(gulp.dest('./builds/staging/'+config.name));
    });
    // Build clean pre zip
    gulp.task('build-prezip', ['build-files'], function() {
        return del([
            './builds/staging/'+config.name+'/assets/{raw,css,js,wordpress}/**/*',
            './builds/staging/'+config.name+'/vendor/10quality/{ayuco,wpmvc-commands}/**/*',
            './builds/staging/'+config.name+'/vendor/nikic/**/*',
            './builds/staging/'+config.name+'/vendor/bin/**/*',
            './builds/staging/'+config.name+'/vendor/10quality/{wp-file,wpmvc-logger,wpmvc-phpfastcache,wpmvc-core,wpmvc-mvc}/tests/**/*',
            './builds/staging/'+config.name+'/assets/{raw,css,js,wordpress}',
            './builds/staging/'+config.name+'/vendor/10quality/{ayuco,wpmvc-commands,nikic}',
            './builds/staging/'+config.name+'/vendor/nikic',
            './builds/staging/'+config.name+'/vendor/bin',
            './builds/staging/'+config.name+'/vendor/10quality/wp-file/{wp-file,wpmvc-logger,wpmvc-phpfastcache,wpmvc-core,wpmvc-mvc}/tests',
        ]);
    });
    // Build zip
    gulp.task('build-zip', config.prezip, function() {
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
    // Build trunk
    gulp.task('build-trunk', ['clean-trunk'], function() {
        return gulp.src('./builds/staging/'+config.name+'/**/*')
            .pipe(gulp.dest('svn/'+wordpressOrg.path+'/trunk'));
    });
    // Clean truck
    gulp.task('clean-trunk', config.prezip, function() {
        return del([
            './svn/'+wordpressOrg.path+'/trunk/**/*',
        ]);
    });
    // Build trunk
    gulp.task('build-assets', ['build-trunk'], function() {
        return gulp.src('./assets/wordpress/**/*')
            .pipe(gulp.dest('svn/'+wordpressOrg.path+'/assets'));
    });
    // Cleans SVN
    gulp.task('svn-clean', ['build-assets'], function() {
        return del([
            './builds/staging/**/*',
            './builds/staging',
        ]);
    });
    // --------------------
    // DEV
    gulp.task('default', [
        'styles',
        'scripts',
    ]);
    gulp.task('dev', [
        'styles',
        'scripts',
    ]);
    // BUILD
    gulp.task('build', [
        'styles',
        'scripts',
        'build-files',
        'jsmin',
        'cssmin',
        'build-prezip',
        'build-zip',
        'build-clean',
    ]);
    if (wordpressOrg
        && wordpressOrg.cwd
        && wordpressOrg.username
        && wordpressOrg.password
    ) {
        // Wordpress task
        gulp.task('wordpress', [
            'styles',
            'scripts',
            'build-files',
            'jsmin',
            'cssmin',
            'clean-trunk',
            'build-trunk',
            'build-assets',
            'svn-clean',
        ]);
    }
}