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
var cache = require('gulp-cache');
var image = require('gulp-image');

var files = {
	src: {
		module: 'src/app/**/*.module.js',
		js: 'src/app/**/*.js',
		sass: 'src/**/*.scss',
		jade: 'src/**/*.jade',
		fonts: 'src/fonts/**/*.{ttf,eot,woff,woff2,svg}',
		fonts_bower: 'bower_components/**/*.{ttf,eot,woff,woff2,svg}',
		imgs: 'src/imgs/**/*.{jpg,jpeg,gif,png}'
	},
	dist: {
		root: 'dist',
		js: 'dist/app',
		css: 'dist/css',
		fonts: 'dist/fonts',
		imgs: 'dist/imgs'
	},
	build: {
		root: 'build',
		js: 'build/app',
		css: 'build/css',
		fonts: 'build/fonts',
		imgs: 'build/imgs'
	}
}

// js dist
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

// sass dist
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

// html dist
gulp.task('html_dist', function() {
	return gulp.src('src/index.jade')
	.pipe(jade({
		locals: files.dist.root
	}))
	.pipe(gulp.dest(files.dist.root));
});

// html build
gulp.task('html_build', function() {
	return gulp.src('src/index.jade')
	.pipe(jade({
		locals: files.build.root,
		pretty: true
	}))
	.pipe(gulp.dest(files.build.root));
});

// html components dist
gulp.task('html_components_dist', function() {
	return gulp.src('src/app/**/*.jade')
		.pipe(jade({
			locals: files.dist.root
		}))
		.pipe(gulp.dest(files.dist.js))
		.pipe(connect.reload());
});

// html components build
gulp.task('html_components_build', function() {
	return gulp.src('src/app/**/*.jade')
		.pipe(jade({
			locals: files.build.root,
			pretty: true
		}))
		.pipe(gulp.dest(files.build.js))
		.pipe(connect.reload());
});

// js build
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

// sass build
gulp.task('sass_build', function() {
	return sass(files.src.sass, {
		loadPath: [files.src.sass]
	})
	.pipe(gulp_concat(files.build.js))
	.pipe(gulp_rename('main.css'))
	.pipe(gulp.dest(files.build.css));
});

// image build
gulp.task('image_build', function () {
	return gulp.src(files.src.imgs)
		.pipe(image())
		.pipe(gulp.dest(files.build.imgs));
});

// image dist
gulp.task('image_dist', function () {
	return gulp.src(files.src.imgs)
		.pipe(image())
		.pipe(gulp.dest(files.dist.imgs));
});

// fonts dist
gulp.task('fonts_dist', function () {
	gulp.src(files.src.fonts)
		.pipe(gulp.dest(files.dist.fonts));

	gulp.src(files.src.fonts_bower)
		.pipe(gulp.dest(files.dist.fonts));	
});

// fonts build
gulp.task('fonts_build', function () {
	gulp.src(files.src.fonts)
		.pipe(gulp.dest(files.build.fonts));

	gulp.src(files.src.fonts_bower)
		.pipe(gulp.dest(files.build.fonts));	
});

// connect build
gulp.task('connect_build', function () {
	connect.server({
		name: 'Application',
		root: ['build'],
		port: 8000,
		livereload: true
	});
});

// connect dist
gulp.task('connect_dist', function () {
	connect.server({
		name: 'Application',
		root: ['dist'],
		port: 8000,
		livereload: true
	});
});

gulp.task('clear_cache', function (done) {
	return cache.clearAll(done);
});

// watch build
gulp.task('stream', function(callback) {
	return gulp_watch([
		files.src.js,
		files.src.sass,
		files.src.jade
	],
	function() {
		runSequence(
			'js_build',
			'sass_build',
			'html_build',
			'html_components_build',
			'image_build',
			'fonts_build',
			'clear_cache'
		);
	});
});

// watch dist
gulp.task('callback', function(callback) {
	return gulp_watch([
		files.src.js,
		files.src.sass,
		files.src.jade
	],
	function() {
		runSequence(
			'js_dist',
			'sass_dist',
			'html_dist',
			'html_components_dist',
			'image_dist',
			'fonts_dist',
			'clear_cache'
		);
	});
});

gulp.task(
'default',
[
	'js_build',
	'sass_build',
	'html_build',
	'html_components_build',
	'image_build',
	'fonts_build',
	'connect_build',
	'stream'
]);

gulp.task(
'prod',
[
	'js_dist',
	'sass_dist',
	'html_dist',
	'html_components_dist',
	'image_dist',
	'fonts_dist',
	'connect_dist',
	'callback'
]);