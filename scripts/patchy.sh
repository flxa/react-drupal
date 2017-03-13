#!/bin/sh

BRANCH=patchy

# Set the Git user for our builds.
git config --global user.email admin@previousnext.com.au
git config --global user.name Patchy

git checkout -b $BRANCH

composer update --with-dependencies --prefer-dist --no-interaction
git add composer.lock
git commit -m "[PATCHY] Update composer dependencies"

# Bit hacky, but we need to close the PR via deleting the branch.
# We also sleep because I have seen race conditions in the past.
git push origin  --delete $BRANCH || true
sleep 5

git push -u origin $BRANCH
hub pull-request -m "Automated patching" -b master -h $BRANCH
