#!/usr/bin/make -f

APP_ROOT=$(CURDIR)/app
APP_URL=http://EXAMPLE.dev

BUILD_LOGS_DIR=$(CURDIR)/build/logs

PHPCS_FOLDERS=$(CURDIR)/app/modules/custom
PHPCS_EXTENSIONS=php,module,inc,install,test,profile,theme

CONFIG_DIR=$(CURDIR)/config-export
CONFIG_DELETE=$(CURDIR)/drush/config-delete.yml
CONFIG_IGNORE=$(CURDIR)/drush/config-ignore.yml
CONFIG_INSTALL=$(CURDIR)/config-install
CONFIG_SKIP_MODULES=devel

list:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1n}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

build: sql-drop sync updb entity-updates import cache-rebuild

init:
	composer install --prefer-dist --no-progress
	npm install --loglevel silent

init-local: init
	cp $(APP_ROOT)/sites/example.settings.local.php $(APP_ROOT)/sites/default/settings.local.php

mkdirs:
	mkdir -p $(APP_ROOT)/sites/default/files/tmp $(APP_ROOT)/sites/default/private build/logs/{simpletest,behat}

sql-drop:
	drush -r $(APP_ROOT) sql-drop -y

updb:
	drush -r $(APP_ROOT) updb -y

entity-updates:
	drush -r $(APP_ROOT) entity-updates -y

cache-rebuild:
	drush -r $(APP_ROOT) cr

styleguide:
	./node_modules/.bin/gulp build

sync:
	skpr exec dev "drush sql-dump |gzip > /tmp/db.sql.gz" && skpr rsync dev:/tmp/db.sql.gz . && gunzip db.sql.gz -f && drush -r $(APP_ROOT) sql-cli < db.sql

import:
	drush -r $(APP_ROOT) cimy -y --skip-modules=$(CONFIG_SKIP_MODULES) --source=$(CONFIG_DIR) --install=$(CONFIG_INSTALL) --delete-list=$(CONFIG_DELETE)

export:
	drush -r $(APP_ROOT) cexy -y --skip-modules=$(CONFIG_SKIP_MODULES) --destination=$(CONFIG_DIR) --ignore-list=$(CONFIG_IGNORE)

fix-php:
	./bin/phpcbf --report=full --standard=vendor/drupal/coder/coder_sniffer/Drupal/ruleset.xml --extensions=$(PHPCS_EXTENSIONS) $(PHPCS_FOLDERS)

lint-php:
	./bin/phpcs --report=full --standard=vendor/drupal/coder/coder_sniffer/Drupal/ruleset.xml --extensions=$(PHPCS_EXTENSIONS) $(PHPCS_FOLDERS)

line-sass-js:
	./node_modules/.bin/gulp lint:with-fail

ci-phpcs: ci-prepare
	rm -rf $(BUILD_LOGS_DIR)/checkstyle.xml
	./bin/phpcs --report=checkstyle --report-file=$(BUILD_LOGS_DIR)/checkstyle.xml --standard=vendor/drupal/coder/coder_sniffer/Drupal/ruleset.xml --extensions=$(PHPCS_EXTENSIONS) $(PHPCS_FOLDERS)

ci-prepare:
	mkdir -p $(BUILD_LOGS_DIR)

ci-test:
	mkdir -p app/sites/simpletest
	export SIMPLETEST_BASE_URL="http://127.0.0.1";export SIMPLETEST_DB="mysql://drupal:drupal@localhost/local";./bin/phpunit -c app/core app/modules/custom --log-junit build/logs/phpunit/phpunit.xml

test:
	export BROWSERTEST_OUTPUT_FILE="/vagrant/app/test-output.html";export SIMPLETEST_BASE_URL=$(APP_URL);export SIMPLETEST_DB="mysql://root:@localhost/d8_testing";./bin/phpunit -c app/core $(APP_ROOT)/modules/custom/$(folder);cat $(APP_ROOT)/test-output.html;echo "" > $(APP_ROOT)/test-output.html

test-init:
	touch $(APP_ROOT)/test-output.html;
	chmod 777 $(APP_ROOT)/test-output.html;
	echo "create database d8_testing;" | sudo mysql

login:
	drush uli --uri=$(APP_URL)

.PHONY: list build init mkdirs sql-drop updb entity-updates cache-rebuild styleguide sync import export phpcbf phpcs ci-phpcs ci-prepare ci-test test test-init login
