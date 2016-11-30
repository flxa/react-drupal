#!/usr/bin/env bash

# Initialise a new project, renaming placeholders to the project name.

TPLT_FILES="app/sites/default/* .skpr.yml .pnxci.yml"

# Default to the current directory name.
APP_NAME=${PWD##*/}

echo "Using APP_NAME:" $APP_NAME

for var in $TPLT_FILES ; do
  echo Updating $var
  sed -i '' -e "s/APP_NAME/$APP_NAME/g" $var
done
