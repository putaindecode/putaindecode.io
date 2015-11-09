---
date: "2013-11-16"
title: Premiers pas avec Grunt
tags:
  - javascript
  - tools
  - grunt
authors:
  - kud
---

<div class="putainde-Note">
Nous vous conseillons aujourd'hui d'utiliser un gestionnaire de tâches qui
nous paraît être mieux sur bien des points: configuration plus souple, lisible
et facile et rapidité vous attendent avec [Gulp](/posts/js/introduction-gulp).
</div>

<figure class="putainde-Media putainde-Media--left">![](gruntjs.png)</figure>

Vous avez sûrement déjà entendu parler de **Grunt** à droite à gauche, en conférence, voire votre boite l'utilise déjà mais vous ne savez toujours pas trop ce qui se cache derrière ce terme saugrenu digne d'un personnage de Warcraft. Soit, ce n'est pas bien grave. **Grunt** est simplement un *JavaScript Task Runner*, un outil vous permettant de créer des tâches automatisées en JavaScript. Forcément ce n'est pas très parlant mais c'est tout l'intérêt de cet article, vous expliquer ce qu'est **Grunt** et pourquoi il peut vous être utile dans un _workflow_ de front-end dev.

# Commençons

Vous est-il déjà arrivé de devoir régulièrement lancer, lancer et relancer des processus tels que _Sass_, _LESS_, _uglify_ - en somme des préprocesseurs ou des minifiers - régulièrement à la main ? N'est-ce pas pénible ? N'est-ce pas aussi pénible de devoir indiquer à tous ses collègues comment ils doivent bosser pour que vous soyez tous cohérents ? Oui ? **Grunt** permet de résoudre ce genre de choses : respecter un putain de _workflow_ en s'assurant que le parcours soit le même pour tout le monde et d'exécuter tout ça en lançant une seule commande. N'est-ce pas fucking aweeeeesome dude ? Bref.

Voici un _workflow_ assez classique :

- Compiler mes `.scss` en `.css`;
- Concaténer mes `*.js` en un seul fichier;
- Minifier (avec _uglify_ par exemple) la résultante de l'action précédente.

Voyons maintenant comment l'on peut mettre en place ceci via **Grunt**.


## Installation

Tout d'abord, installons **Grunt**. Notez que **Grunt** est en _nodejs_ et que je considère que vous avez déjà _nodejs_ d'installé. D'autre part, nous allons créer un nouveau projet **npm** afin d'enregistrer tous les packages que vous allez installer. Je vous explique par la suite pourquoi nous faisons ça.

```console
$ npm init // puis plusieurs fois entrée
```

En premier lieu, il faut installer le *package* qui permet de gérer **Grunt** en ligne de commande. C'est le _commander_ de **Grunt** en gros.

```console
$ npm install -g grunt-cli
```

Une fois cela fait, installez **Grunt** en local dans votre projet.

```console
$ npm install grunt --save-dev
```

Ni plus ni moins, **Grunt** est enfin installé dans votre projet.

## Initialisation

Maintenant, il est nécessaire de créer un fichier de configuration **Grunt**. Pour cela, nous allons créer un fichier nommé `Gruntfile.js` à la racine de votre projet.

```console
$ touch Gruntfile.js
```

Fait ? Voici maintenant à quoi doit ressembler la base d'une configuration **Grunt**.

```javascript
module.exports = function(grunt) {

  // Configuration de Grunt
  grunt.initConfig({})

  // Définition des tâches Grunt
  grunt.registerTask('default', '')

}
```

Nous avons maintenant tout le nécessaire pour débuter notre projet. Nous allons enfin pouvoir attaquer les choses sérieuses. Revenons un peu en arrière où nous expliquions que nous voulons en tout premier lieu compiler nos `.scss` en `.css`.

## Créer sa première tâche

Une petite recherche sur votre moteur de recherche préféré en tapant `grunt sass` et vous trouverez le projet [`grunt-contrib-sass`](https://github.com/gruntjs/grunt-contrib-sass).

Toute documentation pour installer une tâche **Grunt** est indiquée sur chaque `README.md` du projet mais pour un souci de clarté et de compréhension, je vais tout de même vous expliquer ici comment faire.

D'abord, installons le package pour _Sass_.

```console
$ npm install grunt-contrib-sass --save-dev
```

Ceci va installer le _package_ `grunt-contrib-sass` dans votre dossier `node_modules` où vous pourrez l'utiliser en l'important dans votre `Gruntfile.js`.

Un exemple d'utilisation :

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    sass: {                              // Nom de la tâche
      dist: {                            // Nom de la sous-tâche
        options: {                       // Options
          style: 'expanded'
        },
        files: {                         // Liste des fichiers
          'main.css': 'main.scss',       // 'destination': 'source'
          'widgets.css': 'widgets.scss'
        }
      }
    }
  })

  // Import du package
  grunt.loadNpmTasks('grunt-contrib-sass')

  // Redéfinition de la tâche `default` qui est la tâche lancée dès que vous lancez Grunt sans rien spécifier.
  // Note : ici, nous définissons sass comme une tâche à lancer si on lance la tâche `default`.
  grunt.registerTask('default', ['sass:dist'])
}
```

Nous avons maintenant tout le nécessaire pour pouvoir compiler nos `.scss` en  `.css`.

Vous vous demandez peut-être comment vous pouvez généraliser vos sources plutôt que les définir une par une. Pas de souci.

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{ // C'est ici que l'on définit le dossier que l'on souhaite importer
          "expand": true,
          "cwd": "src/styles/",
          "src": ["*.scss"],
          "dest": "dist/styles/",
          "ext": ".css"
        }]
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-sass')

  grunt.registerTask('default', ['sass:dist'])
}
```

## Deuxième tâche : concaténer ses fichiers JavaScript

Passons maintenant à la concaténation des fichiers JavaScript.

Comme pour la majorité des tâches dont vous aurez besoin avec **Grunt**, un _package_ **Grunt** existe déjà pour ce travail demandé.

-> [`grunt-contrib-concat`](https://github.com/gruntjs/grunt-contrib-concat)

Installation : `npm install grunt-contrib-concat --save-dev` (`--save-dev` permet de sauvegarder le package dans `package.json` pour pouvoir à tout moment le réinstaller en faisant `npm install`)

On ajoute alors à notre configuration **Grunt** l'importation de `grunt-contrib-concat` :

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{
          "expand": true,
          "cwd": "src/styles/",
          "src": ["*.scss"],
          "dest": "dist/styles/",
          "ext": ".css"
        }]
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat'); // Voilà l'ajout.

  grunt.registerTask('default', ['sass:dist'])
}
```

Puis on ajoute notre tâche :

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{
          "expand": true,
          "cwd": "src/styles/",
          "src": ["*.scss"],
          "dest": "dist/styles/",
          "ext": ".css"
        }]
      }
    },
    concat: {
      options: {
        separator: ';', // permet d'ajouter un point-virgule entre chaque fichier concaténé.
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'], // la source
        dest: 'dist/built.js' // la destination finale
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['sass:dist'])
}
```

Ne pas oublier d'ajouter la tâche de concaténation à notre tâche par défaut :

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{
          "expand": true,
          "cwd": "src/styles/",
          "src": ["*.scss"],
          "dest": "dist/styles/",
          "ext": ".css"
        }]
      }
    },
    concat: {
      options: {
        separator: ';', // permet d'ajouter un point-virgule entre chaque fichier concaténé.
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'], // la source
        dest: 'dist/built.js' // la destination finale
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['sass:dist', 'concat:dist']) // ici même.
}
```

## Compressons le tout !

Pour finir, compressons nos fichiers JavaScript ! Pour cela : [`grunt-contrib-uglify`](https://github.com/gruntjs/grunt-contrib-uglify) fera l'affaire.

Je vous passe les détails pour l'installer, si vous avez bien suivi cet article, vous ne devriez avoir aucun problème pour cela.

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{
          "expand": true,
          "cwd": "src/styles/",
          "src": ["*.scss"],
          "dest": "dist/styles/",
          "ext": ".css"
        }]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        dest: 'dist/built.js'
      }
    },
    uglify: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        dest: 'dist/built.js'
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-concat')

  grunt.registerTask('default', ['sass:dist', 'concat:dist'])
}
```

Ne constatez-vous pas un souci ici ? Oui, nous ne voulons sûrement pas à la fois concaténer nos fichiers et les compresser. Alors comment faire ? Pas d'inquiétude, il suffit de créer des tâches d'environnement ou de contexte. On pourrait par exemple créer une tâche développement et une tâche de production, qu'en pensez-vous ? Pas mal non ? :)

## Optimisons !

Supprimons alors dans un premier temps notre tâche par défaut et créons deux tâches : `dev` et `dist`.

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{
          "expand": true,
          "cwd": "src/styles/",
          "src": ["*.scss"],
          "dest": "dist/styles/",
          "ext": ".css"
        }]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        dest: 'dist/built.js'
      }
    },
    uglify: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        dest: 'dist/built.js'
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-concat')

  grunt.registerTask('dev', [])
  grunt.registerTask('dist', [])
}
```

Sauf que comme ça, vous le voyez, cela ne va pas faire grand chose, voire rien du tout. Agrémentons alors nos deux tâches par ce qu'on souhaite faire.

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{
          "expand": true,
          "cwd": "src/styles/",
          "src": ["*.scss"],
          "dest": "dist/styles/",
          "ext": ".css"
        }]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        dest: 'dist/built.js'
      }
    },
    uglify: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        dest: 'dist/built.js'
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-concat')

  grunt.registerTask('dev', ['sass:dist', 'concat:dist']) // C'est pas chouette ça ?
  grunt.registerTask('dist', ['sass:dist', 'uglify:dist']) // Et hop, je compresse si je lance $ grunt dist
}
```

Ha ! Nous y voilà ! Nous avons alors deux tâches ```grunt dev``` et ```grunt dist``` qui nous permettent dans tous les cas de générer nos CSS et dans un cas concaténer nos JS, et dans l'autre de les compresser (la compression fait aussi la concaténation implicitement).

Sauf que comme tout bon(ne) développeur/euse, vous êtes une grosse feignasse et compiler à chaque fois que vous faites des modifications sur vos fichiers va vite être saoulant.

Pour cela, une tâche existe, elle s'appelle ```watch``` (via le package [`grunt-contrib-watch`](https://github.com/gruntjs/grunt-contrib-watch/)).

## Regarde ce fichier que je ne... euh bref.

Très simple, `watch` va vous permettre de "regarder" vos fichiers, savoir lesquels ont changé et donc lancer une action en fonction du type de fichiers.

Imaginons que l'on veut par exemple compiler nos CSS à chaque fois que l'on change un fichier _Sass_. Ou encore que l'on concatène nos fichiers JavaScript dès que l'on touche à l'un d'entre eux.

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{
          "expand": true,
          "cwd": "src/styles/",
          "src": ["*.scss"],
          "dest": "dist/styles/",
          "ext": ".css"
        }]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        dest: 'dist/built.js'
      }
    },
    uglify: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js']
        dest: 'dist/built.js'
      }
    },
    watch: {
      scripts: {
        files: '**/*.js', // tous les fichiers JavaScript de n'importe quel dossier
        tasks: ['concat:dist']
      },
      styles: {
        files: '**/*.scss', // tous les fichiers Sass de n'importe quel dossier
        tasks: ['sass:dist']
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('dev', ['sass:dist', 'concat:dist'])
  grunt.registerTask('dist', ['sass:dist', 'uglify:dist'])
}
```

Maintenant, vous êtes capable à tout moment de compiler automatiquement vos fichiers en lançant simplement `$ grunt watch`.

Oui, comprenez bien que lorsque vous ajoutez une tâche dans la définition de la configuration de **Grunt**, elle est appelable directement. Typiquement, vous pouvez faire ```$ grunt premier-niveau:deuxieme-niveau``` soit par exemple ```$ grunt sass:dist```. Vous n'êtes pas obligé(e) de (re)définir chaque tâche via `grunt.registerTask()`.

Je ne sais pas si vous vous rappelez mais nous avions créé une tâche de base s'appelant ```default```. Cette tâche se lance dès que vous ne passez aucun paramètre à **Grunt** soit ```$ grunt```. Vous pouvez aussi l'appeler via ```$ grunt default``` mais aucun intérêt.

Tout ça pour dire qu'il est serait sûrement intéressant de lancer la tâche `watch` dès qu'on souhaite lancer **Grunt** étant donné que c'est sûrement la tâche la plus récurrente que vous utiliserez.

C'est parti !

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{
          "expand": true,
          "cwd": "src/styles/",
          "src": ["*.scss"],
          "dest": "dist/styles/",
          "ext": ".css"
        }]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        dest: 'dist/built.js'
      }
    },
    uglify: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js']
        dest: 'dist/built.js'
      }
    },
    watch: {
      scripts: {
        files: '**/*.js', // tous les fichiers JavaScript de n'importe quel dossier
        tasks: ['concat:dist']
      },
      styles: {
        files: '**/*.scss', // tous les fichiers Sass de n'importe quel dossier
        tasks: ['sass:dist']
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['dev', 'watch']) // Oui, je conseille de toujours compiler une fois avant de lancer watch.
  grunt.registerTask('dev', ['sass:dist', 'concat:dist'])
  grunt.registerTask('dist', ['sass:dist', 'uglify:dist'])
}
```

That's it. Nous avons maintenant tout le nécessaire pour compiler des CSS, du JS, l'optimiser, ainsi qu'avoir une commande de développement avec compilation automatique.

Et puisque je suis maniaque, nous allons ranger un peu :

```javascript
module.exports = function(grunt) {

  // Je préfère définir mes imports tout en haut
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-watch')

  var jsSrc = ['src/intro.js', 'src/project.js', 'src/outro.js']
  var jsDist = 'dist/built.js'

  // Configuration de Grunt
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{
          "expand": true,
          "cwd": "src/styles/",
          "src": ["*.scss"],
          "dest": "dist/styles/",
          "ext": ".css"
        }]
      },
      dev: {} // À vous de le faire ! vous verrez que certaines options Sass sont plus intéressantes en mode dev que d'autres.
    },
    concat: {
      options: {
        separator: ';'
      },
      compile: { // On renomme vu qu'on n'a pas de mode dev/dist. Dist étant une autre tâche : uglify
        src: jsSrc, // Vu qu'on doit l'utiliser deux fois, autant en faire une variable.
        dest: jsDist // Il existe des hacks plus intéressants mais ce n'est pas le sujet du post.
      }
    },
    uglify: {
      options: {
        separator: ';'
      },
      compile: {
        src: jsSrc,
        dest: jsDist
      }
    },
    watch: {
      scripts: {
        files: '**/*.js',
        tasks: ['scripts:dev']
      },
      styles: {
        files: '**/*.scss',
        tasks: ['styles:dev']
      }
    }
  })

  grunt.registerTask('default', ['dev', 'watch'])
  grunt.registerTask('dev', ['styles:dev', 'scripts:dev'])
  grunt.registerTask('dist', ['styles:dist', 'scripts:dist'])

  // J'aime bien avoir des noms génériques
  grunt.registerTask('scripts:dev', ['concat:compile'])
  grunt.registerTask('scripts:dist', ['uglify:compile'])

  grunt.registerTask('styles:dev', ['sass:dev'])
  grunt.registerTask('styles:dist', ['sass:dist'])
}
```

Avec ça, je pense qu'on est pas trop mal. Il reste des optimisations éventuelles à faire et nombreuses autres tâches intéressantes peuvent être ajoutées comme [jshint](https://github.com/gruntjs/grunt-contrib-jshint/). Cela fera probablement office d'un autre article.

J'espère que vous y voyez maintenant un peu plus clair dans **Grunt** ainsi que dans la compilation côté front-end. **Grunt** est un excellent produit, avec une communauté réactive et il est rare qu'une tâche que vous souhaitiez mettre en place n'existe pas déjà.

Bon workflow !
