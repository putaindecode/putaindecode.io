---
title: Démarrer le projet en local
layout: Page
---

## Pré-requis

Avant de démarrer le projet afin de travailler dessus,
il faudra les choses suivantes:

- [Node.js]()
- Un compte sur [GitHub]()

## Forker

Ensuite _fork_ le projet sur GitHub

![bouton fork](assets/fork-button.jpg)

Une fois ceci fait, tu peux récupérer le projet chez toi
et installer les dépendances :

```console
$ git clone https://github.com/TON_PSEUDO_GITHUB/putaindecode.io.git
$ cd putaindecode.io
$ npm install
```

**Note: Si tu as déjà un fork** en retard sur notre ``master``,
tu peux mettre ta ``master`` à jour :

```console
$ git remote add upstream https://github.com/putaindecode/putaindecode.io.git
$ git fetch upstream
$ git checkout master
$ git merge upstream/master
```

## Démarrer

Rien de plus simple

```console
$ npm start
```

Le projet s'ouvrira automatiquement dans ton navigateur si tout est ok 😉.
