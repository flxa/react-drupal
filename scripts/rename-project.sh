#!/usr/bin/env bash

# Initialise a new project, renaming placeholders to the project name.
# Default to the current directory name.
APP_NAME=$1
TEMPLATE_FILES="app/sites/default/* .skpr.yml .pnxci.yml gulpfile.js package.json app/themes/APP_NAME_theme/*.yml npm-shrinkwrap.json"

# String replace APP_NAME in templates.
echo "Using APP_NAME:" $APP_NAME
find $TEMPLATE_FILES -type f -exec sed -i '' -e "s/APP_NAME/$APP_NAME/g" {} \;

# Rename theme files
mv app/themes/APP_NAME_theme/APP_NAME_theme.breakpoints.yml app/themes/APP_NAME_theme/${APP_NAME}_theme.breakpoints.yml
mv app/themes/APP_NAME_theme/APP_NAME_theme.info.yml app/themes/APP_NAME_theme/${APP_NAME}_theme.info.yml
mv app/themes/APP_NAME_theme/APP_NAME_theme.libraries.yml app/themes/APP_NAME_theme/${APP_NAME}_theme.libraries.yml
mv app/themes/APP_NAME_theme app/themes/${APP_NAME}_theme
