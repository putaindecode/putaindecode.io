---
date: "2014-02-25"
title: Comment en finir avec les préfixes CSS
tags:
  - css
  - préfixe
  - pré-processeur
  - post-processeur
authors:
  - MoOx
---

En mettant de côté le débat trollesque _faut-il ou pas des préfixes CSS ?_
(car avouons-le, ils sont là, il faut faire avec), on ne va pas se le cacher,
les préfixes CSS ça nous brise tous les... touches du clavier.
Eh bien oui, sans automatisation on est obligé de se taper des caractères en plus.
Même avec un IDE correct, on peut faire ça rapidement, mais ça nécessite
presque à chaque fois une action de notre part.

## Préfixer via des outils en ligne

Les élèves au fond de la classe me montreront de suite des solutions comme
[prefixmycss.com](http://prefixmycss.com/) ou l'ancien prefixr.
Inopinément, un moche "Mourrez moi sile vou pler" sort de mon corps.
Non, sérieusement, ce n’est pas une façon de faire ça. Aller sur une web app à
chaque fois que je veux préfixer mes CSS ? Sérieusement ?
Vous avez qu’à aussi faire un service postal où j’envoie mes fichiers CSS dans
une clé USB et qu’on me renvoie sous 48h avec les préfixes ajoutés.
Super pratique.

## Préfixer via JavaScript

Une autre solution serait [prefix-free](http://leaverou.github.io/prefixfree/),
mais je ne vais même pas en parler tellement l’idée de dépendre de JavaScript pour
avoir un `border-radius` ou une `transition` CSS me donne une migraine.
Je vous passe les détails niveau performance. Selon les cas, on pourrait même avoir
un petit flash visuel sans les propriétés préfixées.
Non mais flûte. On ne fait pas ça. On n’alourdit pas une page web avec du JavaScript
pour parser la feuille de style et réintégrer des préfixes quoi. Au secours.

## Préfixer via les pré-processeurs CSS

Alors là, j’en entends déjà qui parle à voix haute au milieu de la classe :

> Bah lui c’est clair il’connait pas les pré-processeurs CSS le noube

Sans rentrer dans un débat trollesque (encore un), à part peut-être avec _Stylus_ et ces
mixins transparent (coucou _[Nib](http://visionmedia.github.io/nib/)_),
on est obligé de rajouter du code.
Avec _Sass_ il faudra (en scss) rajouter `@include` et un couple de parenthèse (et
au passage avoir _Compass_ si on ne veut pas coder les mixins à la main).
Avec _Less_ il faudra aussi une librairie _Less Hat_ si on n’a pas envie de se taper
du mixin qui donne de la nausée comme on peut voir sur la
[page d’accueil](http://lesscss.org/).

## Les préfixes, c’est comme le lait, ça tourne

D’ailleurs, parlons en vite fait de cette page d’accueil qui au jour où j’écris
ce post, comporte <b>en premier exemple</b> un mixin pour `box-shadow`
(hashtag ohlol).

Certaines propriétés comme `box-shadow`, ou encore `border-radius`, sont
aujourd’hui préfixées à tort, car comme on peut le voir sur le site de
[CanIUse.com](http://caniuse.com/), elles n’ont plus vraiment besoin d’être préfixées, à
moins que vous supportiez encore Firefox 3.6, Safari iOS 3 ou Android 2...
Je vous renvoie rapidement sur ce (vieil) article de Chris Coyier
[Do we need box-shadow or border-radius prefixes anymore?](http://css-tricks.com/do-we-need-box-shadow-prefixes/)
en guise de mémo :)

Sans être de mauvaise foi, on va vite avouer qu’on ne peut pas forcément tout savoir.
Donc on ne peut pas être au top pour connaître quand il faut ou quand il n’y a plus
besoin de préfixer x ou y (oui bon x et y ne sont pas des propriétés CSS, c’est
pour l’exemple).
Qui sait qu’on peut enfin arrêter de préfixer box-sizing dans Firefox depuis la 29 ?
Ou la 30 je ne sais plus...

Bon mais alors comment faire ? J’entends les fayots du premier rang parler d’auto...
auto... AUTOPREFIXER ?!

MAIS C’EST POSSIBLE ÇA ?

Bon allons à l’essentiel, assez trollé.


# Autoprefixer

Ce magnifique outil, basé sur une solide base de données (au hasard, CanIUse.com),
permet de préfixer automatiquement vos CSS, et ce, de manière intelligente.
Vous pouvez en effet configurer autoprefixer, afin de lui préciser quel
navigateur vous voulez utiliser.
Vous pouvez au choix lui demander de supporter X versions en arrière, les versions
qui ont un usage global > à Y% de trafic, ou encore une version minimale donnée.

Voici quelques exemples de configuration.

```js
// Je supporte une version en arrière et les navigateurs qui ont plus de 1% de trafic ainsi qu'Internet Explorer 7
autoprefixer("last 1 version", "> 1%", "Explorer 7").process(css).css;

// Je supporte 2 versions en arrière, et minimum BlackBerry 10 et Android 4
autoprefixer("last 2 version", "BlackBerry 10", "Android 4").process(css).css;
```

Dans ces lignes de code JavaScript... Quoi attendez c’est en JavaScript ? Oh le
fourbe, il nous recale sa techno de front-end de mes deux.
Bon faites pas les relous, que vous soyez front-end ou back-end, vous avez Node.js hein ?

Donc aucune inquiétude, il existe une commande pour que vous puissiez faire ça rapidement :

```console
# on install autoprefixer via npm en global
$ npm install --global autoprefixer
# ou pour les fainéants
$ npm i -g autoprefixer

# on prefixe !
$ autoprefixer *.css
```

Là bon de suite, réflexe, vous me sautez dessus à la gorge en me criant:

> NON MAIS T’AS CRU QUE J’ALLAIS TAPER LA COMMANDE À CHAQUE FOIS TOCARD ?

No problem, comme tout outil bien foutu, il y’a une multitudes de façon de
l’utiliser :

- via [Node.js](https://github.com/ai/autoprefixer#nodejs) directement,
- en plugin [Gulp](https://www.npmjs.org/package/gulp-autoprefixer),
- en plugin [Grunt](https://github.com/ai/autoprefixer#grunt),
- via [Compass](https://github.com/ai/autoprefixer#compass),
- en plugin [Stylus](https://github.com/ai/autoprefixer#stylus),
- avec [RoR](https://github.com/ai/autoprefixer#ruby-on-rails) ou [Ruby](https://github.com/ai/autoprefixer#ruby),
- avec l’application [Prepros](https://github.com/ai/autoprefixer#prepros)
- via [Mincer](https://github.com/ai/autoprefixer#mincer)
- via [Middleman](https://github.com/ai/autoprefixer#middleman)
- avec [PHP](https://github.com/ai/autoprefixer#php) (vous avez bien lu),

Bien entendu, parfois, lorsqu’on fait un petit bout de CSS standalone,
vous avez aussi à dispo des plugins pour
[Sublime Text](https://github.com/sindresorhus/sublime-autoprefixer)
 ou [Brackets](https://github.com/mikaeljorhult/brackets-autoprefixer)
 afin de ne pas forcément avoir à utiliser les app ou process cités juste avant.

<figure>
  ![sublime text autoprefixer preview](autoprefixer.gif)
  <figcaption>Intégration dans Sublime Text</figcaption>
</figure>

Cet outil est maintenant basé sur [PostCSS](https://github.com/ai/postcss),
un post-processeur CSS. Vous pouvez donc l’utiliser en plugin pour ce post-procésseur.

Attends attends, un WAT ? Un **POST**-processeur ? Oui tu as bien lu car les
pré-processeurs c’est so 2000. Regarde par là [Le point sur les pré-processeurs CSS](/posts/css/le-point-sur-les-preprocesseurs/) ;)

Tout plein de -moz-bisous.

<hr />

PS: Convaincu par cette solution ? Tant mieux, elle est simple à mettre en place.
Tout ça est décrit dans la [mise en place d'autoprefixer](/posts/css/mise-en-place-autoprefixer/)
avec des exemples concrets pour ajouter ça dans un workflow existant.
