/**
 * Test unit.
 * @version 1.3.0
 */
var assert = require('assert');
var fs = require('fs');
var gulp = require('gulp');
var wpmvc = require('../index');
// Load package JSON as config file.
var config = JSON.parse(fs.readFileSync('./package.json'));

describe('wpmvc', function() {
    // Prepare
    wpmvc(gulp, config);
    // Assert
    it('Task "styles" exists.', function() {
        assert.notEqual(undefined, gulp.task('styles')); 
    });
    it('Task "scripts" exists.', function() {
        assert.notEqual(undefined, gulp.task('scripts')); 
    });
    it('Task "sass" exists.', function() {
        assert.notEqual(undefined, gulp.task('sass')); 
    });
    it('Task "jsmin" exists.', function() {
        assert.notEqual(undefined, gulp.task('jsmin')); 
    });
    it('Task "cssmin" exists.', function() {
        assert.notEqual(undefined, gulp.task('cssmin')); 
    });
    it('Task "build-files" exists.', function() {
        assert.notEqual(undefined, gulp.task('build-files')); 
    });
    it('Task "build-prezip" exists.', function() {
        assert.notEqual(undefined, gulp.task('build-prezip')); 
    });
    it('Task "build-zip" exists.', function() {
        assert.notEqual(undefined, gulp.task('build-zip')); 
    });
    it('Task "build-clean" exists.', function() {
        assert.notEqual(undefined, gulp.task('build-clean')); 
    });
    it('Task "build-trunk" exists.', function() {
        assert.notEqual(undefined, gulp.task('build-trunk'));
    });
    it('Task "clean-trunk" exists.', function() {
        assert.notEqual(undefined, gulp.task('clean-trunk'));
    });
    it('Task "build-assets" exists.', function() {
        assert.notEqual(undefined, gulp.task('build-assets'));
    });
    it('Task "svn-clean" exists.', function() {
        assert.notEqual(undefined, gulp.task('svn-clean'));
    });
    it('Task "watch-styles" exists.', function() {
        assert.notEqual(undefined, gulp.task('watch-styles'));
    });
    it('Task "watch-js" exists.', function() {
        assert.notEqual(undefined, gulp.task('watch-js'));
    });
    it('Task "watch" exists.', function() {
        assert.notEqual(undefined, gulp.task('watch'));
    });
    it('Task "dev" exists.', function() {
        assert.notEqual(undefined, gulp.task('dev')); 
    });
    it('Task "build" exists.', function() {
        assert.notEqual(undefined, gulp.task('build')); 
    });
    it('Task "deploy-main" exists.', function() {
        assert.notEqual(undefined, gulp.task('deploy-main')); 
    });
    it('Task "deploy-clean" exists.', function() {
        assert.notEqual(undefined, gulp.task('deploy-clean')); 
    });
    it('Task "deploy" exists.', function() {
        assert.notEqual(undefined, gulp.task('deploy')); 
    });
    it('Task "watch-sass" exists.', function() {
        assert.notEqual(undefined, gulp.task('watch-sass')); 
    });
});