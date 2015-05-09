---
date: "2014-05-12"
title: napa ou comment télécharger un package qui napa de package.json
tags:
  - npm
  - javascript
  - nodejs
authors:
  - kud
---

(Grosse grosse blague ce titre...)

[@kewah](https://twitter.com/kewah) nous a récemment parlé de [**npm** comme front-end packager manager](/posts/frontend/npm-comme-package-manager-pour-le-front-end/), je vais aller encore plus loin. Je vais vous dévoiler comment installer des projets qui n'ont pas de `package.json`. Oui, car c'est bien beau de virer Bower (oh que oui c'est beau) mais comme npm requiert constamment un `package.json`, on ne va pas pouvoir télécharger grand chose sauf si on fait des _PR_ afin d'ajouter ce fichier sur les projets que l'on souhaite obtenir.

C'est pourquoi je vais vous parler de [**napa**](https://github.com/shama/napa).

napa est un _helper for installing stuff without a package.json with npm_. Pardon, napa est un aideur pour installer des trucs sans un package.json avec npm. BON. napa vous aide à travers npm à installer des modules qui n'ont pas de package.json. C'est plus clair là ?

napa est ce qui manque à npm où bower avait justement son utilité : télécharger n'importe quel _package_ _front_ n'importe où. Mais plutôt que d'installer un autre _packager_, napa s'insère directement dans npm afin de ne pas perturber le _workflow_, et ça, j'apprécie grandement.

Simple, tout simple. Dans un premier temps, téléchargez-le :

```
$ npm install napa --save-dev
```

Cela ajoutera napa au `package.json`.

Puis dans `package.json`, ajoutez :

```
{
  "scripts": {
    "install": "napa"
  }
}
```

Cela permettra de lancer napa à chaque fois que vous faites `npm install`.

Afin d'ajouter les projets qui seront téléchargés par napa et donc par npm, il suffit d'ajouter un objet `napa` toujours dans `package.json` :

```
{
  "napa": {
    "foo": "username/repo",
    "bar": "git@example.com:user/repo"
  }
}
```

ce qui donne au final :

```
{
  "scripts": {
    "install": "napa"
  },
  "napa": {
    "foo": "username/repo",
    "bar": "git@example.com:user/repo"
  }
}
```

Je vous ai volontairement donné la version structurée (et/ou explicite) parce que d'une, c'est celle que j'utilise :D et de deux, c'est celle que je trouve la plus claire, mais il y a d'[autres façons](https://github.com/shama/napa#want-to-name-the-package-something-else) de l'écrire.

On se retrouve alors dans la vraie vie à avoir un `package.json` comme ceci :

```
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "Brilliant project",
  "scripts": {
    "install": "napa"
  },
  "devDependencies": {
    "animate.css": "git://github.com/daneden/animate.css#3.1.1",
    "backbone": "^1.1.2",
    "jquery": "^1.9.0",
    "jquery-migrate": "git://github.com/jquery/jquery-migrate#1.2.1",
    "lodash": "^2.4.1",
    "moment": "^2.6.0",
    "napa": "^0.4.1",
    "putainde-cookie": "^0.2.0"
  },
  "napa": {
    "swfobject": "swfobject/swfobject#a22b7db077abc126d6aa5f2d0f44b11e4ed97940",
    "modernizr": "Modernizr/Modernizr#v2.8.1"
  },
  "repository": "git://github.com/my/project.git",
  "author": "Myself",
  "license": "BSD",
  "readmeFilename": "readme.md"
}
```

Top non ?

Note : napa et npm-shrinkwrap, c'est pas encore ça, alors n'hésitez pas à supprimer la partie "napa" avant de lancer votre génération de npm-shrinkwrap.

Bon download à vous.
