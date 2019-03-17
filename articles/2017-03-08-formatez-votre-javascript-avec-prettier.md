---
date: 2017-03-08
title: Formatez votre JavaScript avec prettier
author: zoontek
oldSlug: js/prettier
slug: formatez-votre-javascript-avec-prettier
---

Rob Pike et Ken Thompson ont conçu le langage de programmation Go de façon à ce
que celui-ci soit à portée des jeunes développeurs : si vous découvrez et
commencez à apprendre le Go le lundi, vous devriez être en mesure d'être
productif le mercredi. Le langage est extrêmement minimaliste, il y a rarement
plus d'une façon de faire quelque chose.

Seulement voilà, le développeur torturé se posera toujours un tas de questions
essentielles : tabs ou spaces ? 2, 4 ou 8 spaces ? Single quotes ou double
quotes ? Après quelles structures de contrôle passer une ligne ? Mais aussi les
éternels : vim ou emacs ? Flow ou TypeScript ? Maintenir ce projet Angular 1 ou
démissionner comme un prince ?

_N.B. : Pour information, les bonnes réponses sont bien évidemment spaces, 2,
single quotes, vim, flow, la démission_

C'est pour répondre à ce problème (enfin, ceux liés au formatage de votre code)
que Go intègre un formatting tool (`fmt`, comme la commande Unix), intitulé
[gofmt](https://golang.org/cmd/gofmt/).

1.  Vous codez comme vous le sentez
2.  Vous sauvegardez votre fichier
3.  Votre code est automatiquement formaté
4.  Vous vous sentez frustré
5.  Très vite, vous vous rendez compte que c'est pour votre bien, et que perdre
    du temps ou débattre sur ce genre de détails, c'est tout sauf utile

Autre avantage non négligeable : le code Go que vous trouverez dans d'autres
packages, des exemples, etc. sera toujours formaté de la même façon.

_À noter : Reason offre quelque chose de similaire avec
[refmt](https://facebook.github.io/reason/tools.html)._

Cette solution officielle n'existe pas en JS. Mais c'est ici qu'intervient
[prettier](https://github.com/prettier/prettier) (et non
[jsfmt](https://www.npmjs.com/package/jsfmt), qui existe mais ne semble plus
maintenu), un projet relativement récent, en version `0.21` à l'heure où j'écris
ces lignes. Compatible _out of the box_ avec le JS ES2017, JSX, flow, il offre
également le moins de configuration possible (ce qui est une bonne chose). Le
projet est activement suivi par Facebook, qui discute même la possibilité de
s'en servir sur la codebase de
[React](https://github.com/facebook/react/pull/9101).

## Comment ça fonctionne ?

Croyez-le ou non, ce n'est pas "tellement" complexe. À la manière de babel ou
flow, prettier utilise un AST parser (Abstract Syntax Tree parser) afin
d'analyser le contenu de votre fichier JS, suite à quoi il va simplement
formater votre code sans tenir compte de la forme précédente, en ne gardant que
ce qui est important: le fond, pas la forme.

Je vous invite à jouer avec [AST explorer](https://astexplorer.net/) pour
comprendre beaucoup plus simplement comment tout cela fonctionne.

## Installation

```console
npm install --save-dev prettier
```

Ou, pour les meilleurs d'entre vous :

```console
yarn add --dev prettier
```

¯\\_( ツ )_/¯

## Configuration

Car oui, il y en a tout de même un peu. Il est possible de régler:

- La longueur maximale des lignes (`printWidth`, `80` caractères par défaut)
- Le nombre d'espaces pour l'indentation (`tabWidth`, `2` par défaut, pas de
  tabs)
- Single quotes / double quotes (`singleQuote`, `false` par défaut)
- S'il faut ajouter des virgules en fin de certaines structures (comme les
  objets, mais aussi dans les paramètres de fonction, ce qui est possible depuis
  peu) (`trailingComma`, `none` par défaut, `es5` et `all` sont également
  possibles)
- S'il faut ajouter des espaces dans un objet écrit sur une seule ligne
  (`bracketSpacing`, `true` par défaut)
- Comment fermer les balises JSX (`jsxBracketSameLine`, `false` par défaut)
- Quel parser utiliser (`parser`, `babylon` par défaut, `flow` est disponible)

> Mais attends… Si l'on peut malgré tout configurer tout ça, ce n'est plus
> vraiment un style standard ?

Oui et non, car il y aura toujours beaucoup de détails sur lesquels il nous sera
impossible de choisir, les options resteront minimalistes. Par exemple, vous ne
pourrez jamais retirer les points-virgules.

`EDIT: Il semblerait que malgré ce qui a pu être annoncé par l'auteur de prettier, une option --no-semicolons soit dans les tuyaux.`

Dans tous les cas, prettier reste un outil extrêmement pratique pour forcer le
formatage du code au sein de votre équipe.

Ouvrez votre `package.json`, c'est parti.

```json
{
  "scripts": {
    "prettify": "prettier src/**/*.js"
  },
  "devDependencies": {
    "prettier": "^0.21.0"
  }
}
```

`npm run prettify` ou `yarn run prettify` formateront automatiquement tous les
fichiers `.js` contenus dans votre dossier `/src`. Bon j'avoue, c'est assez
basique comme usage. Ajoutons-y notre config préférée.

```json
{
  "scripts": {
    "prettify":
      "prettier --single-quote --trailing-comma all --write '{src,__{tests,mocks}__}/**/*.js'"
  },
  "devDependencies": {
    "prettier": "^0.21.0"
  }
}
```

`npm run prettify` ou `yarn run prettify` formateront maintenant automatiquement
tous les fichiers `.js` contenus dans vos dossiers `/src`, `__tests__` et
`__mocks__`, en utilisant le parser de flow, préférant les single quotes et en
ajoutant une virgule en fin de chaque structure possible.

OK. Mais si un membre de l'équipe oublie d'exécuter le script avant de commiter
son code ? **We got this !** (avec 2 dépendances de plus).

```json
{
  "scripts": {
    "precommit": "lint-staged",
    "prettify":
      "prettier --single-quote --trailing-comma all --write '{src,__{tests,mocks}__}/**/*.js'"
  },
  "lint-staged": {
    "{src,__{tests,mocks}__}/**/*.js": [
      "prettier --single-quote --trailing-comma all --write",
      "git add"
    ]
  },
  "devDependencies": {
    "husky": "^0.13.2",
    "lint-staged": "^3.3.1",
    "prettier": "^0.21.0"
  }
}
```

## Les plugins

Si vous ne pouvez pas attendre le moment du commit pour admirer votre code
fraichement formaté, il existe déjà pas mal de plugins, pour pas mal d'éditeurs
: `prettier-atom`, `prettier-vscode`, `Jsprettier` (pour Sublime Text), mais
aussi pour emacs, vim, les IDE Jetbrain, etc. Tout est dans le
[README](https://github.com/prettier/prettier/blob/master/README.md).

_Protip: Inutile de vous conforter au style de formatage de votre équipe au sein
de votre éditeur si le code est à nouveau formaté en pre-commit._

## Quelques exemples, c'est possible ?

J'ai mieux. Il est possible
d'[essayer en ligne](https://prettier.github.io/prettier) ! ✨

## Donc c'est bon, tu conseilles ?

C'est tout de même à réfléchir. Le projet est encore jeune et en beta, même s'il
évolue extrêmement vite. Tout n'est pas encore parfaitement supporté, mais je
vous rassure, si vous n'utilisez pas le flow-parser vous ne risquez pas de
rencontrer beaucoup de problèmes avec la dernière version.

Des projets tels que
[immutable-js](https://github.com/facebook/immutable-js/commit/9bcc8b54a17c3bbc94d70864121784bc91011e8f),
[react-native-web](https://github.com/necolas/react-native-web/commit/a2f25a46c495ca53a75e728cfb14dbdf67cdb342)
et
[babel](https://github.com/babel/babel/commit/bdbe2cfbc5ab5ba6f528b7ee3e4bf5ed940a47af)
y sont déjà passés. Pourquoi pas vous ? 😉
