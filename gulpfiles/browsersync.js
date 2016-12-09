/**
 * @file
 * Adds Browsersync to the mix.
 */

'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';

import config from './config';

/**
 * Start Browsersync.
 */
const init = function(done) {
  browserSync.init({
      proxy: config.developmentUrl,
      host: config.developmentUrl,
      open: false
  });
  done();
}

init.description = 'Start Browsersync.';
gulp.task('browsersync:init', init);

/**
 * Reload Browsersync.
 */
const reload = function(done) {
  browserSync.reload();
  done();
}

reload.description = 'Reload Browsersync.';
gulp.task('browsersync:reload', reload);
