---
date: "2014-05-06"
title: NPM comme package manager pour le front-end
tags:
  - npm
  - package manager
  - javascript
  - css
authors:
  - kewah
---

NPM, le package manager de Node.js, a grandement participé au succès de ce dernier.
Il facilite la création, le partage et l'installation de modules.
Il permet aux développeurs de suivre la [philosophie Unix](http://www.faqs.org/docs/artu/ch01s06.html)
où chaque module fait une seule tâche (évite la complexité, facilite la réutilisation et les tests).

Cependant NPM ne se limite pas aux modules JavaScript. Il est en effet possible
de publier tout type de fichier et c'est là que ça devient intéressant pour nos
modules front-end, qui peuvent aussi être CSS, HTML, fonts, etc.

## Module JavaScript

Si vous n'êtes pas familier(e) avec la création d'un module JavaScript, je vous
conseille d'exécuter la commande `npm init` qui va vous aider à générer votre
`package.json` (fichier de configuration utilisé par NPM). Le champ
"[main](https://www.npmjs.org/doc/json.html#main)" définit le point d'entrée de
votre module.

```json
{
  "name": "putaindemodule",
  "version": "0.0.1",
  "main": "index.js"
}
```

Dans un article précédent, il vous a été présenté le développement d'une application
autour de [modules JavaScript avec Browserify](/posts/js/browserify-all-the-things/).

## Module pour tout type de fichier

C'est grâce au champ "[files](https://www.npmjs.org/doc/json.html#files)" que
l'on peut définir la liste des fichiers que l'on va publier (autre que les fichiers JavaScript).
Voici un exemple de `package.json` d'un module pour un système de grille CSS.

```json
{
  "name": "putaindegrid",
  "version": "0.0.1",
  "files": [
    "grid.css"
  ]
}
```

Il ne reste de plus qu'à le [publier](https://gist.github.com/coolaj86/1318304)
et à l'installer (`npm install putaindegrid --save`) dans vos différents projets
où vous en aurez besoin. Votre fichier `grid.css` est accessible dans le dossier
`node_modules/putaindegrid/grid.css`, vous pouvez donc l'inclure dans votre page
HTML. (Ou l'`@import`er dans votre fichier Sass/Less principal.)

```html
<link href="node_modules/putaindegrid/grid.css" rel="stylesheet" type="text/css">
```

## Pourquoi NPM plutôt qu'un autre package manager ?

- Il a déjà fait ses preuves comme package manager pour Node.js.
- Pas besoin d'installer un nouvel outil, NPM étant installé avec Node.js, ce qui
évite un lot de bugs et de fichiers de configuration supplémentaires (un simple `package.json` suffit).
- Et surtout, toutes les dépendances de votre projet peuvent être gérées via NPM:
votre tasks runner et ses plugins ([Gulp](/posts/js/introduction-gulp/), [Grunt](/posts/js/premiers-pas-avec-grunt/) & co), vos [modules JavaScript](/posts/js/browserify-all-the-things/), vos [tests](/posts/js/introduction-au-testing-js-front/)
et comme on vient de le voir, vos fichiers de style.

Dans le cas où vous n'auriez pas envie de passer par l'étape de publication
(`npm publish`) pour diverses raisons, sachez qu'il est possible
d'[installer](https://www.npmjs.org/doc/cli/npm-install.html) des packages qui ne
sont pas publiés. Mon alternative favorite étant l'utilisation du namespace Github
`npm install user/repo --save`.  
Cependant, même si vous ne publiez pas votre module, lorsque vous en modifiez le
code n'oubliez jamais de mettre à jour sa version suivant la convention
[semver](http://semver.org/). Sinon vous serez susceptible d'inclure des bugs dans
les projets qui l'utilisent. Ce qui implique :

- Mettre à jour le champ "version" de votre `package.json` (vous pouvez vous
  aider des commandes `npm version patch`, `npm version minor` et `npm version major`).
- Ajouter un tag git (`git tag -a 0.1.0 -m "Initial release"`).

NPM est une excellente solution pour gérer les dépendences de votre projet, aussi
bien pour vos outils de build, que pour vos assets front-end. Je pense qu'il est
important de garder les choses simples, en commençant par utiliser un seul
gestionnaire de dépendances, dans le cas où celui-ci n'intègre pas d'autres
fonctionnalités que le téléchargement de modules.  

Bye bye Bower!

PS: vous avez besoin d'un module qui n'a pas de package.json ? Pas de problème, [napa est là pour ça](/posts/nodejs/napa-ou-comment-telecharger-package-napa-package-json/)
