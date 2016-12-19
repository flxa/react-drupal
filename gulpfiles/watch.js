/**
 * @file
 * Watch task runners.
 */

'use strict';

import gulp from 'gulp';

import config from './config';
import * as styles from './styles';
import * as clean from './clean';
import * as lint from './lint';
import * as sg from './styleguide';
import * as browsersync from './browsersync';

// Files to watch for changes.
let watchFiles = {
  sass: [
    config.sass.src + '/**/*.scss',
    // Don't watch the styleguide sass files, these are watched by the styleguide task.
    '!' + config.sass.src + '/style-guide/**/*.scss'
  ],

  js: config.js.src + '/**/*.js',

  styleguide: [
    config.sass.src + '/**/*.twig',
    config.sass.src + '/style-guide/**/*.scss',
    config.sass.src + '/style-guide/**/*.md',
  ]
}

// Watch options.
let watchOptions = {
  // This is required for watching to work inside vagrant.
  usePolling: true
}

/**
 * Watch sass files.
 *
 * Rather than doing a full reload of browserSync, the sass watcher will inject
 * CSS (see styles:development inside styles.js). This is a compromise
 * so you can get instant soft-refreshes to see changes to CSS rapidly. However
 * if you make changes to styleguide comments inside a sass file, browserSync
 * won't automatically reload even though the html has changed. You'll need
 * to manually reload in those cases.
 */
const sass = function(e) {
  gulp.watch(watchFiles.sass, watchOptions, gulp.series('styles:development', 'styleguide', 'lint:sass'));
}

sass.description = 'Watch scss files and rebuild styles and the styleguide, with linting.';
gulp.task('watch:sass', sass);

/**
 * Watch js files.
 *
 * Reload browserSync automatically after a change to a js file.
 */
const js = function(e) {
  gulp.watch(watchFiles.js, watchOptions, gulp.series('lint:js', 'browsersync:reload'));
};

js.description = 'Watch js files and lint them.';
gulp.task('watch:js', js);

/**
 * Watch styleguide twig/sass files.
 *
 * Reload browserSync automatically after a change to a twig file.
 */
const styleguide = function(e) {
  gulp.watch(watchFiles.styleguide, watchOptions, gulp.series('styleguide', 'browsersync:reload'));
};

styleguide.description = 'Watch twig files and rebuild the styleguide.';
gulp.task('watch:styleguide', styleguide);

/**
 * Watch all.
 */
const watch = gulp.series('styles:development', 'styleguide', 'browsersync:init', 'lint', gulp.parallel('watch:sass', 'watch:js', 'watch:styleguide'));
watch.description = 'Watch styles, js and styleguide files and rebuild as needed on change.';
gulp.task('watch', watch);

// Export all functions.
export { sass, js, styleguide, watch };
