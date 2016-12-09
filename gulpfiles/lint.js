/**
 * @file
 * Lints CSS and JS.
 */

'use strict';

import gulp from 'gulp';
import sassLint from 'gulp-sass-lint';
import eslint from 'gulp-eslint';

import config from './config';

// We want to lint all the js files provided in gulpfile.yml and any js files
// that might live inside sass components.
let jsSrc = [
  config.sass.src,
  ...config.js.src
];
// Create a new array to exclude any files that might already be minified.
let jsMin = jsSrc.map(f => '!' + f + '/**/*.min.js');
// Now we can add the js files glob into the original array.
jsSrc = jsSrc.map(f => f + '/**/*.js');

// The actual files to lint (or ignore).
let lintFiles = {
  js: [
    // Combine the jsSrc and jsMin arrays to give us the full list of js files
    // to lint and minified files to ignore.
    ...jsSrc,
    ...jsMin
  ],

  sass: [
    config.sass.src + '/**/*.scss'
  ]
}

/**
 * Lint JS.
 */
const js = function() {
  return gulp.src(lintFiles.js)
    .pipe(eslint())
    .pipe(eslint.format());
};

js.description = 'Lints all JS src files.';
gulp.task('lint:js', js);

/**
 * Lint JS (with fail).
 */
const jsWithFail = function() {
  return gulp.src(lintFiles.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
};

jsWithFail.description = 'Lints all JS src files, and fail on an error.';
gulp.task('lint:js-with-fail', jsWithFail);

/**
 * Lint Sass.
 */
const sass = function() {
  return gulp.src(lintFiles.sass)
    .pipe(sassLint())
    .pipe(sassLint.format());
};

sass.description = 'Lints all Sass src files.';
gulp.task('lint:sass', sass);

/**
 * Lint Sass (with fail).
 */
const sassWithFail = function() {
  return gulp.src(lintFiles.sass)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
};

sassWithFail.description = 'Lints all Sass src files, and fail on an error.';
gulp.task('lint:sass-with-fail', sassWithFail);

/**
 * Run both linters in series.
 */
const lint = gulp.series('lint:sass', 'lint:js');
lint.description = 'Lint Sass and JS.';
gulp.task('lint', lint);

/**
 * Run both linters in series (with fail).
 */
const lintWithFail = gulp.series('lint:sass-with-fail', 'lint:js-with-fail');
lintWithFail.description = 'Lint Sass and JS, and fail on an error.';
gulp.task('lint:with-fail', lintWithFail);

// Export all functions.
export { js, jsWithFail, sass, sassWithFail, lint, lintWithFail };
