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

## Getting started

1. Spin up a local VM environment

```bash
$ vagrant up
```

2. From here on all **COMMANDS ARE INSIDE THE VM**

```bash
$ vagrant ssh
```

3. Install dependencies

```bash
# Uses the default make target.
$ make init
$ make build
$ make styleguide
```

## Docker for Local Development

In order to use Docker for local development, you will need Docker for Mac Beta 17.05 or above from the
[Edge Channel][1]. This version supports the cached volume strategy which makes performance for Drupal
acceptable.

### Running

You can spin up a local environment with the following command:

` docker-compose up -d`

### Drupal settings

You will need to change the host name of the database in `settings.php` to what is specified in
 `docker-compose.yml` (e.g. mariadb instead of localhost).

### Make

You will need to prefix any commands you want to run with `docker-compose exec php`. For example:

`docker-compose exec php make init`

You can add a bash alias on your host to make this shorter. E.g.

`alias de='docker-compose exec php'`

so the command becomes:

`de make init`

### Browsing the site

The docker site will be avaiable on [http://127.0.0.1/](http://127.0.0.1/)

You can only have one project running at a time.

[1]: https://docs.docker.com/docker-for-mac/install/
