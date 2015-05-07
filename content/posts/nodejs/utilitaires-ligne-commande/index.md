---
date: "2015-05-08"
route: /posts/nodejs/utilitaires-ligne-commande/
title: "Les utilitaires en ligne de commande"
tags:
  - npm
  - cli
  - nodejs
authors:
  - magsout
---

Avoir accès à ses utilitaires en ligne de commande ([cli](https://en.wikipedia.org/wiki/Command-line_interface)) est un quotidien dans nos métiers et un avantage indéniable. Ce n'est pas nouveau et cela existe depuis la nuit des temps. Tout utilisateur
d'unix voue un culte particulier à son terminal.

J'ai récemment eu à développer un utilitaire en `NodeJS`, j'ai donc voulu avec cet article déblayer un peu le terrain
et présenter quelques utilitaires très pratiques.

Deux postulats avant de commencer :
- Pourquoi NodeJS ? En cohérence avec le workflow que j'utilise.
- Cet article n'a pas pour but d'apprendre à écrire du JavaScript en NodeJS.

## hello world

Avant de commencer à coder, il va tout d'abord falloir créer deux fichiers qui seront nécessaire et obligatoire :

```console

// création du dossier
$ mkdir putaindecode-cli && cd putaindecode-cli

//création de index.js
$ touch index.js

// création de package.json
$ touch package.json

```

Le fichier `index.js` va se présenter comme ceci :

```
#!/usr/bin/env node
// Cette ligne ou shebang permet de définir l'interpréteur de notre script, à savoir `node`

//notre fameux hello world
console.log("Hello world")

```

Pour notre fichier `package.json`, deux méthodes possibles pour l'écrire, soit en faisant `npm init` puis suivre les instructions ou adapter ce JSON :

```console
{
  "name": "putaindecode-cli",
  "version": "0.1.0",
  "description": "Putaindecode cli",
  "keywords": [
    "cli",
    "npm"
  ],
  "author": "magsout",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/putaindecode/putaindecode-cli.git"
  },
  "engines": {
    "node": ">=0.10"
  },
  "homepage":"https://github.com/putaindecode-cs/putaindecode-cli"
  "bugs": {
    "url": "https://github.com/putaindecode-cs/putaindecode-cli/issues"
  },
  "files": [
    "index.js"
  ],
  "dependencies": {},
  "devDependencies": {},
  "bin": {
    "putaindecode": "index.js"
  }
}

```
La ligne importante et surtout à ne pas oublier :

```console
"bin": {
  "putaindecode-cli": "index.js"
}
```

Elle permettra de déterminer le script à exécuter lorsque la commande : `putaindecode-cli` est lancée.

Si on vulgarise un peu le principe, en installant le script, le fichier `index.js` sera renommé en `putaindecode-cli.js` et sera copié dans le répertoire adéquat (dépend de  l'OS).

Lorsque la commande `putaindecode-cli` sera executée, le shell va chercher le fichier exécutable en utilisant les répertoires listés dans la variable PATH.

Si on suit ce raisonnement, l'installation d'un script écrasera automatiquement l'ancienne version.

Pour s'assurer qu'il n'existe pas d'autre commande portant le même nom, il est conseiller d'utiliser la commande : `which putaindecode-cli` qui ne retournera rien si la commande est inexistante :

```console
#putaindecode-cli ne retourne aucun résultat
$ which putaindecode-cli
#node est installé et accessible dans le path suivant
$ which node
  /usr/local/bin/node
```

## Installation du script

Afin de vérifier que le script fonctionne correctement, il suffit d'executer  tout simplement dans le répertoire la commande : `./index.js`.

Une erreur de droit ? Un petit chmod pour arranger ça : `chmod +x index.js`.

A ce stade si tout fonctionne bien, `Hello World` va s'afficher.

Par contre, exécuter notre script de la sorte n'est pas très pratique, d'autant plus qu'il sera necessaire de connaitre à chaque fois le chemin vers le fichier.

Il serait beaucoup plus simple de pouvoir executer le script comme une commande. Comme tout package NodeJS, cela se fait avec `npm install`.


```console
// installation en global du script
$ npm install -g

// exécution de la commande
$ putaindecode-cli

// résultat de la commande
Hello world
```

Le script est maintenant accessible partout sur l'OS grace à la commande `putaindecode-cli`. L'installation en globale n'est pas absolument pas nécessaire, tout dépend de l'interêt de votre script.  Il est d'ailleurs souvent préférable de l'installer en local dans un projet avec `--save` ou `--save-dev`.

## Installation des scripts de base

La puissance de `NPM` provient de son nombre impressionnant de package mis à disposition.

Pour gagner du temps et éviter d'avoir à recoder la roue. Le script `putaindecode-cli` va avoir besoin de trois choses :

- une gestion des commandes (commande, argument, aide)
- une gestion des couleurs (notice, error, warning)
- une capacité à stopper proprement notre code.

### `commander`

Pour les commandes avec en prime la gestion des arguments et de l'aide, [commander](https://github.com/tj/commander) est tout a fait adapté et répondra pratiquement à tous nos besoins.

Il est simple d'utilisation et très bien maintenu.

Voici un exemple de ce qu'on peut faire :

```js
/* Default */
program
  .version(pkg.version)

/* deploy */
program
  .command("command")
  .alias('c')
  .description("   command does something")
  .option("-v, --verbose", "Verbose")
  .option("-f, --force", "Force installation")
  .action(commandAction)
  .on("--help", function() {
    console.log("  Example:")
    console.log();
    console.log("     command does something")
    console.log("     $ putaindecode-cli command")
	  console.log("")
	});

/* help */
program.on("--help", function() {
	console.log("  Examples:")
  console.log();
  console.log("     command do something")
  console.log("     $ putaindecode-cli command")
  console.log("")
  console.log("     Force command does something")
  console.log("     $ putaindecode-cli command -f")
  console.log("")
});

program.parse(process.argv)

/* help by default */
if (!program.args.length) program.help()

```

### `chalk`

Null besoin de faire un cour sur les couleurs, mais l'affichage d'une notice est bien plus pertinante avec sa couleur associée. C'est à ce moment qu'entre en jeu [chalk](https://github.com/sindresorhus/chalk). Relativement simple à mettre en place et à utiliser :

```js
var chalk = require('chalk')

/* var */
var error   = chalk.bold.red
var warn    = chalk.yellow
var success = chalk.green
var notice  = chalk.blue

/* code */

console.log(warn('No command'))
console.log(notice("file modified !"))

```
### `exit`

Peu importe comment s'exécute son code, il est important de bien savoir maitriser l'arrêt de son script. Pour ça, `process.exit() nous sera bien utile.

Dans le cas d'une erreur la valeur de `exit` doit systématiquement être supérieur à 0, et donc bien naturellement en cas de succes la valeur est 0.

Voici une [liste des valeurs](http://www.virtsync.com/c-error-codes-include-errno) de `exit` et de leurs correspondances

## Thanks god for our terminal

Voici quelques exemples de projets avec des commandes et des mises en situations intéressantes:
- [cssnext](https://github.com/cssnext/cssnext/blob/master/bin/cssnext.js)
- [trash](https://github.com/sindresorhus/trash/blob/master/cli.js)

Je vous invite également à visionner la [vidéo](http://blog.clement.delafargue.name/posts/2015-02-25-declarative-cli-parsing-in-js.html) de [Clement Delafargue](https://twitter.com/clementd) qui fait une présentation sur le sujet en début d'année.

À partir de là on a une bonne base pour refaire le monde et accroître la flemme du développeur que l'on est en automatisant tout plein de tâches.
