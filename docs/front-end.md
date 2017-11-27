## Front end workflow

### Summary

The front end workflow goes as so:

- **npm**, manages all our dependencies.
- **node-sass**, using **eyeglass** to include our 3rd party libraries, builds the CSS.
- **kss-node** builds the styleguide.
- **autoprefixer** applies/removes appropriate browser prefixes.
- **sass-lint** and **eslint** lints our CSS and JS.
- **Browsersync** is used for testing and CSS live reloading.
- **gulp** is used to run all the above tasks.
- **babel** and **rollup.js** are used to transpile and bundle ES6 js.
- **pnx.ci** runs gulp when building the project serverside.

The following files are included in your root folder:

- **package.json** - Specifies the Node.js modules needed for the Gulp tasks and the KSS style guide.
- **yarn.lock** - This file locks specific versions of Node.js modules so that all developers on the project are using the exact same versions.
- **gulpfile.yml** - Contains the Gulp configuration.
- **/gulfiles** - Organised gulp tasks that utilise the Gulp configuration. You should only need to edit these files to add something new.
- **gulpfile.babel.js** - Loads all different gulfiles into one and sets the default task.
- **.sass-lint.yml** - Sass linting configuration file
- **.eslintrc.json** - JS linting configuration file
- **.nvmrc** - Specifies the node version required.

### NVM

To ensure you have the correct node version installed we recommended using NVM (Node Version Manager).

```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
$ . ~/.bashrc
$ nvm install
```

### Yarn

To get started, install the required node modules. You can skip this if you have
already run `Make init`

```bash
$ yarn install
```

New modules can be added with:

```bash
$ yarn add [package] --dev
```

After installing any new packages, ensure you commit the updated _yarn.lock_ file.


### Gulp

Gulp is a toolkit that helps us automate painful or time-consuming tasks in our development workflow.

Many of the front-end development tasks are run with gulp. This include compiling Sass and generating a styleguide and are all configured with the _gulpfile.yml_

```bash
$ gulp watch
```

While watching, any changes to _.scss_ files will build the CSS, styleguide, and live reload Browsersync. In addition changes to _.twig_ files will rebuild the styleguide only.

To see a full list of gulp tasks run:

```bash
$ gulp -T
```

**Adding new tasks**

New tasks should follow the [API](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname-deps-fn) (specifically dependencies and async support)

### KSS

[KSS Node](https://www.npmjs.com/package/kss) is a Node.js implementation of Knyle Style Sheets (KSS), "a documentation syntax for CSS" that's intended to have syntax readable by humans and machines.

Using `gulp watch` will build the styleguide and watch for changes in _.scss_ and _.hbs_ files. You can access the styleguide through Browsersync at:

```
http://APP_NAME.dev:3000/styleguide
```

Please refer to the [KSS Node Documentation](https://github.com/kss-node/kss/blob/spec/SPEC.md) for details about how to format your Sass comments.

To include additional Stylesheets or Javascript files in the styleguide;

1. Edit the _gulpfile.yml_
2. Find the `styleguide` section
3. Edit the `styleguide:cssFiles` and `styleguide:jsFiles` paths as required.
4. Re-run `gulp watch` after making changes to _gulpfile.yml_

### Eyeglass

[Eyeglass](https://github.com/src-eyeglass/eyeglass) allows us to install 3rd party Sass libraries via npm and then import these into our stylesheets easily.

First make sure the library you want to use is available on npm and has eyeglass support. Generally there will be an _eyeglass-exports.js_ file to indicate this. Install the package as so:

```bash
$ yarn add [package] --dev
```

Then all you need to do is import the module inside one of /init sass files.

```
@import '<name>';
```

### Browsersync

Browsersync will always be running when using `gulp watch`.

The URL to access BS will popup when you first start watching. Use the _external_ url on your local machine.

```
http://APP_NAME.dev:3000
```

### Tunnel

To access Browsersync on other devices connected to your local network you need to use tunnel.

To get started, grab the latest binary for your machines architecture: https://github.com/previousnext/tunnel/releases

Install by moving to your local bin folder and setting execute permissions.

```bash
mv ~/Downloads/tunnel-darwin-amd64 /usr/local/bin/tunnel
chmod +x /usr/local/bin/tunnel
```

Then in a new terminal window keep the tunnel command running whilst developing.

```bash
sudo tunnel 3000,3001 APP_NAME.dev
```

You can then access BS at http://your-local-ip:3000 on any device connected to your local network.

### Maintaining coding standards

By default Linting is required for all custom Sass and JS files.

Configuration of the linting tools is provided by Scaffold but can be configured;

- **.sass-lint.yml** - Sass linting configuration file
- **.eslintrc.json** - JS linting configuration file

For Javascript specific documentation, see the [Javascript docs](javascript.md)

To exclude 3rd party JS files from being linted:

1. Edit the /gulpfiles/config.js
2. Find the `config.jsFiles` and add a line starting with `!` to exclude it.

**SMACSS, BEM and DRY**

Be sure to follow the [SMACSS](http://smacss.com/) approach to categorisation,
breaking your Sass down into modular components.

As well as the following the basic [BEM](http://bem.info/) naming pattern.

Combined with DRY (don’t repeat yourself) approach to your Sass in general,
will all ensure your theme meets current coding standards.

Because Drupal uses some of these names (ie. blocks and modules)
we are using alternative names. They map to the original as follows:

```
# From SMACSS
module = component
submodule = variant
theme = variant

# From BEM
block = component
modifier = variant
```

### Sass structure and categorisation

Sass files are all compiled into the one _styles.css_ file in the following order:

```
# Outputs as styles.css with everything else included in it.
/src/styles.scss

# Custom variables; edit these first to change presentation.
/src/init/_assets.scss
/src/init/_colors.scss
/src/init/_typography.scss
/src/init/_breakpoints.scss
/src/init/_variables.scss

# Custom mixins.
/src/utils/* (or /src/library/*)

# Base styles; resets, element defaults, fonts, etc.
/src/base/*

# Layouts and grid systems.
/src/layouts/*

# Form fields.
/src/form/*

# Components; independently styled components that can live anywhere in a layout.
/src/components/*
```

### Testing for accessibility

To make sure you aren't creating any accessibility errors it is recommended that you regularly
run your theme through a checker like the [HTML_CodeSniffer](https://squizlabs.github.io/HTML_CodeSniffer/)

Which will review the following (and then some);

- [Colour contrast](http://webaim.org/resources/contrastchecker/)
- Heading hierarchy and [page structure](http://webaim.org/techniques/semanticstructure/)
- Providing alternative text for images and link text on icons
- Ensuring [hidden content is accessible and doesn't create keyboard traps](https://www.previousnext.com.au/blog/so-many-ways-hide)
