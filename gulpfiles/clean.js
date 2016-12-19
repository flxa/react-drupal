/**
 * @file
 * Handles cleaning various dirs.
 */

'use strict';

import gulp from 'gulp';
import del from 'del';

import config from './config';

// Define the globs to delete (or leave alone).
let cleanFiles = {
  css: [
    config.sass.dest + '/**/*.css',
    config.sass.dest + '/**/*.map',
    // Don't delete styleguide css files as these are handled by the styleguide cleaner.
    '!' + config.sass.dest + '/style-guide/**/*.css'
  ],

  styleguide: [
    config.styleguide.dest + '/*.html',
    config.styleguide.dest + '/kss-assets',
    config.sass.dest + '/style-guide',
  ]
}

/**
 * Clean the SASS destination directory, except styleguide styles.
 */
const css = function() {
  return del(cleanFiles.css, { force: true });
};

css.description = 'Clean the SASS destination directory.';
gulp.task('clean:css', css);

/**
 * Clean the styleguide directory and remove any related styleguide files.
 */
const styleguide = function() {
  return del(cleanFiles.styleguide, { force: true });
};

styleguide.description = 'Clean the styleguide directory and remove any related styleguide files.';
gulp.task('clean:styleguide', styleguide);

// Export all functions.
export { css, styleguide };