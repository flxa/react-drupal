/**
 * @file
 * Minimize and combine svgs into sprites.
 */

'use strict';

import gulp from 'gulp';
import size from 'gulp-size';
import merge from 'merge-stream';
import svgmin from 'gulp-svgmin';
import svgSprite from 'gulp-svg-sprite';

import config from './config';

// Glob for svg files to minify.
let svgoFiles = config.svg.svgo.src.map(p => p + '/**/*.svg');

// gulp-svgmin needs its plugin config provided in comma separated objects.
// @see https://github.com/ben-eb/gulp-svgmin
let svgoPlugins = [];
for (let key in config.svg.svgo.plugins) {
  let plugin = {}
  plugin[key] = config.svg.svgo.plugins[key];
  svgoPlugins.push(plugin);
}

/**
 * Use SVGO to minify svg files.
 */
const svgo = function() {
  return gulp.src(svgoFiles, {base: './'})
    .pipe(size({title: 'Original size:', showFiles: true, showTotal: false}))
    .pipe(svgmin({plugins: svgoPlugins}))
    .pipe(size({title: 'Minified size:', showFiles: true, showTotal: false}))
    .pipe(gulp.dest('./'));
}

svgo.description = 'Minify SVG files with svgo (src SVG files are overwritten).';
gulp.task('svg:svgo', svgo);

/**
 * Combine SVG files into sprites.
 */
const svgSprites = function(done) {
  // We need to return a combination of the below streams.
  let streams = [];

  // Loop over the sprite config and run a seperate stream for each one.
  for (let key in config.svg.sprites) {
   let sprite = config.svg.sprites[key];
   let stream = gulp.src(sprite.src + '/*.svg')
     .pipe(svgSprite(sprite.config))
     .pipe(size({title: 'Sprite size:', showFiles: true, showTotal: false}))
     .pipe(gulp.dest(sprite.dest));

   // Add this to our list of streams.
   streams.push(stream);
  }

  // Use merge-stream to combine the streams to return.
  return merge(...streams);
}

svgSprites.description = 'Combine SVG files into sprites (without minification).';
gulp.task('svg:sprites', svgSprites);

/**
 * Minify svgs and build sprites.
 */
const svg = gulp.series('svg:svgo', 'svg:sprites');
svg.description = 'Minify svgs and build sprites.';
gulp.task('svg', svg);
