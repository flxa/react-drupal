/**
 * @file
 * Handles cleaning various dirs.
 */

import gulp from 'gulp';
import cached from 'gulp-cached';
import del from 'del';

import config from './config';

// Define the globs to delete (or leave alone).
const cleanFiles = {
  css: [
    `${config.sass.dest}/**/*.css`,
    `${config.sass.dest}/**/*.map`,
    // Don't delete styleguide css files as these are handled by the styleguide cleaner.
    `!${config.sass.dest}/style-guide/**/*.css`,
  ],

  js: [
    `${config.js.dest}/**/*.min.js`,
    `${config.js.modules}/**/*.min.js`,
    `!${config.js.dest}/**/vendor/*.min.js`,
    `!${config.js.dest}/**/vendor/**/*.min.js`,
    `!${config.js.modules}/**/vendor/*.min.js`,
    `!${config.js.modules}/**/vendor/**/*.min.js`,
  ],

  styleguide: [
    `${config.styleguide.dest}/*.html`,
    `${config.styleguide.dest}/kss-assets`,
    `${config.sass.dest}/style-guide`,
  ],
};

/**
 * Clean the SASS destination directory, except styleguide styles.
 * @return {object} css
 */
const css = () => del(cleanFiles.css, { force: true });

css.description = 'Clean the SASS destination directory.';
gulp.task('clean:css', css);

/**
 * Clean the Minfied JS destination directory, except vendor files.
 * @return {object} js
 */
const js = () => del(cleanFiles.js, { force: true });

js.description = 'Clean the JS destination directory.';
gulp.task('clean:js', js);

/**
 * Clean the styleguide directory and remove any related styleguide files.
 * @return {object} styleguide
 */
const styleguide = () => del(cleanFiles.styleguide, { force: true });

styleguide.description = 'Clean the styleguide directory and remove any related styleguide files.';
gulp.task('clean:styleguide', styleguide);

/**
 * Clean the cache.
 * @return {object} cache
 */
const cache = () => (cached.caches === {});

cache.description = 'Clean the cache.';
gulp.task('clean:cache', cache);

/**
 * Clean everything.
 */
const clean = gulp.series('clean:js', 'clean:css', 'clean:styleguide');
clean.description = 'Clean everything.';
gulp.task('clean', clean);

// Export all functions.
export { css, js, styleguide, cache };
