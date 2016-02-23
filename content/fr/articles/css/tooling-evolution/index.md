---
date: "2016-02-23"
title: Évolution des outils CSS
tags:
  - css
  - outils
  - css modules
authors:
  - thib_thib
---

> Je crois que même avant que je sache exactement ce qu'était le CSS, j'avais
déjà entendu quelqu'un me dire "Je HAIS le CSS". Cette phrase était souvent dite
par un de mes amis du back-end, et souvent pour de très bonnes raisons. Cet
article n'essaiera pas de défendre ni de vous faire aimer le CSS, mais comme les
outils de développement front-end évoluent rapidement, je trouve intéressant
d'expliquer les nouvelles façons d'écrire le CSS.


# Retour aux bases
D'abord, pour comprendre quel sont les problèmes que les nouveaux outils tentent
de résoudre, un petit rappel sur ce qu'est le CSS : *Cascading Style Sheets* ou
*Feuilles de style en cascade*.

Une feuille de style ? C'est facile ! C'est un bout de code qui lie des "styles" à
du HTML. En cascade ? Et bien, quelques fois un élément HTML peut correspondre à
plusieurs styles, et "en cascade" est le groupe de règles qui permet de
déterminer lequel appliquer.

Voici du code CSS basique : nous voulons que nos titres h1 soient rouges.

```css
h1 {
  color: red;
}
```

Ici, nous lions la ***règle (ou déclaration)*** `color: red` au ***sélecteur***
"h1". Un sélecteur peut contenir plusieurs règles dans son bloc de déclarations.

> Et les dernières lueurs de bonheur s'éteignent alors que nous entrons dans
> l'enfer de la cascade

# Le truc qui cascade
La cascade est pour moi un désastre qui rend le CSS très compliqué à maintenir
si on ne suit pas de lignes directrices ou on n'utilise pas d'outils pour
l'écrire. Je vais vous montrer quelques exemples simples pour vous expliquer les
principaux concepts de la cascade, mais gardez en tête que la plupart des
applications web contiennent de nos jours beaucoup de code, aggravant les effets
de la cascade.

La nécessité d'avoir un système comme la cascade vient du fait que le CSS permet à
plusieurs règles de style de s'appliquer à un même élément, ces dernières
pouvant même venir de plusieurs origines (du site, mais aussi du navigateur ou
encore même de l'utilisateur). Il faut donc pouvoir définir dans ce cas-là
quelle est la règle qui au final sera appliquée. Pour cela, la cascade donne à
chacune un poids, calculé selon un certain nombre de critères, et applique la
règle la plus lourde. Cela peut paraitre simple au premier abord, mais les
critères de calcul de poids ne le sont pas du tout.

Les règles qui sont les plus légères dans la cascade ne sont pas vraiment un
problème, mais il faut les connaitre afin de s'éviter des surprises :

## Les valeurs par défaut du navigateur
Voici le haut de la cascade. Ce sont les règles qui font qu'un titre h1 est gros
même si on ne l'a pas spécifié.

## L'héritage des parents
Ensuite, les règles sont héritées depuis les éléments HTML parents. Si on
reprend notre élément h1, si une règle `color: blue` est définie sur l'élément
`body`, le titre va en hériter, et sera donc bleu.

Ceci étant dit, on entre maintenant dans un niveau plus douloureux de la
cascade.

## L'ordre des règles
La position d'une règle par rapport aux autres va influer sur son poids. Deux règles
auraient pu avoir le même poids si elles étaient à la même position mais, au
final, c'est la dernière qui sera la plus lourde et sera donc appliquée. ***La
dernière.***  Quand il s'agit de code assez simple, cela peut être facilement
compréhensible :

```css
h1 {
  color: red;
  color: blue;
}
```

Facile, n'est-ce pas ? Le titre sera bleu ! Mais s'il y a une règle `color:
red` dans un fichier CSS nommé *foo.css*, et une règle `color: blue` dans un
autre fichier nommé *bar.css*, que le fichier *foo.css* met plus de temps que le
fichier *bar.css* à charger, mais que le tag HTML référençant *foo.css* est
avant celui de *bar.css*, quelle règle est appliquée ? Eh bien, c'est plus
compliqué à savoir. *(indice : le temps de chargement n'est pas pris en compte)*

## La spécificité des sélecteurs
Ce critère est un niveau de complexité au-dessus des autres, [si bien que des
personnes en ont fait des calculettes pour le
simplifier](https://specificity.keegan.st). Je ne vais pas rentrer dans les
détails, mais il faut savoir que le poids d'un sélecteur est égal à la somme des poids de tous les sélecteurs le composant. Et que tous les sélecteurs n'ont pas le même poids.


```css
.title {
  color: red;
}

body header h1 {
  color: blue;
}
```

Ici, le premier sélecteur pèse 10 parce qu'il contient un sélecteur de classe
CSS, qui pèse lui-même 10. Le deuxième sélecteur quant à lui pèse 3, parce qu'il
contient trois sélecteurs de tag, pesant chacun 1. Et donc, comme 10 > 3, le
titre h1 sera rouge !

## Les styles inline
Les règles qui sont dans l'attribut “style” d'un élément HTML sont plus lourdes
que n'importe quel sélecteur défini précédemment. Et donc voici un titre bleu :

```css
h1 {
  color: red;
}
```
```html
<h1 style="color: blue;">Title</h1>
```

## Importance
Et enfin le dernier critère, le God Mode, le broyeur de styles, le mot-clé
***!important.*** Quand on veut VRAIMENT que le titre soit rouge :

```css
h1 {
  color: red !important;
}
```
```html
<h1 style="color: blue;">Title</h1>
```

Et comme toute la cascade est à propos de poids, si deux règles sont marquées
comme !important, le reste des critères est toujours pris en compte pour
calculer laquelle est la plus lourde, et donc appliquée.

**…Et on ne peut pas faire plus compliqué que ça.** Maintenant, imaginez des
milliers et des milliers de sélecteurs et règles cascadant les uns sur les
autres pour définir le style d'un site, et vous comprendrez l'enfer que peut
être le CSS. Ainsi, des développeurs CSS ont imaginé différentes méthodologies
et outils pour éviter ce cauchemar !

# L'évolution des outils
Maintenant, je vais vous présenter comment ma façon d'écrire du CSS a évolué au
fil du temps. Ne vous attendez pas à une chronologie complète de tous les
outils inventés depuis la création du CSS en 1996 (j'avais 6 ans !) mais plutôt
une explication de comment je me suis débrouillé avec la cascade dans ma courte
expérience personnelle.

## Pré-processeurs
J'ai commencé à developper des applications web en 2012, en plein âge d'or [des
pré-processeurs](http://putaindecode.io/fr/articles/css/preprocesseurs/). Ils
étaient apparus quelques années auparavant, comme le CSS lui-même n'était pas
suffisamment adapté pour construire des sites complexes. Les pré-processeurs sont des
compilateurs qui génèrent du code CSS à partir de languages légèrement
différents, comme [Sass](http://sass-lang.com) ou [LESS](http://lesscss.org).
Ces nouveaux languages permettent de créer des variables par exemple, ou
d'imbriquer des sélecteurs, entre autres merveilleuses nouvelles
fonctionnalités.

On peut transformer ce vieux code CSS compliqué à maintenir :

```css
body {
  background: #E5E5E5;
}

body h1 {
  color: #333333;
}
```

en cette bien *meilleure* version :

```scss
$textColor: #333333;

body {
  background: lighten($textColor, 90%);
    
  h1 {
    color: $textColor
  }
}
```

Avec ces nouveaux outils, et pour éviter aux règles d'entrer en collision dans
la cascade, nous avons commencé à imbriquer nos sélecteurs et à répliquer toute
notre structure HTML dans le code de notre pré-processeur favori. Notre CSS se 
retrouva donc avec des sélecteurs très long et lourds qui étaient associés
uniquement avec un element HTML précis, comme ce dernier : 

> .searchPage .sideBar .refinements.default .category .star input

Et ça a plutôt bien marché au début ! Mais ces sélecteurs n'étaient pas les plus
performants, et la structure du HTML étant répliquée, n'importe quel changement
dans cette dernière doit être répercuté dans les styles. Donc je suis passé à
autre chose.

## Méthodologies CSS
À ce moment, quelques nouvelles guidelines CSS ont commencé a attirer mon
attention. On pouvait les utiliser avec les pré-processeurs, et avaient pour but
d'éviter les collisions dans la cascade (tout comme l'imbrication des
sélecteurs) avec un certain nombre de règles, comme sur le nommage des
sélecteurs.

Ces methodologies sont arrivées au moment ou je commençais à découper mes
développements en composants. L'imbrication des sélecteurs ne marchait pas très
bien avec ces derniers, vu que le but est de créer des bouts de code
réutilisables partout dans la web app, comme un bouton par exemple. La
méthodologie que j'utilise (toujours aujourd'hui) est appelée [BEM, pour Block
Element Modifier](http://putaindecode.io/fr/articles/css/bem/), mais il y en a
d'autres avec le même but : chaque élément HTML de mes composants doit avoir une
classe CSS qui lui est unique. De cette façon, pas besoin d'imbrication, et pas
de collision de la cascade !

Et ce code de pré-processeur :

```scss
h1 {
  color: $textColor
  
  img {
    border: 1px solid black;
  }
}
```

se transforme en :

```css
.Title {
  color: $textColor
}

.Title-icon {
  border: 1px solid black;
}
```

Évidement, le code HTML doit être mis à jour avec les nouvelles classes, mais
les sélecteurs sont maintenant courts et compréhensibles. Et ceci, sans aucune chance
de collision de cascade.

Maintenant, pour pouvoir mieux expliquer un dernier outil, celui qui je pense va
résoudre tous nos problèmes, il faut que je vous montre une autre approche pour
contourner les problèmes de la cascade :

## Frameworks CSS
Ici, pour éviter à nos règles CSS d'entrer en collision, nous… n'en écrivons plus !
Les frameworks CSS sont des styles déjà écrits qu'on peut utiliser avec des
classes CSS spécifiques. Il y a deux approches ici :

* Les frameworks de styles "finaux" comme [Bootstrap](http://getbootstrap.com).
Il suffit d'ajouter la classe `btn` sur un élément HTML et… tada ! C'est
maintenant un magnifique bouton. Certaines variables sont modifiables pour
transformer le look global du framework.

* Les frameworks de styles "utilitaires" comme [Tachyons](http://tachyons.io).
Ici, il n'y a pas de styles pré-définis, mais plein de classes utilitaires
sont disponibles, comme `pam` pour donner un *medium padding* à un élément,
ou encore `ba` pour lui donner une *border all* tout autour.

Les frameworks utilitaires sont assez intéressants, du fait que le fichier CSS
final fera autour de 10kB et jamais plus, même si le site grandit ! Mais il y
aura beaucoup de classes peu compréhensibles dans le code HTML. C'est comparable
aux styles inline, avec une optimization de poids final, comme `ba` est plus
court que *“border-style: solid; border-width: 1px;”*

Ces frameworks nous évitent tout tracas avec la cascade ! Mais je n'aimais pas
le fait d'utiliser un framework, ainsi qu'avoir beaucoup de classes non
compréhensibles dans mon code HTML. Cependant, la totale réutilisabilité et
modularité des styles, sans problèmes de cascade, sont impressionnants. 

Cela nous amène donc à cet outil génial, forgé directement avec la meilleure
magie JavaScript :

## CSS Modules
Ce concept a d'abord pris forme suite à une simple observation : de nos jours,
le CSS est compilé à partir d'autres languages pour permettre une écriture plus
facile, et pour cette même raison le HTML est aussi généré grâce à des outils de
templating en JavaScript. Mais les sélecteurs CSS, le lien entre les éléments et
les styles, ceux-la même auxquels le codeur doit faire très attention pour
éviter qu'ils n'entrent en collision, n'ont pas d'outils du tout. 

Et [CSS Modules](https://github.com/css-modules/css-modules) fut créé. La
première fonctionnalité intéressante est la génération automatique des noms de
classes CSS. Plus d'inquiétude sur leur unicité, on peut les nommer comme on
veut, au final ceux générés dans le HTML seront uniques. Promis. Cela nous
permet de réécrire ce code CSS en BEM, et HTML :

```css
.Title {
  color: $textColor;
}
```
```html
<h1 class="Title"></h1>
```

en ce code CSS et template JavaScript :

```css
.styleName {
  color: $textColor
}
```
```js
import styles from './style.css';
`<h1 class=${styles.styleName}></h1>`
```

Une fois compilé, ce code générera quelque chose comme ça :

```css
.styleName__abc5436 {
  color: #333333;
}
```
```html
<h1 class="styleName__abc5436"></h1>
```

Une casc-quoi ? Je ne sais pas ce que c'est ! ❤️

La deuxième fonctionnalité géniale, directement inspirée par les frameworks CSS
modulaires comme Tachyons, est la composition des styles. De la même façon qu'en
ajoutant plusieurs classes utilitaires sur son élément HTML, CSS Modules nous
permet de composer nos classes à partir de styles communs. Laissez-moi vous
montrer : 

```css
.titleColor {
  color: #333333;
}

.bigTitle {
  composes: titleColor;
  font-size: 24px;
}

.mediumTitle {
  composes: titleColor;
  font-size: 16px;
}
```
```js
import styles from './style.css';
`<h1 class=${styles.bigTitle}></h1>
 <h2 class=${styles.mediumTitle}></h2>`
```

va générer :

```css
.titleColor__abc5436 {
  color: #333333;
}

.bigTitle__def6547 {
  font-size: 24px;
}

.mediumTitle__1638bcd {
  font-size: 16px;
}
```
```js
<h1 class="titleColor__abc5436 bigTitle__def6547"></h1>
<h2 class="titleColor__abc5436 mediumTitle__1638bcd"></h2>
```

Et ceci, messieurs-dames, est plutôt fantastique. Les styles sont modularisables
et composables, et ce sans classes incompréhensibles mais directement dans les
feuilles de style. Et les collisions de sélecteurs et règles ne sont plus qu'un
mauvais souvenir.

Et c'est ainsi que j'ai expérimenté avec le CSS et sa cascade jusque-là.
J'espère que les mois et les années à venir vont me surprendre avec de meilleurs
outils et / ou méthodologies, et je serais heureux de les apprendre et les
essayer 👍🏼
