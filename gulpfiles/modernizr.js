/**
 * @file
 * Builds a custom version of modernizr based on the options we are actually using.
 */

import gulp from 'gulp';
import size from 'gulp-size';
import modernizr from 'gulp-modernizr';
import uglify from 'gulp-uglify';

import config from './config';

// Files to look within.
const modernizrFiles = [
  `${config.sass.src}/**/*.scss`,
  `${config.js.src}/**/*.js`,
  `${config.js.module}/**/*.js`,
];

// Some hackyness to output a minified modernizr.
const modernizrDest = config.modernizr.dest;
delete config.modernizr.dest;

/**
 * Build the custom version.
 * @return {object} build
 */
const build = (done) => (
  gulp.src(modernizrFiles)
    .pipe(modernizr('modernizr.min.js', config.modernizr))
    .pipe(uglify())
    .pipe(size({ title: 'Final size:', showFiles: true, showTotal: false }))
    .pipe(gulp.dest(modernizrDest));
  done();
);

build.description = 'Build a custom version of modernizr.';
gulp.task('modernizr', build);
