---
date: "2014-04-29"
title: Introduction à Gulp
tags:
  - javascript
  - tools
  - gulp
authors:
  - MoOx
---

Vous commencez tous à connaitre les _tasks runners_, ces outils qui permettent
d'automatiser les tâches de développement récurrentes.
Personnellement
 [je n'ai](http://moox.io/slides/2013/grunt-before-after/)
 [pas arrêté](http://www.24joursdeweb.fr/2013/automatisez-votre-workflow-front-end/)
 [d'en parler](http://moox.io/slides/2014/introduction-gulp/)
 depuis que
 [Grunt](/posts/js/premiers-pas-avec-grunt/)
 à déterré cette vielle problématique, assez récente pour le développement Web côté front end.

Il faut avouer que de par l'évolution du développement Web, côté front end,
on voit beaucoup de personnes qui n'ont pas de vraies bases de développeur.
Je veux dire par là non pas que ces personnes sont incompétentes, mais plutôt
qu'il manque parfois la bonne flemme du développeur, celle qui le pousse à **développer**
des solutions techniques pour mieux développer des produits.
Il manque un peu [d'algorithmie](http://fr.wiktionary.org/wiki/algorithmie)
dans les veines, de curiosité et d'amour du risque.
Ce n'est pas en restant dans sa zone de confort qu'on va de l'avant. Enfin si vous
avez des exemples contraires, je suis preneur.
Mais tout cela doit provenir du fait que pas mal de métiers dans le web sont nouveaux,
dont celui de « développeur Web front end » et que du coup, peu de personnes ont
initialement suivi des formations appropriés (pour ma part je proviens d'une
formation _d'analyste-programmeur_, conception et développement software quoi).
Je remarque que niveau back end il y a beaucoup moins de lacunes, du fait que
les problématiques gérées de ce côté sont (il me semble) moins nouvelles.

Bref. Je ne vais pas m'éterniser sur une intro du pourquoi on met en place un task
runner, ni faire une comparaison entre Make, Rake, Cake, Jake, Grunt, Brunch
et Broccoli.
Rentrons dans le vif. Parlons Gulp.

# Pourquoi Gulp

Je vais faire court. Pour faire simple, son point fort réside dans le fait qu'il utilise des
[streams](http://dailyjs.com/2012/09/10/streams/) (tl;dr: un flux de données - en mémoire)
et qu'il limite au maximum l'utilisation de fichiers.
Au point qu'il existe une [police Gulp](https://github.com/godaddy/gulp-header/issues/4#issuecomment-32111457)
pour vous dire.
Si vous voulez en savoir plus sur les streams, n'hésitez pas à lire l'article de
Nicolas Froidure [Gulp remplacera-t-il Grunt ?](http://insertafter.com/fr/blog/gulp_vs_grunt.html)
qui contient une partie explicative sur les streams.

Dans la pratique cela évite d'avoir un gruntfile qui, si on imagine une task
sass -> autoprefixer -> csso, passe [3 fois par des lectures/écritures sur le système
de fichiers](/posts/css/mise-en-place-autoprefixer/#autoprefixer-avec-grunt).

<figure>
  ![](http://jaysoo.ca/images/grunt-flow-2.png)
  <figcaption>Sans stream</figcaption>
</figure>

Et du coup au lieu d'avoir un fichier de conf d'une soixantaine de lignes, on arrive
à avoir [quelque chose de concis](http://putaindecode.fr/posts/css/mise-en-place-autoprefixer/#autoprefixer-avec-gulp)
(une vingtaine de ligne seulement).

<figure>
  ![](http://jaysoo.ca/images/gulp-flow.png)
  <figcaption>Avec stream</figcaption>
</figure>

## Installation

Pour avoir la commande globale sur le système (comme grunt-cli) :

```console
$ npm i -g gulp
```

Ensuite dans votre projet :

```console
$ npm i -D gulp gulp-util gulp-plumber gulp-WHATEVER
```

_Note : `npm i -D` == `npm install --save-dev`, c'est cadeau._

Bon dans mon exemple j'ai mis un peu n'importe quoi, donc on va faire un mini workflow de hipster hacker.

## Utilisation

On part avec une tâche très simple : transpiler [cssnext](http://cssnext.io).

```console
$ mkdir putaindegulp && cd putaindegulp
$ npm init
$ npm i -D gulp gulp-util gulp-plumber gulp-cssnext gulp-csso minimist
```

```js
var gulp = require("gulp")
var gutil = require("gulp-util")
var plumber = require("gulp-plumber")
var cssnext = require("gulp-cssnext")
var csso = require("gulp-csso")
var options = require("minimist")(process.argv.slice(2))

gulp.task("styles", function() {
  gulp.src("./src/css/*.css")
    .pipe(!options.production ? plumber() : gutil.noop())
    .pipe(cssnext({sourcemap: !options.production}))
    .pipe(options.production ? csso() : gutil.noop())
    .pipe(gulp.dest("./dist/css/"))
})

gulp.task("default", ["styles"], function() {
  gulp.watch("./src/css/**/*", ["styles"])
})
```

Voilà c'est tout. Et heureusement.

Bon, on se refait l'exemple commenté :

```js
// bah là ok, on est obligé d'y passer pour avoir l'API Gulp
var gulp = require("gulp")

  // Ça c'est optionnel, c'est pour avoir (entre autres la méthode noop())
  // je reviens dessus après
  // https://github.com/gulpjs/gulp-util
var gutil = require("gulp-util")

  // Là on a Mario le plombier qui fixe la tuyauterie foireuse.
  // Ce plugin patch le problème de stream avec node.js qui fait que tout le process
  // explose à la moindre erreur (pas pratique en cas de watch par exemple)
  // en gros, il remplace la méthode pipe et attrape les erreurs pour les ressortir gentiment
  // https://gist.github.com/floatdrop/8269868
var plumber = require("gulp-plumber")

  // Ici, rien de magique, du plugin en veux-tu en voilà
var cssnext = require("gulp-cssnext")
var csso = require("gulp-csso")

  // ici on chope les options de la ligne de commande
  // exemple: pour avoir options.production à true,
  // il suffit de faire `gulp --production`
var options = require("minimist")(process.argv.slice(2))

// Définition d'une tâche, un nom et une fonction.
// Ce qui est pratique c'est le fait de pouvoir mettre ce qu'on veut
// y compris un console.log() ^^
// un autre paramètre peut être ajouté avant la fonction, qui permet de préciser
// les dépendances (cf task dev plus bas par exemple)
gulp.task("styles", function() {

  // Ici on attrape les fichiers (glob classique)
  // à la racine (on va considérer que nos fichiers finaux ne seront pas dans
  // des sous dossiers, réservés aux partials & co)
  gulp.src("./src/css/*.css")

    // On utilise plumber que si on build en dev, sinon faut que ça pête, qu'on
    // soit prévenu lors d'un build pour la prod
    .pipe(!options.production ? plumber() : gutil.noop())

    // Et là on pipe nos plugins
    // toujours en jouant avec les options si besoin
    .pipe(cssnext({
      compress: options.production,
      sourcemap: !options.production
    }))

    // Super important, on convertit nos streams en fichiers
    .pipe(gulp.dest("./dist/css/"))
})

// Ici on a une tâche de dev qui lance un watch APRES avoir exécuté `styles` une fois
gulp.task("default", ["styles"], function() {

  // gulp.watch est natif (pas comme avec grunt)
  // vous noterez qu'ici par exemple on va surveiller tous les fichiers
  // et non pas ceux juste à la racine par exemple
  gulp.watch("./src/css/**/*", ["styles"])
})

// Comme grunt, `gulp` sans argument lancera la tâche `default`.
```

Bien entendu, vous avez déjà compris que si vous voulez remplacer cssnext par Sass,
c'est l'histoire de 4 secondes.

Chez _Putain de code !_ on a aimé Gulp. Il faut bien avouer que
[ça va vite](https://twitter.com/putaindecode/status/460868992396460032)
(encore plus appréciable lorsque l'on n'a pas de SSD) et que c'est plaisant à
écrire comparé à Grunt.
Pas de configurations pas spécialement verbeuse et trop espacée.
Avec Gulp on se sent plus libre, moins contraint.
Du coup, on avait carrément refait notre site avec Gulp
(puis au passage un petit refresh graphique tant qu'à faire).

**Mise à jour: depuis nous avons simplifié encore simplifié notre process et nous
nous sommes passé de Gulp.**

Pour aller plus loin, vous n'avez qu'à ouvrir notre ancien
[Gulpfile](https://github.com/putaindecode/putaindecode.fr/blob/6702dffed608cf6d03141f1dcdbb096a66ff7d8f/gulpfile.js)
et regarder nos
[tasks](https://github.com/putaindecode/putaindecode.fr/tree/6702dffed608cf6d03141f1dcdbb096a66ff7d8f/tasks)
de l'époque qui vont de
[la plus simple](https://github.com/putaindecode/putaindecode.fr/blob/6702dffed608cf6d03141f1dcdbb096a66ff7d8f/tasks/clean.js)
à
[la plus compliqué](https://github.com/putaindecode/putaindecode.fr/blob/6702dffed608cf6d03141f1dcdbb096a66ff7d8f/tasks/contributors.js).

Pour voir des tâches plus « real world example » je vous invite à regarder les tasks suivantes :

- [server](https://github.com/putaindecode/putaindecode.fr/blob/6702dffed608cf6d03141f1dcdbb096a66ff7d8f/tasks/server.js),
le server de dev local avec livereload dedans ;
- [watch](https://github.com/putaindecode/putaindecode.fr/blob/6702dffed608cf6d03141f1dcdbb096a66ff7d8f/tasks/watch.js),
le classique et si simple watcher ;
- [deploy](https://github.com/putaindecode/putaindecode.fr/blob/6702dffed608cf6d03141f1dcdbb096a66ff7d8f/tasks/deploy.js),
la tâche pour publier le dossier `dist/` sur les [gh-pages](https://pages.github.com/) ;
- [icons](https://github.com/putaindecode/putaindecode.fr/blob/6702dffed608cf6d03141f1dcdbb096a66ff7d8f/tasks/icons.js),
qui transforme des SVG en fontes d'icones avec le bout de CSS qui va bien ;
- [scripts-linting](https://github.com/putaindecode/putaindecode.fr/blob/6702dffed608cf6d03141f1dcdbb096a66ff7d8f/tasks/scripts-linting.js),
qui vérifie la qualité du code ;
- [scripts](https://github.com/putaindecode/putaindecode.fr/blob/6702dffed608cf6d03141f1dcdbb096a66ff7d8f/tasks/scripts.js),
du [browserify](/posts/js/browserify-all-the-things/) pour nos JS côté client ;
- [stylesheets](https://github.com/putaindecode/putaindecode.fr/blob/6702dffed608cf6d03141f1dcdbb096a66ff7d8f/tasks/stylesheets.js),
notre tâche pour coder des css du futur ;

## Vous reprendrez bien un peu de… Gulp* ! Pardon.

Si vous avez encore envie de détails je vous renvoie sur l'article anglais
[Getting started with gulp](http://markgoodyear.com/2014/01/getting-started-with-gulp/)
qui détaille tellement bien chaque point que même un anglophobe comprendrait.

Vous avez aussi
[une documentation](https://github.com/gulpjs/gulp/blob/master/docs/README.md)
très bien faite, qui comporte carrément
[des exemples _officiels_ tout prêts](https://github.com/gulpjs/gulp/tree/master/docs/recipes).

Comme je vous disais plus tôt, les auteurs de Gulp sont assez carrés et valident
(ou plutôt _invalident_) [les plugins](https://www.npmjs.org/search?q=gulpplugin) qui
ne respectent pas les
[règles](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md).
Je trouve que c'est gage de qualité.

Pour finir quelques liens pour ceux qui en veulent toujours plus :

- [Gulp : Retour d'expérience](http://insertafter.com/fr/blog/retour_experience_gulp.html)
- [Grunt vs. Gulp, au-delà des chiffres](http://jaysoo.ca/2014/01/27/gruntjs-vs-gulpjs/) (anglais)

```console
$ gulp bisous
❯ ♡ 😘
```
