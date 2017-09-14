APP_NAME
===========

**Maintainer**: Name

**Site**: http://www.example.com

**Environments**
* **QA** - http://APP_NAME.qa.previousnext.com.au
* **Staging** - http://APP_NAME.staging.previousnext.com.au
* **Prod** - TBD

## Important

Important project notes go here...

## Local Development

Local development is run via Docker Compose.

Documentation for this approach is documented in a series of blog posts.

- [How our services talk to each other](https://www.previousnext.com.au/blog/composing-docker-local-development-networking)
- [How Xdebug works in OSX](https://www.previousnext.com.au/blog/composing-docker-local-development-xdebug-osx)

### Install dependencies

```bash
# Uses the default make target.
$ make init
$ make build
```

### Front-end workflow

- [Setup and documentation](docs/front-end.md)
- Build the styleguide

```bash
$ make styleguide
```

### Git Hooks

To utilise the default pre-commit hooks, run the following command:

```
git config core.hooksPath .git-hooks
```
