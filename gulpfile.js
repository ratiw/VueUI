// Load gulp
var gulp = require('gulp');

// Load components
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Check scripts
gulp.task('lint', function() {
    gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Merge css files
gulp.task('csss', function() {
    gulp.src('./src/**/*.css')
        .pipe(concat('vueUI.css'))
        .pipe(gulp.dest('./dist'));
});

// Merge js files
gulp.task('scripts', function() {
    gulp.src('./src/**/*.js')
        .pipe(concat('vueUI.js'))
        .pipe(gulp.dest('./dist'));
});

// Default task
gulp.task('default', function(){
    gulp.run('csss', 'scripts');

    // Monitor file changes
    gulp.watch('./src/**/*.js', function(){
        gulp.run('scripts');
    });

    // Monitor file changes
    gulp.watch('./src/**/*.css', function(){
        gulp.run('csss');
    });
});