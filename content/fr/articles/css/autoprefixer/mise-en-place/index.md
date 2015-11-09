---
date: "2014-03-04"
title: Mise en place d’autoprefixer
tags:
  - css
  - préfixe
authors:
  - MoOx
---

Suite à mon précédent article [Comment en finir avec les préfixes CSS](/posts/css/comment-en-finir-avec-les-prefixes/),
certains sont restés sur leur faim.
Voici donc de rapides exemples de mise en place de cette solution.

## Installation d’autoprefixer

Il vous faudra [Node.js](http://nodejs.org/) (qui embarque maintenant [Npm](https://www.npmjs.org/)) afin de pouvoir
installer ce nouveau joujou.

```console
# on install autoprefixer via npm en global
$ npm install --global autoprefixer
# ou pour les fainéants
$ npm i -g autoprefixer
```

Une fois ceci fait, vous devriez avoir la commande `autoprefixer` disponible.
On vérifie de suite avec `autoprefixer -v`.

```console
$ autoprefixer -v
autoprefixer 1.0.20140203
```

Vous remarquerez que le numéro de version est un peu spécial : il contient une
date en place d’un numéro de patch. Cette date correspond à la dernière mise à
jour de la base de données de _Can I Use_.

## Utilisation d’autoprefixer

```console
$ autoprefixer *.css
```

C’est aussi simple que ça.

En fait non je plaisante, c’est un tout petit peu plus long car par défaut,
comme beaucoup de commandes, vous allez avoir la sortie crachée en plein visage.

Pour voir les options, comme d’habitude `--help` ou `-h` :

```console
$ autoprefixer -h
```

On y apprend l’existance des options suivantes :

```
Options:
  -b, --browsers BROWSERS  add prefixes for selected browsers
  -o, --output FILE        set output file
  -d, --dir DIR            set output dir
  -m, --map                generate source map
  -i, --info               show selected browsers and properties
  -h, --help               show help text
  -v, --version            print program version
```

Du coup si on veut faire un coup de commande bien personnalisée on pourra faire :

```console
$ autoprefixer -b "last 2 versions, > 1%, Explorer 7, Android 2" -o prefixed.css index.css
```

Il va par contre nous falloir un fichier css pour tester :

```console
# on met un peu de CSS dans index.css manière de tester le bouzin
$ echo "* { box-sizing:border-box}" > index.css
```

On peut donc essayer notre commande plus haut qui va remplir le fichier `prefixed.css`

Pour vérifier :

```console
$ cat prefixed.css
* { -webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box}
```

On a bien eu des préfixes ajoutés en fonction de notre demande (bon rien pour IE
qui n’est pas passé par une version préfixé)

Par défaut, _autoprefixer_ utilise `> 1%, last 2 versions, Firefox ESR, Opera 12.1` pour les navigateurs.
Je pense que pour la plupart d’entre vous voudront ajouter "Explorer 8" à la liste, mais ça
n’est en théorie pas nécessaire vu le permier argument qui demande de préfixer tous les navigateurs
dont l’usage global est supérieur à 1%. Peut-être Explorer 7 pour certains ?
Faites un tour sur la [page dédié aux statistiques globales sur CanIUse.com](http://caniuse.com/usage_table.php) pour avoir une idée.

Sinon, pour du petit one shot, un plugin dans votre éditeur suffira:

- [plugin autoprefixer pour Atom](https://github.com/sindresorhus/atom-autoprefixer)
- [plugin autoprefixer pour Sublime Text](https://github.com/sindresorhus/sublime-autoprefixer)
- [plugin autoprefixer pour Brackets](https://github.com/mikaeljorhult/brackets-autoprefixer)

<figure>
  ![sublime text autoprefixer preview](autoprefixer.gif)
  <figcaption>Intégration dans Sublime Text</figcaption>
</figure>

## Automatisation d’autoprefixer (autoception)

Bien entendu on va pas se taper la commande à la main tout le temps hein...
Il nous faut automatiser nos processus. Sans quoi on perd du temps, et
[le temps... C’est du temps !](http://deboutlesgens.com/blog/jai-pas-le-temps-la-pire-excuse-qui-soit/)

Donc, comme je l’ai dit précédemment, on peut utiliser _autoprefixer_ avec les solutions
suivantes:

- via [Node.js](https://github.com/ai/autoprefixer#nodejs) directement,
- en plugin [Gulp](https://www.npmjs.org/package/gulp-autoprefixer),
- en plugin [Grunt](https://github.com/ai/autoprefixer#grunt),
- via [Compass](https://github.com/ai/autoprefixer#compass),
- en plugin [Stylus](https://github.com/ai/autoprefixer#stylus),
- avec [RoR](https://github.com/ai/autoprefixer#ruby-on-rails) ou [Ruby](https://github.com/ai/autoprefixer#ruby),
- avec l’application [Prepros](https://github.com/ai/autoprefixer#prepros)
- via [Mincer](https://github.com/ai/autoprefixer#mincer)
- via [Middleman](https://github.com/ai/autoprefixer#middleman)
- avec [PHP](https://github.com/ai/autoprefixer#php) (vous avez bien lu)

Si vous avez besoin, je pense que vous trouverez sans trop de problème d’autres
implémentations.

Cela dit, je vais vous montrer quelques cas d’utilisations:

### Make

Là c’est facile, tout bon développeur doit avoir `make` sur sa machine (sinon
c’est que t’es pas développeur, je sais pas trop ce que tu fais ici du coup).

On peut tout simplement créer un fichier `Makefile` avec la commande précédente:

```console
# création d’un dossier pour notre popote (puis on va dedans...)
$ mkdir autoprefixer-test && cd autoprefixer-test

# On créer un makefile avec une tâche `css` (création/écrasement via >)
$ echo "css:" > Makefile

# On vérifie qu’on a bien rempli le fichier
$ cat Makefile

## On ajoute notre commande au fichier (ajout au fichier existant via >>)
$ echo "\tautoprefixer index.css -b \"last 2 versions, > 1%, Explorer 7, Android 2\" -o prefixed.css" >> Makefile

# On vérifie qu’on a bien rempli le fichier
$ cat Makefile
```

Voilà votre Makefile doit être bien rempli. Pour tester la commande `css`:

```console
$ make css
```

Vous remarquerez que la commande _autoprefixer_ s’affiche, si ça vous embête, rajoutez
`@` devant. Vous pouvez modifier votre Makefile dans ce sens:

```
css:
    echo "❯ Autoprefixage magique."
    @autoprefixer index.css -b "last 2 versions, > 1%, Explorer 7, Android 2" -o prefixed.css
```

_Attention : Les Makefiles utilisent des tabulations uniquement ! Sans quoi cela
ne va pas marcher comme prévu._

Vous avez donc maintenant un exemple assez simpliste qui peut être utilisé si
vous n’avez pas encore [automatisé votre workflow](http://www.24joursdeweb.fr/2013/automatisez-votre-workflow-front-end/)
via des outils comme [Gulp](http://gulpjs.com/) ou [Grunt](http://gruntjs.com/).

Passons justement à ces solutions plus sérieuses.

### Autoprefixer avec Gulp

Je ne vais pas trop rentrer dans les détails de Gulp (ce n’est pas le sujet ici).
Voici cependant une exemple assez bref et compréhensible pour commencer, avec
une seule écriture sur le système de fichier (contrairement à la solution Grunt).

```js
// gulp stuff
var gulp = require("gulp")
var gutil = require("gulp-util")
  // le plombier ajuste les fuites des tuyaux (erreur de pipe)
  // ceci est conseillé pour éviter que chaque erreur "casse" tout le process
  // dès qu’une erreur est remonté par un plugin
var plumber = require("gulp-plumber")

// css stuff
var sass = require("gulp-ruby-sass")
var autoprefixer = require("gulp-autoprefixer")
var csso = require("gulp-csso")

// css task: sass, autoprefixer et csso si --production
gulp.task("styles", function() {
  gulp.src("./src/css/*.scss")
    // it’s me, Mario
    .pipe(plumber())

    .pipe(sass({style: "expanded"}))

    // Autoprefixer \\
    // vous remarquerez que ici chaque option est un paramètre
    // pas comme pour l’appel en ligne de commande.
    .pipe(autoprefixer("last 2 versions", "> 1%", "Explorer 7", "Android 2"))

    // optimisation CSS pour la prod uniquement
    .pipe(gulp.env.production ? csso() : gutil.noop())

    // unique écriture sur disque
    .pipe(gulp.dest("./dist/css/"))
    // je passe sur cette partie à configurer, mais ici on peut imaginer un
    // livereload en plus, il faudra définir livereload et livereloadServer
    // cette partie dépend un peu de votre serveur durant le dév.
    // ca fera l’objet d’un post tiens...
    //.pipe(livereload(livereloadServer))
})

gulp.task("dev", ["styles"], function() {
  gulp.watch("./src/css/**/*", function(event) {
    gulp.run("styles")
  })
})

// Tâches disponibles :

// - pour générer les feuilles de styles
//   (pour optimiser pour la prod, utiliser l’option)
// $ gulp styles [--production]

// - pour le dev, surveille et lance la tâche `styles` dès que nécessaire
// $ gulp dev
```

### Autoprefixer avec Grunt

Voici un petit Gruntfile avec la même configuration que ci dessus

```js
module.exports = function(grunt) {
  "use strict";

  grunt.loadNpmTasks("grunt-contrib-sass")
  grunt.loadNpmTasks("grunt-autoprefixer")
  grunt.loadNpmTasks("grunt-csso")
  grunt.loadNpmTasks("grunt-contrib-watch")

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: "expanded"
        },
        files: [{
          expand: true,
          flatten: true,
          cwd: "./src/css",
          src: ["*.scss"],
          dest: "./dist/css",
          ext: ".css"
        }]
      }
    },
    autoprefixer: {
      options: {
        browsers: ["last 2 versions", "> 1%", "Explorer 7", "Android 2"]
      },
      dist: {
        expand: true,
        flatten: true,
        cwd: "./dist/css",
        src: ["*.css"],
        dest: "./dist/css/"
      }
    },
    csso: {
      dist: {
        expand: true,
        flatten: true,
        cwd: "./dist/css/",
        src: ["*.css"],
        dest: "./dist/css/"
      }
    },
    watch: {
      styles: {
        files: ["./src/css/**/*.scss"],
        tasks: ["styles"]
      }
    }
  })

  grunt.registerTask("styles", ["sass", "autoprefixer"])
  grunt.registerTask("styles:production", ["sass", "autoprefixer", "csso"])
  grunt.registerTask("dev", ["sass", "watch"])
}

// Tâches disponibles :

// - pour générer les feuilles de styles
// $ grunt styles

// - pareil, mais optimiser pour la prod
// $ grunt styles:production

// - pour le dev, surveille et lance la tâche `styles` dès que nécessaire
// $ grunt watch
```

Comme vous pouvez le voir, la version Grunt est un peu plus volumineuse (bien qu’espacée).
Personnellement j’aime la concision de gulp.
De plus la version Grunt sera plus longue car nous aurons 3 lectures / écritures sur le disque.

_Notez que bien entendu dans notre exemple précédent, nous pouvons remplacer Sass
par un autre pré / post-processeur._

### Autoprefixer avec Stylus

Dans les exemples précédents, j’ai montré une solution classique avec Sass.
Mais voici complètement autre chose: _autoprefixer_ peut s’utiliser en "plugin" Stylus.

C’est assez simple il suffit d’utiliser l’option `use` (`-u` en cli).
Voilà ce qu’on aurait en cli :

```console
$ npm install -g stylus autoprefixer-stylus
$ stylus -u autoprefixer-stylus -o index.css index.styl
```
#### Avec Grunt

Il suffira d’utiliser donc l’option `use` dans votre configuration.

#### ~~Avec Gulp~~

La façon de faire de gulp, via des streams pour éviter la lecture / écriture multiple fait que le plugin
_autoprefixer-stylus_ est vide de sens.
Vous pouvez donc utiliser _autoprefixer_ normalement, après l’appel du pré-processeur.


---


Voilà j’espère que cette fois-ci vous êtes rassasié(e) afin de ne plus avoir envie de manger des préfixes CSS !
