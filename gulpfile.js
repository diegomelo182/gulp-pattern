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
var del = require('del');

var files = {
	src: {
		module: 'src/app/**/*.module.js',
		js: 'src/app/**/*.js',
		sass: 'src/style.scss',
		jade: 'src/**/*.jade',
		fonts: 'src/fonts/**/*.{ttf,eot,woff,woff2,svg}',
		fonts_bower: 'bower_components/**/*.{ttf,eot,woff,woff2,svg}',
		imgs: 'src/imgs/**/*.{jpg,jpeg,gif,png,ico}',
		json: 'src/json/**/*.json'
	},
	dist: {
		root: 'dist',
		js: 'dist/app',
		css: 'dist/css',
		fonts: 'dist/fonts',
		imgs: 'dist/imgs',
		json: 'dist/json'
	},
	build: {
		root: 'build',
		js: 'build/app',
		css: 'build/css',
		fonts: 'build/fonts',
		imgs: 'build/imgs',
		json: 'build/json'
	}
}

var on_error = function(err) {
	hasError = true;
	console.log(err.message);
}

// js dist
gulp.task('js_dist', function() {
	var js_files_concat = main_bower_files('**/*.js');
	js_files_concat = js_files_concat.concat([
		files.src.module,
		files.src.js
	]);
	return gulp.src(js_files_concat)
		.pipe(gulp_concat(files.dist.js))
		.pipe(gulp_rename('main.js'))
		.pipe(gulp_uglify())
		.on('error', on_error)
		.pipe(gulp.dest(files.dist.js));
});

// js dist remove
gulp.task('rm_js_dist', function() {
	return del(['dist/*.js']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
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
	.on('error', on_error)
	.pipe(gulp.dest(files.dist.css));
});

// css dist remove
gulp.task('rm_sass_dist', function() {
	return del(['dist/*.css']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
});

// html dist
gulp.task('html_dist', function() {
	return gulp.src('src/index.jade')
	.pipe(jade({
		locals: files.dist.root
	}))
	.on('error', on_error)
	.pipe(gulp.dest(files.dist.root));
});

// html dist remove
gulp.task('rm_html_dist', function() {
	return del(['dist/index.html']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
});

// html build
gulp.task('html_build', function() {
	return gulp.src('src/index.jade')
	.pipe(jade({
		locals: files.build.root,
		pretty: true
	}))
	.on('error', on_error)
	.pipe(gulp.dest(files.build.root));
});

// html build remove
gulp.task('rm_html_build', function() {
	return del(['build/index.html']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
});

// html components dist
gulp.task('html_components_dist', function() {
	return gulp.src('src/app/**/*.jade')
		.pipe(jade({
			locals: files.dist.root
		}))
		.on('error', on_error)
		.pipe(gulp.dest(files.dist.js))
		.pipe(connect.reload());
});

// html components dist remove
gulp.task('rm_html_components_dist', function() {
	return del(['dist/app/**/*.html']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
});

// html components build
gulp.task('html_components_build', function() {
	return gulp.src('src/app/**/*.jade')
		.pipe(jade({
			locals: files.build.root,
			pretty: true
		}))
		.on('error', on_error)
		.pipe(gulp.dest(files.build.js))
		.pipe(connect.reload());
});

// html components build remove
gulp.task('rm_html_components_build', function() {
	return del(['build/app/**/*.html']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
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
		.on('error', on_error)
		.pipe(gulp.dest(files.build.js));
});

// js build remove
gulp.task('rm_js_build', function() {
	return del(['build/*.js']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
});

// sass build
gulp.task('sass_build', function() {
	return sass(files.src.sass, {
		loadPath: [files.src.sass]
	})
	.pipe(gulp_concat(files.build.js))
	.pipe(gulp_rename('main.css'))
	.on('error', on_error)
	.pipe(gulp.dest(files.build.css));
});

// css build remove
gulp.task('rm_sass_build', function() {
	return del(['build/*.css']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
});

// image build
gulp.task('image_build', function () {
	return gulp.src(files.src.imgs)
		.pipe(image())
		.on('error', on_error)
		.pipe(gulp.dest(files.build.imgs));
});

// image build remove
gulp.task('rm_image_build', function() {
	return del(['build/imgs/*.{jpg,jpeg,gif,png}']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
});

// image dist
gulp.task('image_dist', function () {
	return gulp.src(files.src.imgs)
		.pipe(image())
		.on('error', on_error)
		.pipe(gulp.dest(files.dist.imgs));
});

// image dist remove
gulp.task('rm_image_dist', function() {
	return del(['dist/imgs/*.{jpg,jpeg,gif,png}']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
});

// fonts dist
gulp.task('fonts_dist', function () {
	gulp.src(files.src.fonts)
		.on('error', on_error)
		.pipe(gulp.dest(files.dist.fonts));

	gulp.src(files.src.fonts_bower)
		.on('error', on_error)
		.pipe(gulp.dest(files.dist.fonts));	
});

// fonts dist remove
gulp.task('rm_fonts_dist', function() {
	return del(['dist/fonts/*.{ttf,eot,woff,woff2,svg}']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
});

// fonts build
gulp.task('fonts_build', function () {
	gulp.src(files.src.fonts)
		.on('error', on_error)
		.pipe(gulp.dest(files.build.fonts));

	gulp.src(files.src.fonts_bower)
		.on('error', on_error)
		.pipe(gulp.dest(files.build.fonts));	
});

// fonts build remove
gulp.task('rm_fonts_build', function() {
	return del(['build/fonts/*.{ttf,eot,woff,woff2,svg}']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
});

// json build
gulp.task('json_build', function () {
	return gulp.src(files.src.json)
		.on('error', on_error)
		.pipe(gulp.dest(files.build.json));
});

// json build remove
gulp.task('rm_json_build', function() {
	return del(['build/json/*.json']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
});

// json dist
gulp.task('json_dist', function () {
	return gulp.src(files.src.json)
		.on('error', on_error)
		.pipe(gulp.dest(files.dist.json));
});

// json dist remove
gulp.task('rm_json_dist', function() {
	return del(['dist/json/*.json']).then(paths => {
		console.log('Arquivos e diretorios removidos:\n', paths.join('\n'));
	});
});

// connect build
gulp.task('connect_build', function () {
	connect.server({
		name: 'Application',
		root: ['build'],
		port: 8000,
		livereload: true,
		fallback: 'build/index.html'
	});
});

// connect dist
gulp.task('connect_dist', function () {
	connect.server({
		name: 'Application',
		root: ['dist'],
		port: 8000,
		livereload: true,
		fallback: 'dist/index.html'
	});
});

gulp.task('clear_cache', function (done) {
	return cache.clearAll(done);
});

gulp.task('reload', function (done) {
	return gulp
			.src(files.src.jade)
			.pipe(connect.reload());
});

// watch build
gulp.task('stream', function(callback) {
	// javascripts
	gulp_watch(
	files.src.js,
	function() {
		runSequence(
			'rm_js_build',
			'js_build',
			'clear_cache',
			'reload'
		);
	});

	// sass
	gulp_watch(
	files.src.sass,
	function() {
		runSequence(
			'rm_sass_build',
			'sass_build',
			'clear_cache',
			'reload'
		);
	});

	// jade templates
	gulp_watch(
	files.src.jade,
	function() {
		runSequence(
			'rm_html_build',
			'html_build',
			'rm_html_components_build',
			'html_components_build',
			'clear_cache',
			'reload'
		);
	});

	// imgs
	gulp_watch(
	files.src.imgs,
	function() {
		runSequence(
			'rm_image_build',
			'image_build',
			'clear_cache',
			'reload'
		);
	});

	// fonts
	gulp_watch(
	files.src.fonts,
	function() {
		runSequence(
			'rm_fonts_build',
			'fonts_build',
			'clear_cache',
			'reload'
		);
	});

	// fonts bower
	gulp_watch(
	files.src.fonts_bower,
	function() {
		runSequence(
			'rm_fonts_build',
			'fonts_build',
			'clear_cache',
			'reload'
		);
	});

	// json bower
	gulp_watch(
	files.src.json,
	function() {
		runSequence(
			'rm_json_build',
			'json_build',
			'clear_cache',
			'reload'
		);
	});
});

// watch dist
gulp.task('callback', function(callback) {
	// javascripts
	gulp_watch(
	files.src.js,
	function() {
		runSequence(
			'rm_js_dist',
			'js_dist',
			'clear_cache',
			'reload'
		);
	});

	// sass
	gulp_watch(
	files.src.sass,
	function() {
		runSequence(
			'rm_sass_dist',
			'sass_dist',
			'clear_cache',
			'reload'
		);
	});

	// jade templates
	gulp_watch(
	files.src.jade,
	function() {
		runSequence(
			'rm_html_dist',
			'html_dist',
			'rm_html_components_dist',
			'html_components_dist',
			'clear_cache',
			'reload'
		);
	});

	// imgs
	gulp_watch(
	files.src.imgs,
	function() {
		runSequence(
			'rm_image_dist',
			'image_dist',
			'clear_cache',
			'reload'
		);
	});

	// fonts
	gulp_watch(
	files.src.fonts,
	function() {
		runSequence(
			'rm_fonts_dist',
			'fonts_dist',
			'clear_cache',
			'reload'
		);
	});

	// fonts bower
	gulp_watch(
	files.src.fonts_bower,
	function() {
		runSequence(
			'rm_fonts_dist',
			'fonts_dist',
			'clear_cache',
			'reload'
		);
	});

	// json bower
	gulp_watch(
	files.src.json,
	function() {
		runSequence(
			'rm_json_dist',
			'json_dist',
			'clear_cache',
			'reload'
		);
	});

});

gulp.task(
'default',
function(callback){
	runSequence(
		'js_build',
		'sass_build',
		'html_build',
		'html_components_build',
		'image_build',
		'fonts_build',
		'json_build',
		'connect_build',
		'stream'
	);
});

gulp.task(
'prod',
function(callback){
	runSequence(
		'js_dist',
		'sass_dist',
		'html_dist',
		'html_components_dist',
		'image_dist',
		'fonts_dist',
		'json_dist',
		'connect_dist',
		'callback'
	);
});