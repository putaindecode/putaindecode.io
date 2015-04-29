---
date: "2014-05-20"
title: Faire son préprocesseur CSS à la carte
tags:
  - css
  - preprocesseur
  - postprocesseur
authors:
  - MoOx
---

Après vous avoir fait un petit [état de l'art des préprocesseurs CSS historiques](/posts/css/le-point-sur-les-preprocesseurs/)
et vous avoir parlé [des postprocesseurs](/posts/css/le-point-sur-les-preprocesseurs/),
je me dois de vous montrer le chemin qui me semble le plus pertinent aujourd'hui,
en 2014, maintenant que [les spécifications CSS sont découpées en modules](http://www.w3.org/standards/techs/css#cr)
qui peuvent du coup avancer (plus rapidement) chacune de leur côté.

Bon après faut avouer que chez {p!} on fait genre on est des hipsters hackers,
du coup quand on voit que [Sass est le game changer of the year](http://blog.kaelig.fr/post/85546040569/net-awards-sass-game-changer-of-the-year)
 et que tout le monde l'adopte, on se doit de rester hipster.
Du coup on est obligés de passer à autre chose.

**Mise à jour du 11 décembre 2014:** _depuis le temps où j'ai rédigé cette article, j'ai travaillé sur un transpileur CSS future-proof, basé sur PostCSS. Je vous invite à jeter au project **[cssnext](https://cssnext.github.io/)**._

## Pré ou postprocesseurs ?

Je vais ici utiliser le mot préprocesseur, alors que certains trouveront postprocesseurs plus pertinent,
car pour moi le préprocessing reste simplement une étape avant le _processing_
de nos feuilles de styles par les navigateurs.

Cela dit il faut bien distinguer les étapes :

1. Preprocessing d'un langage spécifique (Sass, Stylus*) ou superset du langage CSS (Scss, Less);
2. Preprocessing d'un fichier respectant la syntaxe CSS;
3. Processing par le navigateur

Revenons rapidement sur ces 3 points :

### Preprocessing via langage dédié

Ici je parle d'un langage, car superset ou pas, on a des éléments nouveaux,
incompréhensibles par le navigateur (ex: `@if`, `@foreach`...).

Note: Je case Stylus dans le langage spécifique car il n'est pas vraiment compatible,
ne tolérant pas l'indentation :

```css
.Block { prop: value }

  .Block-element { prop: value }

/* 💥 BOOM ! CA PAS MARCHER EN STYLUS */
```

### Préprocessing futureproof/fallback

Ici on conserve la syntaxe CSS, le parsing est donc simple est connu.
Mais attention on peut avoir un résultat non compréhensible par certains navigateurs
(ex: unité REM sur IE 8, variables CSS...).

À la différence de la solution du dessus, on reste ici avec un langage à la syntaxe simple
et connue, avec des spécifications (en brouillon ou pas).

Dès que c'est possible on va rendre le CSS encore plus compatible en ajoutant
des fallbacks (roues de secours) à tout va.
Ainsi par exemple pour assurer une utilisation de l'unité REM, on peut (en roue de secours)
doubler nos valeurs en `px`.
Autre exemple avec les variables CSS natives : on peut (pour une utilisation simpliste)
faire un prérendu et mettre des roues de secours là où c'est possible.

### Processing par le navigateur

Ici on a blindé notre feuille de fallback, on est (en théorie) sensé avoir un support "au mieux".

## Créer un préprocesseur CSS

Allons à l'essentiel : pour créer votre préprocesseur on va utiliser une bibliothèque.
À ce jour nous avons le choix entre [Rework](https://github.com/reworkcss/rework)
 ou [PostCSS](https://github.com/ai/postcss) qui permettent d'inspecter et de manipuler nos CSS.
Tout deux sont des bibliothèques écrites en JavaScript (NodeJs).

Pour la petite histoire, Autoprefixer est à l'origine de PostCSS. En effet les
premières versions utilisaient Rework, mais à cause de limitation dues à l'API de Rework,
l'auteur d'Autoprefixer a décidé de créer son propre moteur, qui a une API presque
plus sympa il faut le dire (il faudra voir comment évolue Rework).

D'un autre côté Rework étant plus ancien, il possède un écosystème plus fourni et répondra
donc mieux à nos besoins.

Cela étant dit, avec l'approche futureproof nous pourrons switcher de Rework à PostCSS
 sans problème et surtout sans toucher à nos feuilles de styles.
Il suffira de trouver un plugin équivalent (ex: rework-vars et postcss-vars font la même chose).

Pour des raisons d'écosystème, je partirai sur Rework histoire de ne pas réinventer la roue.

## Créer un préprocesseur CSS avec Rework

Rework prend une chaîne CSS en entrée, produit un AST (arbre de syntaxe abtrait)
de notre CSS et nous fournis une API pour le manipuler.

```js
var rework = require("rework")
var unPlugin = require("rework-BIDULE")
// usage simple
var css = rework("html { font-size: 2rem}").use(unPlugin).toString()
```

### Plugin Rework

Un plugin Rework n'est rien d'autre qu'une fonction JavaScript.
L'exemple suivant remplacera toutes les couleurs de texte par du noir.

```js
var monPlugin = function plugin(ast, reworkInstance) {
  ast.rules.forEach(function (rule) {
    // dans notre cas on ne veut que travailler sur des règles
    if (rule.type !== "rule") return

    rule.declarations.forEach(function (declaration, index) {
      if (declaration.property === "color") {
        declaration.value = '#000'
      }
    })
  })
}
```

Il est certain que l'exemple ci-dessus ne doit pas vous exciter beaucoup. Moi non plus.
Je n'ai d'ailleurs pas du tout accroché lorsque Rework est apparu par manque de compréhension.
**Ou plutôt par manque d'imagination**.

Pour un exemple plus costaud je vous invite à regarder le code [rework-vars](https://github.com/reworkcss/rework-vars/blob/master/index.js).

## L'Ecosystème Rework

Heureusement pour nous, nous avons un écosystème. Donc pour un usage classique (écrire
du CSS futureproof ou ajouter quelques petites améliorations) il n'y aura pas besoin
d'écrire de plugin, juste en utiliser fera l'affaire.

### Plugins Rework natif

Rework embarque en natif quelques plugins. Il faudra tout de même les activer (on voit comment juste après).

- [extend](https://github.com/reworkcss/rework#extend): Permet d'hériter d'un sélecteur (`@extend` quoi).
- [ease](https://github.com/reworkcss/rework#ease): Ajout un paquet de fonctions d'easing pour les animations et transitions.
- [at2x](https://github.com/reworkcss/rework#at2x): Gestion automatique des images `@2x`.
- [prefixSelectors](https://github.com/reworkcss/rework#prefixselectorsstring): Permet de préfixer vos sélecteurs.
- [colors](https://github.com/reworkcss/rework#colors): Explication par l'exemple : `rgba(#fc0, .5)`.
- [mixin](https://github.com/reworkcss/rework#mixinobject): Faire ses propres mixins via des fonctions JavaScript.
- [function](https://github.com/reworkcss/rework#functionobject): Ajouter ses propres fonctions CSS.
- [references](https://github.com/reworkcss/rework#references): Permet de faire référence à des valeurs de propriétés (ex: `height: @width`)
- [url](https://github.com/reworkcss/rework#urlfn): Réécrire les `url()`s via une fonction JavaScript.
- [inline](https://github.com/reworkcss/rework#inlinedir): Inliner des ressources via des datauri.

### Plugins Rework NPM

On a déjà plus d'une soixantaine de [plugins Rework disponible sur NPM](https://www.npmjs.org/search?q=rework) en plus des plugins natifs.

#### Ajouter des fallbacks

Si vous souhaitez écrire des CSS sans pour autant vous limiter à certaines implémentations, ces plugins devraient vous plaire.

##### rework-vars

[rework-vars](https://github.com/reworkcss/rework-vars)
permet un usage des [variables CSS](http://www.w3.org/TR/css-variables/).
Ce plugin est (pour l'instant) restreint aux déclarations à la racine (`:root`).
Cela permet toutefois un usage classique de variables globales.
Et de se séparer de Sass ou Less si on utilise pas beaucoup plus que des variables.

##### rework-calc

[rework-calc](https://github.com/reworkcss/rework-calc)
ajoute les résultats des opérations `calc()` quand c'est possible (même unité).
Très pratique spécialement couplé avec rework-vars pour ajouter un peu de math via vos variables.

##### rework-npm

[rework-npm](https://github.com/conradz/rework-npm)
nous parse `@import` comme on l'aime.
Peut taper dans votre dossier de sources ou en plus dans `node_modules`
(pratique pour utiliser [normalize.css](https://www.npmjs.org/package/normalize.css)
[via npm](/posts/frontend/npm-comme-package-manager-pour-le-front-end/) par exemple).
Il existe aussi [rework-importer](https://github.com/simme/rework-importer) qui amène quelques différences de syntaxe.

##### [rework-rem-fallback](https://github.com/ctalkington/rework-rem-fallback)

[rework-rem-fallback](https://github.com/ctalkington/rework-rem-fallback)
ajoute un fallback sur les unités REM. Pratique si vous voulez utiliser REM mais
que vous devez supporter IE 8.

##### rework-color-function

[rework-color-function](https://github.com/ianstormtaylor/rework-color-function) permet
de manipuler les couleurs via
[les nouvelles fonctions en cours de spécifications](http://dev.w3.org/csswg/css-color/#modifying-colors)
(hue, saturation, lightness, whiteness, blackness, tint, shade, blend, blenda, contrast).

##### rework-mixin-opacity

[rework-mixin-opacity](https://github.com/reworkcss/rework-mixin-opacity) ajoute l'`opacity` pour IE 8.

#### Améliorer un peu vos feuilles de styles

Sans pour autant partir en vrille vers des `@if` ou `@each`, voici quelques plugins
qui peuvent ajouter un peu de beurre dans les épinards :

##### rework-parent
[rework-parent](https://github.com/fgnass/rework-parent) permet de référencer le sélecteur précédent via `&`. Pratique dans pour les media-queries ou pour les états (:hover etc).

##### rework-breakpoints
[rework-breakpoints](https://github.com/reworkcss/rework-breakpoints) permet de spécifier des media-queries via des breakpoints prédéfinis. Pratique en attendant un plugin gérant les [`@custom-media`](http://dev.w3.org/csswg/mediaqueries4/#custom-mq).

##### rework-hex-alpha
[rework-hex-alpha](https://github.com/ianstormtaylor/rework-hex-alpha) permet de spécifier des couleurs avec alpha sous la forme #rrggbbaa.

##### rework-clearfix
[rework-clearfix](https://github.com/fgnass/rework-clearfix) permet d'utiliser `clear: fix` via l'insertion automatique du [micro clearfix de @necolas](http://nicolasgallagher.com/micro-clearfix-hack/).

##### rework-assets
[rework-assets](https://github.com/conradz/rework-assets) permet de copier les assets référencés. Pratique avec rework-npm et des modules externes.

##### rework-namespace-css
[rework-namespace-css](https://github.com/geordiemhall/rework-namespace-css) permet de namespacer vos CSS par une classe sur `<html>`.

##### rework-namespace
[rework-namespace](https://github.com/kristoferjoseph/rework-namespace) permet de namespacer vos CSS par un préfixe. Pratique avec [BEM](/posts/css/petite-definition-bem/) lorsque vous préfixez par votre `.org-`.

##### rework-classmap
[rework-classmap](https://github.com/andreypopp/rework-classmap) permet de renommer des classes via du mapping. Avec ça on pourrait presque avoir un code Bootstrap propre.

##### rework-palette
[rework-palette](https://github.com/fgnass/rework-palette) permet d'ajouter une palette de couleur personnalisée (via des noms de couleurs).

##### rework-deduplicate
[rework-deduplicate](https://github.com/kristoferjoseph/rework-deduplicate) permet de supprimer les règles dupliquées.

##### rework-split-media
[rework-split-media](https://github.com/reworkcss/split-media) permet de couper les contenus des media queries dans d'autres fichiers.

##### rework-move-media
[rework-move-media](https://github.com/reworkcss/rework-move-media) permet de regrouper les contenus des media queries. Pas très utile car gzip fera aussi bien.


#### Au delà du préprocessing

En utilisant le parser Rework, on peut faire plus que des ajustements ou du remplacement: on peut balancer des erreurs.

- [rework-ie-limits](https://github.com/reworkcss/rework-ie-limits): prévient si vos CSS dépassent la limite de 4095 selectors (limite pour IE < 10).
- [rework-suit-conformance](https://github.com/suitcss/rework-suit-conformance): permet de vérifier que votre code suit bien les [conventions SUIT](https://github.com/suitcss/suit/tree/master/doc) (pour peu que vous les suiviez).

En partant dans d'autres directions on pourrait réaliser des statistiques sur
nos CSS (nombre de sélecteurs, de couleurs utilisées etc) comme le fait [CSS Stats](http://www.cssstats.com/).

Retrouvrez en plus de la recherche via npm (qui sera la plus à jour), [une liste des plugins et utilitaires sur le wiki de Rework](https://github.com/reworkcss/rework/wiki/Plugins-and-Utilities).

## Mise en place de Rework pour faire votre préprocesseur en moins de 5 min

Maintenant que nous avons vu comment utiliser Rework et quels sont les plugins
les plus sympas, on se faire un petit fichier pour automatiser tout ce process.

Plutôt que de réinventer la roue comme l'a fait [Pleeease](http://pleeease.io/) (en gérant un watcher et tout le tralala),
on va plutôt partir comme [Myth.io](http://myth.io/) ou [Styl](https://github.com/visionmedia/styl) (successeur spirituel de Stylus)
qui se concentrent sur le rendu et non le workflow pour générer ce rendu.

Nous allons donc faire simple et efficace avec une task [gulp](/posts/js/introduction-gulp/).
Ceci pourrait bien entendu être aussi bien fait avec grunt ou même make et [watchman](https://github.com/facebook/watchman).

```console
$ mkdir monrework && cd monrework

# on crée un package.json pour sauvegarder les références des paquets qu'on va utiliser
$ npm init

# on install gulp, autoprefixer et rework & co en les sauvegardants dans la partie "devDependencies"
$ npm i -D minimist gulp gulp-util gulp-plumber gulp-autoprefixer gulp-rework rework-npm rework-vars rework-calc rework-color-function rework-rem-fallback rework-parent rework-ie-limits

# on créé notre fichier vide
$ mkdir src && mkdir src/styles && touch src/styles/index.css
```

Ensuite il nous reste à faire notre petit `Gulpfile.js`

```js
var options = require("minimist")(process.argv.slice(2))
var gulp = require("gulp")
var util = require("gulp-util")
var plumber = require("gulp-plumber")
var rework = require("gulp-rework")

var reworkPlugins = {
  atimport: require("rework-npm"),
  parent: require("rework-parent"),
  vars: require("rework-vars"),
  calc: require("rework-calc"),
  colorFn: require("rework-color-function"),
  remFallback: require("rework-rem-fallback"),
  ieLimits: require("rework-ie-limits")
}
var autoprefixer = require("gulp-autoprefixer")

gulp.task("styles", function() {
  // ici on prend toutes les CSS à la racine
  // on considère que celles dans des sous dossiers sont à importer
  return gulp.src("./src/styles/*.css")
    .pipe(opts.production ? plumber() : util.noop())
    .pipe(rework(
      reworkPlugins.atimport({dir: "./src/styles/"}),
      rework.colors(),
      rework.references(),
      rework.ease(),
      rework.inline,
      reworkPlugins.parent,
      reworkPlugins.vars(), // notez que certains plugins nécessitent d'être éxecutés (retournant une fonction dynamique)
      reworkPlugins.calc,
      reworkPlugins.colorFn,
      reworkPlugins.remFallback(),
      reworkPlugins.ieLimits
    ))
    .pipe(autoprefixer())
    .pipe(gulp.dest("./dist/styles"))
})

gulp.task("default", ["styles"], function() {
  gulp.watch("./src/css/**/*", ["styles"])
})

```

Ensuite il ne reste plus qu'à lancer Gulp au besoin qui s'occupera d'éxecuter le preprocessing
au démarrage et lors des changements de fichiers.
Il ne reste plus grand chose à faire si ce n'est ajouter livereload en plus pour avoir le petit process aux petits oignons.

```console
$ gulp
[gulp] Using gulpfile ~/Development/monrework/Gulpfile.js
[gulp] Starting 'styles'...
[gulp] Finished 'styles' after 49 ms
[gulp] Starting 'default'...
[gulp] Finished 'default' after 4.16 ms
```

Le watch est lancé, on peut remplir notre fichier CSS

```css
:root {
	--fontSize: 1rem;
	--lineHeight: 1.5rem;
	--color-highlight: rgba(#f00, .8);
}

html {
	width: 100%;
	height: @width;
	font-size: var(--fontSize)
}

p {
	margin: calc(var(--lineHeight) / 2) 0;
}

a {
	color: var(--color-highlight);
	transition: all 500ms ease-out-back;
}

&:hover {
	color: color(var(--color-highlight) lightness(-10%));
	trasnform: rotate(1deg);
}
```

Et on obtiendra

```css
html {
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-size: 1rem;
}

p {
  margin: 12px 0;
  margin: 0.75rem 0;
}

a {
  color: rgba(255, 0, 0, .8);
  -webkit-transition: all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.275);
  transition: all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.275);
}

a:hover {
  color: rgba(204, 0, 0, 0.8);
  transform: rotate(1deg);
}
```

Gardez bien en tête qu'avec le code CSS d'origine, vous avez (en majeur partie) un code futureproof.
D'ici quelques temps on pourra supprimer une grande partie des plugins et les navigateurs prendront le relais 😉.

**Bon alors, on Less tomber Sass ?**
