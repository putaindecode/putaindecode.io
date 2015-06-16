---
date: "2015-06-16"
title: "SemVer, c'est quoi ?"
tags:
  - semver
authors:
  - kud
header:
  linearGradient: rgba(0,0,0, 0.6), rgba(0,0,0, 0.5)
  credit: https://www.flickr.com/photos/stevensnodgrass/5480863464/
---

_Ce post a été largement inspiré de la mauvaise expérience que j'ai pu avoir
avec l'évolution de [Backbone.js](http://backbonejs.org/) qui, ne respectant pas SemVer, m'a posé des
problèmes lors de mise à jour de versions. Les node_modules (dépendances de
dépendances) sont aussi en question._

Depuis quelques temps, vous devez entendre le terme **SemVer** par-ci par-là
mais peut-être que vous ne savez pas ce que c'est ou que vous ne savez pas
comment l'appliquer. Et je vous comprends, j'ai mis un peu de temps à maitriser
le sujet.

Pour faire simple, **SemVer** (voulant dire _Semantic Versioning_) est une
gestion sémantique des versions. En d'autres termes, une façon de numéroter les
versions de manière logique, cohérente, parlante, ayant du sens. Ce n'est
cependant pas forcément une norme, vous n'êtes pas obligé(e) de la respecter
mais ce serait vraiment, vraiment dommage car il tend justement à l'être.

Mais tout d'abord, posons les bases, qu'est-ce qu'une version ?

Une version s'applique à un produit, une application, une bibliothèque, un OS,
tout ce qui a une progression en informatique. Cela permet de définir
l'avancement du produit. La majorité du temps (sauf pour quelques hérétiques),
cela s'écrit de cette façon : `X.Y.Z` où `X`, `Y` et `Z` sont des entiers (pas
forcément des chiffres d'ailleurs, cela peut être supérieur à 9) soit `1.0.10`
par exemple. Il est possible que vous voyiez cette forme `vX.Y.Z` comme `v1.0.10`
mais en toute franchise, je ne l'apprécie pas. J'aime que mon tag équivaille à
ma version en elle-même. Purement personnel.

Maintenant que nous savons ce qu'est une version, voyons voir ce qu'est
réellement **SemVer**.

**SemVer** est un moyen cohérent, pertinent de nommer ses versions afin de
savoir rapidement quelles modifications ont été apportées à votre projet.

Voyons voir ce que dit la documentation officielle de
[SemVer](http://semver.org/lang/fr/)


>Étant donné un numéro de version MAJEUR.MINEUR.CORRECTIF, il faut incrémenter :

>le numéro de version MAJEUR quand il y a des changements
rétro-incompatibles,<br>
>le numéro de version MINEUR quand il y a des changements rétro-compatibles,<br>
>le numéro de version de CORRECTIF quand il y a des corrections d’anomalies
rétro-compatibles

>Des libellés supplémentaires peuvent être ajoutés pour les versions de
pré-livraison et pour des méta-données de construction sous forme d'extension du
format MAJEURE.MINEURE.CORRECTIF.

On comprend effectivement l'idée de **SemVer** (et la suite du site explique
comment l'appliquer) mais je trouve que l'on peut mieux expliquer.

Pour comprendre **SemVer**, il faut se mettre dans la peau de l'utilisateur qui
va se servir de votre production.

En effet, **SemVer** est un contrat que vous signez avec vos utilisateurs, une
forme de respect qui leur permet d'adapter leur code ou non en fonction des
versions que vous proposez.

Si je devais définir à quelqu'un ce qu'est **SemVer**, je lui dirais ceci :

>SemVer s'écrit de cette façon : `X.Y.Z` où `X` est "majeur", `Y` est "mineur",
`Z` est "patch".

>Qu'est-ce que cela veut dire. Cela veut dire que si vous avez corrigé un bug
dans votre lib et que cela n'affecte en rien le code écrit par votre
utilisateur, alors incrémentez `Z` (+0.0.1).

>Si vous avez fait des ajouts dans votre app qui peuvent être intéressants pour
l'utilisateur et mérite une certaine attention afin d'améliorer le code qui
utilise votre lib, alors incrémentez `Y` (+0.1.0).

>Si en revanche, vous avez cassé ne serait-ce qu'une partie de l'API ("breaking
changes"), que vous avez _juste_ changé des noms de méthodes / fonctions déjà
existantes (et donc sûrement utilisées par quelqu'un d'autre), que finalement
cela nécessite **forcément** une modification de la part de l'utilisateur sous
peine que sa propre app ne fonctionne plus, alors incrémentez `X` (+1.0.0).

C'est vraiment une question de respect envers qui vous proposez votre lib. Par
**SemVer**, je vous informe des potentielles modifications ou lectures de
documentation que vous devez faire. Il ne faut vraiment pas voir ça comme une
évolution de votre propre code.

Par exemple, vous avez refactorisé tout votre code mais l'API n'a pas changé.
Alors `Z` suffit. Et si vous avez ajoutez des méthodes, c'est plutôt `Y`.
Pourtant il y a eu une quantité phénoménale de code modifié. Des lignes et des
lignes. Est-ce pour autant que vous devez incrémentez `X` ? Non. Surtout lorsque
les tests automatisés n'ont pas été modifiés et passent toujours.

En revanche, vous ne faites qu'une petite modification de nom de méthode qui ne
vous semble pas appropriée, ça ne vous prend qu'une ligne de modification, vous
pourriez croire que c'est uniquement `Z` à changer ? Non plus. Là, vous modifiez
le contrat que l'utilisateur a acquiescé en utilisant votre lib ; vous avez
alors la responsabilité de lui indiquer que son code doit absolument changer
sinon celui-ci ne marchera plus correctement.

En bref, ne voyez pas l'évolution de votre projet avec **SemVer** mais le
contrat que vous signez implicitement avec vos utilisateurs.

Oh et oui, surtout, surtout, ce n'est pas parce que vous êtes arrivé(e) à `9`
dans `Y` ou `Z` que le nombre le précédant doit augmenter. Par exemple _mineur_
sur `1.9.0` ? Alors `1.10.0` et non `2.0.0`.

J'espère qu'avec ceci, vous vous sentirez plus à l'aise.

## Tips npm

Avec npm, il est possible de mettre à jour rapidement son `package.json` et tag
git en utilisant la commande `$ npm version`. Comme ceci :

```console
$ npm version (major|minor|patch)
```

Cela vous incrémentera le `package.json`  et vous fera un beau commit + tag dans
git tel que :

```console
* b474d9c (HEAD -> master, tag: 1.5.3, origin/master) 1.5.3`.
```

Et pour éviter d'avoir le "v" dans les tags git qui est par défaut dans npm,
faites :

```console
$ npm config set tag-version-prefix ""
```

## Changelog

**SemVer** va de pair avec les [changelog](http://keepachangelog.com/). Mettre à
jour le changelog vous permet d'indiquer très rapidement ce qui a été modifié
sans que l'utilisateur ait forcément à regarder votre code. Il est surtout très
important lors d'ajouts de fonctionnalités ou de modifications (majeures et
mineures) afin de voir directement les méthodes / fonctions affectées mais aussi
dans le cas d'un patch de voir le gain obtenu de cette nouvelle mise à jour. À
ajouter directement dans le `README.md` à la fin ou carrément dans un fichier ou
des fichiers dédiés à ça.
Voici un [exemple](https://github.com/cssnext/cssnext/blob/master/CHANGELOG.md).

---

Stay safe, use **SemVer**.

Ressources :

- [site officiel](http://semver.org/)
- [semver-ftw](http://semver-ftw.org/)
