## Javascript

### Summary

Javascript should be written using ES6 (ECMAScript 2015) specification, following the [Airbnb Javascript](https://github.com/airbnb/javascript) approach and coding standards.

### Linting

All theme and custom module javascript will be linted based on the Airbnb ESLint npm package, which has been adopted by Drupal core as of 8.4.x

### Minification and debugging

All javascript files will be minified regardless of Drupal aggregation. The original unminified version will remain at it's source, and should be used for active development and debugging.

### Naming convention

Also in accordance with 8.4.x, is the naming convention of suffixing `.es6.js` to all files written in the ES6 spec. Only files with this suffix will be linted and tranpiled.

Legacy ES5 js files can be kept alongside their ES6 versions for as long as needed. They will not be linted, so will not trigger a build failure.

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

### Gulp (theme only)

See _gulpfile.yml_ `js:es6` and `js:dest` for configuation options of these Gulp tasks.

#### Transpile and Minify (with babel and uglify)

The `gulp scripts:minify` task will look for any theme files suffixed as `.es6.js` and will transpile and minify them to ES5 for use in the site. Minified files are saved to the themes `/js` directory. This task is not intended to package ES6 modules, so refer to the below `gulp scripts:package` / "Packaging (with webpack)" instructions if you want to use the ES6 module `import` feature.

Browser support for ES6 isn't great enough to skip this step, so please do not load ES6 files into your site, unless debugging.

**Example input/output:**

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

#### Packaging (with webpack)

The `gulp scripts:package` task will look for any `.es6.js` inside a components `/src` directory and create a `.bundle.js` file inside your component, which combines any ES6 modules used in the src file, as well as transpiling down to ES5. These `.bundle.js` files also get minified and saved in the themes `/js` directory.

**Example input/output:**

```
src/components/header/src/header.es6.js
src/components/header/src/header.drupal.es6.js
```
Will first go through webpack to bundle any modules, be transpiled to ES5 and a new file will be created in the component folder with `.bundle` in it's filename:
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

### Gulp (custom modules)

Coming soon.
