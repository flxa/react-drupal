#!/usr/bin/env bash

# Initialise a new project, renaming placeholders to the project name.
# Default to the current directory name.
APP_NAME=$1

TEMPLATE_FILES=".circleci/config.yml \
.pnxci.yml \
.skpr.yml \
.gitignore \
app/profiles/custom/APP_NAME_profile/* \
app/profiles/custom/APP_NAME_profile/config/install/* \
app/sites/default/* \
app/themes/APP_NAME_theme/*.yml \
app/themes/APP_NAME_theme/APP_NAME_theme.theme \
app/themes/APP_NAME_theme/src/init/_asset.scss \
app/themes/APP_NAME_theme/templates/**/*.html.twig \
docs/* \
gulpfile.yml \
Makefile \
package.json \
README.md"

# String replace APP_NAME in templates.
echo "Running find and replace using APP_NAME:" $APP_NAME
find $TEMPLATE_FILES -type f -exec sed -i '' -e "s/APP_NAME/$APP_NAME/g" {} \;

# Rename profile files
mv app/profiles/custom/APP_NAME_profile/APP_NAME_profile.install app/profiles/custom/APP_NAME_profile/${APP_NAME}_profile.install
mv app/profiles/custom/APP_NAME_profile/APP_NAME_profile.info.yml app/profiles/custom/APP_NAME_profile/${APP_NAME}_profile.info.yml
mv app/profiles/custom/APP_NAME_profile/APP_NAME_profile.post_update.php app/profiles/custom/APP_NAME_profile/${APP_NAME}_profile.post_update.php
mv app/profiles/custom/APP_NAME_profile app/profiles/custom/${APP_NAME}_profile

# Rename theme files
mv app/themes/APP_NAME_theme/APP_NAME_theme.breakpoints.yml app/themes/APP_NAME_theme/${APP_NAME}_theme.breakpoints.yml
mv app/themes/APP_NAME_theme/APP_NAME_theme.info.yml app/themes/APP_NAME_theme/${APP_NAME}_theme.info.yml
mv app/themes/APP_NAME_theme/APP_NAME_theme.libraries.yml app/themes/APP_NAME_theme/${APP_NAME}_theme.libraries.yml
mv app/themes/APP_NAME_theme/APP_NAME_theme.layouts.yml app/themes/APP_NAME_theme/${APP_NAME}_theme.layouts.yml
mv app/themes/APP_NAME_theme/APP_NAME_theme.theme app/themes/APP_NAME_theme/${APP_NAME}_theme.theme
mv app/themes/APP_NAME_theme app/themes/${APP_NAME}_theme
