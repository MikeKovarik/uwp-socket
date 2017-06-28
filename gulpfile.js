var gulp = require('gulp')
var watch = require('gulp-watch')
var sourcemaps = require('gulp-sourcemaps')
var rollup = require('gulp-better-rollup')
var babel = require('rollup-plugin-babel')
var pkg = require('./package.json')


var rollupOptions = {
	entry: 'lib/UwpSocket.js',
	plugins: [babel()],
	external: ['buffer', 'stream'],
	globals: {
		buffer: 'buffer',
		stream: 'stream',
	}
}

gulp.task('dev', function() {
	gulp.src('lib/*.js')
		.pipe(watch('lib/*.js'))
		.pipe(rollup(rollupOptions, 'umd'))
		.pipe(gulp.dest('dist'))
})

gulp.task('build', function() {
	gulp.src('lib/UwpSocket.js')
		.pipe(sourcemaps.init())
		.pipe(rollup(rollupOptions, [{
			dest: pkg['jsnext:main'],
			format: 'es',
		}, {
			dest: pkg['main'],
			format: 'umd',
		}]))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest('dist'))
})

gulp.task('default', ['dev'])