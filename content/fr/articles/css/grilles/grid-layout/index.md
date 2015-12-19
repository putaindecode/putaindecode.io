---
date: "2016-01-05"
title: Introduction à Grid Layout
tags:
  - css
  - grid
  - layout
authors:
  - magsout
header:
  credit: https://www.flickr.com/photos/thomashawk/8031723857
---

La mise en page d'un site ou d'une application est toujours quelque chose de
complexe et fastidieux à développer/maintenir. Pour cela, de nombreux designs
sont élaborés à partir d'une grille. En effet, l'objectif de la grille est de
servir de base pour placer les différents éléments et de faire en sorte qu'ils
soient alignés et espacés uniformément. Le problème de CSS est qu'il rencontre
beaucoup de lacunes pour mettre en place cette logique.

L'arrivé du module `Flexbox` a commencé à bien faciliter les choses. Toutefois,
ce module n'est pas adapté à toutes les situations et il est bien plus pertinent
sur du layout de composants.

C'est pour cette raison qu'a été développé le module `Grid Layout`, plus
puissant et orienté mise en page.

## États des lieux

Parlons des choses qui fâchent dès le début. À l'heure actuelle la dernière
révision date du [17 septembre 2015](http://www.w3.org/TR/css-grid-1/) et la
spécification en est toujours à l'état de *working draft*.

La compatibilité des [navigateurs est quelque peu
limitée](http://caniuse.com/#feat=css-grid). Excepté Internet Explorer 10+ (Edge
également), il est nécessaire d'activer le flag `layout.css.grid.enabled` dans
Firefox et `experimental Web Platform features` pour Chrome pour activer le
support du module.

Autant dire qu'une utilisation en production est relativement prématurée, quand
bien même cela ne doit pas nous empêcher d'expérimenter ce module.

## Grid

La notion de Grid n'est pas nouvelle, de multiples frameworks/librairies
utilisent déjà la mise en page en `Grid` :
- [SUIT CSS components-grid](https://github.com/suitcss/components-grid)
- [Zurb Foundation](http://foundation.zurb.com/docs/components/grid.html)
- [960](http://960.gs/)
- [cssrecipes Grid](https://github.com/cssrecipes/grid)

Toutes ces solutions se basent soit sur du `inline-block`, soit plus récemment
sur `Flexbox`. Même si elles sont relativement élégantes, elles nécessitent
quand même quelques petits hacks ou tricks pour réussir à faire quelque chose de
cohérent (hello, `font-size: 0`, gouttière, `calc` avec marge négative, etc.).
La raison est simple : les techniques utilisées ne sont pas adaptées pour un
système complet de `Grid`.

## Thinking in Grid

De façon à pouvoir présenter une partie de la spécification, nous allons partir
sur cette mise en page :

![Maquette Grid Layout](maquette.png)

Avant de commencer à présenter les différentes propriétés, réfléchissons au
concept de `Grid`.

### Grid lines

Si on applique cette notion à notre maquette, voici ce qu'on obtient :

![Caniuse Grid Layout](grid-line.png)

Concrètement, cela consiste à découper notre interface de façon à pouvoir en
extraire une grille et ainsi virtualiser la position et l'espace pris pour
chaque élément.

On va donc pouvoir extrapoler notre UI en lignes (`rows`), en colonnes
(`columns`), en cellules (`cells`) et en zones (`areas`).


Cette dernière notion (`areas`) est peut-être nouvelle dans la théorie, mais va
s'avérer très utile dans la pratique pour la suite.

## Grid Layout

On dispose de suffisamment d'informations sur notre interface pour démarrer
(enfin) notre intégration.

Voici le markup que l'on va utiliser pour notre maquette.

```html
<div class="Layout">
  <header class="Header">Header</header>
  <aside class="Aside">Aside</aside>
  <main class="Main">
    Main
  </main>
  <footer class="Footer">Footer</footer>
</div>
```

Dans un premier temps, nous allons "configurer" notre Grid:

```CSS
.Layout {
  /*
   * On déclare un nouveau contexte dans le parent
   * qui devient alors un grid-container
   * tous les enfants deviennent des grid-items
   */
   display: grid;

  /* Configuration de notre canvas */

  /*
   * On définit le nombre de colonnes :
   * - la première fera 200px de large
   * - la deuxième fera 10px de large
   * - la troisième prendra tout l'espace restant
   */
   grid-template-columns: 200px 10px 1fr;

  /*
   * Cette fois-ci au tour des lignes :
   * - la première fera 70px de haut
   * - la deuxième fera 10px de haut
   * - la troisième ligne s'adaptera à la hauteur de son contenu
   * - la quatrième fera 50px de haut
   */
   grid-template-rows: 70px 10px auto 10px 50px;

  /*
   * On peut utiliser grid qui est le raccourci
   * des deux propriétés précédentes
   */
   grid: 200px 10px 1fr / 70px 10px auto 10px 50px;
}
```

Notre `Grid` est prête, passons au positionnement de nos éléments.

## grid-area

Pour notre exemple nous allons utiliser la méthode la plus originale du module à
savoir les `areas`. L'interêt de cette méthode est de pouvoir contrôler tant en
terme d'espace occupé que de positionnement les différentes zones (`areas`) de
notre grille. On pourrait définir la forme des valeurs de `grid-template-areas`
comme de l'`ASCII art`.

```CSS
.Layout {
  /**
   * 1. Header s'affichera sur 3 colonnes
   * 2. On utilisera le symbole . pour définir un élément
   *    virtuel et ainsi l'utiliser pour définir les gouttières
   * 3. Aside s'affichera sur 1 colonne et 3 lignes
   */
  grid-template-areas:
   "Header Header Header"  /* 1 */
   ".        .      .   "  /* 2 */
   "Aside    .     Main "  /* 3 */
   "Aside    .      .   "  /* 3 */
   "Aside    .    Footer"; /* 3 */
}

/**
 * 1. Il est donc nécessaire de nommer chaque élément
 *    pour le contrôler dans notre area
 */

.Header {
  grid-area: Header; /* 1 */
}

.Main {
  grid-area: Main; /* 1 */
}

.Aside {
  grid-area: Aside; /* 1 */
}

.Footer {
  grid-area: Footer; /* 1 */
}

```

Notre intégration est terminée, on constate qu'avec très peu d'HTML et de CSS,
on arrive déjà à quelque chose d'intéressant. Il devient alors très facile de
manipuler et déplacer nos différents éléments en fonction du contexte de notre
application (mobile first, responsive, etc.).

## Et c'est pas fini !

`Grid-Layout` dispose d'une quantité assez impressionnante de propriétés, il
embarque pratiquement toutes les propriétés introduites par `Flexbox`
(`align-items`, `order`, `justify-content` etc..).

De nouvelles fonctions font leur apparition comme `repeat` (permet d'appliquer
des motifs de répétition), mais aussi de nouvelles unités tels que
`xfr` (fraction de l'espace restant), `min-content` (se rapporte à l'élément le
plus petit), `max-content` (se rapporte à l'élément le plus grand). La notion de
`subgrid` est également présente pour l'imbrication de grilles.

Il est d'ailleurs tout à fait possible d'intégrer une même interface de
plusieurs manières différentes. Si l'on reprend notre exemple, nous somme partis
sur les propriétés utilisant les `areas`, mais on aurait très bien pu utiliser
`grid-row` et `grid-column` qui s'appliquent non pas sur le parent mais sur les
enfants. Cette solution peut s'avérer très pratique pour des systèmes de grilles
classiques.

`Grid Layout` est un module très puissant et très complet. En le combinant avec
`Flexbox`, on dispose de suffisament d'outils pour travailler sur des mises en
pages complexes. Reste plus qu'aux navigateurs à rapidement valider/intégrer
/supporter cette nouvelle spécification.
