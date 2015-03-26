var gulp = require('gulp');

var runSequence = require('run-sequence');
var webserver = require('gulp-webserver');
var babel = require('gulp-babel');
var del = require('del');
var jshint = require('gulp-jshint');

const SRC_ROOT = './src/';
const DIST_ROOT = './dist/';
const DIST_SRC_ROOT = './dist/src/';


/**
 * runs jslint on all javascript files found in the src dir.
 */
gulp.task('lint', function() {
	// Note: To have the process exit with an error code (1) on
	// lint error, return the stream and pipe to failOnError last.
	return gulp.src([
			'./src/js/*.js'
		])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});


/**
 * Install pre-commit hook for app.
 */
gulp.task('pre-commit', function() {
	return gulp.src(['./pre-commit'])
		.pipe(gulp.dest('.git/hooks/'));
});


/**
 * Setup steps after an npm install.
 */
gulp.task('install', ['copy-app', 'pre-commit']);


/**
 * Copy all non-js directory app source/assets/components.
 */
gulp.task('copy-app', function() {
	return gulp.src([
			SRC_ROOT + '**',
			'!' + SRC_ROOT + 'js/*.js' // do not copy js
		])
		.pipe(gulp.dest(DIST_SRC_ROOT));
});


/**
 * converts javascript to es5. this allows us to use harmony classes and modules.
 */
gulp.task('babel', function() {
	var files = [
		SRC_ROOT + 'js/*.js',
	];
	try {
		return gulp.src(files)
			.pipe(babel({
				modules: 'amd'
			}).on('error', function(e) {
				console.log('error running babel', e);
			}))
			.pipe(gulp.dest(DIST_SRC_ROOT + 'js/'));
	} catch (e) {
		console.log('Got error in babel', e);
	}
});


/**
 * Packages the application into a zip.
 */
gulp.task('zip', function() {
	return gulp.src(DIST_SRC_ROOT)
		.pipe(zip('app.zip'))
		.pipe(gulp.dest(DIST_ROOT));
});


/**
 * Runs travis tests
 */
gulp.task('travis', ['lint', 'babel']);


/**
 * Build the app.
 */
gulp.task('build', function(cb) {
	runSequence(['clobber'], ['copy-app'], ['babel', 'lint' ], cb);
});


/**
 * Watch for changes on the file system, and rebuild if so.
 */
gulp.task('watch', function() {
	gulp.watch([SRC_ROOT + '**'], ['build']);
});


gulp.task('webserver', function() {
	gulp.src('dist/src')
		.pipe(webserver({
			port: process.env.PORT || 8000,
			host: process.env.HOST || 'localhost',
			livereload: false,
			directoryListing: false,
			open: false
		}));
});


/**
 * The default task when `gulp` is run.
 * Adds a listener which will re-build on a file save.
 */
gulp.task('default', function() {
	runSequence('build', 'webserver', 'watch');
});

/**
 * Remove the distributable files.
 */
gulp.task('clobber', function(cb) {
	del('dist/', cb);
});

/**
 * Cleans all created files by this gulpfile, and node_modules.
 */
gulp.task('clean', function(cb) {
	del([
		'dist/',
		'node_modules/'
	], cb);
});
