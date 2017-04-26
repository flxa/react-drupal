#!/usr/bin/make -f

APP_ROOT=$(CURDIR)/app
APP_URL=http://APP_NAME.dev

BUILD_LOGS_DIR=$(CURDIR)/build/logs

PHPCS_FOLDERS=$(CURDIR)/app/modules/custom
PHPCS_EXTENSIONS=php,module,inc,install,test,profile,theme

CONFIG_DIR=$(CURDIR)/config-export
CONFIG_DELETE=$(CURDIR)/drush/config-delete.yml
CONFIG_IGNORE=$(CURDIR)/drush/config-ignore.yml
CONFIG_INSTALL=$(CURDIR)/config-install
CONFIG_SKIP_MODULES=devel

ARCH=$(shell uname -m)
PHANTOMJS_DIR=$(HOME)/.phantomjs
PHANTOMJS_BIN=$(HOME)/.phantomjs/phantomjs-2.1.1-linux-$(ARCH)/bin/phantomjs

DRUSH=$(CURDIR)/bin/drush -r $(APP_ROOT)

list:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1n}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

build: sql-drop db-sync deploy login

deploy: updb entity-updates import cache-rebuild

init:
	composer install --prefer-dist --no-progress
	yarn

init-local: init styleguide-init styleguide
	cp $(APP_ROOT)/sites/example.settings.local.php $(APP_ROOT)/sites/default/settings.local.php

mkdirs:
	mkdir -p $(APP_ROOT)/sites/default/files/tmp $(APP_ROOT)/sites/default/private build/logs/simpletest

sql-drop:
	$(DRUSH) sql-drop -y

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
	./node_modules/.bin/gulp build

db-sync:
	skpr exec dev "bin/drush sql-dump |gzip > /tmp/db.sql.gz" && skpr rsync dev:/tmp/db.sql.gz . && gunzip db.sql.gz -f && $(DRUSH) sql-cli < db.sql

import:
	$(DRUSH) cimy -y --skip-modules=$(CONFIG_SKIP_MODULES) --source=$(CONFIG_DIR) --install=$(CONFIG_INSTALL) --delete-list=$(CONFIG_DELETE)

export:
	$(DRUSH) cexy -y --skip-modules=$(CONFIG_SKIP_MODULES) --destination=$(CONFIG_DIR) --ignore-list=$(CONFIG_IGNORE)

fix-php:
	./bin/phpcbf --report=full --standard=vendor/drupal/coder/coder_sniffer/Drupal/ruleset.xml --extensions=$(PHPCS_EXTENSIONS) $(PHPCS_FOLDERS)

lint-php:
	./bin/phpcs --report=full --standard=vendor/drupal/coder/coder_sniffer/Drupal/ruleset.xml --extensions=$(PHPCS_EXTENSIONS) $(PHPCS_FOLDERS)

lint-sass-js:
	./node_modules/.bin/gulp lint:with-fail

ci-lint-php: ci-prepare
	rm -rf $(BUILD_LOGS_DIR)/checkstyle.xml
	./bin/phpcs --report=checkstyle --report-file=$(BUILD_LOGS_DIR)/checkstyle.xml --standard=vendor/drupal/coder/coder_sniffer/Drupal/ruleset.xml --extensions=$(PHPCS_EXTENSIONS) $(PHPCS_FOLDERS)

ci-prepare:
	mkdir -p $(BUILD_LOGS_DIR)

test-ci:
	mkdir -p $(APP_ROOT)/sites/simpletest
	-export SIMPLETEST_BASE_URL="http://127.0.0.1";export SIMPLETEST_DB="mysql://drupal:drupal@localhost/local";./bin/phpunit -c app/core app/modules/custom --log-junit $(BUILD_LOGS_DIR)/phpunit/phpunit.xml
	killall phantomjs

ci-test: phantomjs test-ci phantomjs-stop

test:
	export BROWSERTEST_OUTPUT_FILE="/vagrant/app/test-output.html";export SIMPLETEST_BASE_URL=$(APP_URL);export SIMPLETEST_DB="mysql://root:@localhost/d8_testing";./bin/phpunit -c app/core $(APP_ROOT)/modules/custom/$(folder);cat $(APP_ROOT)/test-output.html;echo "" > $(APP_ROOT)/test-output.html

test-init:
	touch $(APP_ROOT)/test-output.html;
	chmod 777 $(APP_ROOT)/test-output.html;
	echo "create database d8_testing;" | sudo mysql

phantomjs: phantomjs-stop phantom-init
	${PHANTOMJS_BIN} --ssl-protocol=any --ignore-ssl-errors=true ${CURDIR}/vendor/jcalderonzumba/gastonjs/src/Client/main.js 8510 1024 768 2>&1 >> /dev/null &
	ps axo pid,command | grep phantomjs | grep -v grep | grep -v make

phantom-init:
	if [ ! -d ${PHANTOMJS_DIR} ]; then mkdir -p ${PHANTOMJS_DIR}; wget --no-check-certificate https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-$(ARCH).tar.bz2 -O ${PHANTOMJS_DIR}/phantomjs-2.1.1-linux-x86_64.tar.bz2; tar -xvf ${PHANTOMJS_DIR}/phantomjs-2.1.1-linux-x86_64.tar.bz2 -C ${PHANTOMJS_DIR}; else echo "PhantomJS already exists"; fi

phantomjs-stop:
  # Terminate all the phantomjs and php instances so that we can start fresh.
	ps axo pid,command | grep phantomjs | grep -v grep | grep -v make | awk '{print $$1}' | xargs -I {} kill {}
	ps axo pid,command | grep php | grep -v grep | grep -v phpstorm | grep -v make | awk '{print $$1}' | xargs -I {} kill {}

login:
	$(DRUSH) uli --uri=$(APP_URL)

.PHONY: list build init mkdirs sql-drop updb entity-updates cache-rebuild styleguide db-sync import export phpcbf phpcs ci-lint-php ci-prepare ci-test test test-init login
