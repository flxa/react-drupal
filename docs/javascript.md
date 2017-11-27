## Javascript

### Summary

Javascript should be written using ES6 (ECMAScript 2015) specification, following the [Airbnb Javascript](https://github.com/airbnb/javascript) approach and coding standards.

### Linting

All theme and custom module javascript will be linted based on the Airbnb ESLint npm package, which has been adopted by Drupal core as of 8.4.x

### Minification and Drupal

All javascript files will be minified regardless of Drupal aggregation. The original unminified version will remain at it's source, and should be used for active development.

When adding a minified JS file as a library you should use the `minified: true` flag.

```
js/components/header/header.min.js: { minified: true }
```

For a theme component or module JS file, that is included on the page conditionally, the `preprocess: false` flag should also be used.

```
js/components/gallery/gallery.min.js: { minified: true, preprocess: false }
```

### Naming convention

Also in accordance with 8.4.x, is the naming convention of suffixing `.es6.js` to all files written in the ES6 spec. Only files with this suffix will be linted and tranpiled.

Legacy ES5 JS files can be kept alongside their ES6 versions for as long as needed. They will not be linted, so will not trigger a build failure.

### Separation of Drupal from component JS

Where appropriate (when theming), javascript widgets should be generic so as to be portable and easy to used outside of Drupal. This means having two files for a component:

```
component.drupal.es6.js
component.es6.js
```

Anything Drupal specific like behaviours and drupalSettings should be kept to the `component.drupal.es6.js` file, which calls the function from `component.es6.js`, passing in any required arguments. The [PNX chatbot component](https://github.com/previousnext/pnx-d8/tree/master/app/themes/previousnext_d8_theme/src/components/chatbot) is a good example of this.

This doesn't apply to custom modules.

### Testing

Coming soon.

### Gulp

See _gulpfile.yml_ `js:src`, `js:modules` and `js:dest` for configuration options of these Gulp tasks.

#### Transpile and Minify (with babel and uglify)

The `gulp scripts:production` task will look for any theme or module files suffixed as `.es6.js` and will transpile and minify them to ES5 for use in the site. Minified files are saved to the theme or modules `/js` directory. This task will first run the `gulp scripts:bundle` / "Bundling (with rollup.js)" task (details below) allowing you to use the ES6 module `import` feature.

Browser support for ES6 isn't great enough to skip this step, so please do not load ES6 files into your site, unless debugging.

_Example input/output:_

```
src/components/header/header.drupal.es6.js
src/components/header/header.es6.js
```
Will go through linting, be transpiled to ES5 and the minified files will be created at destination:
```
js/components/header/header.drupal.min.js
js/components/header/header.min.js
```

Assuming the destination directory is left as the themes /js folder, these files will be git ignored, just like compiled css.

#### Bundling (with rollup.js)

The `gulp scripts:bundle` task will look for any `.es6.js` inside a component or modules `/src` directory and create a `.bundle.js` file outside of it, which combines any ES6 modules used in the src file, as well as transpiling down to ES5. These `.bundle.js` files are then run through the minifying gulp task.

_Example input/output:_

```
src/components/header/src/header.es6.js
src/components/header/src/header.drupal.es6.js
```
Will first go through rollup.js to bundle any modules, be transpiled to ES5 and a new file will be created in the component folder with `.bundle` in it's filename:
```
src/components/header/src/header.es6.js
src/components/header/src/header.drupal.es6.js
src/components/header/header.drupal.bundle.js (NEW, git ignored)
src/components/header/header.bundle.js (NEW, git ignored)
```
Then, everything except the `/src/header.es6.js` will be transpiled to ES5 and the minified files will be created at destination:
```
js/components/header/header.drupal.min.js
js/components/header/header.min.js
```

#### Module javascript

The only difference between a theme components javascript file and a modules javascript file, is the destination of the minified file.

A theme's minified file is created in the themes root `/js` directory. A modules minified file is created in the same directory as the source file (usually also `/js`).

_Example input/output:_

```
modules/custom/toc/js/src/toc.es6.js
modules/custom/toc/js/toc.es6.js
```
Will go through linting and bundling and the minified files will be created in the same folder:
```
modules/custom/toc/js/src/toc.es6.js
modules/custom/toc/js/toc.bundle.js (NEW, git ignored)
modules/custom/toc/js/toc.bundle.min.js (NEW, git ignored)
modules/custom/toc/js/toc.min.js (NEW, git ignored)
```

### Watching and debugging

The default `gulp watch` task will include watching for changes in any theme or module js file, and run the `gulp scripts:development` gulp task on them. The only difference between development and production javascript is the development script doesn't minify the output and has less console output. It's still names the file `.min.js` but this is only to avoid having to change file being loaded into pages.

So you should use `gulp watch` during active theme or module development.
