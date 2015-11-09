---
date: "2015-06-02"
title: Introduction à cssnext
tags:
  - css
  - postcss
authors:
  - Macxim
header:
  credit: https://www.flickr.com/photos/frinky/620935482
---

D'après le [site officiel](http://cssnext.io/):
> **cssnext** est un transpileur CSS qui vous permet d'utiliser dès aujourd'hui la syntaxe CSS de demain. Il transforme les spécifications CSS qui ne sont pas encore mises en œuvre sur les navigateurs les plus populaires en CSS compatible.

## Ça veut dire quoi exactement ?

Depuis CSS3, vous avez savez sans doute que CSS est divisé en plusieurs documents indépendants appelés "modules". Ces modules peuvent avoir différents niveaux de stabilité et différents [statuts](http://www.w3.org/Style/CSS/current-work#legend). La mise en œuvre de ces modules par les navigateurs peut prendre un certain temps et encore plus pour que le W3C les approuve comme [Recommandation](http://www.w3.org/2005/10/Process-20051014/tr#RecsW3C).

Avec **cssnext**, vous pouvez utiliser la syntaxe des [nouveaux modules CSS](http://www.xanthir.com/b4Ko0) tels que les _propriétés personnalisées (custom properties level 1)_ ou les _media queries personnalisées (custom media queries level 1)_. **cssnext** va transformer ces nouvelles et étranges syntaxes en du CSS compréhensible par les navigateurs que vous voulez supporter.

En clair, il vous donne un **avant-goût du futur**.

Je ne sais pas vous mais étant quelqu'un qui aime expérimenter avec les dernières technologies de pointe, je trouve ça plutôt cool !

Je vous conseille de jeter un oeil à la [liste des fonctionnalités](http://cssnext.io/features/).

### Quid de mon préprocesseur actuel ?

Oubliez les risques liés à une abstraction trop élevée des CSS par les pré-processeurs actuels ; certes causés par une (sur-|mauvaise) utilisation de ces outils mais quand même.

Devinez quoi, vous n'en avez pas forcément besoin.

Essayez **cssnext** et retournez à ce bon ~~vieux~~ nouveau CSS. Et avec un zeste de [méthodologie BEM](/posts/css/petite-definition-bem/), vous vous sentirez revivre.

## Exemples

Voyons voir quelles sont les fonctionnalités offertes par **cssnext** pour le moment.

Avant toute chose, vous devriez aller faire un tour sur le [playground du site officiel](http://cssnext.io/playground/).

### Préfixes propriétaires automatiques

```css

.h1 {
  transform: skewX(25deg);
  transition: transform 1s;
}
```

Cela va être transformé par **cssnext** via Autoprefixer en :

```css
.h1 {
  -webkit-transform: skewX(25deg);
      -ms-transform: skewX(25deg);
          transform: skewX(25deg);
  -webkit-transition: -webkit-transform 1s;
          transition: transform 1s;
}
```
### Propriétés personnalisées et var() limité à `:root`

Aussi connues sous le nom des très attendues [variables CSS](http://www.w3.org/TR/css-variables/).

```css
:root {
  --primary-Color:                 #E86100;
  --secondary-Color:               #2c3e50;
  --r-Grid-baseFontSize:           1rem;
}
```
À utiliser de cette façon :

```css
.h1 {
  color: var(--primary-Color);
}
.h1:hover {
  color: var(--secondary-Color);
}
body {
  font-size: var(--r-Grid-baseFontSize);
}
```

### Media Queries personnalisées

Pour créer des alias sémantiques, clairs et simples ([lisez la doc'](http://dev.w3.org/csswg/mediaqueries/#custom-mq)).

```css
@custom-media --viewport-medium (width <= 40rem);
@custom-media --viewport-large (max-width: 50em);
```

Prenons par exemple :

```css
:root {
  --fontSize: 1.2rem;
}

@media (--viewport-medium) {
  body { font-size: calc(var(--fontSize) * 1.2); }
}
@media (--viewport-large) {
  body { font-size: calc(var(--fontSize) * 1.4); }
}
```

Le code généré sera alors :

```css
@media (max-width: 40rem) {
  body { font-size: 1.44rem; }
}
@media (max-width: 50em) {
  body { font-size: 1.68rem; }
}
```

### Sélecteurs personnalisés

Encore une fois, un petit tour sur les [specs](http://dev.w3.org/csswg/css-extensions/#custom-selectors) pour commencer. Disons qu'on veuille appliquer des styles à toutes les balises de titre.

```css
@custom-selector :--heading h1, h2, h3, h4, h5, h6;

:--heading {
  margin-top: 0;
}
```
Ce qui va générer le code suivant :

```css
h1,
h2,
h3,
h4,
h5,
h6 { margin-top; 0; }
```

### `color()`

Une simple [fonction color](http://dev.w3.org/csswg/css-color/#modifying-colors) qui sert à appliquer des _réglages couleur_ (teinte, luminosité, entre autres) à une couleur de base.

Exemples :

```css
.class {
  background-color: color(#2B88E6);
  color: color(#2B88E6 red(+30) green(-50) blue(6%) alpha(.65));
  border-top-color: color(#2B88E6 saturation(-8%) whiteness(+50%));
  border-right-color: color(#2B88E6 lightness(5%) blackness(-25%));
  border-bottom-color: color(#2B88E6 tint(80%));
  border-left-color: color(#2B88E6 shade(75%));
}
```
Le code ci-dessus sera transformé en...

```css
.class {
  background-color: rgb(43, 136, 230);
  color: rgba(73, 86, 15, 0.65);
  border-top-color: rgb(181, 201, 222);
  border-right-color: rgb(3, 45, 87);
  border-bottom-color: rgb(213, 231, 250);
  border-left-color: rgb(11, 34, 58);
}
```

**cssnext** propose aussi les fonctionalités suivantes liées à la couleur.

#### hwb()

D'après les [spécifications](http://dev.w3.org/csswg/css-color/#the-hwb-notation), HWB (Hue-Whiteness-Blackness) est similaire à la notation HSL mais plus facile à utiliser pour les humains.

```css
.title {
  color: hwb(125, 32%, 47%);
}
```

Rendu :

```css
.title {
  color: rgb(33, 135, 42);
}
```

#### gray()

Les gris sont [tellement cool](http://dev.w3.org/csswg/css-color/#grays) qu'ils ont une fonction rien que pour eux.

```css
.section {
  background-color: gray(120, 50%);
  border-color: gray(17%, 25%);
}
```

Ce qui donnera :

```css
.section {
  background-color: rgba(120, 120, 120, 0.5);
  border-color: rgba(43, 43, 43, 0.25);
}
```

#### #rrggbbaa

**cssnext** transforme les [notations hexadécimales](http://dev.w3.org/csswg/css-color/#hex-notation) #RRGGBBAA et #RGBA en rgba().

```css
body {
  color: #5c69;
  background-color: #C73D5C59;
}
```

Résultat :

```css
body {
  color: rgba(85, 204, 102, 0.6);
  background-color: rgba(199, 61, 92, 0.34902);
}
```

#### rebeccapurple

Transforme simplement la couleur [`rebeccapurple`](https://github.com/postcss/postcss-color-rebeccapurple#why-this-plugin-) en `rgb(102, 51, 153)`.

### rem units

Rien de bien extraordinaire ici, on génère un **_fallback_ en pixels pour les unités en rem**. Certaines personnes pourraient penser qu'un tel _fallback_ est inutile de nos jours. Cependant, pour des projets bien spécifiques (compatibilité IE 7 et 8 requise), c'est encore une nécessité.
Non mais vous n'avez quand même pas besoin d'un exemple pour ça ? Si ? Bon... d'accord. Allons-y !

```css
.section-Highlight {
  font-size: 2.5rem;
}
```
Résultat :

```css
.section-Highlight {
  font-size: 40px;
  font-size: 2.5rem;
}
```

## Note importante sur les fonctionnalités

Vous pouvez manuellement activer ou désactiver certaines fonctionnalités si vous n'en ressentez pas le besoin.
Cela étant dit, il vous est conseillé d'utiliser l'option [`browsers`](http://cssnext.io/usage/#browsers),
qui permet de gérer automatiquement la liste des fonctionnalités à activer.
Par exemple si vous spécifiez un environnement où IE 8 n'est pas supporté, l'option de transformation des `rem`
en `px` ne sera pas activé. Tout comme Autoprefixer ne rajoutera pas les préfixes inutiles.

## Fonctionnalités bonus

Les deux fonctionnalités qui vont suivre ne sont pas vraiment en rapport avec les spécifications CSS. Cependant, elles méritent tout de même leur place dans cette brève présentation de l'outil.

### `import`

Et si vous pouviez importer des fichiers locaux et des modules (`node_modules` ou `web_modules`) pour produire un seul et même fichier CSS les contenant tous ? Oui, [c'est à vous que je m'adresse, les utilisateurs de Sass](https://github.com/sass/sass/issues/193), hum. Eh bien, avec **cssnext**, c'est possible.

### `compress`

Comme vous l'avez sûrement deviné, c'est juste une option pour compresser _ou pas_ votre fichier de sortie, et ceci grâce à [cssnano](https://github.com/ben-eb/cssnano).

### Usage

Voici un exemple simple de ces deux fonctionnalités. J'ai ici utilisé [gulp-cssnext](https://github.com/cssnext/gulp-cssnext), un des [nombreux plugins](http://cssnext.io/setup/) qui vous aident à démarrer avec **cssnext**.

```js
var gulp = require('gulp'),
    cssnext = require("gulp-cssnext");

gulp.task('styles', function() {
  gulp.src("css/index.css")
  .pipe(cssnext({
    compress: true,  // default is false
  }))
  .pipe(gulp.dest("./dist/"))
});

```

Ensuite, dans mon fichier `index.css`, j'ai ceci :

```css

@import "normalize.css"; /* == @import "./node_modules/normalize.css/index.css"; */
@import "cssrecipes-defaults"; /* == @import "./node_modules/cssrecipes-defaults/index.css"; */
@import "project-modules/partner"; /* relatif à css/ */
@import "typo"; /* même niveau que mon index.css principal situé dans css/ */
@import "highlight" (min-width: 25em);

```

Et le rendu final sera :

```css

/* contenu de ./node_modules/normalize.css/index.css */
/* contenu de ./node_modules/cssrecipes-defaults/index.css */
/* contenu de project-modules/partner.css */
/* contenu de typo.css */
@media (min-width: 25em) {
  /* contenu de highlight.css */
}
```

Je sais ce que vous ressentez. Ce n'est peut-être pas le coup de foudre au premier coup d'œil (enfin, pour certains comme moi si, mais bon, passons). Vous ne l'acceptez pas encore mais il va falloir vous rendre à l'évidence, un jour ou l'autre vous coderez comme ça. Mieux vaut vous y mettre tout de suite, non ? :)

Bref, pour résumer, disons simplement que le but principal de **cssnext** est de pouvoir développer selon les spécifications du W3C en gardant bien à l'esprit que, théoriquement, il sera possible de le supprimer plus tard (quand il ne sera plus utile).

En effet, dans un futur proche, les fonctionnalités qu'offre cet outil ne seront plus gérées par **cssnext** lui-même mais directement par les navigateurs. Laissons-les s'adapter, chacun à leur vitesse et préparons-nous. Voilà tout l'intérêt du code _future-proof_, comme le permet [babeljs](http://babeljs.io/) pour le JavaScript.

En attendant, il y a encore du boulot : voici une [liste des fonctionnalités à venir](https://github.com/cssnext/cssnext/issues?q=is%3Aopen+is%3Aissue+label%3A%22type%3A+feature+request%22).

Maintenant, à vous de jouer. N'oubliez pas d'aller faire un tour sur le [repo GitHub](https://github.com/cssnext/cssnext), n'hésitez pas à suivre [@cssnext](https://twitter.com/cssnext) sur Twitter pour être au courant des dernières news et rejoignez la [room cssnext sur Gitter](https://gitter.im/cssnext/cssnext) si vous avez des questions.

* [Site officiel](http://cssnext.io/)
