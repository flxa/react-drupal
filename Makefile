#!/usr/bin/make -f

APP_ROOT=./app
APP_URL=http://APP_NAME.dev

BUILD_LOGS_DIR=./build/logs

PHPCS_FOLDERS=./app/modules/custom
PHPCS_EXTENSIONS=php,module,inc,install,test,profile,theme

CONFIG_DIR=$(CURDIR)/config-export
CONFIG_DELETE=$(CURDIR)/drush/config-delete.yml
CONFIG_IGNORE=$(CURDIR)/drush/config-ignore.yml
CONFIG_INSTALL=$(CURDIR)/config-install

DRUSH=./bin/drush -r $(APP_ROOT) -l $(APP_URL)
GULP=./node_modules/.bin/gulp
COMPOSER=composer
YARN=yarn
PHPCBF=./bin/phpcbf
PHPCS=./bin/phpcs

.DEFAULT_GOAL := list

default: list;
	
list:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1n}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

build: sql-drop db-sync deploy login

deploy: updb entity-updates import cache-rebuild

init:
	$(COMPOSER) install --prefer-dist --no-progress --no-suggest --no-interaction --optimize-autoloader
	$(YARN) install --non-interactive --no-progress

init-package:
	$(COMPOSER) install --no-dev --prefer-dist --no-progress --no-suggest --no-interaction --optimize-autoloader
	$(YARN) install --non-interactive --no-progress

init-local: init
	cp $(APP_ROOT)/sites/example.settings.local.php $(APP_ROOT)/sites/default/settings.local.php

mkdirs:
	mkdir -p $(APP_ROOT)/sites/default/files/tmp $(APP_ROOT)/sites/default/private build/logs/simpletest

sql-drop:
	$(DRUSH) sql-drop -y

db-dump:
	mkdir mariadb-init
	$(DRUSH) sql-dump > mariadb-init/db.sql

updb:
	$(DRUSH) updb -y

entity-updates:
	$(DRUSH) entity-updates -y

cache-rebuild:
	$(DRUSH) cr

styleguide-init:
	curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
	. ~/.bashrc
	nvm install
	npm rebuild node-sass

styleguide:
	$(GULP) build

db-sync:
	skpr exec dev "drush sql-dump --gzip | base64" | base64 -di > /tmp/db.sql.gz
	gunzip /tmp/db.sql.gz -f
	$(DRUSH) sql-cli < /tmp/db.sql

config-import:
	$(DRUSH) cimy -y --source=$(CONFIG_DIR) --install=$(CONFIG_INSTALL) --delete-list=$(CONFIG_DELETE)

config-export:
	$(DRUSH) cexy -y --destination=$(CONFIG_DIR) --ignore-list=$(CONFIG_IGNORE)

fix-php:
	$(PHPCBF) --report=full --standard=vendor/drupal/coder/coder_sniffer/Drupal/ruleset.xml --extensions=$(PHPCS_EXTENSIONS) $(PHPCS_FOLDERS)

lint-php: psalm
	$(PHPCS) --report=full --standard=vendor/drupal/coder/coder_sniffer/Drupal/ruleset.xml --extensions=$(PHPCS_EXTENSIONS) $(PHPCS_FOLDERS)

psalm:
	./bin/psalm --show-info=0

lint-sass-js:
	$(GULP) lint:with-fail

ci-lint-php: ci-prepare psalm
	rm -rf $(BUILD_LOGS_DIR)/checkstyle.xml
	./bin/phpcs --report=checkstyle --report-file=$(BUILD_LOGS_DIR)/checkstyle.xml --standard=vendor/drupal/coder/coder_sniffer/Drupal/ruleset.xml --extensions=$(PHPCS_EXTENSIONS) $(PHPCS_FOLDERS)

ci-prepare:
	mkdir -p $(BUILD_LOGS_DIR)

ci-test:
	mkdir -p $(APP_ROOT)/sites/simpletest
	-./bin/phpunit -c app/core app/modules/custom --log-junit $(BUILD_LOGS_DIR)/phpunit/phpunit.xml

test:
	./bin/phpunit -c app/core $(APP_ROOT)/modules/custom/$(folder);cat $(APP_ROOT)/test-output.html;echo "" > $(APP_ROOT)/test-output.html

test-init:
	touch $(APP_ROOT)/test-output.html;
	chmod 777 $(APP_ROOT)/test-output.html;
	echo "create database d8_testing;" | sudo mysql

login:
	$(DRUSH) uli

.PHONY: list build init mkdirs sql-drop updb entity-updates cache-rebuild styleguide db-sync config-import config-export phpcbf phpcs ci-lint-php ci-prepare test test-init login default
