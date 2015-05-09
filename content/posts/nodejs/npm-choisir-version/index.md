---
date: "2014-05-12"
title: "npm: choisir la bonne version de ses dépendances"
tags:
  - npm
  - javascript
  - nodejs
authors:
  - kud
---

Pas plus tard qu'hier, alors que je travaillais tranquillement, apparu soudainement un bug dans mon _workflow_ de _build_. Il ne m'était plus possible avec [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean) de supprimer des fichiers. Hmmm, ballot, car sans la suppression, mon _workflow_ devenait tout bancal. Bien. Il me fallut remonter la rivière - comme souvent, en tant que développeur - afin de constater où était le bug. Je suis alors tombé sur [rimraf](https://github.com/isaacs/rimraf) (bon c'était pas bien loin) qui s'était vu être mis à jour il y a à peine 12 heures, comprenant un bug.

## Contexte

Bon, vous voyez le topo ?

```
{
  "name": "grunt-contrib-clean",
  "dependencies": {
    "rimraf": "~2.2.1"
  }
}
```

[grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean) qui contient en _dependencies_ [rimraf](https://github.com/isaacs/rimraf) avec une version bugguée. Oh la belle affaire. Oui car `~2.2.1` veut dire "[Raisonnablement proche de 2.2.1](https://github.com/isaacs/node-semver#ranges)", ce qui se traduit par télécharger la dernière version en `2.2.x`, soit la `2.2.7` (celle bugguée) lorsque je mis à jour le package [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean).

## Le hic

Une question m'est venue : comment faire en sorte de figer la version de [rimraf](https://github.com/isaacs/rimraf) qui est une dépendance de dépendance ?

Ha ! Pas évident comme ça.

J'ai d'abord essayé sans trop d'espoir de télécharger [rimraf](https://github.com/isaacs/rimraf) lui-même en `2.2.6` mais vu que chaque dépendance à ses propres dépendances et qu'elles ne se les partagent pas... c'était peine perdue.

J'ai donc cherché, cherché, et je suis tombé sur [npm-shrinkwrap](https://www.npmjs.org/doc/cli/npm-shrinkwrap.html): "Lock down dependency versions". Bingo !

## npm-shrinkwrap, la solution pour figer vos depéndances, toutes vos dépendances

[npm-shrinkwrap](https://www.npmjs.org/doc/cli/npm-shrinkwrap.html) va vous permettre de définir avec précision chaque version de chaque dépendance.

Pour cela, faites d'abord un `npm install` (si vous avez évidemment un `package.json`) afin d'installer vos `node_modules`. Une fois cela fait, lancez `npm shrinkwrap` qui créera le fichier `npm-shrinkwrap.json` qui comprendra toutes les définitions de chaque dépendance.

### Figer une dépendance de dépendance

Simple, regardez :

```
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "grunt-contrib-clean": {
      "version": "0.5.0",
      "from": "grunt-contrib-clean@~0.5.*",
      "dependencies": {
        "rimraf": {
          "version": "2.2.6",
          "from": "rimraf@~2.2.1",
          "resolved": "https://registry.npmjs.org/rimraf/-/rimraf-2.2.6.tgz"
        }
      }
    }
  }
}
```

J'ai défini la version de [rimraf](https://github.com/isaacs/rimraf) dans `dependencies.grunt-contrib-clean.dependencies.rimraf`.

Bon, je ne connais pas tout par coeur non plus, npm-shrinkwrap vous écrira la totalité du fichier avec toutes les définitions mais j'ai volontairement tout supprimé et gardé uniquement la partie [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean) car seule cette partie est à figer. Quand je dis supprimer, je parle réellement dans le fichier final, pas juste ici dans l'article.

Vous aurez toute l'explication de npm-shrinkwrap sur la [documentation officielle [en]](https://www.npmjs.org/doc/cli/npm-shrinkwrap.html).

## Choisir la bonne stratégie de version

Parce qu'il est important de savoir quelle version exacte nous souhaitons installer dans notre projet, il faut définir avec précisions ces versions dans `package.json`.

Vous pouvez avoir `1.2.1` ou encore `~1.4.6` ou bien encore `^2.3.1`. Mais que veulent dire `^` ou `~` ?

- `1.2.1` : cette version exacte
- `~1.4.6` : raisonnablement proche de `1.4.6`
- `^2.3.1` : compatible avec `2.3.1`

Il est clair que lu comme ça, le plus intéressant est le `^` et c'est justement [celui qui est choisi maintenant [en]](http://fredkschott.com/post/2014/02/npm-no-longer-defaults-to-tildes/) lorsque l'on fait un `npm install --save`. Cool non ?!

Pour plus d'information sur la définition des versions, [c'est par là](https://github.com/isaacs/node-semver#ranges) (Oh mon dieu, il a fait un lien avec un "cliquez ici").

Bon. C'est bon ? Vous avez tout compris ? Okay, vous pouvez passer à [**napa**](/posts/nodejs/napa-ou-comment-telecharger-package-napa-package-json/) maintenant qui vous aidera grandement sur le téléchargement de projets n'ayant pas de `package.json`.

En ce qui concerne npm, je m'arrête là, et vous propose une petite solution afin d'augmenter la vitesse de vos installations de node modules.

## Bonus

Envie d'accélérer vos installations npm ? Je vous conseille [npm-pkgr](https://github.com/vvo/npm-pkgr).

Il hashera votre `package.json` pour savoir s'il a été modifié ou non, et en fonction de ça, il lancera `npm install` ou non. Sacré gain de temps (surtout si vous faites des `npm install` à chaque _deploy_).

You are now a npm master. 👨
