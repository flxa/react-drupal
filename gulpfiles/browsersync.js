/**
 * @file
 * Adds Browsersync to the mix.
 */

import gulp from 'gulp';
import browserSync from 'browser-sync';

import config from './config';

/**
 * Start Browsersync.
 * @param {function} done - Callback
 */
const init = (done) => {
  browserSync.init({
    proxy: config.developmentUrl,
    host: config.developmentUrl,
    open: false,
  });
  done();
};

init.description = 'Start Browsersync.';
gulp.task('browsersync:init', init);

/**
 * Reload Browsersync.
 * @param {function} done - Callback
 */
const reload = (done) => {
  browserSync.reload();
  done();
};

reload.description = 'Reload Browsersync.';
gulp.task('browsersync:reload', reload);
