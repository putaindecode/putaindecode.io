#!/usr/bin/env bash

# abort if any command fails
set -o errexit

npm run test

if \
  [ $TRAVIS_PULL_REQUEST = "false" ] && \
  [ $TRAVIS_BRANCH = "master" ]
then
  npm run _deploy
fi
