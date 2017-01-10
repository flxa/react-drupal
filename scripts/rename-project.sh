#!/usr/bin/env bash

# Initialise a new project, renaming placeholders to the project name.
# Default to the current directory name.
APP_NAME=$1

TEMPLATE_FILES=".skpr.yml .pnxci.yml gulpfile.yml package.json npm-shrinkwrap.json README.md Vagrantfile app/sites/default/* app/themes/APP_NAME_theme/*.yml app/profiles/APP_NAME_profile/* "

# String replace APP_NAME in templates.
echo "Using APP_NAME:" $APP_NAME
find $TEMPLATE_FILES -type f -exec sed -i '' -e "s/APP_NAME/$APP_NAME/g" {} \;

# Rename profile files
mv app/profiles/APP_NAME_profile/APP_NAME_profile.install app/themes/APP_NAME_profile/${APP_NAME}_profile.install
mv app/profiles/APP_NAME_profile/APP_NAME_profile.info.yml app/themes/APP_NAME_profile/${APP_NAME}_profile.info.yml
mv app/profiles/APP_NAME_profile/APP_NAME_profile.post_update.php app/themes/APP_NAME_profile/${APP_NAME}_profile.post_update.php
mv app/profiles/APP_NAME_profile app/profiles/${APP_NAME}_profile

# Rename theme files
mv app/themes/APP_NAME_theme/APP_NAME_theme.breakpoints.yml app/themes/APP_NAME_theme/${APP_NAME}_theme.breakpoints.yml
mv app/themes/APP_NAME_theme/APP_NAME_theme.info.yml app/themes/APP_NAME_theme/${APP_NAME}_theme.info.yml
mv app/themes/APP_NAME_theme/APP_NAME_theme.libraries.yml app/themes/APP_NAME_theme/${APP_NAME}_theme.libraries.yml
mv app/themes/APP_NAME_theme app/themes/${APP_NAME}_theme
