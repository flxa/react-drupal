/**
 * @file
 * Adds Webpack to the mix.
 */

'use strict';

import gulp from 'gulp';
import size from 'gulp-size';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import named from 'vinyl-named';
import path from 'path';

import config from './config';

// The js files we are minifying.
let jsFiles = [
  config.js.es6 + '/**/*.es6.js',
  config.js.es6 + '/**/*.bundle.js',
  // Ignore already minified files.
  '!' + config.js.es6 + '/**/*.min.js',
  // Ignore webpack src files
  '!' + config.js.es6 + '/**/src/*.js',
];

// The js files we need to package.
let webpackFiles = [
  config.js.es6 + '/**/src/*.es6.js',
];

/*
 * Package import scripts.
 * Only needs to run on files utilising ES6 imports.
 */
const webpackPackage = function() {
  return gulp.src(webpackFiles)
    .pipe(named(function(file) {
      const dirname = path.dirname(file.relative).replace('/src', '');
      const basename = path.basename(file.path, path.extname(file.path)).replace('.es6', '');
      file.named = path.join(dirname, basename);
      this.queue(file);
    }))
    .pipe(gulpWebpack({
      output: {
        filename: '[name].bundle.js',
      },
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: { presets: ['es2015'] },
        }],
      },
    }, webpack))
    .pipe(gulp.dest(config.js.es6));
};

webpackPackage.description = 'Package webpack javascript.';
gulp.task('scripts:package', webpackPackage);

/**
 * Transpile and minify
 * Keeps an original in the src and adds the minified file to dest.
 */
const minify = function() {
  return gulp.src(jsFiles)
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify())
    .pipe(rename(function (file) {
      file.basename = file.basename.replace('.es6', '').replace('.bundle', '');
      file.extname = '.min.js';
    }))
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest(config.js.dest));
};

minify.description = 'Minify and transpile ES6 javascript.';
gulp.task('scripts:minify', minify);

/**
 * Development JS.
 * Runs both without minification for easier debugging.
 */
const minifyDev = function() {
  return gulp.src(jsFiles)
    .pipe(babel({presets: ['es2015']}))
    .pipe(rename(function (file) {
      file.basename = file.basename.replace('.es6', '').replace('.bundle', '');
      file.extname = '.min.js';
    }))
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest(config.js.dest));
};

minifyDev.description = 'Minify javascript.';
gulp.task('scripts:development', gulp.series('scripts:package', minifyDev));

/**
 * Run both scripts in series.
 */
const scripts = gulp.series('scripts:package', 'scripts:minify');
scripts.description = 'Package and minify ES6 js.';
gulp.task('scripts', scripts);

// Export all functions.
export { minify, webPackage, minifyDev, scripts };
