/**
 * @file
 * Adds Webpack to the mix.
 */

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
import * as modernizr from './modernizr';
import * as clean from './clean';

// The js files we need to package.
const webpackFiles = [
  `${config.js.src}/**/src/*.es6.js`,
  `${config.modules}/**/js/src/*.es6.js`,
];

// Theme js files we are minifying.
const jsFiles = [
  `${config.js.src}/**/*.es6.js`,
  `${config.js.src}/**/*.bundle.js`,
  // Ignore already minified files.
  `!${config.js.src}/**/*.min.js`,
  // Ignore webpack src files
  `!${config.js.src}/**/src/*.js`,
];

// Module js files to minify (dest is same as src)
const moduleFiles = [
  `${config.js.modules}/**/*.es6.js`,
  // Ignore already minified files.
  `!${config.js.modules}/**/*.min.js`,
  // Ignore webpack src files
  `!${config.js.modules}/**/src/*.js`,
];

// Helper function for the minified filename.
const filename = function (file) {
  file.basename = file.basename.replace('.es6', '').replace('.bundle', '');
  file.extname = '.min.js';
};

/*
 * Package import scripts.
 * Only needs to run on files utilising ES6 imports.
 */
const webpackPackage = () => (
  gulp.src(webpackFiles, { base: './' })
    .pipe(named(function (file) {
      const dirname = path.dirname(file.relative).replace(/\/src$/, '');
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
          query: { presets: ['env'] },
        }],
      },
    }, webpack))
    .pipe(gulp.dest('./'))
);

webpackPackage.description = 'Package webpack javascript.';
gulp.task('scripts:package', webpackPackage);

/**
 * Transpile and minify
 * Keeps an original in the src and adds the minified file to dest.
 * @return {object} themeJs
 */
const themeJs = () => (
  gulp.src(jsFiles)
    .pipe(babel({ presets: ['env'] }))
    .pipe(uglify())
    .pipe(rename(file => (filename(file))))
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest(config.js.dest))
);

themeJs.description = 'Minify and transpile theme javascript.';
gulp.task('scripts:theme', gulp.series('clean:js', themeJs, 'modernizr'));

/**
 * Minify a modules JS.
 * Keeps an original in the src and adds the minified file to the src.
 * @return {object} moduleJs
 */
const moduleJs = () => (
  gulp.src(moduleFiles, { base: './' })
    .pipe(babel({ presets: ['env'] }))
    .pipe(uglify())
    .pipe(rename(file => (filename(file))))
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest('./'))
);

moduleJs.description = 'Minify and transpile module javascript.';
gulp.task('scripts:module', moduleJs);

/**
 * Development JS.
 * Runs both without minification for easier debugging.
 * @return {object} themeDev
 */
const themeDev = () => (
  gulp.src(jsFiles)
    .pipe(babel({ presets: ['env'] }))
    .pipe(rename(file => (filename(file))))
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest(config.js.dest))
);

themeDev.description = 'Transpile theme javascript.';
gulp.task('scripts:theme-dev', gulp.series('scripts:package', themeDev));

/**
 * Development module JS.
 * Runs both without minification for easier debugging.
 */
const moduleDev = () => (
  gulp.src(moduleFiles, { base: './' })
    .pipe(babel({ presets: ['env'] }))
    .pipe(rename(file => (filename(file))))
    .pipe(gulp.dest('./'))
);

moduleDev.description = 'Transpile module javascript.';
gulp.task('scripts:module-dev', moduleDev);

/**
 * Run both production scripts in series.
 */
const scripts = gulp.series('scripts:package', 'scripts:theme', 'scripts:module');
scripts.description = 'Package, transpile and minify production js.';
gulp.task('scripts:production', scripts);

/**
 * Run both development scripts in series.
 */
const scriptsDev = gulp.series('scripts:package', 'scripts:theme-dev', 'scripts:module-dev');
scriptsDev.description = 'Package and transpile development js.';
gulp.task('scripts:development', scriptsDev);

// Export all functions.
export { scripts, scriptsDev, webpackPackage, themeJs, themeDev, moduleJs, moduleDev };
