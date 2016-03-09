#!/usr/bin/env bash

GIT_DEPLOY_REPO=${GIT_DEPLOY_REPO:-$(node -e 'process.stdout.write(require("./package.json").repository)')}

cd dist && \
$(npm bin)/rimraf .git
git init && \
git config user.name \"Travis CI\" && \
git config user.email \"github@travis-ci.org\" && \
git add . && \
git commit -m "Deploy to GitHub Pages" && \
git push --force "${GIT_DEPLOY_REPO}" master:gh-pages
