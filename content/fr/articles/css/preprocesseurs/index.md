---
date: "2014-03-11"
title: Le point sur les pré-processeurs CSS
tags:
  - css
  - pré-processeur
  - post-processeur
authors:
  - MoOx
---

## Pourquoi les pré-processeurs

Voilà ce que j'ai écrit en 2011 dans
[mon premier post sur les pré-processeur](http://moox.io/blog/utiliser-des-variables-fonctions-css/).
Je venais de découvrir cette notion et j'avais donc fait le tour de la question.

> Le langage des CSS n’a pas de côté dynamique. C’est lui avec lequel, à chaque
fois qu’on intègre une maquette graphique, on doit se taper tout de zéro.
Il a beau exister des CSS « Reset », des frameworks CSS, tout un tas de
grilles prête à l’emploi, des composants de CSS réutilisables avec l’approche
objet, je n’ai jamais réellement été satisfait par ces méthodes, que ce soit
à cause des contraintes qu’impose la syntaxe (devoir mettre des classes à tout
va dans l’HTML ça peut vite devenir chiant dans un CMS), ou par d’éventuelles
limitations qui obligent à « trop » modifier la source du document (pas assez
de, ou trop de, ou seulement ça ne me plait pas comment c’est fait).

J'avais tout dit, même des trucs qu'aujourd'hui je pense être des conneries (il
n'y a que les cons qui ne changent pas d'avis + c'est en faisant des erreurs
qu'on apprend le mieux), mais je reviendrais dessus plus tard.

Du coup on en retire quoi ? Qu'utiliser un pré-processeur se justifie par
l'ajout de fonctionnalités lorsque vous écrivez des feuilles de style (en tant
que développeur). En tant qu'utilisateur du code produit, cela va permettre
d'ajouter une couche abstraction (ce qui peut poser des problèmes, je reviendrais
sur ce point plus tard).

## Principales fonctionnalités

  - variables
  - fonctions
  - mixins (permettant de réaliser des sorties CSS paramétrables)
  - `@import` intelligent (pas côté client)
  - nesting (imbrications des sélecteurs pour éviter la répétition)
  - optimisation et abstraction poussée (via les mixins, placeholders et `@extend`)

Anciennement on aurait rajouté à cette liste la gestion du CSS 3, mais comme
je l'expliquais il y a peu, ce n'est plus nécessaire, on a une méthode bien
mieux, rapide et surtout <b>maintenu à jour</b> avec
[AutoPrefixer](/posts/css/comment-en-finir-avec-les-prefixes/)

## Les principaux pré-processeurs

### [Sass](http://sass-lang.com/)

Sass est à mon avis le plus mature des pré-processeurs CSS.
Il possède 2 syntaxes (une indentée et une plus proche de CSS).
Ce projet avance à bon rythme. Niveau fonctionnalités, rien à dire si ce n'est que
celui-ci a un petit plus pour avec la feature `@content` qui permet pour le coup de
passer tout un bloc de propriétés en paramètre à des mixins. Ce qui est super
pratique lorsque l'on écrit pas mal de media queries.
(Après, venez pas me dire qu'on a plein de fois les media-queries qui se
répètent et que ce n'est pas bien pour la taille du fichier, gzip se chargera de ça -
<small>[exemple similaire](https://twitter.com/kaelig/status/412909849207644160))</small>.

Le langage Sass possède une implémentation d'origine en Ruby mais aussi depuis
quelques temps une implémentation C qui se veut beaucoup plus rapide et portable:
[libsass](http://libsass.org/) mais qui est encore un peu en retard niveau
fonctionnalité (affaire à suivre). Surtout depuis la version 3.3 qui possède de
nouvelles fonctionnalités (comme les maps, entre autres).

Avec ce pré-processeur, on peut s'éloigner pas mal du CSS natif, que ce soit avec
la syntaxe ou l'aspect programmation (il n'y a qu'à voir des trucs comme
[modular-scale](https://github.com/Team-Sass/modular-scale) ou
[SassyMatrix](https://github.com/HugoGiraudel/SassyMatrix)).

Bibliotèques construites sur Sass :
- [Compass](http://compass-style.org/), solide, basé sur Ruby (incompatible libsass),
- [Bourbon](http://bourbon.io/), plus light mais plus rapide.

### [LESS](http://lesscss.org/)

Je n'ai pas trop envie de parler de ce pré-processeur assez classique, qui a fait un
choix assez étrange pour les variables par exemple (oui, `@` est un caractère
spécial en CSS, c'est assez étrange de rajouter une couche avec pour les variables
avec ce dernier).
J'espère seulement que ceux qui l'utilisent aujourd'hui n'utilise pas le script côté client
(ce qui provoquerait un affichage sans CSS si le client n'a pas JavaScript activé).
Bien qu'il soit populaire, le repository sur GitHub n'est pas signe de bonne santé
à mes yeux. Voir des pull-requests qui traînent vielles de plusieurs
<del>mois</del> <ins>années</ins> me laissent dubitatif...
Puis il n'y a qu'à voir l'exemple sur la homepage du site avec les box-shadow,
pour voir que ce pré-processeur est assez déprécié.

Ajoutons à cela le fait que Twitter Boostrap a (enfin) une version Sass...

Côté fonctionnalités, l'aspect programmation est assez laborieux avec la façon dont
sont gérés les mixins conditionnels. Je passe sur ce point gerbant.

Bibliotèques construites sur Less :
- [LESS Hat](http://lesshat.madebysource.com/),
- [LESS Elements](http://www.lesselements.com/).

### [Stylus](http://learnboost.github.io/stylus/)

Stylus se veut plus transparent que les autres pré-processeurs. C'est un point
réussi puisqu'il permet d'avoir des mixins transparents au niveau écriture.
Cela peut par contre bien entendu rendre la maintenance et la compréhension plus
difficile si on en abuse.
Il permet aussi de coder sans `{}` ni `:` ni `;` (bien que tout cela soit optionnel)

Niveau fonctionnalités cela ne vaut pas Sass. Ici pas de `@content` ou de maps.

Bibliotèque construite sur Stylus :
- [Nib](http://visionmedia.github.io/nib/)

### Alternatives

On peut s'amuser à faire un pré-processeur CSS avec n'importe quel langage c'est
évident.
Mais [les enfants, ne faites pas ça.](http://www.alsacreations.com/astuce/lire/1433-utiliser-php-pour-gerer-vos-styles-css.html)
À moins que vous souhaitiez alourdir vos CSS plus que vous y gagnerez.
Puis si c'est juste pour ajouter des variables, il existe d'autres solutions...

_Note: si vous avez d'autres pré-processeurs intéressants, je me ferais un plaisir
de les ajouter ici. Mais bon [vous pouvez aussi le faire tout seul comme un
grand](https://github.com/putaindecode/putaindecode.fr/blob/master/pages/posts/css/le-point-sur-les-preprocesseurs/index.md)._

## Les pré-processeurs sont-ils vraiment nécessaire ?

> Oula. Le mec vient de nous poser un post pour nous parler des pré-processeurs,
et il nous sort une question comme ça ? Il est où le piège ?

Si je pose la question c'est que j'ai une petite réponse par là. Et elle ne va
peut-être pas vous plaire.

Je vais revenir sur certains points qui peuvent poser problème avec les pré-processeurs.

### Le nesting cay mal

Ahh... Le nesting, c'est bien pratique lorsque l'on travaille sur un CMS
(ou n'importe quoi ayant un code HTML qu'on ne maitrise pas facilement)
de pouvoir utiliser le nesting pour pouvoir rapidement produire les sélecteurs adéquats.
Mais en terme de maintenance et surtout de réutilisation, c'est vraiment à chier.
Faut dire ce qui est.

```scss
.widget {
  // titre
  h3 { }

  // widget body
  > div {

    // liste
    ul {

    }
  }
}
```

Cet exemple est parfait pour démontrer les limites du nesting.
Comment faire si, sur un widget donnée, nous avons comme titre un h2 ou h4 ?
Il faut alourdir la CSS. Pareillement, si notre fameuse liste dans le corps n'est
pas dans la même arborescence que celle décrite, il faut à nouveau alourdir notre CSS.
Sans rentrer dans ces solutions solides (nous parlerons de BEM très bientôt),
cette solution serait bien plus élégante pour la réutilisation :

```css
.widget {}

  .widget-title { }

  .widget-body { }

    .widget-body-list { }
```

Vous remarquerez que j'ai un code ici beaucoup plus compréhensible par un nouveau,
mais aussi bien mieux réutilisable et surtout, point très important, non couplé
(non dépendant) à notre arborescence HTML (coucou le DOM).
De plus, utiliser le nesting provoque des sélecteurs à rallonges, après c'est la
course à la longueur (et au poids) des sélecteurs quand il faut surcharger une
règle héritée.
Avec de simple sélecteurs, pas de souci de ce genre là.

_ProTip™ : vous remarquerez que j'indente mon CSS à l'image des composants, ça mange
pas de pain, est cela facilite la lecture, moins linéaire._

Donc je reviens sur ce que je disais, il faut utiliser pleins de classes dans l'HTML.
Ça sert à ça. Votre CSS produit de cette façon sera bien plus réutilisable.

### L'abstraction cay dangereux

On en revient à la magie. Lorsqu'on a trop de couche qui cache ce qu'il y a
réellement sous le capot, [on peut vite perdre le contrôle](http://linuxfr.org/news/encore-un-exemple-de-code-spaghetti-toyota).

Et voici [un parfait exemple](https://github.com/MoOx/compass-recipes/issues/104)
où un utilisateur de ma bibliothèque [Compass Recipes](https://github.com/MoOx/compass-recipes)
avait un problème lorsqu'il utilisait 2 mixins qui cachaient trop de code.
Dans  notre cas corners-tucked (version coin scotché) et background-noise (bruit visuel).
Il en a perdu des choses simples et avait passé beaucoup de temps à se prendre la tête
alors que la solution était très (trop) simple (une histoire entre `background-image`
et le shorthand `background`).

Je me laisse souvent attirer par la magie d'un code, mais mon expérience m'indique
aujourd'hui qu'il ne faut pas abuser de cette partie mystérieuse où l'on ne sait
plus ce qui se passe.

Je vous laisse imaginer du nesting caché dans des mixins qui utilisent d'autres mixins
qui font des @extends de placeholders...

> Un grand pouvoir implique de grandes responsabilités.

Tout est dit. Il faut faire attention. Très attention.

## Mon avis sur les pré-processeurs

Je pense que les pré-processeurs restent utiles mais seulement pour des projets
de très grosse envergure, qui possède énormément de code CSS et/ou extrêmement dynamique.
Ou que vous utilisez de solutions comme [Bootstrap](http://getbootstrap.com/) ou
[Foundation](http://foundation.zurb.com/), chose que je déconseille pour autre chose que des prototypes.

De part mon expérience et mon recul (si si j'en prends je vous jure), je pense que
j'aurais pu m'en passer bien plus souvent que j'ai voulu l'admettre par le passé.
Mais bon comme je dis souvent, quel plaisir de se planter quand ce n'est pas dans un platane !

Ce qu'il faut retenir clairement c'est que ce ne sont pas les pré-processeurs qui
vont vous faire écrire des meilleurs feuilles de styles. C'est plus un travail sur
une méthodologie et  une organisation adaptées à vos besoins qui amélioreront
votre quotidien de webdesigner (oui quoi, dès qu'on code du CSS, on peut
utiliser l'appellation webdesigner sur son CV, ça en jette).

J'ai donc longtemps apprécié les pré-processeurs CSS, mais aujourd'hui je commence
à leur tourner le dos du fait que je n'utilise que trop peu de leurs fonctionnalités.
J'évite l'overkill quoi.

Quand on voit que des _grands_ de l'HTML / CSS comme [@necolas](http://nicolasgallagher.com/)
n'utilise pas de pré-processeur, on a de quoi se poser des questions.
Avec une bonne bibliothèque comme [SUIT CSS](https://github.com/suitcss/suit/),
on s'en retrouve à ne manquer que des petites choses.

Que l'on peut combler.

Avec les post-processeurs par exemple.

J'ai donc à ce jour moi aussi conservé une couche pour ajouter le minimum vital en tant que développeur.

Mais ne voulant pas alourdir ce post consacré aux pré-processeurs CSS,
vous pourrez continuer la lecture au prochain épisode qui sera consacré aux post-processeurs...

<small>(Mamam, t'as vu ce cliffhanger digne des séries US !)</small>

~~Bon promis la prochaine fois je vous en parle des post-processeurs. Pour de vrai.~~
Chose promise, chose due : [Les post-processeurs CSS](/posts/css/les-post-processeurs/)
