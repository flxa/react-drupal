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
$ make
```
