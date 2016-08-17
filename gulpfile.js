var gulp = require('gulp');
var gulp_concat = require('gulp-concat');
var gulp_rename = require('gulp-rename');
var gulp_uglify = require('gulp-uglify');
var gulp_watch = require('gulp-watch');
var sass = require('gulp-ruby-sass');
var main_bower_files = require('main-bower-files');

var files = {
	src: {
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
		js: 'build/js',
		css: 'build/css'
	}
}

gulp.task('stream', function () {
	return gulp_watch([
		files.src.js,
		files.src.sass,
		files.src.html
	],
	function() {
		var js_files_concat = main_bower_files();
		js_files_concat = js_files_concat.concat([
			files.src.js
		]);

		// javascripts
		gulp.src(js_files_concat)
			.pipe(gulp_concat(files.dist.js))
			.pipe(gulp_rename('build.js'))
			.pipe(gulp.dest(files.build.js));

		// stylesheet
		sass(files.src.sass, {
            loadPath: [files.src.sass]
        })
        .pipe(gulp_concat(files.build.js))
		.pipe(gulp_rename('build.css'))
        .pipe(gulp.dest(files.build.css))

		// index.html
		gulp.src('src/index.html')
			.pipe(gulp.dest(files.build.root));
	},{ ignoreInitial: false });
});


gulp.task('callback', function () {
	return gulp_watch([
		files.src.js,
		files.src.sass,
		files.src.html
	],
	function () {
		var js_files_concat = main_bower_files();
		js_files_concat = js_files_concat.concat([
			files.src.js
		]);
		// javascripts
		console.log('Compilando JS ;)');
		gulp.src(js_files_concat)
			.pipe(gulp_concat(files.dist.js))
			.pipe(gulp_rename('dist.min.js'))
			.pipe(gulp_uglify())
			.pipe(gulp.dest(files.dist.js));

		// stylesheet
		console.log('Compilando Sass ;)');
		sass(files.src.sass, {
            style: 'compressed',
            loadPath: [files.src.sass]
        })
        .pipe(gulp_concat(files.dist.js))
		.pipe(gulp_rename('dist.min.css'))
        .pipe(gulp.dest(files.dist.css));

        // index.html
        console.log('Copiando o index.html ;)');
		gulp.src('src/index.html')
			.pipe(gulp.dest(files.dist.root));
	});
});

gulp.task('default', ['stream', 'callback']);