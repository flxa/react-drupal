/**
 * @file
 * Builds the styleguide using KSS.
 */

'use strict';

import gulp from 'gulp';
import path from 'path';
import kss from 'kss';
import sass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import eyeglass from 'eyeglass';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import replace from 'gulp-replace';

import config from './config';
import * as clean from './clean';

// Ensure CSS paths are relative to the styleguide. Unless they are external.
let cssFiles = [];
if (config.styleguide.cssFiles) {
  cssFiles = config.styleguide.cssFiles.map(c => c.startsWith('http') ? c : path.relative(config.styleguide.dest, c));
}

// Ensure JS paths are relative to the styleguide. Unless they are external.
let jsFiles = [];
if (config.styleguide.jsFiles) {
  jsFiles = config.styleguide.jsFiles.map(j => j.startsWith('http') ? j : path.relative(config.styleguide.dest, j));
}

// Kss config.
let kssOptions = {
  source: [
    config.sass.src,
    config.sass.dest + '/style-guide/'
  ],
  destination: config.styleguide.dest,
  builder: config.styleguide.builder,
  css: cssFiles,
  js: jsFiles,
  homepage: 'homepage.md',
  title: config.styleguide.title,
  namespace: config.theme + ':' + config.sass.src,
  'extend-drupal8': true
};

// The Kss scss files to compile.
let kssSassFiles = [
  config.sass.src + '/style-guide/**/*.scss',
  '!' + config.sass.src + '/style-guide/chroma-kss-markup.scss'
];

/**
 * Outputs Styleguide CSS.
 */
const styles = function() {
  return gulp.src(kssSassFiles)
    .pipe(sassGlob())
    .pipe(sass(eyeglass(config.sassOptions)).on('error', sass.logError))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulp.dest(config.sass.dest + '/style-guide'));
};

styles.description = 'Compiles sass/style-guide.';
gulp.task('styleguide:styles', styles);

/**
 * Outputs Chroma KSS Markup.
 */
const chromaKssMarkup = function() {
  return gulp.src(config.sass.src + '/style-guide/chroma-kss-markup.scss')
    .pipe(sass(eyeglass(config.sassOptions)).on('error', sass.logError))
    .pipe(replace(/(\/\*|\*\/)\n/g, ''))
    .pipe(rename('chroma-kss-markup.twig'))
    .pipe(gulp.dest(config.sass.dest + '/style-guide'));
};

chromaKssMarkup.description = 'Compiles Chroma KSS markup.';
gulp.task('styleguide:chroma-kss-markup', chromaKssMarkup);

/**
 * Outputs the styleguide.
 */
const build = function() {
  return kss(kssOptions);
}

build.description = 'Builds the style guide.';
gulp.task('styleguide:build', build);

/**
 * Run all styleguide tasks in the correct order.
 */
const styleguide = gulp.series('clean:styleguide', 'styleguide:chroma-kss-markup', gulp.parallel('styleguide:styles', 'styleguide:build'));
styleguide.description = 'Builds the style guide and compiles sass/styleguide and Chroma markup.';
gulp.task('styleguide', styleguide);

// Export all functions.
export { styles, chromaKssMarkup, build, styleguide };
