var gulp = require('gulp');
var gulp_concat = require('gulp-concat');
var gulp_rename = require('gulp-rename');
var gulp_uglify = require('gulp-uglify');
var gulp_watch = require('gulp-watch');
var sass = require('gulp-ruby-sass');
var main_bower_files = require('main-bower-files');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var jade = require('gulp-jade');

var files = {
	src: {
		module: 'src/app/**/*.module.js',
		js: 'src/app/**/*.js',
		sass: 'src/**/*.scss',
		html: 'src/**/*.html',
	},
	dist: {
		root: 'dist',
		js: 'dist/app',
		css: 'dist/css'
	},
	build: {
		root: 'build',
		js: 'build/app',
		css: 'build/css'
	}
}

// dist
gulp.task('js_dist', function() {
	var js_files_concat = main_bower_files('**/*.js');
	js_files_concat = js_files_concat.concat([
		files.src.module,
		files.src.js
	]);
	console.log('Compilando JS --> dist ;)');
	return gulp.src(js_files_concat)
		.pipe(gulp_concat(files.dist.js))
		.pipe(gulp_rename('main.js'))
		.pipe(gulp_uglify())
		.pipe(gulp.dest(files.dist.js));
});

gulp.task('sass_dist', function() {
	console.log('Compilando Sass --> dist ;)');
	return sass(files.src.sass, {
		style: 'compressed',
		loadPath: [files.src.sass]
	})
	.pipe(gulp_concat(files.dist.js))
	.pipe(gulp_rename('main.css'))
	.pipe(gulp.dest(files.dist.css));
});

gulp.task('html_dist', function() {
	return gulp.src('src/index.jade')
	.pipe(jade({
		locals: files.dist.root
	}))
	.pipe(gulp.dest(files.dist.root));
});

gulp.task('html_build', function() {
	return gulp.src('src/index.jade')
	.pipe(jade({
		locals: files.build.root,
		pretty: true
	}))
	.pipe(gulp.dest(files.build.root));
});

gulp.task('html_components_dist', function() {
	return gulp.src('src/app/**/*.jade')
		.pipe(jade({
			locals: files.dist.root
		}))
		.pipe(gulp.dest(files.dist.js));;
});

gulp.task('html_components_build', function() {
	return gulp.src('src/app/**/*.jade')
		.pipe(jade({
			locals: files.build.root,
			pretty: true
		}))
		.pipe(gulp.dest(files.build.js))
		.pipe(connect.reload());
});

// build
gulp.task('js_build', function() {
	var js_files_concat = main_bower_files('**/*.js');
	js_files_concat = js_files_concat.concat([
		files.src.module,
		files.src.js
	]);

	return gulp.src(js_files_concat)
		.pipe(gulp_concat(files.dist.js))
		.pipe(gulp_rename('main.js'))
		.pipe(gulp.dest(files.build.js));
});

gulp.task('sass_build', function() {
	return sass(files.src.sass, {
		loadPath: [files.src.sass]
	})
	.pipe(gulp_concat(files.build.js))
	.pipe(gulp_rename('main.css'))
	.pipe(gulp.dest(files.build.css));
});

gulp.task('connect_build', function () {
	connect.server({
		name: 'Application',
		root: ['build'],
		port: 8000,
		livereload: true
	});
});

gulp.task('connect_dist', function () {
	connect.server({
		name: 'Application',
		root: ['dist'],
		port: 8000,
		livereload: true
	});
});

// watch build
gulp.task('stream', function(callback) {
	return gulp_watch([
		files.src.js,
		files.src.sass,
		files.src.html
	],
	function() {
		runSequence(
			'js_dist',
			'sass_dist',
			'js_build',
			'sass_build',
			'html_dist',
			'html_build',
			'html_components_dist',
			'html_components_build'
		);
	});
});

// watch dist
gulp.task('callback', function(callback) {
	return gulp_watch([
		files.src.js,
		files.src.sass,
		files.src.html
	],
	function() {
		runSequence(
			'js_dist',
			'sass_dist',
			'js_build',
			'sass_build',
			'html_dist',
			'html_build',
			'html_components_dist',
			'html_components_build'
		);
	});
});

gulp.task(
'default',
[
	'js_dist',
	'sass_dist',
	'js_build',
	'sass_build',
	'html_dist',
	'html_build',
	'html_components_dist',
	'html_components_build',
	'stream',
	'callback',
	'connect_build'
]);

gulp.task(
'prod',
[
	'js_dist',
	'sass_dist',
	'js_build',
	'sass_build',
	'html_dist',
	'html_build',
	'html_components_dist',
	'html_components_build',
	'stream',
	'callback',
	'connect_build'
]);