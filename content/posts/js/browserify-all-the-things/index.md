---
date: "2014-01-15"
title: BROWSERIFY ALL THE THINGS
tags:
  - javascript
  - amd
  - commonjs
  - browserify
authors:
  - MoOx
---

Alors que je prends goût à me passer de frameworks (principalement à cause des
courbes d'apprentissage et des éventuelles lourdeurs et/ou restrictions que cela
impose, mais c'est une autre histoire),
je cherchais la meilleure façon d'écrire des micro composants réutilisables.

Pour le JavaScript, j'ai commencé il y a bien longtemps par des extensions/plugins
[Prototype](http://prototypejs.org/), puis peu de temps après, du plugins
[jQuery](http://plugins.jquery.com/) à la pelle.
Souvent à tord puisque j'utilisais peut être 1% de la librairie en dépendance -
exemple avec mon [indicateur de chargement avec sémaphore](https://github.com/MoOx/jQuery.Loading-Indicator/)
ou encore mon [plugin qui ouvre les liens externes avec du target blank automatique](https://github.com/MoOx/jQuery.External-Links/).

<b>Je ne ferais plus jamais ça pour la simple raison du ratio "poids / % d'utilisation" de la dépendance.</b>

Alors oui, utiliser jQuery a peut-être du bon. Mais s'en passer aussi.
<a href="/posts/js/de-jquery-a-vanillajs/">C'est faisable pour pleins de petites choses</a>.
<a href="/posts/js/comment-se-passer-de-libraries-frameworks-javascript/">Et c'est pas forcément difficile</a>.

Car si je veux utiliser mon petit script qui ajoute des targets blank automatiquement,
 devoir inclure jQuery pour si peu, ça fait mal à mes kilobites.

En attendant <a href="http://wiki.ecmascript.org/doku.php?id=harmony:modules">
la gestion de modules via ES6</a>, il nous faut gérer aujourd'hui nos composants
et dépendances à la main.
Encore qu'on pourrait faire un transpiler pour utiliser cette syntaxe (ça existe
déjà, il n'y a qu'à voir sur GitHub), mais là on ne ferait que créer une nouvelle
définition de module.

Côté back-end, on a déjà ce qu'il faut en JavaScript avec la gestion
[des modules en Node](http://nodejs.org/api/modules.html).
Un simple `require('module')` va tenter de récupérer un module avec ce nom.
Un module n'est rien d'autre qu'un fichier JavaScript. Node va essayer de loader
un `.js`, puis `.json` et enfin `.node` si besoin), qui lui même peut
éventuellement charger d'autres dépendances (les dépendances sont gérées localement)
tout en prenant en compte les packages NPM.
Même si [Node](http://nodejs.org/) n'implémente pas totalement
[CommonJS](http://wiki.commonjs.org/wiki/CommonJS), un projet de développement d'une API pour
écrire des programmes en JavaScript ailleurs que dans le navigateur,
la façon de faire est assez proche.

<figure>![](browserify.png)</figure>

L'idée de [Browserify](http://browserify.org/) est d'amener cette façon de faire
dans le navigateur.

À côté de ça, vous me direz qu'on a déjà [RequireJS](http://requirejs.org/)
pour un résultat similaire.

RequireJS implémente l'API AMD  (Asynchronous Module Definition),
différent de l'API CommonJS.
Cette API, dérivée de CommonJS, se veut adaptée au navigateur. Son principal atout
étant le chargement des modules de manière asynchrone.
En théorie, c'est super.

Sauf que dans la pratique (du moins quelque chose de simple et classique,
disons pour l'exemple du petit JavaScript pour améliorer une page web, ou encore
une simple <em>single page webapp</em> (SPA)) ce n'est pas forcément pertinent.

En effet charger des modules de manières asynchrones n'est forcément pas optimisé
lorsqu'il s'agit de faire des pages qui se chargent rapidement.
Il suffit de penser aux problématiques de débits selon la vitesse de la connexion
au réseau (Edge, faible 3G...) et donc nombre de requêtes HTTP qui peuvent nous
faire souffrir de gros ralentissement pour se rendre compte que cela peut poser
problème.

En plus de cela, je trouve personnellement dégueulasse  la façon de déclarer les
modules AMD, mais ça ce n'est qu'un détail.

Comparons les différentes méthodes comme on nous les montre sur le site de
[RequireJS](http://requirejs.org/docs/whyamd.html) :

Le web aujourd'hui:

```js
(function () {
    var $ = this.jQuery;

    this.myExample = function () {};
}());
```

AMD:

```js
define(['jquery'] , function ($) {
    return function () {};
});
```

CommonJS:

```js
var $ = require('jquery');
exports.myExample = function () {};
```

AMD et CommonJS utilisent tout les deux une identification par chaîne de caractères.
Il faut bien que ces chaînes soient déclarées quelque part.

Côté RequireJS (AMD), on doit éventuellement mapper toutes ces chaînes à la main,
dans le fichier configuration.
De plus la déclaration des dépendances se faisant dans l'entête du module, ça peut
devenir lourd :

```js
define([ "require", "jquery", "blade/object", "blade/fn", "rdapi",
         "oauth", "blade/jig", "blade/url", "dispatch", "accounts",
         "storage", "services", "widgets/AccountPanel", "widgets/TabButton",
         "widgets/AddAccount", "less", "osTheme", "jquery-ui-1.8.7.min",
         "jquery.textOverflow"],
function (require,   $,        object,         fn,         rdapi,
          oauth,   jig,         url,         dispatch,   accounts,
          storage,   services,   AccountPanel,           TabButton,
          AddAccount,           less,   osTheme) {
  // ici le corps de la fonction
});
```

Bon vous me direz que si un module a autant de dépendances, il y a peut être un
problème en amont et vous n'aurez pas tort.

Côté Browserify (CommonJS like), les dépendances externes proviennent (à la base)
de NPM.
On a donc rien à mapper nul part. Puis pour avoir un module local, il suffit de
faire un `require('./mon/module')`, et Browserify se chargera de régler la
dépendance (et je vous montre encore mieux après).

RequireJS propose un "optimizer", qui au final ne fait que supprimer son point fort:
le côté asynchrone du téléchargement des modules.
Du coup on se retrouve avec tout RequireJS dans la source ET toutes les dépendances avec le mapping.
Il y a bien une façon de vraiment optimiser par bundle quand on cherche un peu
dans la doc, mais
[ça n'est pas vraiment mis en avant](http://requirejs.org/docs/optimization.html#wholemultipage).
Il existe aussi [Almond.js](https://github.com/jrburke/almond) qui se veut être
plus léger, mais du coup, utiliser RequireJS pour optimiser avec Almond, je ne
trouve pas ça cohérent.

Si jusque là, Browserify vous intéresse (plus car les autres solutions ne vous
intéressent pas), attaquons le corps du sujet.

## Installation de Browserify

Si vous souhaitez accéder à la commande via le terminal, la chose la plus simple
à faire est d'installer le paquet en global.

```console
$ npm install -g browserify
```

Si vous ne l'installez pas en global (sans l'option `-g`, vous aurez la commande
accessible dans `./node_modules/.bin/browserify`).
Mais selon votre workflow, vous pouvez l'utiliser via une tâche
[grunt-browserify](https://www.npmjs.org/package/grunt-browserify)
ou [gulp-browserify](https://www.npmjs.org/package/gulp-browserify).

## Utilisation de Browserify

Partons d'un simple fichier `main.js`:

```js
alert('Hello world !');
```

Sans aucune dépendance, ça n'a que peu de sens, mais c'est plus pour montrer un
dernier point intéressant.

Je le compile avec la commande suivante:

```console
$ browserify main.js -o bundle.js
```

J'obtiens le fichier suivant.

```js
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
alert('Hello world !');


},{}]},{},[1])
```

On reconnaît notre ligne en plein milieu. Avec un ajout conséquent. Ça peut paraître
beaucoup, mais c'est rien comparé à la
[source de RequireJS](http://requirejs.org/docs/release/2.1.10/minified/require.js)

Bon du coup partons avec un exemple peut être plus représentatif qu'on peut voir
sur la homepage de Browserify.

```js
var foo = require('./foo');
var gamma = require('gamma');

var n = gamma(foo(5) * 3);
var txt = document.createTextNode(n);
document.body.appendChild(txt);
```

Ici on aura en plus `foo.js`

```js
module.exports = function (n) { return n * 11 }
```

Et le module `gamma` qu'on a installé depuis NPM

```console
$ npm i gamma
```

<small><i>`i` est l'alias de `install`.</i></small>

Avec la même commande que précédement (et donc le même ajout), Browserify va parser
l'arbre syntaxique abstrait (AST) des appels à `require()` et va créer un graph
des dépendances du projet.  
Une fois ceci fait, il va simplement ajuster les chemins et déclarer les fonctions
mappées dans un object par leur identifiant. Lorsqu'une fonction appelle `require`,
le petit bout de script ajouté va se charger de retourner la dépendance.

Notez qu'on peut aussi simplement utiliser une redirection de sortie de commande
pour gérer le fichier final:

```console
$ browserify main.js > bundle.js
```

Du coup on a plus qu'à utiliser une simple balise `<script>` pour incorporer ça
dans nos pages web.

```html
<script src="bundle.js"></script>
```

## Les transformations avec Browserify

Tant qu'à utiliser un outil, autant l'exploiter jusqu'au bout. Car pour l'instant
je n'ai parlé que de NPM.
Que faire si mon module n'est pas sur NPM ?
Bon déjà je double check, car maintenant la plupart des librairies y sont
(jQuery, Backbone et Jean passe).
Si ce n'est pas le cas, je pourrais toujours faire `npm i https//adresse.git`
mais si le paquet n'a pas de `package.json` avec le `main` bien rempli, ça ne va
pas forcément être le mieux.

Cela dit, si mon paquet est prévu pour Bower par exemple, il existe une <i>transformation</i>
prévue pour aider Browserify à résoudre les références aux paquets pour les
consommer depuis Bower: `debowerify`.
Dans le même esprit, on va retrouver de nombreuses transformations telles que :

- `decomponentify`: pour consommer des [component](https://github.com/component/component)s,
- `deamdify`:  pour consommer des modules AMD,
- `deglobalify`: pour consommer des modules qui utilisent des variables globales,
- `jadeify`: pour consommer des fichiers de templates jade,
- `hbsify`: pour consommer des fichiers de templates handlebars,
- `es6ify`: pour écrire du JavaScript ES6 (compilé en ES5),
- `uglifyify`: appliquer uglify.

Il existe plein [d'autres transformations](https://www.npmjs.org/browse/keyword/browserify)
qui s'adapteront sûrement à vos besoins.

Du coup la ligne ultime pour consommer a peu près n'importe quel module :

```console
browserify -t debowerify -t decomponentify -t deamdify -t deglobalify -t es6ify main.js > bundle.js
```

L'équivalent avec les tâches Grunt ou Gulp sera tout aussi simple via un tableau.
Pensez bien à installer ces dépendances avant:

```console
npm install debowerify decomponentify deamdify deglobalify es6ify --save
```

## Ecrire un module pour Browserify (mais pas que)

Consommer c'est bien, mais faire c'est <del>mieux</del> bien aussi.

<figure>![](browserify-potter.png)</figure>

Tout droit sorti de [UMD](https://github.com/umdjs/umd) (Universal Module Definition),
voici un wrapper qui vous permettra de créer votre module compatible avec CommonJS,
AMD et pour les projets old school !

```js
(function (root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(require('b'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['b'], function (b) {
      return (root.returnExportsGlobal = factory(b));
    });
  } else {
    // Global Variables
    root.returnExportsGlobal = factory(root.b);
  }
}(this, function (b) {

  // Ici votre module (fonction, objet, whatever...)
  return {};
}));
```

Il existe bien sur [plusieurs façons de faire](https://github.com/umdjs/umd#variations)
selon vos critères. À vous de choisir.

Maintenant vous allez pouvoir consommer et écrire des modules facilement, et
sans vous prendre la tête.

Bisous.

_PS: pour tester browserify en live, c'est sur [requirebin.com](http://requirebin.com/)._
