APP_NAME
===========

**Maintainer**: Name

**Site**: http://www.example.com

**Environments**
* **QA** - http://APP_NAME.qa.previousnext.com.au
* **Staging** - http://APP_NAME.staging.previousnext.com.au
* **Prod** - TBD

## Local Development

Local development is run via Docker Compose.

Documentation for this approach is documented in a series of blog posts.

- [How our services talk to each other](https://www.previousnext.com.au/blog/composing-docker-local-development-networking)
- [How Xdebug works in OSX](https://www.previousnext.com.au/blog/composing-docker-local-development-xdebug-osx)

### Install storybook

```bash
nvm install
npm i -g @storybook/cli
npm install
npm run storybook
```

### Install React App

```bash
npm install
npm start
```
