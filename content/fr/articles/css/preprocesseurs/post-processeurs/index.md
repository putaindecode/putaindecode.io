---
date: "2014-04-08"
title: Les post-processeurs CSS
tags:
  - css
  - pré-processeur
  - post-processeur
authors:
  - MoOx
---

Vous avez surement entendu parler des [_post-processeurs CSS_](http://iamvdo.me/blog/les-postprocesseurs-css).
J'ai personnellement pas mal fait référence à ~~ce concept~~ cette expression ces derniers temps.
Que ce soit lorsque je vous racontais
<a href="/posts/css/comment-en-finir-avec-les-prefixes/">comment se passer des préfixes CSS</a>
ou lors
<a href="/posts/css/le-point-sur-les-preprocesseurs/">d'un point sur les pré-processeurs CSS</a>.
N'y a-t-il rien qui vous a fait tiquer ?

## Du post-processing ?

Bon on va pas jouer sur les mots mais quand même un peu. _Post_ ça veut dire après.
Mais après quoi ? Après du _processing_. Donc en théorie après que la feuille de
style ait été traitée.

Si on revient sur _pré-processeurs_, on a quelques choses de sensé.
On travaille sur la feuille de style avant qu'elle n'ait été traitée.
Traitée par qui ? Je dirais le navigateur pas vous ?
Dans ce cas le pré-processing est tout à fait logique.

Mais le post-processing ? Du vrai post-processing ça existe ? Oui et ça ressemblerait à ça par exemple :
<a href="http://jsfiddle.net/yyx990803/B5JTg/">Interpolation de CSS avec Vue.js</a> (enfin je crois).
Ici on a un process sur du CSS existant, déjà traité par le navigateur.

Bon ok j'avoue que je pinaille un peu. On pourrait considérer que le "process",
c'est le fait d'améliorer sa feuille de style et dans ce cas, on pourrait accepter pré- et post-process.
Mais ça reste pas super exact de mon point de vue.

Du coup on appelle ça comment les post-processeurs ?
Devrait-on appeler ça du _post-pré-processing_ ? Je vous le demande.

Assez plaisanté, passons donc à l'explication de ce qu'on appelera le _post-processing._

## Le post-processing

Quel est la différence avec du pré-processing ? Pour répondre à cette question,
il faut bien définir ce qu'est le pré-processing dans notre contexte.

### Le pré-processing CSS

Le pré-processing est un pré-traitement avant le traitment final. Dans le cas de feuille de style,
on travaille donc sur des pré-feuilles de style. Ce ne sont donc pas des feuilles de style.
Comment les différencie-t-on ? La syntaxe.

Hola hola, calmez-vous. J'en entends déjà chouiner qu'avec Sass, Less et Stylus,
on peut coller du CSS valide et Ça Marche™. Oui ça marche. Mais seulement dans ce sens.
Si on essaye de faire parser un `@foreach`, `@include` ou ce genre de nouveautés
apportés par un pré-processeur, votre navigateur il va faire la gueule.

En effet un pré-processeur n'est rien d'autre qu'un langage. Un nouveau.
Il ajoute des éléments à ce langage, et change même éventuellement la syntaxe.
Certes il peut s'appuyer sur un langage existant (par exemple la syntaxe Scss de Sass, ou la syntaxe Less )
mais ça n'est pas obligé (exemple avec l'ancienne syntaxe Sass, ou encore pour changer de registre, CoffeeScript pour du JavaScript).

### Différence entre post-processing et pré-processing

Avant de parler des différences il nous faut un cas concret pour y voir plus clair.
Autoprefixer est un très bon exemple, mais je vais vous en montrer un encore plus pertinent: les fallbacks REM.
J'espère que vous connaissez le REM (root EM), cette unité CSS très utile qui permet d'avoir la souplesse de l'unité EM,
en se basant non sur l'élement parent, mais l'élement root (donc le document).
Cette unité CSS n'est par exemple pas compatible avec IE8, et certain d'entre vous doivent encore le supporter.

On a donc vu pas mal de mixins genre `rem2px()` pour ajouter un fallback, via des pré-processeurs CSS.
Sauf que là, il semble beaucoup plus pertinent de ne pas alourdir son code (car on y ajoute rien d'intéressant),
surtout lorsque c'est pour supporter de vieux navigateurs.
Et si on pouvait ajouter un petit coup de peinture magique, je dirais même automatique,
afin d'avoir ce fallback ?

Et bien, on peut. Ça prend 20 secondes, et ça fera les choses bien, sans oubli.
Exemple avec [rework-rem-fallback](https://github.com/ctalkington/rework-rem-fallback)

```js
// il faudrait installer les dépendances de la façon suivante
// $ npm i rework rework-rem-fallback

var rework = require('rework') // le moteur rework, je reviens dessus après
var remFallback = require('rework-rem-fallback') // le plugin rework

  // lecture du fichier css
var css = require('fs').readFileSync('dist/index.css', 'utf8').toString()

  // on traite le CSS en indiquant à rework la source, et le plugin à utiliser
var out = rework(css).use(remFallback()).toString()

  // ici on fait la même chose, mais comme si la font de base était en 14px
var out14 = rework(css).use(remFallback(14)).toString()
```

Avec l'exemple d'avant, et ce bout de CSS:

```css
.main-header { width: 5rem }
```

... On obtiendra le résultat suivant:

```css
.main-header {
  width: 80px;
  width: 5rem;
}
```

Notre exemple n'est pas intégré dans un
[workflow automatisé](http://www.24joursdeweb.fr/2013/automatisez-votre-workflow-front-end/),
mais c'est juste pour vous montrer que c'est l'histoire de 5 lignes de code
et pas autant de lignes que de fois où l'on a `rem` dans sa feuille de style.

Sexy n'est-ce pas ?

L'autre grosse différence entre le pré- et le post-processing, c'est le langage.
Ce post-processing s'effectue après du pré-processing. Donc après que le pré-processeur,
cet autre langage, ait fait son boulot.

**Le post-processing s'effectue sur du CSS de manière transparente.**

_Ce processing s'effectue sur du vrai CSS (disons la syntaxe CSS)._

Cette syntaxe étant très simple (se résumant principalement à `selecteur { prop: value }` - oui y'a les règles `@*` en plus je sais),
[c'est très rapide à parser](https://github.com/reworkcss/css-parse#performance).

## Pourquoi du post-processing ?

Comme on vient de le voir avec les 2 points précédents, on a déjà 3 bonnes raisons :

- la simplicité (pour certains cas de figures, c'est plus pertinent, ça évite trop de code et des
oublis)
- la vitesse
- le fait de pouvoir brancher ses propres plugins

Je sais pas vous mais moi ça me suffit. Et en cherchant mieux, on pourrait sûrement trouver d'autres arguments.
(_Rappel : d'ailleurs n'hésitez pas à modifier cet article si vous en avez_).

## Avec quoi doit-on post-processer ces CSS ?

Comme vous avez pu le voir tout à l'heure j'ai pris dans un exemple Rework,
mais il existe aussi PostCSS, plus récent.

### [Rework](https://github.com/reworkcss/rework)

Rework a été initié par le grand [TJ Holowaychuck](https://github.com/visionmedia),
cette machine de guerre ([que certains ne pensent même pas humain](http://www.quora.com/TJ-Holowaychuk-1/How-is-TJ-Holowaychuk-so-insanely-productive) pour vous dire).
TJ était il fut un temps utilisateur de Sass, il avait donc même commencé le
portage de [Sass en Node](https://github.com/stunti/sass.js).
Il a dû se rendre compte bien avant nous que ce n'était finalement pas forcément la meilleure option.
Il a donc développé [Stylus](https://github.com/LearnBoost/stylus/) (si, si, c'est bien lui),
le temps de comprendre qu'une autre approche était possible (pour info, il ne maintient maintenant plus Stylus).

C'est donc [le 1er Septembre 2012 qu'il pousse la première version de Rework](https://github.com/reworkcss/rework/commit/0a7be255bfe753d03f93c7072351266fa636e80a).

L'objectif de Rework n'est pas spécialement de gérer du post-process.
Rework se place comme un manipulateur de CSS, permettant (entre autres) :

- l'automatisation d'ajout des préfixes
- la création de nouvelles propriétés
- l'intégration d'images inline

Vous me direz que ça ressemble vachement à un pré-processeur n'est-ce pas ?
Vu l'historique que je viens de vous conter et [les plugins par défaut](https://github.com/reworkcss/rework#plugins),
vous aurez bien compris que c'est l'idée : faire un moteur de pré-processeur où l'on y branche des plugins pour ajouter nos propres fonctionnalités.
C'est grâce à ce projet qu'Autoprefixer a initialement vu le jour d'ailleurs.

### [PostCSS](https://github.com/ai/postcss)

Beaucoup plus récent, PostCSS a été écrit par l'auteur d'Autoprefixer.

> Heu mais quoi ? Tu viens de nous dire que Autoprefixer utilisait Rework ?!

Oui _c'était_ le cas. _Utilisait_. L'auteur de PostCSS s'explique dans [son README](https://github.com/ai/postcss#rework).
Il y indique que, bien que très similaire, Rework et PostCSS n'ont pas été développé pour les mêmes raisons.
C'est ce qui explique les différences au niveau des moteurs.
PostCSS se veut plus préservateur par rapport à votre source d'origine,
et gère donc mieux sourcemap, peut conserver votre espacement et indentation,
parse de manière plus sécurisé (vu que ça se veut mieux gérer le code legacy).

Dans la pratique je n'ai jamais eu de problème avec Rework, me souciant peu de la mise en forme de la sortie CSS.
Mais PostCSS semble avoir une API plus haut niveau et plus souple pour mieux travailler les feuilles de styles.

### Rework ou PostCSS ?

Tout dépend ce que vous voulez faire. Si vous avez en tête l'idée de développer un outil,
je pencherais plus vers PostCSS. Mais en temps qu'utilisateur, pour l'instant, définitivement Rework.

Ce dernier a clairement beaucoup plus de plugins existants. Voyez par vous-mêmes :

- [npmjs.org/search?q=rework](https://www.npmjs.org/search?q=rework)
- [npmjs.org/search?q=postcss](https://www.npmjs.org/search?q=postcss)

## Rework ce n'est pas _que_ du post-processing ?

Oui en effet, comme je le disais avant, c'est pas le but. C'est du "processing".
Pré-, post-... Qu'est-ce que ça change dans le fond hein ?

L'idée, en temps que développeur, est d'améliorer le confort d'écriture sans contrainte.
Comme je l'ai indiqué [précédemment](/posts/css/le-point-sur-les-preprocesseurs/#mon-avis-sur-les-pr-processeurs),
j'ai laché les pré-processeurs "classiques" ayant l'impression d'utiliser un tank pour tuer une mouche.
Car au fond pour 90% (si ce n'est plus) d'entres nous,
que nous faut-il pour bien développer des feuilles de styles ?
Un peu d'organisation, des variables et un poil de math ?
Personnellement je me contente de ça. Pour l'organisation, je suis devenu fan de BEM
(on vous en parle bientôt).

**Et en attendant de vraiment pouvoir utiliser les variables CSS associé à `calc()`,
je reste sur du _custom pré-processing_ via Rework avec lequel je peux coder avec la syntaxe des specs (même si c'est en draft), plus future-proof.**

J'aime conserver la syntaxe CSS et avoir un process ultra-rapide et transparent.

### Prochaine étape: faire son propre pré/post-processeur CSS, c'est simple

Rework ayant un bon petit paquet de plugins déjà existants, c'est assez simple de [réaliser son propre pré-processeur](/posts/css/preprocesseur-a-la-carte/) via quelques lignes de code seulement.
