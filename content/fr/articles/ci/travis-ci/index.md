---
date: "2016-04-19"
title: Déploiement continu avec Travis-CI (et GitHub Pages)
tags:
  - ci
  - tests
  - travis-ci
authors:
  - MoOx
reviewers:
  - magsout
  - lionelB
  - Macxim
header:
  linearGradient: 160deg, rgba(204, 51, 51, .8), rgba(204, 51, 51, .4)
  image: https://farm8.staticflickr.com/7279/7408451314_e0c3faeaaa_z.jpg
  credit: https://www.flickr.com/photos/jurvetson/7408451314
---

On va partir comme ça : on a un projet sur git et tous les commits dans la
branche `master` provoqueront une mise en production automatique une fois les
tests validés.

Les autres commits sur les autres branches et pull/merge requests joueront juste
les tests pour notifier l'état. Quand même.

## C'est qui Travis?

[Travis-CI](https://travis-ci.com/) est un service en ligne qui permet de tester
et déployer ses applications de manière automatisée.

Ce service payant propose une solution gratuite à tous les projets open source,
ce qui est assez cool. Cette version est disponible sur
[travis-ci.org](https://travis-ci.org/).
Il existe bien entendu plein d'autres services similaires, mais Travis-CI étant
très répandu dans la communauté open source, on le prendra pour notre exemple.

## Configuration de Travis-CI

Travis-CI fonctionne avec un fichier de configuration assez simple. Il n'y a
qu'à voir [le
nôtre](https://github.com/putaindecode/putaindecode.io/blob/master/.travis.yml).

Voici ci-dessous une version minimale pour faire tourner un projet node par
exemple :

```yml
language: node_js
```

Oui, c'est tout. Selon le language et/ou les fichiers présents,
Travis-CI va choisir la commande de test par défaut.
Avec node par exemple, ce sera `npm test` si un package.json est présent.
Si un [Makefile](/fr/articles/make/) est de la partie, Travis-CI va exécuter
`make test`.

Voici un fichier plus complet avec quelques exemples et trucs bons à savoir.

```yml
language: node_js

node_js:
  - '5'
  - ‘4’

# échoue dès qu'une erreur intervient
matrix:
  fast_finish: true

# met en cache node_modules, à noter que dans ce genre d’utilisation pour des
# librairies open source consommées via npm, il ne faudra pas oublier
# npm prune utilisé ci-après, histoire de ne pas lancer des tests avec
# des paquets encore en cache mais non présents dans le package.json
cache:
  directories:
    - node_modules

before_install:
  - npm prune

# ici on peut mettre des commandes à utiliser avec le script
before_script:
  # certains runners comme karma, testem ou testling peuvent avoir
  # besoin d'un écran pour fonctionner, voici l'astuce :)
  - export DISPLAY=:99.0
  - sh -e /etc/init.d/xvfb start

# si on veut utiliser autre chose que la commande par défaut
script: npm run test-with-coverage

# voici un exemple de ce que l’on peut faire après les tests :
# on peut lancer une tâche qui va envoyer les informations de
# pourcentage de couverture de code à un service tiers.
# (eg: http://coveralls.io/, https://codecov.io/)
after_success: 'npm run coverage'

# partie intéressante : ici on ne va déployer que les commits sur la
# branche master uniquement pour une version de node
# (car sinon on déploierait plusieurs fois…)
deploy:
  skip_cleanup: true
  provider: script
  script: ./scripts/deploy.sh
  on:
    branch: master
    node: '5'

# variables d'env
env:
  global:
    - NODE_ENV=production
```

## Exemple concret

On va prendre un petit projet simple en JavaScript qu’on va déployer sur GitHub
Pages.
Il va donc nous falloir un token GitHub qu’on va encrypter via un utilitaire
spécifique afin de ne pas publier cela à la vue de tous.

### Générer un token GitHub encrypté sur Travis-CI

Le plus simple est d’utiliser l'interface GitHub pour [ajouter un
token](https://github.com/settings/tokens/new).

#### Encryption du token

Maintenant, nous allons encrypter ce token. Vous avez 2 possibilités :

- soit installer le paquet node `travis-encrypt`
- soit installer la gem ruby `travis` (qui embarque la commande `encrypt`)

##### Via la gem Ruby `travis`

```console
$ sudo gem install travis
$ travis encrypt --add --repo {YOU/YOUR_REPO} GH_TOKEN={YOUR_TOKEN}
```

##### Via le paquet Node `travis-encrypt`

```bash
$ npm i -g travis-encrypt
$ travis-encrypt --add --repo {YOU/YOUR_REPO} GH_TOKEN={YOUR_TOKEN}
```

Les 2 commandes devraient ajouter automatiquement le token encrypté dans votre
`.travis.yml` dans la section `env.global`.

```yml
# …

env:
  global:
    - NODE_ENV=production
    # Ajouter un petit commentaire pour indiquer que c’est votre token GitHub
    # GITHUB_TOKEN
    # cela permettra, si vous avez d’autres variables encryptées et
que vous devez
    # changer de token pour X raison(s), de savoir lequel supprimer
    - secure: vqhHD....ROxGPQo= # VOTRE TOKEN DOIT ETRE PAR LA

    # ici vous pouvez définir en plus d'autres variables non encryptées
    # qui seront réutilsables par la suite
```

### Utilisation du token encrypté

#### Utilisation dans un script

Imaginons que vous ayez un projet à deployer sur GitHub Pages (exemple : vous
générez un site statique avec [Phenomic](https://phenomic.io/), le générateur
de site statique qu'on utilise).
Vous aller devoir générer votre projet, puis ensuite pousser le dossier généré
sur votre branche `gh-pages`.

#### Utiliser la tâche de déploiement seulement si nécessaire

Travis-CI possède une étape qui s'exécute après le succès des tests afin de
pouvoir faire un deploiement.

https://docs.travis-ci.com/user/deployment/

Dans notre cas, on va choisir un provider très simple : un script bash.

**Par défaut, ceci sera executé pour tous les commits, sur toutes les
branches.**

On va donc devoir ajuster un peu le tir, car par exemple les commits sur
`gh-pages` ne doivent rien faire (déjà pour éviter la boucle infinie).
Il en sera de même pour les commits sur d'autres branches de travail ainsi que
les pull/merge requests, comme on l’a vu dans le précédent exemple.

```yml
deploy:

  # très important, on garde notre build, sans ça, nos fichiers buildés
  # sont supprimés.
  skip_cleanup: true

  provider: script
  script: ./scripts/deploy.sh

  # ici on pose notre restriction
  on:
    branch: master
    node: '5'
```

#### Écrire notre fameux `scripts/deploy.sh`

Dans le cas d’un déploiement de dossier sur une branche `gh-pages`, on peut
faire de manière assez simple avec le script suivant :

```sh
#!/usr/bin/env bash

# on lit GIT_DEPLOY_REPO ou si y‘a pas on tente le package.json repository field
# (il faut une string et pas un objet dans ce cas)
GIT_DEPLOY_REPO=${GIT_DEPLOY_REPO:-$(node -e
'process.stdout.write(require("./package.json").repository)')}

# on se déplace dans le dossier de build
cd dist && \
# on repart sur un repo git vierge, pas besoin de versionner quelque chose qui
# se build
$(npm bin)/rimraf .git
git init && \
# il faut quelques infos pour que git soit content
git config user.name "Travis CI" && \
git config user.email "github@travis-ci.org" && \
# on met tout dans git et on commit
git add . && \
git commit -m "Deploy to GitHub Pages" && \
# puis on force push sur gh-pages
git push --force "${GIT_DEPLOY_REPO}" master:gh-pages
```

## Y'a plus qu'à !

Et voilà ! On pousse un commit sur `master` et la magie devrait opérer !

_Note: pour commiter sans déclencher un build sur Travis-CI, il suffit d'ajouter
`[ci skip]` dans votre message de commit. Pratique quand on modifie juste un
README par exemple._

Cette méthode est celle que nous utilisons pour générer et deployer notre site
statique. Et cela permet, par exemple, si quelqu'un corrige une typo depuis
l'interface en ligne de GitHub, de n'avoir rien d'autre à faire que de "merger"
la correction
(et pour rappel : vous pouvez **modifier** n'importe quel article via le lien
situé plus bas).

Travis exécutera nos tests, génèrera notre site si les tests sont bons et mettra
ça en production. Les mises en prod' le vendredi à 19h45 ? Même pas peur.
