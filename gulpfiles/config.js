/**
 * @file
 * Handles importing gulpfile.yml and sets up global config.
 */

import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
let config = {};

try {
  // At this stage we are only using one gulpfile.yml.
  // If the need arises to have developer overrides for gulp config we can do this.
  config = yaml.safeLoad(fs.readFileSync('gulpfile.yml', 'utf8'), { json: true });

  // node-sass / eyeglass global config.
  // This is used by styles and styleguide.
  config.sassOptions = {
    includePaths: [
      config.sass.src,
    ],
    // We are using the standard expanded style for outputting all CSS.
    outputStyle: 'expanded',
    eyeglass: {
      // This is a little hacky and not entirely great however it's the best we
      // can do with the current asset management in eyeglass. All assets will get
      // an absolute path prefixed to them.
      httpRoot: `/${path.relative(config.httpRoot, config.sass.src)}`,
      assets: {
        // Add assets except for js, sass, and twig files.
        // The url passed to the sass asset-url() function should be relative to this directory.
        sources: [
          { directory: config.sass.src, globOpts: { ignore: ['**/*.js', '**/*.scss', '**/*.twig'] } },
        ],
      },
    },
  };
}
catch (e) {
  console.log('gulpfile.yml not found!');
}

export default config;
