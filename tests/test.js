/**
 * Test unit.
 * @version 1.1.0
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
    it('Task "scrits" exists.', function() {
        assert.notEqual(undefined, gulp.task('scrits')); 
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
    it('Task "dev" exists.', function() {
        assert.notEqual(undefined, gulp.task('dev')); 
    });
    it('Task "build" exists.', function() {
        assert.notEqual(undefined, gulp.task('build')); 
    });
});