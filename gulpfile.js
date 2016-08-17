var gulp = require('gulp');
var gulp_concat = require('gulp-concat');
var gulp_rename = require('gulp-rename');
var gulp_uglify = require('gulp-uglify');
var gulp_watch = require('gulp-watch');
var sass = require('gulp-ruby-sass');
var main_bower_files = require('main-bower-files');
var runSequence = require('run-sequence');

var files = {
	src: {
		module: 'src/app/application.module.js',
		js: 'src/app/**/*.js',
		sass: 'src/app/**/*.scss',
		html: 'src/**/*.html',
	},
	dist: {
		root: 'dist',
		js: 'dist/js',
		css: 'dist/css'
	},
	build: {
		root: 'build',
		js: 'build/app',
		css: 'build/css'
	}
}

// dist
gulp.task('js_dist', function(){
	var js_files_concat = main_bower_files();
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

gulp.task('sass_dist', function(){
	console.log('Compilando Sass --> dist ;)');
	return sass(files.src.sass, {
		style: 'compressed',
		loadPath: [files.src.sass]
	})
	.pipe(gulp_concat(files.dist.js))
	.pipe(gulp_rename('main.css'))
	.pipe(gulp.dest(files.dist.css));
});

gulp.task('html', function(){
	// index.html
	return gulp.src('src/index.html')
		.pipe(gulp.dest(files.build.root));
});

// build
gulp.task('js_build', function(){
	var js_files_concat = main_bower_files();
	js_files_concat = js_files_concat.concat([
		files.src.module,
		files.src.js
	]);

	return gulp.src(js_files_concat)
		.pipe(gulp_concat(files.dist.js))
		.pipe(gulp_rename('main.js'))
		.pipe(gulp.dest(files.build.js));
});

gulp.task('sass_build', function(){
	return sass(files.src.sass, {
		loadPath: [files.src.sass]
	})
	.pipe(gulp_concat(files.build.js))
	.pipe(gulp_rename('main.css'))
	.pipe(gulp.dest(files.build.css));
});

// watch build
gulp.task('stream', function (callback) {
	return gulp_watch([
		files.src.js,
		files.src.sass,
		files.src.html
	],
	function(){
		runSequence(
			'js_dist',
			'sass_dist',
			'js_build',
			'sass_build',
			'html',
			callback
		);
	});
});

// watch dist
gulp.task('callback', function (callback) {
	return gulp_watch([
		files.src.js,
		files.src.sass,
		files.src.html
	],
	function(){
		runSequence(
			'js_dist',
			'sass_dist',
			'js_build',
			'sass_build',
			'html',
			callback
		);
	});
});

gulp.task('default', ['js_dist', 'sass_dist','js_build', 'sass_build', 'html', 'stream', 'callback']);