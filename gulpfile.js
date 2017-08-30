'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
		sass = require('gulp-sass'),
		maps = require('gulp-sourcemaps'),
		 del = require('del');

gulp.task('concatScripts', function() {
	return gulp.src([
		'cardboard_unprocessed/scripts/main.js'
	])
	.pipe(concat('application.js'))
	.pipe(gulp.dest('cardboard_unprocessed/scripts'));
});

gulp.task('concatScriptsAngular', function() {
	return gulp.src([
		'cardboard_unprocessed/scripts/angular/marinelliApp.js',
		'cardboard_unprocessed/scripts/angular/controllers/projectCtrl.js',

		'cardboard_unprocessed/scripts/angular/services/projectService.js',

		'cardboard_unprocessed/scripts/angular/directives/flashDirective.js',
		'cardboard_unprocessed/scripts/angular/directives/markdownDirective.js'
	])
	.pipe(concat('marinelli.application.js'))
	.pipe(gulp.dest('public/javascripts'));
});

gulp.task('minifyScripts', ['concatScripts'], function() {
	return gulp.src('cardboard_unprocessed/scripts/application.js')
	.pipe(uglify())
	.pipe(maps.init())
	.pipe(rename('app.min.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('public/javascripts'));
});

gulp.task('compileSass', function() {
	return gulp.src('cardboard_unprocessed/sass/application.sass')
	.pipe(maps.init())
	.pipe(sass())
	.pipe(maps.write('./'))
	.pipe(gulp.dest('public/stylesheets'));
});

gulp.task('watchFiles', function() {
	gulp.watch('cardboard_unprocessed/sass/**/*.sass', ['compileSass']);
	gulp.watch('cardboard_unprocessed/scripts/**/*.js', ['minifyScripts', 'concatScriptsAngular']);
});

gulp.task('clean', function() {
	del(['public/stylesheets/application.css*', 'public/javascripts/app*.js*', 'public/javascripts/koloa*.js*']);
});

gulp.task('build', ['minifyScripts', 'compileSass'], function() {
	return console.log('Build complete!');
});

gulp.task('serve', ['watchFiles']);

gulp.task('default', ['clean'], function() {
	gulp.start('build');
});
