---
date: "2017-11-21"
title: "Respecter SemVer (presque) sans avoir à y penser avec semantic-release"
tags:
  - semver
  - semantic-release
authors:
  - drazik
header:
  linearGradient: rgba(0,0,0, 0.6), rgba(0,0,0, 0.5)
  credit: https://www.flickr.com/photos/stevensnodgrass/5480863464/
---

## Petit rappel : SemVer, c'est quoi déjà ?

SemVer signifie **Sem**antic **Ver**sionning. C'est une manière de numéroter les versions succéssives d'un module. Je vous invite à aller lire [l'article sur SemVer de kud](http://putaindecode.io/fr/articles/semver/) avant de lire la suite si vous n'êtes pas certain de bien comprendre ce qu'est SemVer. Je vais ici citer certaines parties de ce post afin de faire un rapide résumé :

> Une version s'applique à un produit, une application, une bibliothèque, un OS, tout ce qui a une progression en informatique. Cela permet de définir l'avancement du produit. La majorité du temps (sauf pour quelques hérétiques), cela s'écrit de cette façon : X.Y.Z où X, Y et Z sont des entiers

> SemVer est un contrat que vous signez avec vos utilisateurs, une forme de respect qui leur permet d'adapter leur code ou non en fonction des versions que vous proposez.

> SemVer s'écrit de cette façon : X.Y.Z où X est "majeur", Y est "mineur", Z est "patch".

> Cela veut dire que si vous avez corrigé un bug dans votre lib et que cela n'affecte en rien le code écrit par votre utilisateur, alors incrémentez Z (+0.0.1).

> Si vous avez fait des ajouts dans votre app qui peuvent être intéressants pour l'utilisateur et mérite une certaine attention afin d'améliorer le code qui utilise votre lib, alors incrémentez Y (+0.1.0).

> Si en revanche, vous avez cassé ne serait-ce qu'une partie de l'API ("breaking changes"), que vous avez juste changé des noms de méthodes / fonctions déjà existantes (et donc sûrement utilisées par quelqu'un d'autre), que finalement cela nécessite forcément une modification de la part de l'utilisateur sous peine que sa propre app ne fonctionne plus, alors incrémentez X (+1.0.0).

Maintenant que nous sommes au point sur SemVer, passons à la suite.

## Publier un module sur npm manuellement

Lorsqu'on veut publier un module sur npm, on utilise principalement deux commandes : `npm version` et `npm publish`.

`npm version` nous permet de dire quelle composante de notre numéro de version on souhaite incrémenter. Ainsi, `npm version major` augmentera la partie `MAJEUR`, `npm version minor` augmentera la partie `MINEUR` et `npm version patch`... je crois que vous l'avez maintenant. La commande crée aussi un tag git ayant pour nom le numéro de version.

Une fois la nouvelle version prête, `npm publish` permet, vous l'aurez deviné (j'espère), de la publier sur npm.

Ce processus semble simple à première vue. Selon les modifications qui ont été apportées au module depuis la dernière version, on décide de la composante SemVer à incrémenter, on lance un `npm version` puis un `npm publish` et c'est terminé. Pourtant, une étape du processus implique une décision prise par un humain, et est donc soumise à interprétation ainsi qu'à de potentielles erreurs ou oublis.

Imaginons : je travaille sur mon super module au nom extrêmement original `foobar`. Celui-ci est actuellement en version `1.2.3` et plusieurs personnes ont proposé des pull requests ajoutant des fonctionnalités et corrigeant des bugs. Il est temps de publier une nouvelle version de `foobar` afin que tout le monde puisse bénéficier de ces améliorations. Je passe en revue ce qui a été ajouté, et je décide d'incrémenter la composante `MINEUR` de mon numéro de version. Je publie cette nouvelle version, documente le tout dans une note de version, je suis heureux.

Manque de chance, quelques temps après la publication, les issues Github de mon projet s'affolent. J'ai raté une modification non rétrocompatible, les utilisateurs de mon module (auxquels je promets de respecter SemVer) se sont joyeusement empressés de faire la mise à jour dans leur application, et maintenant tout est cassé. Sueurs froides, j'étais pourtant sûr de mon coup, et maintenant je dois me débrouiller pour régler ce problème dans l'urgence. " "Accessoirement", j'ai aussi perdu la confiance que m'accordaient certains utilisateurs.

Après avoir réglé le problème, une question se pose : comment éviter ce problème à l'avenir ?

## semantic-release, pour ne plus se soucier de rien, sauf ce sur quoi on travaille

Eviter ce problème, c'est la promesse de [semantic-release](https://github.com/semantic-release/semantic-release). Ce module nous permet de ne plus avoir à décider nous-même du prochain numéro de version de notre module.

Le principe est simple : à chaque fois que je fais un commit, je décris dans le message qui l'accompagne ce que j'ai effectué dans celui-ci, dans un format précis qui pourra être analysé automatiquement afin de calculer le prochain numéro de version. C'est un deal entre nous et semantic-release : si on respecte ce format, il nous garantit de correctement incrémenter les différentes composantes du numéro de version, et de publier automatiquement chaque nouvelle version de notre module.

Par défaut, semantic-release se base sur la convention de message de commit du projet AngularJS, qui propose le format suivant :

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Ainsi, si un commit correspond à la correction d'un bug, je peux lui attribuer un message de la forme :

```
fix(pencil): stop graphite breaking when too much pressure applied
```

Dans le cas d'un ajout de fonctionnalité :

```
feat(pencil): add 'graphiteWidth' option
```

Et dans le cas d'une modification qui casse la rétrocompatibilité :

```
perf(pencil): remove graphiteWidth option

BREAKING CHANGE: The graphiteWidth option has been removed. The default graphite width of 10mm is always used for performance reasons.
```

Ainsi, lorsque semantic-release va passer tous les commits en revue, il pourra analyser le type de chacun d'entre eux, ainsi que rechercher les "BREAKING CHANGE", afin d'incrémenter le numéro de version comme il se doit.

Petit bonus : semantic-release se charge aussi de vous générer des notes de version et de les ajouter à votre release sur Github. Alors, elle est pas belle la vie ?

Finalement, en écrivant de bons messages de commits (ce qui devrait déjà être le cas, non ?) qui suivent un formalisme précis, vous vous épargnez d'avoir à gérer vous-même SemVer pour votre module.

## La pratique : mettre en place semantic-release sur son projet

Voyons maintenant comment mettre en place semantic-release sur un projet de module npm.

La première chose à faire, c'est d'installer la CLI :

```
npm install -g semantic-release-cli
```

Puis de lancer le setup dans le dossier de votre projet :

```
semantic-release-cli setup
```

semantic-release vous pose alors quelques questions :

* `What is your npm registry?` : appuyez directement sur entrée pour sélectionner le registry npm par défaut
* `What is your npm username?` : entrez votre username npm
* `What is your npm password?` : entrez votre mot de passe npm
* `What is your GitHub username?` : entrez votre username GitHub
* `What is your GitHub password?` : entrez votre mot de passe GitHub
* `What is your GitHub two-factor authentication code?` : si vous avez activé l'authentification à deux facteurs sur GitHub, entrez le code que vous aurez reçu ici
* `What CI are you using?` : nous allons ici utiliser Travis CI, mais vous pouvez utiliser ce que vous voulez si vous avez un système de CI particulier. Pour la suite, il n'y a pas besoin de maîtriser Travis CI ni l'intégration continue en soit. Je vous suggère juste de lire [l'article d'introduction de MoOx](http://putaindecode.io/fr/articles/ci/) si le concept d'intégration continue ne vous parle pas du tout
* `Do you want a `.travis.yml` file with semantic-release setup?` : Yes !

Voilà, tout est configuré et prêt à être utilisé :

* Un script npm `semantic release` a été ajouté à votre `package.json`
* Le champs `version` de votre `package.json` a été modifié en `0.0.0-development`. Vous n'aurez plus jamais à y toucher, c'est semantic-release qui fera ce travail avant de publier chaque nouvelle version
* Un fichier `.travis.yml` contenant la configuration Travis CI nécessaire a été créé. Vous pouvez le modifier selon vos besoins. Dans l'immédiat, la chose urgente est d'adapter la liste des versions de Node sur lesquelles Travis va lancer vos tests
* Votre repository doit être visible sur Travis CI, prêt à lancer un build lorsque vous ferez un `git push`
* Un token npm a été ajouté au repository sur Travis CI, pour que celui-ci puisse s'authentifier lorsqu'il voudra publier une nouvelle version

_Une petite note concernant Travis CI. Le but de semantic-release étant d'automatiser le processus de publication d'un module npm, celui-ci va tout bonnement refuser de se lancer en dehors d'un environnement d'intégration continue._

Bien, maintenant que tout est en place, il va falloir travailler un peu, faire quelques commits afin d'arriver au point où on voudra publier une nouvelle version. Disons que je travaille sur un module `math` qui implémente actuellement les fonctions `add` et `substract`. Le module est actuellement en version 1.0.0 sur npm, et un utilisateur m'a remonté un bug sur la fonction `add` lorsqu'on souhaite additionner deux nombres décimaux. Je règle le problème, et arrive le moment de faire le commit. Selon la convention que nous avons vu un peu plus tôt, celui-ci devra ressembler à :

```
fix(add): handle decimal numbers addition
```

Semantic-release pourra alors voir que ce commit est une correction de bug, qui s'applique à la fonction add, et qui règle un problème d'addition sur des nombres décimaux. Il pourra donc prendre la décision d'incrémenter la composante `MINEUR` de la version du module.

Satisfaits de mon travail pour aujourd'hui, je décide de m'arrêter là, et je fais un `git push`. Travis CI déclenchera un build dès qu'il aura détecté ce nouveau commit sur mon repository GitHub. Celui-ci va donc lancer mes tests, et si ceux-ci passent, lancera le script npm créé lors du setup de semantic-release (`npm run semantic-release`). Ce script va faire les choses suivantes :

1. Vérifier que les conditions d'exécution sont bonnes (par défaut, il vérifie qu'on est bien sur Travis CI, sur la branche master et que tous les autres jobs Travis CI sont bien terminés)
2. Récupérer le dernier numéro de version publié
3. Analyser les commits afin de déterminer le numéro de la nouvelle version
4. Publier la nouvelle version (mise à jour du champ `version` du `package.json` puis `npm publish`)
5. Générer les notes de version
6. Créer un tag git ainsi que la release associée sur GitHub

Une fois le build Travis CI terminé, je verrais donc la version `1.0.1` de `math` publiée sur npm, un nouveau tag et une nouvelle release (avec les notes qui y sont associées) disponibles sur GitHub.

Si je décide maintenant d'ajouter les fonctions `multiply` et `divide` à mon module, et d'effectuer les deux commits suivants :

```
feat(multiply): add multiply function
```

```
feat(divide): add divide function
```

Semantic-release déterminera que le prochain numéro de version est `1.1.0`, et fera le même travail que précédemment.

Enfin, si je décide d'implémenter une fonction spécifique pour l'addition de deux nombre décimaux, je ferais le commit suivant :

```
feat(add): split add function into addInts and addFloats

BREAKING CHANGE: add function has been removed. You must replace it with addInts or addFloats
```

Semantic-release publiera dans ce cas la version `2.0.0`, parce qu'il détectera que ce commit contient des modifications non rétrocompatibles.

Elle est pas belle la vie ?

## Aller un peu plus loin

Nous avons jusqu'ici utiliser semantic-release avec tout ce qu'il propose par défaut. Toutefois celui-ci est basé sur des plugins et peut donc être personnalisé quasiment de A à Z. Je ne détaillerais pas tout ici, mais chaque étape du processus qui se déroule au lancement du script npm `semantic-release` ne fait qu'exécuter une liste de plugins qui peuvent tous être remplacés. Vous pouvez ainsi implémenter votre propre logique pour chaque étape. Un exemple : écrire un plugin pour la phase d'analyse des commits afin d'utiliser une convention différente de celle d'Angular JS.

[La documentation](https://github.com/semantic-release/semantic-release#plugins) explique bien comment écrire un plugin. Les possibilités sont virtuellement infinies, libre à vous d'adapter semantic-release à votre workflow et vos envies.
