'use strict';

/**
 * WordPress MVC gulp development file.
 * Enables predefined (standarized) tasks, such as minify or sass compilation.
 *
 * @link http://gulpjs.com/
 * @author Alejandro Mostajo <info@10quality.com>
 * @copyright 10 Quality
 * @license MIT
 * @version 1.3.0
 */

/**
 * Export module.
 * @since 1.0.0
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
    var fs = require('fs');
    var watch = require('gulp-watch');
    // Prepare options
    if (!config) config = {};
    if (!config.name) config.name = 'app';
    if (!config.version) config.version = '1.0.0';
    if (!config.prestyles) config.prestyles = ['sass'];
    if (!config.prescripts) config.prescripts = [];
    if (!config.prebuild) config.prebuild = ['scripts', 'styles'];
    if (!config.prezip) config.prezip = ['build-prezip', 'jsmin', 'cssmin'];
    if (!config.rootdirs) config.rootdirs = '{app,assets,vendor}/**/*';
    if (!config.deletes) config.deletes = [];
    // Prepare individual assets compilations
    var assets = {css:[], js:[], sass:[]};
    // ------------------
    // Set GULP tasks
    // ------------------
    // SASS
    gulp.task('sass', function () {
        if (fs.existsSync('./assets/raw/sass/'))
            assets.sass = fs.readdirSync('./assets/raw/sass')
                .filter(function(dirent) {
                    return (dirent.isDirectory === undefined && !fs.lstatSync('./assets/raw/sass/' + dirent).isDirectory())
                        || (dirent.isDirectory !== undefined && !dirent.isDirectory());
                })
                .map(function(dirent) {
                    return dirent.name === undefined ? dirent.replace(/\.[\s\S]+/g, '') : dirent.name.replace(/\.[\s\S]+/g, '');
                });
        if (assets.sass.length > 1) {
            return assets.sass.map(function(asset) {
                gulp.src([
                    './assets/raw/sass/'+asset+'.scss',
                    './assets/raw/sass/'+asset+'.sass',
                ])
                .pipe(sass().on('error', sass.logError))
                .pipe(gulp.dest('./assets/css'));
            });
        }
        return gulp.src([
                './assets/raw/sass/*.scss',
                './assets/raw/sass/*.sass',
            ])
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./assets/css'));
    });
    // Styles
    gulp.task('styles', gulp.series(config.prestyles, function () {
        // Assets prep
        if (fs.existsSync('./assets/raw/css/'))
            assets.css = fs.readdirSync('./assets/raw/css')
                .filter(function(dirent) {
                    return (dirent.isDirectory === undefined && fs.lstatSync('./assets/raw/css/' + dirent).isDirectory())
                        || (dirent.isDirectory !== undefined && dirent.isDirectory());
                })
                .map(function(dirent) {
                    return dirent.name === undefined ? dirent : dirent.name;
                });
        // {asset}.css
        assets.css
            .filter(function(asset) { return asset !== 'app'; })
            .map(function(asset) {
                gulp.src('./assets/raw/css/'+asset+'/**/*.css')
                    .pipe(concat(asset+'.css'))
                    .pipe(gulp.dest('./assets/css'));
            });
        // app.css
        return gulp.src(
                assets.css.filter(function(asset) { return asset !== 'app'; })
                    .map(function(asset) {
                        return '!./assets/raw/css/'+asset+'/**/*';
                    })
                    .concat(['./assets/raw/css/**/*.css'])
            )
            .pipe(concat('app.css'))
            .pipe(gulp.dest('./assets/css'));
    }));
    // Scripts
    gulp.task('scripts', gulp.series(config.prescripts, function() {
        // Assets prep
        if (fs.existsSync('./assets/raw/js/'))
            assets.js = fs.readdirSync('./assets/raw/js')
                .filter(function(dirent) {
                    return (dirent.isDirectory === undefined && fs.lstatSync('./assets/raw/js/' + dirent).isDirectory())
                        || (dirent.isDirectory !== undefined && dirent.isDirectory());
                })
                .map(function(dirent) {
                    return dirent.name === undefined ? dirent : dirent.name;
                });
        // {asset}.js
        assets.js
            .filter(function(asset) { return asset !== 'app'; })
            .map(function(asset) {
                gulp.src('./assets/raw/js/'+asset+'/**/*.js')
                    .pipe(concat(asset+'.js'))
                    .pipe(gulp.dest('./assets/js'));
            });
        // app.js
        return gulp.src(
                assets.js.filter(function(asset) { return asset !== 'app'; })
                    .map(function(asset) {
                        return '!./assets/raw/js/'+asset+'/**/*';
                    })
                    .concat(['./assets/raw/js/**/*.js'])
            )
            .pipe(concat('app.js'))
            .pipe(gulp.dest('./assets/js'));
    }));
    // Build files
    gulp.task('build-files', gulp.series(config.prebuild, function() {
        return gulp.src([
                config.rootdirs,
                './LICENSE',
                './*.{php,css,jpg,txt}'
            ])
            .pipe(gulp.dest('./builds/staging/'+config.name));
    }));
    // Build clean pre zip
    gulp.task('build-prezip', gulp.series(['build-files'], function() {
        return del(config.deletes.concat([
            './builds/staging/'+config.name+'/assets/{raw,css,js,wordpress}/**/*',
            './builds/staging/'+config.name+'/vendor/10quality/{ayuco,wpmvc-commands}/**/*',
            './builds/staging/'+config.name+'/vendor/nikic/**/*',
            './builds/staging/'+config.name+'/vendor/bin/**/*',
            './builds/staging/'+config.name+'/vendor/10quality/{wp-file,wpmvc-logger,wpmvc-phpfastcache,wpmvc-core,wpmvc-mvc}/tests/**/*',
            './builds/staging/'+config.name+'/assets/{raw,css,js,wordpress}',
            './builds/staging/'+config.name+'/vendor/10quality/{ayuco,wpmvc-commands,nikic}',
            './builds/staging/'+config.name+'/vendor/nikic',
            './builds/staging/'+config.name+'/vendor/bin',
            './builds/staging/'+config.name+'/vendor/10quality/{wp-file,wpmvc-logger,wpmvc-phpfastcache,wpmvc-core,wpmvc-mvc}/tests',
        ]));
    }));
    // JS minify
    gulp.task('jsmin', gulp.series(['scripts', 'build-prezip'], function() {
        return gulp.src('./assets/js/**/*.js')
            .pipe(jsmin())
            .pipe(gulp.dest('./builds/staging/'+config.name+'/assets/js'));
    }));
    // CSS minify
    gulp.task('cssmin', gulp.series(['styles', 'build-prezip'], function() {
        return gulp.src('./assets/css/**/*.css')
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest('./builds/staging/'+config.name+'/assets/css'));
    }));
    // Build zip
    gulp.task('build-zip', gulp.series(config.prezip, function() {
        return gulp.src('./builds/staging/**/*')
            .pipe(zip(config.name+'-'+config.version+'.zip'))
            .pipe(gulp.dest('./builds'));
    }));
    // Build clean
    gulp.task('build-clean', gulp.series(['build-zip'], function() {
        return del([
            './builds/staging/**/*',
            './builds/staging',
        ]);
    }));
    // Clean trunk
    gulp.task('clean-trunk', gulp.series(config.prezip, function() {
        return del([
            './svn/'+wordpressOrg.path+'/trunk/**/*',
        ]);
    }));
    // Build trunk
    gulp.task('build-trunk', gulp.series(['clean-trunk'], function() {
        return gulp.src('./builds/staging/'+config.name+'/**/*')
            .pipe(gulp.dest('svn/'+wordpressOrg.path+'/trunk'));
    }));
    // Build assets
    gulp.task('build-assets', gulp.series(['build-trunk'], function() {
        return gulp.src('./assets/wordpress/**/*')
            .pipe(gulp.dest('svn/'+wordpressOrg.path+'/assets'));
    }));
    // Cleans SVN
    gulp.task('svn-clean', gulp.series(['build-assets'], function() {
        return del([
            './builds/staging/**/*',
            './builds/staging',
        ]);
    }));
    // Watch
    gulp.task('watch-styles', function () {
        return watch([
                './assets/raw/sass/**/*.sass',
                './assets/raw/sass/**/*.scss',
                './assets/raw/css/**/*.css',
            ],
            function () {
                gulp.start('styles');
            }
        );
    });
    gulp.task('watch-js', function () {
        return watch([
                './assets/raw/js/**/*.js',
            ],
            function () {
                gulp.start('scripts');
            }
        );
    });
    gulp.task('watch', function () {
        return watch([
                './assets/raw/sass/**/*.sass',
                './assets/raw/sass/**/*.scss',
                './assets/raw/css/**/*.css',
                './assets/raw/js/**/*.js',
            ],
            function () {
                gulp.start('dev');
            }
        );
    });
    // --------------------
    // DEV
    gulp.task('default', gulp.parallel([
        'styles',
        'scripts',
    ]));
    gulp.task('dev', gulp.parallel([
        'styles',
        'scripts',
    ]));
    // BUILD
    gulp.task('build', gulp.parallel([
        'styles',
        'scripts',
        'build-files',
        'jsmin',
        'cssmin',
        'build-prezip',
        'build-zip',
        'build-clean',
    ]));
    if (wordpressOrg
        && wordpressOrg.cwd
        && wordpressOrg.username
    ) {
        // WordPress task
        gulp.task('wordpress', gulp.parallel([
            'styles',
            'scripts',
            'build-files',
            'jsmin',
            'cssmin',
            'clean-trunk',
            'build-trunk',
            'build-assets',
            'svn-clean',
        ]));
    }
}