#!/usr/bin/env bash

# Initialise a new project, renaming placeholders to the project name.
# Default to the current directory name.
APP_NAME=$1
TEMPLATE_FILES="app/sites/default/* .skpr.yml .pnxci.yml gulpfile.js package.json"

echo "Using APP_NAME:" $APP_NAME

for var in $TEMPLATE_FILES ; do
  echo Updating $var
  sed -i '' -e "s/APP_NAME/$APP_NAME/g" $var
done
