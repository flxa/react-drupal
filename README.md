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

Choose between a Vagrant VM or Docker compose container.

- [Vagrant setup](docs/vm-vagrant.md)
- [Docker setup](docs/vm-docker.md)

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
