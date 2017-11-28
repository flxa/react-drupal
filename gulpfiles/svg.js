/**
 * @file
 * Minimize and combine svgs into sprites.
 */

import gulp from 'gulp';
import size from 'gulp-size';
import merge from 'merge-stream';
import svgmin from 'gulp-svgmin';
import svgSprite from 'gulp-svg-sprite';

import config from './config';

// Glob for svg files to minify.
let svgoFiles = config.svg.svgo.src.map(p => `${p}/**/*.svg`);

// Exclude all outputted sprite files as they will error svgo.
svgoFiles = Object.keys(config.svg.sprites).map(key => (
  `!${config.svg.sprites[key].dest}/${config.svg.sprites[key].config.mode.symbol.sprite}`
));

// gulp-svgmin needs its plugin config provided in comma separated objects.
// @see https://github.com/ben-eb/gulp-svgmin
const svgoPlugins = Object.keys(config.svg.svgo.plugins).map((key) => {
  const plugin = {};
  plugin[key] = config.svg.svgo.plugins[key];
  return plugin;
});

/**
 * Use SVGO to minify svg files.
 * @return {object} svgo
 */
const svgo = (done) => {
  gulp.src(svgoFiles, { base: './' })
    .pipe(size({ title: 'Original size:', showFiles: true, showTotal: false }))
    .pipe(svgmin({ plugins: svgoPlugins }))
    .pipe(size({ title: 'Minified size:', showFiles: true, showTotal: false }))
    .pipe(gulp.dest('./'));
  done();
};

svgo.description = 'Minify SVG files with svgo (src SVG files are overwritten).';
gulp.task('svg:svgo', svgo);

/**
 * Combine SVG files into sprites.
 * @return {object} svgSprites
 */
const svgSprites = () => {
  // We need to return a combination of the below streams.
  // Loop over the sprite config and run a seperate stream for each one.
  const streams = Object.keys(config.svg.sprites).map((key) => {
    const sprite = config.svg.sprites[key];
    return gulp.src(`${sprite.src}/*.svg`)
      .pipe(svgSprite(sprite.config))
      .pipe(size({ title: 'Sprite size:', showFiles: true, showTotal: false }))
      .pipe(gulp.dest(sprite.dest));
  });
  // Use merge-stream to combine the streams to return.
  return merge(...streams);
};

svgSprites.description = 'Combine SVG files into sprites (without minification).';
gulp.task('svg:sprites', svgSprites);

/**
 * Minify svgs and build sprites.
 */
const svg = gulp.series('svg:svgo', 'svg:sprites');
svg.description = 'Minify svgs and build sprites.';
gulp.task('svg', svg);
