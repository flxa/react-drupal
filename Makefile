#!/usr/bin/make -f

APP_ROOT=./app
APP_URL=http://127.0.0.1

BUILD_LOGS_DIR=./build/logs

CONFIG_DIR=$(CURDIR)/config-export
CONFIG_DELETE=$(CURDIR)/drush/config-delete.yml
CONFIG_IGNORE=$(CURDIR)/drush/config-ignore.yml
CONFIG_INSTALL=$(CURDIR)/config-install

DRUSH=./bin/drush -r $(APP_ROOT) -l $(APP_URL)
GULP=node --max-old-space-size=512 ./node_modules/.bin/gulp
COMPOSER=composer
YARN=yarn
PHPCBF=./bin/phpcbf
PHPCS=./bin/phpcs

.DEFAULT_GOAL := list

default: list;

list:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1n}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

build: db-drop db-sync deploy login

deploy: updb entity-updates config-import cache-rebuild

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

db-drop:
	$(DRUSH) sql:drop -y

updb:
	$(DRUSH) updatedb -y

entity-updates:
	$(DRUSH) entity:updates -y

cache-rebuild:
	$(DRUSH) cache:rebuild

styleguide:
	$(GULP) build

db-dump:
	$(DRUSH) sql:dump --structure-tables-key=common --skip-tables-key=common > db.sql

db-pull:
	skpr exec dev "$(DRUSH) sql:dump --structure-tables-key=common --skip-tables-key=common" > db.sql

db-import:
	$(DRUSH) sql:cli < db.sql

db-sync: db-pull db-import

config-import:
	$(DRUSH) config-import-plus -y --source=$(CONFIG_DIR) --install=$(CONFIG_INSTALL) --delete-list=$(CONFIG_DELETE)

config-export:
	$(DRUSH) config-export-plus -y --destination=$(CONFIG_DIR) --ignore-list=$(CONFIG_IGNORE)

fix-php:
	$(PHPCBF)

lint-php: psalm
	$(PHPCS)

psalm:
	./bin/psalm --show-info=0

lint-sass-js:
	$(GULP) lint:with-fail

ci-lint-php: ci-init psalm
	rm -rf $(BUILD_LOGS_DIR)/checkstyle.xml
	./bin/phpcs --report=checkstyle --report-file=$(BUILD_LOGS_DIR)/checkstyle.xml

test-init:
	mkdir -p $(APP_ROOT)/sites/simpletest $(APP_ROOT)/sites/default/files/simpletest
	chmod 2775 $(APP_ROOT)/sites/simpletest $(APP_ROOT)/sites/default/files/simpletest
	touch $(APP_ROOT)/test-output.html;
	chmod 775 $(APP_ROOT)/test-output.html;
	chown -R www-data:www-data $(APP_ROOT)

test:
	./bin/phpunit --stop-on-fail $(APP_ROOT)/modules/custom/$(folder)

ci-init: init test-init

ci-test:
	./bin/phpunit --log-junit $(BUILD_LOGS_DIR)/phpunit/phpunit.xml

login:
	$(DRUSH) user:login

patchy:
	echo '[PATCHY] Update composer dependencies\n\n' > /tmp/message.txt
	composer install --prefer-dist --no-interaction --no-progress --no-suggest
	composer show > /tmp/before.txt
	composer update --with-dependencies --prefer-dist --no-interaction --no-progress --no-suggest
	composer show > /tmp/after.txt
	git diff -U0 --word-diff --no-index -- /tmp/before.txt /tmp/after.txt | grep -v ^@@ | tail -n +5 >> /tmp/message.txt
	git add composer.json composer.lock
	git commit -F /tmp/message.txt
	$(DRUSH) updatedb -y
	$(DRUSH) entity:updates -y
	$(DRUSH) config-export-plus -y --destination=$(CONFIG_DIR) --ignore-list=$(CONFIG_IGNORE)
	git add config-export
	git commit -m "[PATCHY] Update config"

check-expire:
	./scripts/check-expire.sh

sql-drop: db-drop
	echo "WARNING: 'sql-drop' is deprecated. Use db-drop instead"

import: config-import
	echo "WARNING: 'import' is deprecated. Use config-import instead"

.PHONY: list build init mkdirs sql-drop updb entity-updates cache-rebuild styleguide db-sync config-import config-export phpcbf phpcs ci-lint-php ci-prepare ci-test test test-init login default patchy

