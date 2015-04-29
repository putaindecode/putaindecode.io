---
date: "2014-06-13"
title: Un point sur les grilles CSS en inline-block
tags:
  - css
  - inline-block
  - grid
authors:
  - lionelB
---

Les grilles sont devenues incontournables pour le layout d'un site.
[Plusieurs](http://justifygrid.com/#methodology) [méthodes](https://github.com/suitcss/components-grid)  [existent](http://www.palantir.net/blog/responsive-design-s-dirty-little-secret) en attendant de pouvoir utiliser le Graal, [CSS3 grid layout](http://dev.w3.org/csswg/css-grid/).

Mais en attendant, on bricole. Et une des solutions que j'aime bien consiste à utiliser des inline-block, car elle offre plusieurs avantages pratiques :

- On peut simplement renverser la grille grâce à la propriété  `direction:rtl;` ce qui est particulièrement pratique sur des sites qui doivent supporter des langues dont le sens de lecture va de droite à gauche.
- les éléments en inline-block peuvent utiliser la propriété `vertical-align`.
- les éléments de la grilles reste dans le flux, ce qui évite l'utilisation de clearfix.

Ce dernier point est aussi une source de problèmes puisque notre `.Grid` contient non seulement nos éléments de grille `.Grid-cell` mais aussi quelques caractères espace ça et là entre les noeuds enfants.

De la même manière qu'un espaces sépare 2 mots, on retrouve ces espaces entre nos blocs. Ces caractères proviennent des espaces et autre sauts de lignes qu'on insère dans le code source pour formater notre document.

Voici donc un aperçu des différents moyens de se débarasser de ces espaces, afin que tout les éléments de notre grille restent à leur place.


## Supprimer les espaces entre les tag `.Grid-cell`

```
<div class="Grid">
  <div class="Grid-cell">...</div><div class="Grid-cell">...</div><div class="Grid-cell">...</div>
</div>
```

Une méthode pas forcément très lisible mais qui est robuste. Soyons créatifs,
on peut aussi faire comme ça, même si le formatage en prend un coup.

```
<div class="Grid">
      <div class="Grid-cell">...
</div><div class="Grid-cell">...
</div><div class="Grid-cell">...</div>
</div>
```

Notez que la première technique peut être facilement mise en place de manière automatique, via une traitement de [minification du code html](https://github.com/kangax/html-minifier).


##Insérer des commentaires html entre les tags `.Grid-cell`

La solution est robuste, au prix de quelques caractères supplémentaires. Un surpoids que gzip se fera un plaisir de vous faire oublier !
C'est la méthode choisie dans le framework [inuitCss](https://github.com/csswizardry/inuit.css/blob/master/objects/_grids.scss).
```
<div class="Grid">
   <div class="Grid-cell">...</div><!--
--><div class="Grid-cell">...</div><!--
--><div class="Grid-cell">...</div>
</div>
```


## font-size: 0

```
.Grid {
  font-size: 0;
}
.Grid-cell {
  display: inline-block;
  font-size: 16px;
  font-size: 1rem;
}
```

L'idée est de faire disparaître les caractères _espace_ situés entre les balises enfants en réglant la taille de la police à zéro. Il suffit ensuite de ré-initialiser la taille sur les noeuds enfants `.Grid-cell`. Cette méthode est utilisée dans [SUIT Grid](https://github.com/suitcss/components-grid).

*Attention*, si votre scope navigateur va en dessous d'IE9, cette méthode fait perdre le bénéfice d'une intégration à base d'em puisque la taille de la typo sur les blocs enfants est désormais fixe.



## Appliquer une marge négative entre les blocs enfants
```
.Grid-cell {
  margin-right: -4px;
}
```
Cette méthode n'est à mon sens pas très robuste, surtout sur des intégrations à base d'em, car on introduit un nombre magique qui dépend de plusieurs paramètre, comme la typo utilisée, sa taille de base, etc. Cette méthode demande donc de bien tester puisque les font disponibles ne seront pas les mêmes selon des équipements, les OS...



## La méthode Kellum
Ici, la méthode consiste à utiliser une font particulière contenant le caractère espace et dont la particularité est d'avoir une largeur nulle. Cette technique est décrite dans l'article de [Scott Kellum](http://scottkellum.com/2013/10/25/the-new-kellum-method.html)

Comme la technique précédente, il suffit d'appliquer la font au conteneur `.Grid` puis de remettre la font-family par defaut pour les enfants `.Grid-cell`. Et ainsi, toutes valeurs relatives en _em_ sont préservées.


```
.Grid {
  display: block;
  font-family: 'blank-kellum';
}

.Grid-cell{
  display: inline-block;
  width: 33.333333%;
  font-family:sans-serif;
}
```


L'inconvénient de cette technique est qu'elle nécessite le téléchargement d'un fichier font particulièr si le navigateur ne supporte pas éléments encodées en data-uri (en gros, en dessous d'ie8). Par contre, si vous utilisez une font d'icônes, rien ne vous empêche de combiner les deux, en ajoutant votre icône de largeur nulle avec vos icônes. Voici un aperçu sur [codepen](http://codepen.io/lionelB/pen/fvyjH)

#Le mot de la fin

Non, il n'y a pas vraiment une technique qui sort du lot. Comme toujours, cela dépend des navigateurs à supporter, est ce que l'utilisateur pourra personnaliser le layout, qui sera chargé des mise à jour, etc... autant de points qui aideront à choisir la meilleure solution.



----

Quelques ressources :

- L'article [Fighting the space between inline block elements](http://css-tricks.com/fighting-the-space-between-inline-block-elements/) sur css-tricks
- L'article [About inline-block](http://webdesigner-webdeveloper.com/weblog/about-inline-blocks/) sur lequel je suis tombé en rédigeant cet article.
