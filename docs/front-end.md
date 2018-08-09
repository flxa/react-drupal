## Front end workflow

### Summary

The front end workflow goes as so:

- **npm**, manages all our dependencies.
- **storybook** builds the styleguide.
- **babel** and **Webpack** are used to transpile and bundle ES6 js.
- **pnx.ci** needs to be set up to run npm start when building the project serverside.

The following files are included in your root folder:

- **package.json** - Specifies the Node.js modules needed for the Gulp tasks and the KSS style guide.
- **yarn.lock** - This file locks specific versions of Node.js modules so that all developers on the project are using the exact same versions.
- **gulpfile.yml** - Not used but needs to be converted to config for webpack.
- **/gulfiles** - Organised gulp tasks that utilise the Gulp configuration. You should only need to edit these files to add something new.
- **.sass-lint.yml** - Sass isn't included yet but will possibly be at a later stage.
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
$ npm install
```

New modules can be added with:

```bash
$ npm install [package] --save
```

After installing any new packages, ensure you commit the updated _package-lock.json_ file.

### Testing for accessibility

There is an addon for storybook that has been installed, Click on the Accessibility tab to see tests and results for the individual component.
