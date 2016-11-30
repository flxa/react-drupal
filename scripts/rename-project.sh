#!/usr/bin/env bash

# Initialise a new project, renaming placeholders to the project name.
# Default to the current directory name.
APP_NAME=$1
TEMPLATE_FILES="app/sites/default/* .skpr.yml .pnxci.yml gulpfile.js package.json app/themes/APP_NAME_theme/* npm-shrinkwrap.json"

echo "Using APP_NAME:" $APP_NAME

find $TEMPLATE_FILES -type f -exec sed -i '' -e "s/APP_NAME/$APP_NAME/g {} \;

mv app/themes/APP_NAME_theme app/themes/${APP_NAME}_theme
