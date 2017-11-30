/**
 * @file
 * Adds rollup.js and babel to the mix.
 */

import gulp from 'gulp';
import size from 'gulp-size';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import rollup from 'gulp-rollup-each';
import rollupBabel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import path from 'path';

import config from './config';
import * as modernizr from './modernizr';
import * as clean from './clean';

// The js files we need to bundle.
const bundleFiles = [
  `${config.js.src}/**/src/*.es6.js`,
  `${config.js.modules}/**/js/src/*.es6.js`,
];

// Any js files that don't get bundled still need transpiling.
const transpileFiles = [
  `${config.js.src}/**/*.es6.js`,
  `${config.js.modules}/**/*.es6.js`,
  // Ignore already minified files.
  `!${config.js.src}/**/*.min.js`,
  `!${config.js.modules}/**/*.min.js`,
  // Ignore bundle files
  `!${config.js.src}/**/src/*.es6.js`,
  `!${config.js.modules}/**/src/*.es6.js`,
  `!${config.js.src}/**/*.bundle.js`,
  `!${config.js.modules}/**/*.bundle.js`,
];

// Theme js files we are minifying.
const minifyFiles = [
  `${config.js.src}/**/*.bundle.js`,
];

// Module js files to minify (dest is same as src)
const moduleFiles = [
  `${config.js.modules}/**/*.bundle.js`,
];

/**
 * Filename for bundle task.
 * @return {object} file
 */
const bundleName = (file) => {
  file.dirname = file.dirname.replace(/\/src$/, '');
  file.basename = file.basename.replace('.es6', '');
  file.extname = '.bundle.js';
  return file;
};

/**
 * Filename for minify task.
 * @return {object} file
 */
const minifyName = (file) => {
  file.basename = file.basename.replace('.bundle', '');
  file.extname = '.min.js';
  return file;
};

/**
 * Bundle import scripts.
 * Only needs to run on files utilising ES6 imports.
 * @return {object} bundleJs
 */
const bundle = () => (
  gulp.src(bundleFiles, { base: './' })
    .pipe(rollup({
      plugins: [
        resolve(),
        commonjs(),
        rollupBabel({
          presets: [['env', {
            modules: false,
            useBuiltIns: true,
            targets: { browsers: config.browsers.js },
          }]],
          babelrc: false,
          plugins: ['external-helpers'],
        }),
      ],
    }, (file) => {
      const thisFile = bundleName(file);
      return {
        format: 'umd',
        name: path.basename(thisFile.path),
      };
    }))
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest('./'))
);

bundle.description = 'Bundle javascript modules.';
gulp.task('scripts:bundle', bundle);

/**
 * Transpile
 * Keeps an original in the src and adds the bundle file to the src.
 * @return {object} transpile
 */
const transpile = () => (
  gulp.src(transpileFiles, { base: './' })
    .pipe(babel())
    .pipe(rename(file => (bundleName(file))))
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest('./'))
);

transpile.description = 'Transpile javascript.';
gulp.task('scripts:transpile', transpile);

/**
 * Transpile and minify
 * Keeps an original in the src and adds the minified file to dest.
 * @return {object} minify
 */
const minify = () => (
  gulp.src(minifyFiles)
    .pipe(uglify())
    .pipe(rename(file => (minifyName(file))))
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest(config.js.dest))
);

minify.description = 'Minify theme javascript.';
gulp.task('scripts:minify', gulp.series('clean:js', minify, 'modernizr'));

/**
 * Minify a modules JS.
 * Keeps an original in the src and adds the minified file to the src.
 * @return {object} minifyModule
 */
const minifyModule = () => (
  gulp.src(moduleFiles, { base: './' })
    .pipe(uglify())
    .pipe(rename(file => (minifyName(file))))
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest('./'))
);

minifyModule.description = 'Minify module javascript.';
gulp.task('scripts:module', minifyModule);

/**
 * Development JS.
 * Runs both without minification for easier debugging.
 * @return {object} themeDev
 */
const minifyDev = () => (
  gulp.src(minifyFiles)
    .pipe(rename(file => (minifyName(file))))
    .pipe(gulp.dest(config.js.dest))
);

minifyDev.description = 'Dev-minify javascript.';
gulp.task('scripts:minify-dev', gulp.series('clean:js', minifyDev));

/**
 * Development module JS.
 * Runs both without minification for easier debugging.
 */
const minifyModuleDev = () => (
  gulp.src(moduleFiles, { base: './' })
    .pipe(rename(file => (minifyName(file))))
    .pipe(gulp.dest('./'))
);

minifyModuleDev.description = 'Dev-minify module javascript.';
gulp.task('scripts:module-dev', minifyModuleDev);

/**
 * Run both production scripts in series.
 */
const babelify = gulp.parallel('scripts:bundle', 'scripts:transpile');
babelify.description = 'Transpile all js.';
gulp.task('scripts:babel', babelify);

/**
 * Run both production scripts in series.
 */
const scripts = gulp.series('scripts:babel', gulp.parallel('scripts:minify', 'scripts:module'));
scripts.description = 'Bundle, transpile and minify production js.';
gulp.task('scripts:production', scripts);

/**
 * Run both development scripts in series.
 */
const scriptsDev = gulp.series('scripts:babel', gulp.parallel('scripts:minify-dev', 'scripts:module-dev'));
scriptsDev.description = 'Bundle and transpile development js.';
gulp.task('scripts:development', scriptsDev);

// Export all functions.
export { scripts, scriptsDev, bundle, transpile, minify, minifyDev, minifyModule, minifyModuleDev };
