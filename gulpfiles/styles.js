/**
 * @file
 * Handles outputting CSS for development and production.
 */

'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import sourcemaps from 'gulp-sourcemaps';
import eyeglass from 'eyeglass';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import size from 'gulp-size';

import config from './config';

// The scss files we are compiling.
let sassFiles = [
  config.sass.src + '/**/*.scss',
  // Ignore partials.
  '!' + config.sass.src + '/**/_*.scss',
  // Ignore styleguide sass files.
  '!' + config.sass.src + '/style-guide/**/*.scss',
]

/**
 * Outputs CSS and sourcemaps.
 */
const development = function() {
  return gulp.src(sassFiles)
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(sass(eyeglass(config.sassOptions)).on('error', sass.logError))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.sass.dest))
    .pipe(browserSync.stream({ match: '**/*.css' }));
};

development.description = 'Output CSS and sourcemaps for development use only.';
gulp.task('styles:development', development);

/**
 * Outputs CSS only.
 */
const production = function() {
  return gulp.src(sassFiles)
    .pipe(sassGlob())
    .pipe(sass(eyeglass(config.sassOptions)).on('error', sass.logError))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest(config.sass.dest));
};

production.description = 'Outputs CSS ready for production.';
gulp.task('styles:production', production);

// Export all functions.
export { development, production };
