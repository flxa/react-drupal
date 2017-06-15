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

## Vagrant for Local Development

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

### Bash Aliases

The docker-compose files are split based on operating system.

This allows us to do cool things on a "per OS" basis eg. `network_mode: host` for Linux.

Add the following to our bash alias.

**OSX**

```bash
alias docker-compose='docker-compose -f docker-compose.osx.yml'
```

**Linux**

```bash
alias docker-compose='docker-compose -f docker-compose.linux.yml'
```

### Running

You can spin up a local environment with the following command:

` docker-compose up -d`

### Drupal settings

You will need to change the host name of the database in `settings.php` to what is specified in
 `docker-compose.yml` (e.g. mariadb instead of localhost).

### Browsing the site

The docker site will be avaiable on [http://127.0.0.1/](http://127.0.0.1/)

You can only have one project running at a time.

[1]: https://docs.docker.com/docker-for-mac/install/

### Xdebug

**From the browser**

This will work automatically due to the service "xdebug" declared in the docker-composer.yaml.

This will take all xdebug traffic and forward it onto your OSX laptop.

**From the CLI**

Given xdebug is provided no context of which host to send its xdebug data to, you will need to
set the following configuration on the CLI before running 

```bash
export PHP_IDE_CONFIG="serverName=localhost";export XDEBUG_CONFIG="remote_host=192.168.65.1";
```

The IP address 192.168.65.1 is common umongst all Docker for Mac installations
